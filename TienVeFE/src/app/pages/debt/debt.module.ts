import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentModule } from 'src/app/components/component.module';
import { DirectiveModule } from 'src/app/directives/directive.module';
import { AuthGuard } from 'src/app/guards';
import { SharedModule } from 'src/app/includes/shared.module';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { ROUTES } from 'src/app/utils';
import { DebtImportComponent } from './debt-import/debt-import.component';
import { DebtListComponent } from './debt-list/debt-list.component';
import { DebtDetailComponent } from './debt-detail/debt-detail.component';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { SendRemindMessageModalComponent } from './send-remind-message-modal/send-remind-message-modal.component';
import { DebtCreateComponent } from './debt-create/debt-create.component';

const routes: Routes = [
    {
        // path: ROUTES.DEBT.MODULE,
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            // {
            //     path: ROUTES.DEBT.IMPORT,
            //     component: DebtImportComponent,
            //     canActivate: [AuthGuard],
            // },
            // {
            //     path: ROUTES.DEBT.LIST,
            //     component: DebtListComponent,
            //     canActivate: [AuthGuard],
            // },
        ],
    },
];

@NgModule({
    declarations: [DebtImportComponent, DebtListComponent, DebtDetailComponent, SendRemindMessageModalComponent, DebtCreateComponent],
    imports: [RouterModule.forChild(routes), SharedModule, ComponentModule, DirectiveModule, PipeModule],
})
export class DebtModule {}
