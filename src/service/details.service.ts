import { IPlace } from '../model/model';
import { API_DETAILS } from '../model/constants';
import Axios from 'axios';

export class PlaceDetailService {
  constructor() {}

  public async fetchlocationDetails(
    placeId: string,
    outputFormat: string,
    apiKey: string,
    language: string
  ): Promise<IPlace> {
    if (apiKey === 'NONE') {
      throw new Error('💩 You need a personal API key to fetch this data');
    }

    const apiDetailsUrl = `${API_DETAILS}${outputFormat}?placeid=${placeId}&key=${apiKey}&language=${language}`;
    let response;
    try {
      response = await Axios.request<any>({
        url: apiDetailsUrl
      });
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
    } catch (error) {
      console.error(
        `🤔 Something went wrong fetching the location details. Can you access the provided place: ${apiDetailsUrl}`
      );
      throw new Error(error);
    }
  }
}
