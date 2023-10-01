import { NgModule } from '@angular/core';
import { SharedModule } from '../includes/shared.module';
import { AppToastComponent } from './app-toast/app-toast.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { FormInputWrapperComponent } from './form-input-wrapper/form-input-wrapper.component';
import { UploadComponent } from './upload/upload.component';
import { MessageSelectComponent } from './message-select/message-select.component';
import { RadioModalComponent } from './radio-modal/radio-modal.component';

@NgModule({
    declarations: [AppToastComponent, FormInputWrapperComponent, ConfirmModalComponent, UploadComponent, MessageSelectComponent, RadioModalComponent],
    imports: [SharedModule],
    exports: [AppToastComponent, FormInputWrapperComponent, ConfirmModalComponent, UploadComponent, MessageSelectComponent, RadioModalComponent],
})
export class ComponentModule {}
