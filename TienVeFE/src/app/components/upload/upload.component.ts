import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import BaseComponent from 'src/app/includes/base.component';
import { UploadFile } from 'src/app/utils/types';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent extends BaseComponent {
    /** Allowed file type list */
    @Input({ required: true }) acceptedTypeList: string[] = [];
    /** Maximum number of files allowed */
    @Input() maxCount = 1;
    /** Max file size (MB) */
    /** Disable / enable */
    @Input() disabled = false;
    @Input() maxSize = 2;
    /** Emit uploaded file list */
    @Output() fileListChange = new EventEmitter<UploadFile[]>();

    /** Uploaded file list */
    public uploadedFileList: UploadFile[] = [];

    /** Message when there is uploading file error  */
    public errorMessageList: string[] = [];

    @ViewChild('uploadInput', { static: false }) private _uploadInput?: ElementRef<HTMLInputElement>;

    public get acceptedTypeListStr() {
        return this.acceptedTypeList.map((t) => (!t.startsWith('.') ? `.${t}` : t)).join(',');
    }

    /** Constructor */
    constructor() {
        super();
    }

    /**
     * Handle when a file is uploaded
     * @param event - upload event
     */
    public async onFileUploaded(event: Event) {
        const element = event.currentTarget as HTMLInputElement;
        const fileList = element.files;

        if (!fileList || fileList.length <= 0) return;

        // Check maximum file count
        if (fileList.length + this.uploadedFileList.length > this.maxCount) {
            const errMsg = String(this.translate$.instant('validation.max_file_count', { num: this.maxCount }));
            this.errorMessageList.push(errMsg);
            element.value = '';
            return;
        }

        // Check if file type is accepted
        const acceptedFileList: File[] = [];
        for (let fileIdx = 0; fileIdx < fileList.length; fileIdx++) {
            const file = fileList[fileIdx];

            const isExtValid = this.helpers.isFileExtensionValid(file.name, this.acceptedTypeList);
            const isSizeValid = file.size <= this.maxSize * 1024 * 1024;
            if (isExtValid && isSizeValid) {
                acceptedFileList.push(file);
            } else {
                if (!isExtValid) {
                    const errMsg = String(this.translate$.instant('validation.invalid_file_type', { name: file.name, type: this.acceptedTypeListStr }));
                    this.errorMessageList.push(errMsg);
                }

                if (!isSizeValid) {
                    const errMsg = String(this.translate$.instant('validation.invalid_file_size', { name: file.name, max: this.maxSize }));
                    this.errorMessageList.push(errMsg);
                }
            }
        }

        if (acceptedFileList.length <= 0) return;

        for (const file of acceptedFileList) {
            const base64 = await this.helpers.convertFileToBase64(file);
            this.uploadedFileList.push({ name: file.name, file, base64 });
        }
        this.fileListChange.emit(this.uploadedFileList);
    }

    /**
     * Remove file from list
     * @param idx -  file index
     */
    public removeFile(idx: number) {
        if (idx >= 0) {
            this.uploadedFileList.splice(idx, 1);
            this.fileListChange.emit(this.uploadedFileList);
            if (this._uploadInput) {
                this._uploadInput.nativeElement.value = '';
            }
        }
    }

    /**
     * Reset input
     */
    public reset() {
        this.errorMessageList = [];
        this.uploadedFileList = [];
        this.fileListChange.emit([]);
        if (this._uploadInput) {
            this._uploadInput.nativeElement.value = '';
        }
    }
}
