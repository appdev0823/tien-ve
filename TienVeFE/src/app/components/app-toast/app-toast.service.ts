import { Injectable } from '@angular/core';

export type ToastInfo = {
    message: string;
    header?: string;
    delay?: number;
    type: 'SUCCESS' | 'ERROR' | 'INFO';
};

@Injectable({ providedIn: 'root' })
export class AppToastService {
    public toastList: ToastInfo[] = [];

    /**
     * Show successful toast
     * @param content - toast content
     * @param header - toast header
     */
    public success(content: string, header?: string) {
        this.toastList.push({
            message: content,
            header,
            delay: 1000,
            type: 'SUCCESS',
        });
    }

    /**
     * Show error toast
     * @param content - toast content
     * @param header - toast header
     */
    public error(content: string, header?: string) {
        this.toastList.push({
            message: content,
            header,
            delay: 1500,
            type: 'ERROR',
        });
    }

    /**
     * Show info toast
     * @param content - toast content
     * @param header - toast header
     */
    public info(content: string, header?: string) {
        this.toastList.push({
            message: content,
            header,
            delay: 2000,
            type: 'INFO',
        });
    }

    /**
     * Remove toast at index
     * @param toastIdx - toast index
     */
    public remove(toastIdx: number) {
        this.toastList.splice(toastIdx, 1);
    }

    /**
     * Clear toast list
     */
    public clear() {
        this.toastList = [];
    }
}
