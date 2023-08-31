import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NumericInputDirective } from './numeric-input.directive';
import { UpperCaseRemoveUnicodeDirective } from './upper-case-remove-unicode.directive';

@NgModule({
    declarations: [NumericInputDirective, UpperCaseRemoveUnicodeDirective],
    imports: [CommonModule],
    exports: [NumericInputDirective, UpperCaseRemoveUnicodeDirective],
})
export class DirectiveModule {}
