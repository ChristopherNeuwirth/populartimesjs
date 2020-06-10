import axios from 'axios';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import { API_DETAILS, UI_DETAILS, languageKeyWordMapping, weekOrderOfApi } from './model/constants';
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
      id: response.data.result.id,
      name: response.data.result.name,
      business_status: response.data.result.business_status,
      geometry: {
        lat: response.data.result.geometry.location.lat,
        long: response.data.result.geometry.location.lng
      },
      opening_hours: {
        open_now: response.data.result.opening_hours.open_now,
        periods: response.data.result.opening_hours.periods
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
    // @TODO: Handle Cannot read property 'innerHTML' of undefined (GESCHLOSSEN)

    const badge = domData?.window?.document?.getElementsByClassName('section-popular-times-now-badge')[0]?.innerHTML;
    const desc = domData?.window?.document?.getElementsByClassName('section-popular-times-live-description')[0]
      ?.innerHTML;

    const rawCurrentPopularityText: ILivePopularity = {
      nowBadge: badge ? badge : 'Derzeit', // @TODO: localize
      liveDescription: desc ? desc : 'geschlossen' // @TODO: localize
    };

    const rawPopulartimes: any = {};
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

    let popularTimes: any = {};

    // find closed days: Um  zu  % ausgelastet.

    // transform normal entries 'Um 06 Uhr zu 0 % ausgelastet.'

    // find today weekday + popular value 'Derzeit zu 55 % ausgelastet; normal sind 22 %.',
    // add entry for time where now needs to be extracted
    for (const day of Object.keys(rawPopularTimes)) {
      let dayData: IPopularTime = {
        day: null,
        data: null
      };

      if (rawPopularTimes[day].length === 1) {
        dayData.day = day;
        dayData.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        console.log(dayData);
        //popularTimes[day] = dayData;
      }
      // rawPopularTimes[day].forEach((entry: any) => {
      //   console.log(entry);
      //   //popularTimes[day] = entry;
      //   // if (entry.includes('  %')) {

      //   // }
      // });
    }

    return {
      currentPopularity: NaN,
      currentPopularityText: raw.rawCurrentPopularityText,
      popularTimes
    };
  }

  // private splitEntry(entry: string) {
  //   const parts = entry.split(' ');

  //   // Fallback for entries where there is no rendered value
  //   if (parts[0] === languageKeyWordMapping[this.language ? this.language : 'de'].default && parts[1] === '') {
  //     return {
  //       isNow: false,
  //       time: NaN,
  //       value: NaN
  //     };
  //   }

  //   // ❌❌❌❌
  //   // Brauche auch den Wert für die Zeit da bei "now"
  //   // auch noch der zahlenwert für den default case drin steckt
  //   if (parts[0] === languageKeyWordMapping[this.language ? this.language : 'de'].currently) {
  //     return {
  //       isNow: true,
  //       time: NaN,
  //       value: parts[2].replace(' %', '')
  //     };
  //   }

  //   if (parts[0] === languageKeyWordMapping[this.language ? this.language : 'de'].default) {
  //     return {
  //       isNow: false,
  //       time: parts[1],
  //       value: parts[4].replace(' %', '')
  //     };
  //   }
  // }

  // private sortData() {}
}
