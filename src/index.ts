import { resolve } from 'path';
import { config } from 'dotenv';
config({ path: resolve(__dirname, '../.env') });

import { Populartimes } from './populartimes';

// just for development purpose. If finished make this primary entry point for popular times.

const populartimes = new Populartimes(process.env.GOOGLEAPIKEY);
const testPlace = 'ChIJc9Ra71_RmUcRzdxRjVQjqXo'; // IKEA Ludwigsburg

(async () => {
  const data = await populartimes.fullWeek(testPlace);
  console.log('🚀', data);
})();
