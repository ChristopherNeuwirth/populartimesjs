export interface IPlace {
  id: string;
  name?: string;
  icon?: string;
  phone?: string;
  address_components?: IAddress;
  business_status?: string;
  geometry?: ILocation;
  opening_hours?: IOpeningHours;
  weekday_text?: string[];
  rating?: number;
  vicinity?: string;
  website?: string;
  current_popularity?: number;
  current_popularity_text?: ILivePopularity;
  populartimes?: IPopularTime[];
  populartimes_today?: IPopularTime;
}

export interface IAddress {
  street?: string;
  street_number?: string;
  locality?: string;
  postal_code?: string;
}

export interface ILocation {
  lat: number;
  long: number;
}

export interface IOpeningHours {
  open_now: boolean;
  periods: IPeriod[];
}

export interface IPeriod {
  close: IDayTime;
  open: IDayTime;
}

export interface IDayTime {
  day: number;
  time: string;
}

export interface IPopularTime {
  day: string;
  data: number[];
}

export interface ILivePopularity {
  nowBadge?: string;
  liveDescription?: string;
}

export interface ILocalization {
  [key: string]: {
    default: string;
    currently: string;
  };
}

export interface IWeek {
  [key: number]: string;
}
