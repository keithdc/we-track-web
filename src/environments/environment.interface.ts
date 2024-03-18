import {EnvironmentEnum} from './environment.enum';

export interface EnvironmentInterface {
  name: EnvironmentEnum;
  // localhost
  apiUrl: string;
}
