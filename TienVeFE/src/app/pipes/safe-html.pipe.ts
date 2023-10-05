import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Helpers } from '../utils';

@Pipe({
    name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
    /** Constructor */
    constructor(private sanitized: DomSanitizer) {}

    transform(value: string) {
        if (!Helpers.isString(value)) return '';

        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}
