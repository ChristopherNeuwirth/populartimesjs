import { IWeek } from './model';

const BASE_URL_API = `https://maps.googleapis.com/maps/api/place/`;

export const API_DETAILS = `${BASE_URL_API}details/`;
export const UI_DETAILS = `https://www.google.com/maps/place/`;

export const weekOrderOfApi: IWeek = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday'
};
