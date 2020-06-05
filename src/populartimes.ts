import { API_DETAILS, UI_DETAILS } from './model/constants';

export class PopulartimesService {
  constructor(
    private readonly googleApiKey: string,
    private outputFormat: string = 'json',
    private language: string = 'de'
  ) {}

  public placeDetails(placeId: string) {
    if (!this.googleApiKey) {
      throw new Error('No Google API Key configured');
    }
    // tslint:disable-next-line:max-line-length
    const apiDetailsUrl = `${API_DETAILS}${this.outputFormat}?placeid=${placeId}&key=${this.googleApiKey}&language=${this.language}`;
    const uiDetailsUrl = `${UI_DETAILS}?q=place_id:${placeId}`;
    return { apiDetailsUrl, uiDetailsUrl };
  }
}
