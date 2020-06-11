import { PopularTimesDataService } from './service/populartimes.service';
import { IPlace, IExtractedData } from './model/model';
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
    const fullWeekData: IExtractedData = await this.popularTimesService.locationPopulartimes(placeId, this.language);
    return fullWeekData;
  }

  // @TODO: return the popular times of today
  public today() {}

  // @TODO: Debugging mode
  // @TODO: add method to debug api if something changes on google side
  public debug() {}

  private sortData() {}
}
