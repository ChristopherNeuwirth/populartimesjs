import { PopularTimesDataService } from './service/populartimes.service';
import { IPlace, IExtractedData, IPopularTime, ILivePopularity } from './model/model';
import { PlaceDetailService } from './service/details.service';

export class Populartimes {
  private popularTimesService: PopularTimesDataService = new PopularTimesDataService();
  private placeService: PlaceDetailService = new PlaceDetailService();

  constructor(
    private readonly googleApiKey: string = 'NONE',
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

  public async now(placeId: string): Promise<number> {
    const fullWeekData: IExtractedData = await this.popularTimesService.locationPopulartimes(placeId, this.language);
    return fullWeekData.currentPopularity;
  }

  public async currentPopularityText(placeId: string): Promise<ILivePopularity> {
    const fullWeekData: IExtractedData = await this.popularTimesService.locationPopulartimes(placeId, this.language);
    return fullWeekData.currentPopularityText;
  }

  public async fullWeek(placeId: string): Promise<IExtractedData> {
    const fullWeekData: IExtractedData = await this.popularTimesService.locationPopulartimes(placeId, this.language);
    return fullWeekData;
  }

  public async today(placeId: string): Promise<IPopularTime> {
    const fullWeekData: IExtractedData = await this.popularTimesService.locationPopulartimes(placeId, this.language);
    const today = fullWeekData.popularTimes.filter((day) => day.isToday);
    return today[0];
  }

  // @TODO: Debugging mode
  // @TODO: add method to debug api if something changes on google side
  public debug() {}
}
