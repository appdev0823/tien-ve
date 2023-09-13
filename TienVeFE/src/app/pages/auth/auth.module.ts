import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentModule } from 'src/app/components/component.module';
import { DirectiveModule } from 'src/app/directives/directive.module';
import { AuthGuard } from 'src/app/guards';
import { SharedModule } from 'src/app/includes/shared.module';
import { AuthLayoutComponent } from 'src/app/layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { ROUTES } from 'src/app/utils';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    {
        path: ROUTES.AUTH.MODULE,
        component: AuthLayoutComponent,
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
                path: ROUTES.AUTH.FORGOT_PASSWORD,
                component: ForgotPasswordComponent,
            },
        ],
    },
    {
        path: ROUTES.AUTH.MODULE,
        component: MainLayoutComponent,
        children: [
            {
                path: ROUTES.AUTH.CHANGE_PASSWORD,
                component: ChangePasswordComponent,
                canActivate: [AuthGuard],
            },
        ],
    },
];

@NgModule({
    declarations: [RegisterComponent, LoginComponent, ChangePasswordComponent, ForgotPasswordComponent],
    imports: [RouterModule.forChild(routes), SharedModule, ComponentModule, DirectiveModule],
    providers: [],
})
export class AuthModule {}
