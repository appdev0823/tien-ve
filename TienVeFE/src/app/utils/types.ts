export type CommonSearchQuery = {
    /** Search keyword */
    keyword?: string;
    /** Page number, start from 1, pass `-1` to get all */
    page?: number;
};

/**
 * Use values of a object as a union type
 * @example
 * ```
 * const TAB_IDS = { AXIS_TAB: 1, EXTRACT_TAB: 2, DISPLAY_ITEM_TAB: 3, EXECUTE_TAB: 4 } as const;
 * // curTabId: 1 | 2 | 3 | 4
 * const curTabId: ValueOf<typeof this.VALUES.TAB_IDS> = 1;
 * ```
 */
export type ValueOf<T> = T[keyof T];

export type UploadFile = {
    name: string;
    file: File;
    base64?: string;
};
