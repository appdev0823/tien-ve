import { NgModule } from '@angular/core';
import { ComponentModule } from 'src/app/components/component.module';
import { SharedModule } from 'src/app/includes/shared.module';
import { BankAccountListComponent } from './bank-account-list/bank-account-list.component';
import { BankAccountSaveComponent } from './bank-account-save/bank-account-save.component';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from 'src/app/utils';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { AuthGuard } from 'src/app/guards';
import { DirectiveModule } from 'src/app/directives/directive.module';

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
    imports: [RouterModule.forChild(routes), SharedModule, ComponentModule, DirectiveModule],
})
export class BankAccountModule {}
