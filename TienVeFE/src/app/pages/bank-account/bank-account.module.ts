import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentModule } from 'src/app/components/component.module';
import { DirectiveModule } from 'src/app/directives/directive.module';
import { AuthGuard } from 'src/app/guards';
import { SharedModule } from 'src/app/includes/shared.module';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { ROUTES } from 'src/app/utils';
import { BankAccountListComponent } from './bank-account-list/bank-account-list.component';
import { BankAccountSaveComponent } from './bank-account-save/bank-account-save.component';

const routes: Routes = [
    {
        path: ROUTES.BANK_ACCOUNT.MODULE,
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: ROUTES.BANK_ACCOUNT.LIST,
                component: BankAccountListComponent,
                canActivate: [AuthGuard],
            },
        ],
    },
];

@NgModule({
    declarations: [BankAccountListComponent, BankAccountSaveComponent],
    imports: [RouterModule.forChild(routes), SharedModule, ComponentModule, DirectiveModule, PipeModule],
})
export class BankAccountModule {}
