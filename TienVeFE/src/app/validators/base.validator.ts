import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export class BaseValidator {
    protected translate$ = inject(TranslateService);

    public readonly DECIMAL_15_3_MAX = 999999999999;
    public readonly PHONE_ML = 10;
}
