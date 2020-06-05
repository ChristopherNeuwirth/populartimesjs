import axios from 'axios';
import { API_DETAILS, UI_DETAILS } from './model/constants';
import { IPlace } from './model/model';

export class Populartimes {
  constructor(
    private readonly googleApiKey: string,
    private outputFormat: string = 'json',
    private language: string = 'de'
  ) {}

  public async placeDetails(placeId: string) {
    if (!this.googleApiKey) {
      throw new Error('No Google API Key configured');
    }

    let placeDetailsData: IPlace;

    try {
      placeDetailsData = await this.locationDetails(placeId);
    } catch (error) {
      console.error(error);
    }
    return placeDetailsData;
  }

  private async locationDetails(placeId: string) {
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
    } as IPlace;
  }

  private async locationPopulartimes(placeId: string) {
    const uiDetailsUrl = `${UI_DETAILS}?q=place_id:${placeId}`;

    // get populartimes
  }
}
