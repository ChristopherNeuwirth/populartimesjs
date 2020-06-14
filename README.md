# populartimesjs

> ☝️ Currently under development

> 🇩🇪 Currently only supported localization is German. English compatibility follows as soon as am / pm issue is solved. Language has no impact on the functionality.

Populartimesjs is a javascript based library to retrieve the popular times of a Google Place, its current popularity and if you provide a Google Developer API key, place meta data such as location, name and many more. All you need to provide is a Google Place id. This library is based on the idea of [m-wrzr populartimes library](https://github.com/m-wrzr/populartimes).

🙈 Be aware this library can get broken due to changes of Google Places. Since Google does not provide popular times of places by its api this library makes use of the `aria labels` for screen readers and converts them into a structured response.

## Getting Started

All you need to get started is a place id of a Google Maps place, you can find them by the [Google Places ID Finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder). Mind that the place needs to provide popular times. Places without popular times are not supported.

Start a new project or import `populartimesjs` to an existing one as dependency.

```bash
npm install @christophern/populartimesjs --save
```

Mind the default languge 🇩🇪. You can add and also configure others by initializing `populartimesjs` with the language property.

## Example

### Typescript

```js
// index.ts
import { Populartimes } from '@christophern/populartimesjs';

const populartimes = new Populartimes('yourGoogleAPIKey'); // just needed if you want to get place details
const testPlace = 'ChIJsWlZerbYnUcRI1QgNIGOX5c';

(async () => {
  const data = await populartimes.fullWeek(testPlace);
  console.log('🚀', data);
})();
```

### Vanilla / Node

```js
//index.js
var Populartimes = require('@christophern/populartimesjs').Populartimes;
var populartimes = new Populartimes();

populartimes.fullWeek('ChIJsWlZerbYnUcRI1QgNIGOX5c').then((data) => {
  console.log('🚀', data);
});
```

## Output

```js
fullWeek(placeId: string): Promise<IExtractedData>
```

This method gives you access to the complete data available. See the documentation section blow for accessing specific subsets.

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

This method returns you available meta data of a place by the official Google Maps API. It requires you to initialize `populartimesjs` with a personal api key.

```json
{
  "id": "a4ae7e2192c051c60263805b7fdd8bb09150fe9d",
  "name": "IKEA Einrichtungshaus Ludwigsburg",
  "business_status": "OPERATIONAL",
  "geometry": { "lat": 48.9180556, "long": 9.1538889 },
  "opening_hours": {
    "open_now": true,
    "periods": [
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

### fullWeek(placeId: string)

Returns you the full data available.

### now(placeId: string)

Returns you just the `currentPopularity`.

### currentPopularityText(placeId: string)

Returns you the localized `currentPopularityText` property.

### today(placeId: string)

Returns you the full data but instead all weekdays it just returns you the popular times of today.

### placeDetails(placeId: string)

Returns you the meta data of a place by the official Google Maps API if you provide an api key to `populartimes`.

## Development

`// follows`
