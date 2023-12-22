import {ArgumentsHost, Catch, ExceptionFilter, Logger} from '@nestjs/common';
// import {Request, Response} from 'express';
import {DownStreamException} from "./DownStreamException";

class ExceptionData {
    public message: string;
    public error: any;
}

@Catch(DownStreamException)
export class DownStreamExceptionFilter implements ExceptionFilter {

    private readonly logger = new Logger(DownStreamExceptionFilter.name);

    constructor() {}

    mapResponse(exception: any): ExceptionData {
        const exceptionData: ExceptionData = new ExceptionData();

        if (exception && exception.error && exception.error.statusText) {
            exceptionData.error = exception.error.statusText;
            if (exception.error.data && exception.error.data.message) {
                exceptionData.message = exception.error.data.message;
            }
        }

        if (!exceptionData.message) {
            exceptionData.message = exception.message;
            exceptionData.error = exception.stack;
        }
        this.logger.error("DownStreamException occurred for stack",exception.stack);

        return exceptionData;
    }

    catch(exception: DownStreamException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<any>();
        const request = ctx.getRequest<Request>();
        const status: number = exception.error && exception.error.status || 500;

        const exceptionData:ExceptionData = this.mapResponse(exception);

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                message: exceptionData.message,
                errorDetails: exceptionData.error,
                path: request.url,
            });
    }
}