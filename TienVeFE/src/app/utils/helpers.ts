import { NgbDate, NgbDateStruct, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as dayjs from 'dayjs';
import * as XLSX from 'xlsx';

export default class Helpers {
    /**
     * Make all properties of an object immutable including nested objects
     * @param obj - this can contain nested objects
     * @returns a readonly version of `obj`
     */
    public static deepFreeze<T extends { [key: string]: any }>(obj: T) {
        Object.keys(obj).forEach((prop) => {
            if (typeof obj[prop] === 'object' && !Object.isFrozen(obj[prop])) {
                Helpers.deepFreeze(obj[prop]);
            }
        });
        return Object.freeze(obj);
    }

    /**
     * Check if array contains element or not
     * @param arr - any variable
     */
    public static isFilledArray(arr: any): arr is any[] {
        return Array.isArray(arr) && arr.length > 0;
    }

    /**
     * Check if a variable is a filled string or not
     * @param str - any variable
     */
    public static isString(str: any): str is string {
        return str !== null && typeof str === 'string' && str.trim().length > 0;
    }

    /**
     * Check if object is empty or null or undefined
     * @param obj - any variable
     * @returns object is empty or null or undefined
     */
    public static isEmptyObject(obj: any) {
        if (obj === null) return true;
        if (typeof obj === 'undefined') return true;
        if (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            Object.keys(obj).length === 0 &&
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            obj.constructor === Object
        )
            return true;
        return false;
    }

    /**
     * Check if function is async or not
     * @param obj - any function
     * @returns - function is async or not
     */
    public static isAsync(obj: Function) {
        return obj.constructor.name === 'AsyncFunction';
    }

    /**
     * Show app loading layout
     */
    public static showLoading() {
        const appLoadingLayer = document.getElementById('appLoadingLayer');
        if (appLoadingLayer) appLoadingLayer.style.display = '';

        const appLoading = document.getElementById('appLoading');
        if (appLoading) appLoading.style.display = '';
    }

    /**
     * Hide app loading layout
     */
    public static hideLoading() {
        const appLoadingLayer = document.getElementById('appLoadingLayer');
        if (appLoadingLayer) appLoadingLayer.style.display = 'none';

        const appLoading = document.getElementById('appLoading');
        if (appLoading) appLoading.style.display = 'none';
    }

    /**
     * Check if an object has `key` or not
     * @param obj - any variable
     * @param propName - property name
     * @returns - `obj` has `propName` or not
     */
    public static hasProperty(obj: any, propName: string): obj is { [k: string]: any } {
        return obj !== null && typeof obj === 'object' && Object.prototype.hasOwnProperty.call(obj, propName);
    }

    /**
     * Get access token
     */
    public static getAccessToken() {
        // can't use CONSTANTS here because CONSTANTS needs Helpers to be initialized first
        return localStorage.getItem('tien_ve_access_token');
    }

    /**
     * Remove access token
     */
    public static removeAccessToken() {
        // can't use CONSTANTS here because CONSTANTS needs Helpers to be initialized first
        return localStorage.removeItem('tien_ve_access_token');
    }

    /**
     * Get common options to open modal
     * @param customOpts - custom options, added to the common options
     * @returns common options (added `customOpts`)
     */
    public static getOpenModalCommonOptions(customOpts?: NgbModalOptions) {
        const commonOpts: NgbModalOptions = {
            centered: true,
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
        };

        if (customOpts) {
            Object.assign(commonOpts, customOpts);
        }

        return commonOpts;
    }

    /**
     * Convert `Date` to `NgbDate`
     * @param date - a `Date` instance
     * @returns `NgbDate` instance
     */
    public static convertDateToNgbDate(date: Date): NgbDate {
        return new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    /**
     * Convert `NgbDate` to `Date`
     * @param date - a `NgbDate` instance
     * @returns `Date` instance
     */
    public static convertNgbDateToDate(date: NgbDateStruct): Date {
        const result = new Date();
        result.setDate(date.day);
        result.setMonth(date.month - 1);
        result.setFullYear(date.year);
        return result;
    }

    /**
     * Get the string which is the formatted number
     * @param num - any number
     * @returns formatted number
     */
    static formatNumber(num: number): string {
        if (!num) return '0';
        const _moneyAmount = parseFloat(`${num}`);
        return new Intl.NumberFormat('en-US').format(_moneyAmount);
    }

    /**
     * Check if `value` is not null and not undefined
     * @returns `true` if `value` is not null and not undefined
     */
    static isDefined<T>(value: T | null | undefined): value is T {
        return value !== null && typeof value !== 'undefined';
    }

    /**
     * Format date
     * @param date - date input
     * @param toFormat - the designated format
     * @returns formatted date string
     */
    static formatDate(date: Date | string | number, toFormat = 'DD/MM/YYYY') {
        return dayjs(date).format(toFormat);
    }

    /**
     * Get random string
     * @param len - string length
     * @param charSet - characters set
     * @returns random string
     */
    static randomString(len?: number, charSet?: string) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        len = len || 15;
        let randomString = '';
        for (let i = 0; i < len; i++) {
            const randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }
        return randomString;
    }

    /**
     * Extract all numbers in a string by using regex to replace non-numeric characters
     * @param str - any string or number (which maybe set to string during runtime), not being mutated
     * @returns a number that is a combination of all numbers in the sequence from left to right, 0 if error
     * @example
     * ```typescript
     * const str = "110ab122cd";
     * const num = Lib.extractNumberFromString(str); //110122
     * ```
     */
    public static extractNumberFromString(str: string | number | null | undefined): number {
        if (typeof str === 'number') return str;
        if (!Helpers.isString(str)) return 0;

        const copy = str ? String(str) : '';
        const result = copy.replace(/[^0-9.]*/g, '');
        const resultNum = Number(result) ? Number(result) : 0;
        return String(str).startsWith('-') ? -resultNum : resultNum;
    }

    /**
     * Get the string which is the formatted number
     * @param number - any number
     * @param options - format options
     * @returns formatted number
     */
    static getFormatNumber(number: string | number | null | undefined, options?: Intl.NumberFormatOptions): string {
        if (!number) return '0';

        const _moneyAmount = parseFloat(String(number) || '0');
        return new Intl.NumberFormat(
            'en-US',
            options || {
                minimumFractionDigits: 0,
                maximumFractionDigits: 5,
            },
        ).format(_moneyAmount);
    }

    static removeSubstringStartingWith(originalString: string, startingString: string) {
        const index = originalString.indexOf(startingString);
        if (index !== -1) {
            return originalString.substring(0, index);
        }
        return originalString;
    }

    static parseDateStringToNgbDate(dateString: string): NgbDate | null {
        if (!dateString) {
            return null;
        }

        const parts = dateString.split('/');
        if (parts.length !== 3) {
            return null; // Invalid format, return null
        }

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return null; // Invalid numeric values, return null
        }

        return new NgbDate(year, month, day);
    }

    /**
     * Get phone number regex
     * @returns phone number regex
     */
    static getPhoneNumberRegex() {
        return /^([0-9]{10})$/;
    }

    /**
     * Check if the extension of an uploaded file is valid
     *
     * @param fileName - File name
     * @param extList - Valid file extension list
     * @returns `true` if file extension is in `extList`
     */
    static isFileExtensionValid(fileName: string, extList: string[]): boolean {
        if (!Helpers.isString(fileName)) return false;
        if (!Helpers.isFilledArray(extList)) return false;

        const lowerFileName = fileName.toLowerCase();
        const fileExt = lowerFileName.substr(lowerFileName.lastIndexOf('.') + 1);
        return extList.some((ext) => ext === fileExt);
    }

    static async convertFileToBase64(file: File) {
        return new Promise<string>((resolve) => {
            let base64Str = '';
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                base64Str = String(reader?.result);
                resolve(base64Str);
            };
            reader.onerror = () => {
                resolve('');
            };
        });
    }

    static async readExcelFile(file: File) {
        return new Promise<string[][]>((resolve) => {
            let result: string[][] = [];
            if (!file) {
                resolve(result);
                return;
            }

            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            const cellSeparator = ',';
            const rowSeparator = ';';
            fileReader.onload = (e) => {
                const bufferArray = e?.target?.result;
                const wb = XLSX.read(bufferArray, { type: 'buffer' });
                const wsName = wb.SheetNames[0];
                const ws = wb.Sheets[wsName];
                const dataStr = XLSX.utils.sheet_to_csv(ws, {
                    FS: cellSeparator,
                    RS: rowSeparator,
                    strip: true,
                    blankrows: false,
                    rawNumbers: true,
                });
                if (!this.isString(dataStr)) {
                    resolve(result);
                    return;
                }

                const rowCSVStrList = dataStr.split(rowSeparator);
                if (!this.isFilledArray(rowCSVStrList)) {
                    resolve(result);
                    return;
                }

                result = rowCSVStrList.filter((csvStr) => Helpers.isString(csvStr)).map((csvStr) => csvStr.split(cellSeparator));

                resolve(result);
            };

            fileReader.onerror = () => {
                resolve([]);
            };
        });
    }
}
