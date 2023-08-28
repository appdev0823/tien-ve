import { inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as brandIcons from '@fortawesome/angular-fontawesome';
import * as regularIcons from '@fortawesome/free-regular-svg-icons';
import * as solidIcons from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { LoginUserDTO } from '../dtos';
import { selectAuthState } from '../store/auth/auth.selectors';
import { CONSTANTS, Helpers, ROUTES } from '../utils';

/** Base class of all components */
export default class BaseComponent {
    // ========== [START] View utilities [START] ==========
    public helpers = Helpers;
    public CONSTANTS = CONSTANTS;
    public ROUTES = ROUTES;

    public icons = {
        solid: solidIcons,
        regular: regularIcons,
        brand: brandIcons,
    };

    public randomStr = Helpers.randomString();
    public curDate = new Date();

    /** Current login user */
    public currentUser = new LoginUserDTO();
    // ========== [END] View utilities [END] ==========

    private _baseModal$? = inject(NgbModal);

    public store = inject(Store);

    constructor() {
        this.store
            .select(selectAuthState)
            .pipe(takeUntilDestroyed())
            .subscribe((authState) => {
                if (authState?.current_user) {
                    this.currentUser = authState.current_user;
                }
            });
    }

    /**
     * Show confirm modal
     *
     *
     * @param confirmMessage - confirm message of modal
     * @param config - other configurations applied to modal
     */
    public showConfirmModal(
        msg: string,
        config: {
            /** Event fires when modal is confirmed */
            confirmEvent: (isConfirmed: boolean) => void;
        },
    ) {
        if (this._baseModal$) {
            const modal = this._baseModal$.open(ConfirmModalComponent, { centered: true });
            const component = modal.componentInstance as ConfirmModalComponent;
            component.message = msg;
            component.confirmEvent.subscribe(config.confirmEvent);
        }
    }
}
