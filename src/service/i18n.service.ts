import { ILocalization } from '../model/model';

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
  },
  en: {
    currently: 'Currently',
    fallbackClosed: ['Currently', 'closed'],
    pattern: (time: string, value: string) => {
      // @TODO: Solve AM / PM issue
      return ``;
    },
    patternSplitLast: null, // @TODO
    patternSplit: [], // @TODO
    extractLocalizedValues: (timeValueString: string) => {
      // @TODO
      return {
        time: null,
        value: null
      };
    }
  }
};
