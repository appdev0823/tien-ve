import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs';
import { CONSTANTS } from '../utils';

/**
 * Factory to load language JSON file in `assets` for translation
 * @param httpClient - HTTP client to load the file
 * @returns HTTP loader to load language file
 */
export const HttpLoaderFactory = (httpClient: HttpClient) => {
    const timestamp = Date.now();
    // add timestamp query to avoid browser caching
    return new TranslateHttpLoader(httpClient, './assets/i18n/', `.json?v=${timestamp}`);
};

/**
 * Factory provides configurations when application initialize
 * @param translate - set default language as `ja`
 */
export const AppInitFactory = (translate: TranslateService) => async () => {
    const defaultLang = CONSTANTS.DEFAULT_LANG;
    translate.setDefaultLang(defaultLang);
    const observable = translate.use(defaultLang);
    await firstValueFrom(observable);
};
