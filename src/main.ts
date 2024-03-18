import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {environment} from './environments/environment';
import {EnvironmentEnum} from './environments/environment.enum';
import {enableProdMode} from '@angular/core';
import {AppModule} from './app/app.module';

if (environment.name === EnvironmentEnum.PRODUCTION) {
  enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
