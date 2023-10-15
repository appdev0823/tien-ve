import { HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgChartsModule } from 'ng2-charts';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { ComponentModule } from './components/component.module';
import { AppInitFactory, HttpLoaderFactory } from './includes/translation.config';
import { LayoutModule } from './layout/layout.module';
import { AuthModule } from './pages/auth/auth.module';
import { BankAccountModule } from './pages/bank-account/bank-account.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { DebtModule } from './pages/debt/debt.module';
import { reducers } from './store/app.states';
import { AuthEffects } from './store/auth/auth.effects';
import { MDateParserFormatter } from './components/datepicker/date-parser-formatter';
import { MDateAdapter } from './components/datepicker/date-adapter';
import { MessageModule } from './pages/message/message.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        RouterModule.forRoot([], {
            onSameUrlNavigation: 'reload',
            anchorScrolling: 'enabled',
        }),
        NgbModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        }),
        AuthModule,
        DashboardModule,
        BankAccountModule,
        DebtModule,
        MessageModule,
        ComponentModule,
        LayoutModule,
        FontAwesomeModule,
        NgChartsModule,
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([AuthEffects]),
        StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.mode === 'PROD' }),
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: AppInitFactory,
            deps: [TranslateService],
            multi: true,
        },
        { provide: NgbDateParserFormatter, useClass: MDateParserFormatter },
        { provide: NgbDateAdapter, useClass: MDateAdapter },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
