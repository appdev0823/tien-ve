import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export class BaseValidator {
    protected _translate$ = inject(TranslateService);

    public readonly DECIMAL_10_MAX = 9999999999;
    public readonly PHONE_ML = 10;
}
