import { resolve } from 'path';
import { config } from 'dotenv';
config({ path: resolve(__dirname, '../.env') });
import { Populartimes } from './populartimes';

// just for development purpose

const populartimes = new Populartimes(process.env.GOOGLEAPIKEY, 'json', 'en');
const testPlace = 'ChIJc9Ra71_RmUcRzdxRjVQjqXo'; // IKEA Ludwigsburg
(async () => {
  const data = await populartimes.placeDetails(testPlace);
  console.log('🏠', data);
})();
(async () => {
  const data = await populartimes.fullWeek(testPlace);
  console.log('🚀', data);
})();
