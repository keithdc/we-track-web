// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {EnvironmentEnum} from './environment.enum';
import {EnvironmentInterface} from './environment.interface';

export const environment: EnvironmentInterface = {
  name: EnvironmentEnum.LOCAL,
  // localhost
  apiUrl: 'http://localhost:8080',
};
