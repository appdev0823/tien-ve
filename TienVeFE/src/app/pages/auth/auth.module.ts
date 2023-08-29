import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentModule } from 'src/app/components/component.module';
import { DirectiveModule } from 'src/app/directives/directive.module';
import { SharedModule } from 'src/app/includes/shared.module';
import { ROUTES } from 'src/app/utils';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    {
        path: ROUTES.AUTH.MODULE,
        children: [
            {
                path: ROUTES.AUTH.LOGIN,
                component: LoginComponent,
            },
        ],
    },
];

@NgModule({
    declarations: [LoginComponent],
    imports: [RouterModule.forChild(routes), SharedModule, ComponentModule, DirectiveModule],
    providers: [],
})
export class AuthModule {}
