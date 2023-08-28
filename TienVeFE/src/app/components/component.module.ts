import { NgModule } from '@angular/core';
import { SharedModule } from '../includes/shared.module';
import { AppToastComponent } from './app-toast/app-toast.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { FormInputWrapperComponent } from './form-input-wrapper/form-input-wrapper.component';

@NgModule({
    declarations: [AppToastComponent, FormInputWrapperComponent, ConfirmModalComponent],
    imports: [SharedModule],
    exports: [AppToastComponent, FormInputWrapperComponent, ConfirmModalComponent],
})
export class ComponentModule {}
