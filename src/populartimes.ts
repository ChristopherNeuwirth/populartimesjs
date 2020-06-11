import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import { languageSpecificMagic } from './service/i18n.service';
import { PopularTimesDataService } from './service/populartimes.service';
import { UI_DETAILS, weekOrderOfApi } from './model/constants';
import { IPlace, ILivePopularity, IPopularTime, IExtractedData } from './model/model';
import { PlaceDetailService } from './service/details.service';

export class Populartimes {
  private popularTimesService: PopularTimesDataService = new PopularTimesDataService();
  private placeService: PlaceDetailService = new PlaceDetailService();

  constructor(
    private readonly googleApiKey: string,
    private outputFormat: string = 'json',
    private language: string = 'de'
  ) {}

  public async placeDetails(placeId: string): Promise<IPlace> {
    try {
      const placeDetailsData: IPlace = await this.placeService.fetchlocationDetails(
        placeId,
        this.outputFormat,
        this.googleApiKey,
        this.language
      );
      return placeDetailsData;
    } catch (error) {
      console.error('🙈 Something happend during creating placeDetails', error);
      return null;
    }
  }

  // @TODO: return a single value which is the popularity right now
  public now() {}

  // @TODO: return all available times for base graph
  public async fullWeek(placeId: string): Promise<IExtractedData> {
    const fullWeekData: IExtractedData = await this.locationPopulartimes(placeId);
    return fullWeekData;
  }

  // @TODO: return the popular times of today
  public today() {}

  // @TODO: Debugging mode
  // @TODO: add method to debug api if something changes on google side
  public debug() {}

  private async locationPopulartimes(placeId: string): Promise<IExtractedData> {
    try {
      const googlePageBody: JSDOM = new JSDOM(await this.fetchPlaceData(placeId));
      const rawData = this.transformDomDataToPopularRawtimes(googlePageBody);
      const extractedData = this.transformRawData(rawData);

      return extractedData;
    } catch (error) {
      console.error('🤔 Something went wrong creating the popular times.', error);
      return null;
    }
  }

  private async fetchPlaceData(placeId: string): Promise<string> {
    const uiDetailsUrl = `${UI_DETAILS}?q=place_id:${placeId}&hl=${this.language}`;

    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(uiDetailsUrl, { waitUntil: 'networkidle2' });
      const data: string = await page.evaluate(() => document.querySelector('.section-popular-times').outerHTML);
      await browser.close();
      return data;
    } catch (error) {
      console.error('😵 Something went wrong fetching the data with puppeteer.');
      throw new Error(error);
    }
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

    if (Object.keys(rawPopulartimes).length === 0 && rawPopulartimes.constructor === Object) {
      throw new Error('🥺 Something went wrong processing the DOM data to raw data. Noting was extracted.');
    }

    return {
      rawPopulartimes,
      rawCurrentPopularityText
    };
  }

  private transformRawData(raw: any): IExtractedData {
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

      rawPopularTimes[day].forEach((entry: any) => {
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
