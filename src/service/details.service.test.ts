import { PlaceDetailService } from './details.service';
import axios from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

test('should throw error if no API key is provided', async () => {
  const placeDetailsService = new PlaceDetailService();
  let error = false;

  try {
    await placeDetailsService.fetchlocationDetails('place', 'json', 'NONE', 'de');
  } catch (e) {
    error = e.message;
  }

  expect(error).toBe('💩 You need a personal API key to fetch this data');
});

test('should fet location details', async () => {
  const response = {
    data: {
      result: {
        id: 'ABC',
        name: 'testname',
        business_status: 'open',
        geometry: { location: { lat: 33.2, lng: 44.3 } },
        opening_hours: {
          open_now: 'open',
          periods: []
        }
      }
    } as any
  };

  mockedAxios.request.mockImplementation(() => Promise.resolve(response));

  const placeDetailsService = new PlaceDetailService();
  const placeData = await placeDetailsService.fetchlocationDetails('place', 'json', 'key', 'de');

  expect(placeData).toMatchObject({
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
  });
});
