import {Injectable, Logger} from "@nestjs/common";
import {AdminHttpService} from "../lib/AdminHttpService";
import {DownStreamException} from "../filters/DownStreamException";
import {ServiceResponse} from "../lib/ServiceResponse";
import {lastValueFrom} from "rxjs";

@Injectable()
export class AppClientService {
    private readonly logger = new Logger(AppClientService.name);

    constructor(private readonly adminHttpService: AdminHttpService) {}

    async defaultPost(token: string, url:string, body: any, serviceType: string): Promise<ServiceResponse> {
        this.logger.debug(`Invoked ${AppClientService.name}::defaultPost`);
        try {
            return lastValueFrom(this.adminHttpService.post(url, body, token, serviceType));
        } catch (err) {
            this.logger.error(err);
            throw new DownStreamException("Service Error", JSON.stringify(err));
        }
    }

    async defaultGet(token: string, contextUrl: string, serviceType: string): Promise<ServiceResponse> {
        this.logger.debug(`Invoked ${AppClientService.name}::defaultGet`);
        try {
            return lastValueFrom(this.adminHttpService.get(contextUrl, token, serviceType));
        } catch (err) {
            throw new DownStreamException("Service Error", err.response);
        }
    }

    async defaultPut(token: string, url:string, body: any, serviceType: string, formatWithSlash: boolean = true): Promise<ServiceResponse> {
        this.logger.debug(`Invoked ${AppClientService.name}::defaultPut`);
        try {
            return lastValueFrom(this.adminHttpService.put(url, body, token, serviceType, formatWithSlash));
        } catch (err) {
            throw new DownStreamException("Service Error", err.response);
        }
    }

    async defaultDelete(token: string, url:string, serviceType: string): Promise<ServiceResponse> {
        this.logger.debug(`Invoked ${AppClientService.name}::defaultDelete`);
        try {
            return lastValueFrom(this.adminHttpService.delete(url, token, serviceType));
        } catch (err) {
            throw new DownStreamException("Service Error", err.response);
        }
    }
}