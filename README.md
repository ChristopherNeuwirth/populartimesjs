# populartimesJs

> ☝️ Currently under development

> 🇩🇪 Currently only working in German. English compatibility follows due to am / pm issue.

PopulartimesJs is a javascript based library to retrieve the popular times of a Google Place, its current popularity and if you provide a Google Developer API key, place meta data such as location, name and many more. All you need to provide is a Google Place id. This library is based on the idea of [m-wrzr populartimes library](https://github.com/m-wrzr/populartimes).

## Getting Started

https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder

## Example

```js
// index.ts
import { Populartimes } from 'populartimesjs';

const populartimes = new Populartimes('yourGoogleAPIKey'); // just needed if you want to get place details
const testPlace = 'ChIJsWlZerbYnUcRI1QgNIGOX5c';

(async () => {
  const data = await populartimes.fullWeek(testPlace);
  console.log('🚀', data);
})();
```

## Output

```js
fullWeek(placeId: string): Promise<IExtractedData>
```

Text

```json
{
  "currentPopularity": 0,
  "currentPopularityText": {
    "nowBadge": "Derzeit",
    "liveDescription": "geschlossen"
  },
  "popularTimes": [
    {
      "day": "sunday",
      "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    {
      "day": "monday",
      "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 35, 49, 58, 61, 58, 54, 56, 58, 49, 31, 0, 0, 0, 0]
    },
    {
      "day": "tuesday",
      "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37, 51, 58, 58, 54, 54, 59, 60, 48, 29, 0, 0, 0, 0]
    },
    {
      "day": "wednesday",
      "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 35, 49, 60, 64, 62, 58, 59, 61, 53, 33, 0, 0, 0, 0]
    },
    {
      "day": "thursday",
      "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      "isToday": true
    },
    {
      "day": "friday",
      "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 55, 61, 61, 62, 67, 68, 64, 59, 48, 27, 0, 0, 0]
    },
    {
      "day": "saturday",
      "data": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 55, 81, 96, 100, 98, 96, 96, 91, 70, 40, 0, 0, 0, 0]
    }
  ]
}
```

---

```js
placeDetails(placeId: string): Promise<IPlace>
```

Text

```json
{
  "id": "a4ae7e2192c051c60263805b7fdd8bb09150fe9d",
  "name": "IKEA Einrichtungshaus Ludwigsburg",
  "business_status": "OPERATIONAL",
  "geometry": { "lat": 48.9180556, "long": 9.1538889 },
  "opening_hours": {
    "open_now": true,
    "periods": [
      // day = index of weekday array starting with 0 sunday
      { "close": { "day": 1, "time": "2000" }, "open": { "day": 1, "time": "1000" } },
      { "close": { "day": 2, "time": "2000" }, "open": { "day": 2, "time": "1000" } },
      { "close": { "day": 3, "time": "2000" }, "open": { "day": 3, "time": "1000" } },
      { "close": { "day": 4, "time": "2100" }, "open": { "day": 4, "time": "1000" } },
      { "close": { "day": 5, "time": "2100" }, "open": { "day": 5, "time": "1000" } },
      { "close": { "day": 6, "time": "2000" }, "open": { "day": 6, "time": "1000" } }
    ]
  }
}
```

## Documentation

`fullWeek(placeId: string): Promise<IExtractedData>`

`now(placeId: string): Promise<number>`

`currentPopularityText(placeId: string): Promise<ILivePopularity>`

`today(placeId: string): Promise<IPopularTime>`

class Populartimes
googleApiKey: string,
outputFormat: string = 'json',
language: string = 'de'

## Development
