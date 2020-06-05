import { resolve } from 'path';
import { config } from 'dotenv';
config({ path: resolve(__dirname, '../.env') });

import { PopulartimesService } from './populartimes';

const populartimesService = new PopulartimesService(process.env.GOOGLEAPIKEY);

console.log(populartimesService.placeDetails('ChIJc9Ra71_RmUcRzdxRjVQjqXo'));
