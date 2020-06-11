import { ILocalization, IWeek } from './model';

const BASE_URL_API = `https://maps.googleapis.com/maps/api/place/`;

export const API_DETAILS = `${BASE_URL_API}details/`;
export const UI_DETAILS = `https://www.google.com/maps/place/`;

export const languageSpecificMagic: ILocalization = {
  de: {
    currently: 'Derzeit',
    fallbackClosed: ['Derzeit', 'geschlossen'],
    pattern: (time: string, value: string) => {
      const timeAsNumber = Number(time);
      value = value.substr(0, value.length - 1);
      return `Um ${timeAsNumber + 1} Uhr zu ${value} ausgelastet.`;
    },
    patternSplitLast: 1, // index which in split array of language is time of last entry
    patternSplit: [2, 6], // index which in split array of language are values
    extractLocalizedValues: (timeValueString: string) => {
      const timeStringParts: string[] = timeValueString.split(' ');
      const valueStringWithPercentage: string = timeStringParts[4];
      const valueStringParts: string[] = valueStringWithPercentage.split(' %');
      return {
        time: Number(timeStringParts[1]),
        value: Number(valueStringParts[0])
      };
    }
  }
};

export const weekOrderOfApi: IWeek = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday'
};
