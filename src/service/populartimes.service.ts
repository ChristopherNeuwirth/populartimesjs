import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';
import { languageSpecificMagic } from './i18n.service';
import { IExtractedData, ILivePopularity, IPopularTime } from '../model/model';
import { UI_DETAILS, weekOrderOfApi, cookieAgree } from '../model/constants';

export class PopularTimesDataService {
  constructor() {}

  public async locationPopulartimes(placeId: string, language: string): Promise<IExtractedData> {
    try {
      const googlePageBody: JSDOM = new JSDOM(await this.fetchPlaceData(placeId, language));
      const rawData = this.transformDomDataToPopularRawtimes(googlePageBody, language);
      const extractedData = this.transformRawData(rawData, language);

      return extractedData;
    } catch (error) {
      console.error('🤔 Something went wrong creating the popular times.', error);
      return null;
    }
  }

  private async fetchPlaceData(placeId: string, language: string): Promise<string> {
    const uiDetailsUrl = `${UI_DETAILS}?q=place_id:${placeId}&hl=${language}`;

    try {
      const browser = await puppeteer.launch({headless: false});
      const page = await browser.newPage();
      await page.goto(uiDetailsUrl, { waitUntil: 'networkidle2' });
      const [button] = await page.$x(`//button[contains(., "${cookieAgree[language]}")]`);
      if (button) {
          await button.click();
      }
      await page.waitForSelector('.section-popular-times', { visible: true });
      const data: string = await page.evaluate(() => document.querySelector('.section-popular-times').outerHTML);
      await browser.close();
      return data;
    } catch (error) {
      console.error('😵 Something went wrong fetching the data with puppeteer.');
      console.error(
        `🤓 Are you sure the place provides popular times? Check out by viewing your provided place: ${uiDetailsUrl}`
      );
      throw new Error(error);
    }
  }

  private transformDomDataToPopularRawtimes(domData: JSDOM, language: string) {
    const badge = domData?.window?.document?.getElementsByClassName('section-popular-times-now-badge')[0]?.innerHTML;
    const desc = domData?.window?.document?.getElementsByClassName('section-popular-times-live-description')[0]
      ?.innerHTML;

    if (languageSpecificMagic[language]?.fallbackClosed[0] === undefined) {
      console.log(`🔥 For your used language key ${language} the translations in i18n.service.ts are not setup`);
    }
    const rawCurrentPopularityText: ILivePopularity = {
      nowBadge: badge ? badge : languageSpecificMagic[language]?.fallbackClosed[0],
      liveDescription: desc ? desc : languageSpecificMagic[language]?.fallbackClosed[1]
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

  private transformRawData(raw: any, language: string): IExtractedData {
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
        if (entry.includes(languageSpecificMagic[language].currently)) {
          const partsLast: string[] = lastEntry.split(' ');
          const partsNow: string[] = entry.split(' ');
          rawPopularTimes[day].splice(
            index,
            1,
            languageSpecificMagic[language].pattern(
              partsLast[languageSpecificMagic[language].patternSplitLast],
              partsNow[languageSpecificMagic[language].patternSplit[1]]
            )
          );
          const currentAsString = partsNow[languageSpecificMagic[language].patternSplit[0]].split(' %');
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
        const timeValuePair = languageSpecificMagic[language].extractLocalizedValues(entry);
        popularTimes[weekDayIndex].data.splice(timeValuePair.time, 1, timeValuePair.value);
      });
      weekDayIndex++;
    }

    // console.log(rawPopularTimes);
    // console.log(popularTimes);

    return {
      currentPopularity,
      currentPopularityText: raw.rawCurrentPopularityText,
      popularTimes
    };
  }
}
