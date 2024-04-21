import { Injectable, PipeTransform } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import { ValidationException } from 'src/exceptions';
import AppLogger from 'src/logger/logger';
import { Helpers } from 'src/utils';

@Injectable()
export class ValidationPipe<T extends { [key: string]: any }> implements PipeTransform {
    private _logger = new AppLogger(this.constructor.name);

    /**
     * Construct a validation pipe
     * @param _schema - `Joi` schema
     * @param _batchValidate - should validate multiple list items in the request body
     * @param _logReqBody - log request body as INFO
     */
    constructor(private _schema: ObjectSchema<T>, private _batchValidate = false, private _logReqBody = false) {}

    /**
     * Validate request body
     * @throws `ValidationException`
     */
    public transform(reqBody: { [key: string]: any }) {
        if (this._logReqBody) {
            this._logger.info(JSON.stringify(reqBody));
        }

        if (this._batchValidate) {
            if (!Array.isArray(reqBody)) {
                throw new ValidationException(undefined, undefined, true);
            }

            // if request body is empty but this is a batch validation,
            // throw an exception with no data so that the ValidationExceptionFilter will response correctly
            if (reqBody.length <= 0) {
                throw new ValidationException();
            }

            const errorList = this._validateMultiple(reqBody as { [key: string]: any }[]);
            if (Helpers.isFilledArray(errorList)) {
                throw new ValidationException(undefined, errorList);
            }
        } else {
            // if the request body is not an object, validate an empty object
            const body = typeof reqBody === 'object' && !Array.isArray(reqBody) && reqBody != null ? reqBody : {};
            const errors = this._validate(body);
            if (errors && !Helpers.isEmptyObject(errors)) {
                throw new ValidationException(errors);
            }
        }

        return reqBody;
    }

    /**
     * Validate when the request body is an object array
     */
    private _validateMultiple(body: { [key: string]: any }[]) {
        const errorList: { [k: string]: string }[] = [];
        for (const item of body) {
            const errors = Helpers.validate(this._schema, item);
            if (errors && !Helpers.isEmptyObject(errors)) {
                errorList.push(errors);
            }
        }
        return errorList;
    }

    /**
     * Validate when the request body is an object
     */
    private _validate(body: { [key: string]: any }) {
        return Helpers.validate(this._schema, body);
    }
}
