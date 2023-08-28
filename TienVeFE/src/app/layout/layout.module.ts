import { NgModule } from '@angular/core';
import { SharedModule } from '../includes/shared.module';
import { HeaderComponent } from './header/header.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
    declarations: [MainLayoutComponent, SidebarComponent, HeaderComponent, FooterComponent],
    imports: [SharedModule],
    exports: [MainLayoutComponent],
})
export class LayoutModule {}
