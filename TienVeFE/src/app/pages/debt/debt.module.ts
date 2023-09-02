import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentModule } from 'src/app/components/component.module';
import { DirectiveModule } from 'src/app/directives/directive.module';
import { AuthGuard } from 'src/app/guards';
import { SharedModule } from 'src/app/includes/shared.module';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { ROUTES } from 'src/app/utils';
import { DebtImportComponent } from './debt-import/debt-import.component';

const routes: Routes = [
    {
        path: ROUTES.DEBT.MODULE,
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: ROUTES.DEBT.IMPORT,
                component: DebtImportComponent,
                canActivate: [AuthGuard],
            },
        ],
    },
];

@NgModule({
    declarations: [DebtImportComponent],
    imports: [RouterModule.forChild(routes), SharedModule, ComponentModule, DirectiveModule],
})
export class DebtModule {}
