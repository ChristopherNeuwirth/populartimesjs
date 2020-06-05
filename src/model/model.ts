export interface IPlace {
  id: string;
  name: string;
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
  populartimes?: IPopularTime[];
}

interface IAddress {
  street?: string;
  street_number?: string;
  locality?: string;
  postal_code?: string;
}

interface ILocation {
  lat: number;
  long: number;
}

interface IOpeningHours {
  open_now: boolean;
  periods: IPeriod[];
}

interface IPeriod {
  close: IDayTime;
  open: IDayTime;
}

interface IDayTime {
  day: number;
  time: string;
}

interface IPopularTime {
  name: string;
  data: number[];
}
