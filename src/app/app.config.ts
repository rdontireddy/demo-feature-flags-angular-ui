import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { FeatureFlagService, LD_CLIENT_ID } from './feature-flags/feature-flag.service';

export function InitFeatureFlagService(service: FeatureFlagService) {
    service.initialize()
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    FeatureFlagService, 
    {
      provide: LD_CLIENT_ID, useValue:'Your Own LD Key'
    },
    {
    provide: APP_INITIALIZER,
    useFactory: InitFeatureFlagService,
    deps:[FeatureFlagService]
  }]
};
