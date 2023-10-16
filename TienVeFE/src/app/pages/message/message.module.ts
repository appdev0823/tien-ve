import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentModule } from 'src/app/components/component.module';
import { AuthGuard } from 'src/app/guards';
import { SharedModule } from 'src/app/includes/shared.module';
import { MainLayoutComponent } from 'src/app/layout/main-layout/main-layout.component';
import { PipeModule } from 'src/app/pipes/pipe.module';
import { ROUTES } from 'src/app/utils';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageTabComponent } from './message-tab/message-tab.component';
import { RemindMessageListComponent } from './remind-message-list/remind-message-list.component';
import { RemindMessageDetailComponent } from './remind-message-detail/remind-message-detail.component';

const routes: Routes = [
    {
        path: ROUTES.MESSAGE.MODULE,
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: ROUTES.MESSAGE.LIST,
                component: MessageTabComponent,
                canActivate: [AuthGuard],
            },
        ],
    },
];

@NgModule({
    declarations: [MessageListComponent, MessageDetailComponent, MessageTabComponent, RemindMessageListComponent, RemindMessageDetailComponent],
    imports: [RouterModule.forChild(routes), SharedModule, ComponentModule, PipeModule],
})
export class MessageModule {}
