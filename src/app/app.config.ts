import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, provideZonelessChangeDetection } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // provideZonelessChangeDetection(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withXhr(), withInterceptorsFromDi()),
    [Location, {provide: LocationStrategy, useClass: HashLocationStrategy}],
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: './i18n/', suffix: '.json' }),
      fallbackLang: 'en',
      lang: 'en',
    }),
  ]
};
