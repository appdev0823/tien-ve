import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumericInputDirective } from './numeric-input.directive';

@NgModule({
    declarations: [NumericInputDirective],
    imports: [CommonModule],
    exports: [NumericInputDirective],
})
export class DirectiveModule {}
