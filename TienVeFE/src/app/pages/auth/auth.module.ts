import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentModule } from 'src/app/components/component.module';
import { DirectiveModule } from 'src/app/directives/directive.module';
import { SharedModule } from 'src/app/includes/shared.module';
import { ROUTES } from 'src/app/utils';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AuthGuard } from 'src/app/guards';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';

const routes: Routes = [
    {
        path: ROUTES.AUTH.MODULE,
        children: [
            {
                path: ROUTES.AUTH.REGISTER,
                component: RegisterComponent,
            },
            {
                path: ROUTES.AUTH.LOGIN,
                component: LoginComponent,
            },
            {
                path: ROUTES.AUTH.CHANGE_PASSWORD,
                component: MainLayoutComponent,
                children: [
                    {
                        path: '',
                        component: ChangePasswordComponent,
                        canActivate: [AuthGuard],
                    },
                ],
            },
        ],
    },
];

@NgModule({
    declarations: [RegisterComponent, LoginComponent, ChangePasswordComponent],
    imports: [RouterModule.forChild(routes), SharedModule, ComponentModule, DirectiveModule],
    providers: [],
})
export class AuthModule {}
