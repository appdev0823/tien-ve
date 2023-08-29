import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as qs from 'qs';
import { catchError, finalize, Observable, throwError, timeout, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { APIResponse } from './api-response';
import { CONSTANTS } from './constants';
import Helpers from './helpers';

/** Common HTTP options used in HTTP requests */
export class HTTPOptions {
    public requestTimeout = 60000;
    public showLoading = true;
    public headers: HttpHeaders | { [header: string]: string | string[] };
    public params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
    public useAccessToken = true;

    /** Constructor */
    constructor() {
        this.headers = { 'Content-Type': 'application/json' };
        if (this.useAccessToken) {
            const accessToken = Helpers.getAccessToken();
            if (!Helpers.isString(accessToken)) return;

            this.headers['Authorization'] = `Bearer ${accessToken}`;
        }
    }
}

/**
 * Base HTTP client for making HTTP requests
 * @example
 * ```
 * // Construct a GET request
 * const { body } = await this._http.get<{ id: number; text: string }[]>(API_ROUTES.PRODUCT.GET_PRODUCT_ATTRIBUTE_LIST);
 * ```
 */
@Injectable({
    providedIn: 'root',
})
export class BaseHTTPClient {
    /** Constructor */
    constructor(private _httpClient: HttpClient) {}

    /**
     * Construct a GET request to API
     * @param route - API route, `environment.api_url` is prepended to this, first `/` is not needed
     * @param query - a object used as the query string
     * @param opts - HTTP options
     */
    public get<T = { [key: string]: any }>(route: string, query = {}, opts = new HTTPOptions()): Observable<HttpResponse<APIResponse<T>>> {
        if (opts.showLoading) Helpers.showLoading();

        const queryString = qs.stringify(query);
        const queries = Helpers.isString(queryString) ? `?${queryString}` : '';
        const url = `${environment.api_url}/${route}${queries}`;

        return this._httpClient
            .get<APIResponse<T>>(url, {
                ...opts,
                responseType: 'json',
                observe: 'response',
            })
            .pipe(
                timeout(opts.requestTimeout),
                catchError((err: HttpErrorResponse) => this._handleError(err)),
                finalize(() => {
                    if (opts.showLoading) Helpers.hideLoading();
                }),
            );
    }

    /**
     * Construct a POST request to API
     * @param route - API route, `environment.api_url` is prepended to this, first `/` is not needed
     * @param body - a object used as the request body
     * @param opts - HTTP options
     */
    public post<T = { [key: string]: any }>(route: string, body: any = {}, opts = new HTTPOptions()) {
        if (opts.showLoading) Helpers.showLoading();

        const url = `${environment.api_url}/${route}`;

        return this._httpClient
            .post<APIResponse<T>>(url, body, {
                ...opts,
                responseType: 'json',
                observe: 'response',
            })
            .pipe(
                timeout(opts.requestTimeout),
                catchError((err: HttpErrorResponse) => this._handleError(err)),
                finalize(() => {
                    if (opts.showLoading) Helpers.hideLoading();
                }),
            );
    }

    /**
     * Construct a PUT request to API
     * @param route - API route, `environment.api_url` is prepended to this, first `/` is not needed
     * @param body - a object used as the request body
     * @param opts - HTTP options
     */
    public put<T = { [key: string]: any }>(route: string, body = {}, opts = new HTTPOptions()) {
        if (opts.showLoading) Helpers.showLoading();

        const url = `${environment.api_url}/${route}`;

        return this._httpClient
            .put<APIResponse<T>>(url, body, {
                ...opts,
                responseType: 'json',
                observe: 'response',
            })
            .pipe(
                timeout(opts.requestTimeout),
                catchError((err: HttpErrorResponse) => this._handleError(err)),
                finalize(() => {
                    if (opts.showLoading) Helpers.hideLoading();
                }),
            );
    }

    /**
     * Construct a DELETE request to API
     * @param route - API route, `environment.api_url` is prepended to this, first `/` is not needed
     * @param opts - HTTP options
     */
    public delete<T = { [key: string]: any }>(route: string, opts = new HTTPOptions()) {
        if (opts.showLoading) Helpers.showLoading();

        const url = `${environment.api_url}/${route}`;

        return this._httpClient
            .delete<APIResponse<T>>(url, {
                ...opts,
                responseType: 'json',
                observe: 'response',
            })
            .pipe(
                timeout(opts.requestTimeout),
                catchError((err: HttpErrorResponse) => this._handleError(err)),
                finalize(() => {
                    if (opts.showLoading) Helpers.hideLoading();
                }),
            );
    }

    /**
     * Handle HTTP error responded from API
     */
    private _handleError(err: HttpErrorResponse) {
        if (err.status === 0) {
            return throwError(() => APIResponse.error('err_unknown_client_error'));
        }
        const error = err.error as APIResponse<any>;
        if (APIResponse.is(error)) {
            return throwError(() => APIResponse.error(error.message, error.data, error.errors));
        }

        return throwError(() => APIResponse.error(CONSTANTS.ERR_INTERNAL_SERVER_ERROR));
    }
}
