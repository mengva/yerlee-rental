import { ServerErrorDto, StatusCodeErrorDto } from "../types/constants/variables";
import { ErrorHandler } from "./handleError";

export class HttpError extends Error {
    data?: any;
    statusCode: number;

    constructor(message: string, statusCode: StatusCodeErrorDto, data?: any) {
        super(message);
        this.name = 'HttpError';
        this.statusCode = Number.parseInt(statusCode);
        this.data = data;
        // Important: restore prototype chain
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

export class HttpErrorMessage extends Error {
    data: any;
    statusCode: number;

    constructor(message: string, statusCode: StatusCodeErrorDto) {
        super(message);
        this.name = 'HttpErrorMessage';
        this.statusCode = Number.parseInt(statusCode);
        // Important: restore prototype chain
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

export const getHttpError = (error: ServerErrorDto) => {
    const message = ErrorHandler.getErrorMessage(error);
    if (error instanceof HttpError) {
        const statusCode = (error.statusCode.toString() || '400') as StatusCodeErrorDto;
        throw new HttpError(message, statusCode);
    }
    throw new HttpError(message, '400');
}