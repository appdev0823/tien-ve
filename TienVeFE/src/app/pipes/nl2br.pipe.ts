import { Pipe, PipeTransform } from '@angular/core';
import { Helpers } from '../utils';

@Pipe({
    name: 'nl2br',
})
export class Nl2brPipe implements PipeTransform {
    transform(value: string): string {
        if (!Helpers.isString(value)) return '';

        return value.replace(/\n/g, '<br/>');
    }
}
