import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountNumberPipe } from './account-number.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { Nl2brPipe } from './nl2br.pipe';

@NgModule({
    declarations: [AccountNumberPipe, SafeHtmlPipe, Nl2brPipe],
    imports: [CommonModule],
    exports: [AccountNumberPipe, SafeHtmlPipe, Nl2brPipe],
    providers: [AccountNumberPipe, SafeHtmlPipe, Nl2brPipe],
})
export class PipeModule {}
