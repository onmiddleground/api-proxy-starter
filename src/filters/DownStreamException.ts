import {Logger} from "@nestjs/common";

export class DownStreamException extends Error {

    private readonly logger = new Logger(DownStreamException.name);

    constructor(message: string, public readonly error: any) {
        super(message);
        this.logger.error(JSON.stringify(error && error.data ? error.data : { message }),"Downstream function failed");
    }
}