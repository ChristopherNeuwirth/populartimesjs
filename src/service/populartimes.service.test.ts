import { PopularTimesDataService } from './populartimes.service';

const pageDomMock = `
<div class="section-popular-times">
  <div class="section-popular-times-graph">
    <div class="section-popular-times-now-badge">Aktuell</div>
    <div class="section-popular-times-live-description">weniger als sonst</div>
    <div aria-label="Um 06 Uhr zu 99&nbsp;% ausgelastet."
         class="section-popular-times-bar section-popular-times-bar-with-label">
    </div>
    <div aria-label="Derzeit zu 55 % ausgelastet; normal sind 22 %s."
         class="section-popular-times-bar section-popular-times-bar-with-label">
    </div>
  </div>
</div>
`;

const popularTimesDataService = new PopularTimesDataService();

jest.spyOn<any, any>(popularTimesDataService, 'fetchPlaceData').mockImplementation(() => Promise.resolve(pageDomMock));

test('should integrate', async () => {
  const placeDetailsData = await popularTimesDataService.locationPopulartimes('placeId', 'de');

  expect(placeDetailsData.currentPopularity).toBe(55);
  expect(placeDetailsData.currentPopularityText.nowBadge).toBe('Aktuell');
  expect(placeDetailsData.currentPopularityText.liveDescription).toBe('weniger als sonst');
  expect(placeDetailsData.popularTimes.length).toBe(1);
  expect(placeDetailsData.popularTimes[0].isToday).toBe(true);
  expect(placeDetailsData.popularTimes[0].day).toBe('sunday');
  expect(placeDetailsData.popularTimes[0].data[6]).toBe(99);
  expect(placeDetailsData.popularTimes[0].data[7]).toBe(22);
});
