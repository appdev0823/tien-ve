import { Directive, HostListener, ElementRef } from '@angular/core';

/** Directive dùng để viết in hoa không dấu */
@Directive({
    selector: 'input[appUpperCaseRemoveUnicode]',
})
export class UpperCaseRemoveUnicodeDirective {
    /** Constructor */
    constructor(private _el: ElementRef) {}

    /**
     * Lắng nghe sự kiện Input
     */
    @HostListener('input', ['$event'])
    onInputChange(event: InputEvent): void {
        this._removeUnicodeAndToUpperCase(event);
    }

    /**
     * Lắng nghe sự kiện blur
     */
    @HostListener('blur', ['$event'])
    onInputBlur(event: FocusEvent): void {
        this._removeUnicodeAndToUpperCase(event);
    }

    /**
     * Lắng nghe sự kiện focus
     */
    @HostListener('focus', ['$event'])
    onInputFocus(event: FocusEvent): void {
        this._removeUnicodeAndToUpperCase(event);
    }

    /**
     * Lắng nghe sự kiện Angular Form thay đổi giá trị của input programmatically
     */
    @HostListener('ngModelChange', ['$event'])
    onInputChangedByAngularForm(value: string): void {
        let str = value;
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
        str = str.replace(/Đ/g, 'D');

        value = str.toUpperCase();
    }

    private _removeUnicodeAndToUpperCase(event: UIEvent): void {
        const element = this._el.nativeElement as HTMLInputElement;
        let initialValue = element.value;
        initialValue = initialValue.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        initialValue = initialValue.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        initialValue = initialValue.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        initialValue = initialValue.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        initialValue = initialValue.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        initialValue = initialValue.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        initialValue = initialValue.replace(/đ/g, 'd');
        initialValue = initialValue.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
        initialValue = initialValue.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
        initialValue = initialValue.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
        initialValue = initialValue.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
        initialValue = initialValue.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
        initialValue = initialValue.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
        initialValue = initialValue.replace(/Đ/g, 'D');
        element.value = initialValue.toUpperCase();
        if (initialValue !== element.value) {
            event.stopPropagation();
        }
    }
}
