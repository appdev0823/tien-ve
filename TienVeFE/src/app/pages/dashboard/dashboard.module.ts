import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/includes/shared.module';
import { ROUTES } from 'src/app/utils';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { AuthGuard } from 'src/app/guards';

const routes: Routes = [
    {
        path: ROUTES.DASHBOARD,
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: ROUTES.DASHBOARD,
                component: DashboardComponent,
                canActivate: [AuthGuard],
            },
        ],
    },
];

@NgModule({
    declarations: [DashboardComponent],
    imports: [RouterModule.forChild(routes), SharedModule],
})
export class DashboardModule {}
