import axios from 'axios';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import { API_DETAILS, UI_DETAILS, languageSpecificMagic, weekOrderOfApi } from './model/constants';
import { IPlace, ILivePopularity, IPopularTime } from './model/model';

export class Populartimes {
  constructor(
    private readonly googleApiKey: string,
    private outputFormat: string = 'json',
    private language: string = 'de'
  ) {}

  public async placeDetails(placeId: string): Promise<IPlace> {
    if (!this.googleApiKey) {
      throw new Error('No Google API Key configured');
    }

    let placeDetailsData: IPlace;

    try {
      placeDetailsData = await this.fetchlocationDetails(placeId);
    } catch (error) {
      console.error('🙈 Something happend during creating placeDetails', error);
    }
    return placeDetailsData;
  }

  // @TODO: return a single value which is the popularity right now
  public now() {}

  // @TODO: return all available times for base graph
  public fullWeek() {}

  // @TODO: return the popular times of today
  public today() {}

  // @TODO: add method to debug api if something changes on google side
  public debug() {}

  public async locationPopulartimes(placeId: string) {
    let googlePageBody: JSDOM;

    try {
      googlePageBody = new JSDOM(await this.fetchPlaceData(placeId));
    } catch (error) {
      console.error('🤔 Something went wrong creating the popular times.', error);
    }

    const rawData = this.transformDomDataToPopularRawtimes(googlePageBody);
    // @TODO: transform to single data (extract today as additional value and transform to entry)
    const extractedData = this.transformRawData(rawData);
    // @TODO: sort due to localized order of weekdays

    return extractedData;
  }

  private async fetchlocationDetails(placeId: string): Promise<IPlace> {
    // tslint:disable-next-line:max-line-length
    const apiDetailsUrl = `${API_DETAILS}${this.outputFormat}?placeid=${placeId}&key=${this.googleApiKey}&language=${this.language}`;
    let response;
    try {
      response = await axios.request<any>({
        url: apiDetailsUrl
      });
    } catch (error) {
      console.error('🤔 Something went wrong fetching the location details.', error);
    }
    return {
      id: response?.data?.result?.id,
      name: response?.data?.result?.name,
      business_status: response?.data?.result?.business_status,
      geometry: {
        lat: response?.data?.result?.geometry?.location.lat,
        long: response?.data?.result?.geometry?.location.lng
      },
      opening_hours: {
        open_now: response?.data?.result?.opening_hours?.open_now,
        periods: response?.data?.result?.opening_hours?.periods
      }
    };
  }

  private async fetchPlaceData(placeId: string): Promise<string> {
    const uiDetailsUrl = `${UI_DETAILS}?q=place_id:${placeId}`;

    let data: string;

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(uiDetailsUrl, { waitUntil: 'networkidle2' });
      data = await page.evaluate(() => document.querySelector('.section-popular-times').outerHTML);
      await browser.close();
    } catch (error) {
      console.error('😵 Something went wrong fetching the data with puppeteer.', error);
    }
    return data;
  }

  private transformDomDataToPopularRawtimes(domData: JSDOM) {
    const badge = domData?.window?.document?.getElementsByClassName('section-popular-times-now-badge')[0]?.innerHTML;
    const desc = domData?.window?.document?.getElementsByClassName('section-popular-times-live-description')[0]
      ?.innerHTML;

    const rawCurrentPopularityText: ILivePopularity = {
      nowBadge: badge ? badge : languageSpecificMagic[this.language].fallbackClosed[0],
      liveDescription: desc ? desc : languageSpecificMagic[this.language].fallbackClosed[1]
    };

    const rawPopulartimes: any = {}; // @TODO: add interface
    Array.from(domData.window.document.getElementsByClassName('section-popular-times-graph')).forEach(
      (timesGraphNode, i) => {
        rawPopulartimes[weekOrderOfApi[i]] = [];
        Array.from(timesGraphNode.getElementsByClassName('section-popular-times-bar')).forEach((entry) => {
          rawPopulartimes[weekOrderOfApi[i]].push(entry.getAttribute('aria-label'));
        });
      }
    );

    return {
      rawPopulartimes,
      rawCurrentPopularityText
    };
  }

  private transformRawData(raw: any) {
    const rawPopularTimes = raw.rawPopulartimes;

    let currentPopularity: number = 0;
    const popularTimes: IPopularTime[] = [];
    for (const day of Object.keys(rawPopularTimes)) {
      popularTimes.push({
        day,
        data: [...Array(24).fill(0)]
      } as IPopularTime);
    }

    // find todays weekday and popular value (Derzeit zu 55 % ausgelastet; normal sind 22 %)
    // add entry for time where now needs to be extracted
    for (const day of Object.keys(rawPopularTimes)) {
      let lastEntry: string = ''; // needed for time of new entry
      rawPopularTimes[day].forEach((entry: any, index: number) => {
        if (entry.includes(languageSpecificMagic[this.language].currently)) {
          const partsLast: string[] = lastEntry.split(' ');
          const partsNow: string[] = entry.split(' ');
          rawPopularTimes[day].splice(
            index,
            1,
            languageSpecificMagic[this.language].pattern(
              partsLast[languageSpecificMagic[this.language].patternSplitLast],
              partsNow[languageSpecificMagic[this.language].patternSplit[1]]
            )
          );
          const currentAsString = partsNow[languageSpecificMagic[this.language].patternSplit[0]].split(' %');
          currentPopularity = Number(currentAsString[0]);
        }
        lastEntry = entry;
      });
    }

    // transform normal entries 'Um 06 Uhr zu 0 % ausgelastet.'
    let weekDayIndex = 0;
    const today: string = weekOrderOfApi[new Date().getDay()];
    for (const day of Object.keys(rawPopularTimes)) {
      if (today === day) {
        popularTimes[weekDayIndex].isToday = true;
      }

      // find closed days (Um  zu  % ausgelastet)
      if (rawPopularTimes[day].length === 1) {
        weekDayIndex++;
        continue;
      }

      rawPopularTimes[day].forEach((entry: any, index: number) => {
        const timeValuePair = languageSpecificMagic[this.language].extractLocalizedValues(entry);
        popularTimes[weekDayIndex].data.splice(timeValuePair.time, 1, timeValuePair.value);
      });
      weekDayIndex++;
    }

    // console.log(rawPopularTimes);
    console.log(popularTimes);

    return {
      currentPopularity,
      currentPopularityText: raw.rawCurrentPopularityText,
      popularTimes
    };
  }

  private sortData() {}
}
