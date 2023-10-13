import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { UpgradeModalComponent } from 'src/app/components/upgrade-modal/upgrade-modal.component';
import { DebtDTO, DebtRemindRequest, LoginUserDTO } from 'src/app/dtos';
import BaseComponent from 'src/app/includes/base.component';
import { DebtService, UserService } from 'src/app/services';
import { saveAuthStateAction } from 'src/app/store/auth/auth.actions';
import { Helpers } from 'src/app/utils';

@Component({
    selector: 'app-send-remind-message-modal',
    templateUrl: './send-remind-message-modal.component.html',
    styleUrls: ['./send-remind-message-modal.component.scss'],
})
export class SendRemindMessageModalComponent extends BaseComponent implements OnInit {
    public selectedOption: 'CHECKED' | 'NOT_COMPLETED' = 'CHECKED';

    @Input() shouldShowOptions = true;

    @Input() checkedList: DebtDTO[] = [];

    @Input() resultEvent = new EventEmitter<void>();

    constructor(public activeModal: NgbActiveModal, private _user$: UserService, private _debt$: DebtService) {
        super();
    }

    ngOnInit() {
        if (!this.helpers.isFilledArray(this.checkedList)) {
            this.selectedOption = 'NOT_COMPLETED';
        }
    }

    public async onSend() {
        if (this.currentUser.remind_count >= this.currentUser.max_remind_count) {
            this.modal$.open(UpgradeModalComponent, { centered: true });
            return;
        }

        const params: DebtRemindRequest = {};
        if (this.selectedOption === 'CHECKED') {
            params.id_list = this.checkedList.map((item) => item.id);
        }
        if (this.selectedOption === 'NOT_COMPLETED') {
            params.is_not_paid = true;
        }

        const result = await this._debt$.remind(params);
        if (!result.isSuccess || !Helpers.isFilledArray(result.data)) {
            const errMsg = String(this.translate$.instant(`message.${result.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const userProfileRes = await firstValueFrom(this._user$.getProfile());
        if (!userProfileRes.isSuccess || !userProfileRes.data) {
            const errMsg = String(this.translate$.instant(`message.${userProfileRes.message}`));
            this.toast$.error(errMsg);
            return;
        }

        const loginUser = new LoginUserDTO();
        loginUser.id = this.currentUser.id;
        loginUser.email = userProfileRes.data.email;
        loginUser.phone = userProfileRes.data.phone;
        loginUser.name = userProfileRes.data.name;
        loginUser.password = userProfileRes.data.password;
        loginUser.remind_count = userProfileRes.data.remind_count;
        loginUser.max_remind_count = userProfileRes.data.max_remind_count;
        loginUser.is_active = userProfileRes.data.is_active;
        loginUser.created_date = userProfileRes.data.created_date;
        loginUser.updated_date = userProfileRes.data.updated_date;
        loginUser.access_token = this.currentUser.access_token;
        this.store.dispatch(saveAuthStateAction({ payload: loginUser }));

        const errMsg = String(this.translate$.instant('message.success'));
        this.toast$.success(errMsg);

        this.resultEvent.emit();
        this.activeModal.close();
    }
}
