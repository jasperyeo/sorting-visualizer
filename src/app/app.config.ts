import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // provideZonelessChangeDetection(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptorsFromDi()),
    [Location, {provide: LocationStrategy, useClass: HashLocationStrategy}],
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: '/assets/i18n/' }),
      fallbackLang: 'en',
      lang: 'en',
    }),
  ]
};
