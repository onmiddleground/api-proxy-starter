import {HttpStatus, Injectable, Logger, ServiceUnavailableException} from '@nestjs/common';
import {AppConfig} from "../configsettings/AppConfig";
import {HttpService} from "@nestjs/axios";
import {Observable} from "rxjs";
import {map} from 'rxjs/operators';
import { ServiceResponse } from './ServiceResponse';

@Injectable()
export class AdminHttpService {
    private readonly logger = new Logger(AdminHttpService.name);

    constructor(private readonly configService: AppConfig, private readonly httpService: HttpService) {}

    private getServiceTypeUrl(contextUrl: string, type: string) {
        // Get the Root url for the Service
        const rootUrl = this.configService.getServiceTypeUrl(type)
        if (!rootUrl) {
            throw new Error(`Missing env value ${type.toUpperCase()}_SERVICE_ROOT_URL`);
        }

        return rootUrl + contextUrl;
    }

    private getHeaders(token: string) {
        return {
            // "x-auth-token": this.getApiToken(token)
            "x-auth-token": token
        };
    }

    private static convertAxiosResponse(axiosResponse: any): ServiceResponse {
        let serviceResponse: ServiceResponse;

        if (axiosResponse && axiosResponse.data) {
            serviceResponse = ServiceResponse.createSuccess(axiosResponse.data);
            serviceResponse.message = axiosResponse.statusText;
        } else {
            serviceResponse = ServiceResponse.createEmpty();
            serviceResponse.statusCode = HttpStatus.NO_CONTENT;   // No Content
        }

        return serviceResponse;
    }

    rawGet(contextUrl: string, headers: any = {}, apiKey?: string): Observable<ServiceResponse> {
        try {
            const _url:string = contextUrl;
            this.logger.debug(`Invoked ${AdminHttpService.name}::get using URL ${_url}`);

            return this.httpService.get(_url, {
                timeout: this.configService.getHTTPTimeOut(),
                headers
            }).pipe(map(o => AdminHttpService.convertAxiosResponse(o)));
        } catch (err) {
            console.log(err);
            throw new ServiceUnavailableException(err,"get request failed");
        }
    }

    rawPost(contextUrl: string, data: any = {}, headers: any = {}, apiKey?: string): Observable<ServiceResponse> {
        try {
            const _url:string = contextUrl;
            this.logger.debug(`Invoked ${AdminHttpService.name}::post using URL ${_url}`);

            if (apiKey) {
                headers["x-api-key"] = apiKey;
            }

            return this.httpService.post(_url, data, {
                timeout: this.configService.getHTTPTimeOut(),
                headers
            }).pipe(map(o => AdminHttpService.convertAxiosResponse(o)));
        } catch (err) {
            console.log(err);
            throw new ServiceUnavailableException(err,"get request failed");
        }
    }

    get(contextUrl: string, token: string, type: string): Observable<ServiceResponse> {
        try {
            const _url:string = this.getServiceTypeUrl(contextUrl, type);
            this.logger.debug(`Invoked ${AdminHttpService.name}::get using URL ${_url}`);

            let headers: any = this.getHeaders(token);

            return this.httpService.get(_url, {
                timeout: this.configService.getHTTPTimeOut(),
                headers
            }).pipe(map(o => AdminHttpService.convertAxiosResponse(o)));
        } catch (err) {
            console.log(err);
            throw new ServiceUnavailableException(err,"get request failed");
        }
    }

    post(url: string, body: any, token: string, type: string): Observable<ServiceResponse> {
        const _url:string = this.getServiceTypeUrl(url, type);
        this.logger.debug(`Invoked ${AdminHttpService.name}::post using URL ${_url}`);

        let headers: any = this.getHeaders(token);

        this.logger.debug(JSON.stringify(body));

        return this.httpService.post(_url, body, {
            timeout: this.configService.getHTTPTimeOut(),
            headers
        }).pipe(map(o => AdminHttpService.convertAxiosResponse(o)));
    }

    // upload(url: string, body: FormData, token: string, type: ServiceType): Observable<ServiceResponse> {
    //     const _url:string = this.getServiceTypeUrl(url, type);
    //     this.logger.debug(`Invoked ${AdminHttpService.name}::post using URL ${_url}`);
    //
    //     let headers: any = this.getHeaders(token);
    //     headers['Content-Type'] = 'multipart/form-data';
    //
    //     return this.httpService.post(_url, body, {
    //         timeout: this.configService.getHTTPTimeOut(),
    //         headers
    //     }).pipe(map(o => AdminHttpService.convertAxiosResponse(o)));
    // }

    put(url: string, body: any, token: string, type: string, formatWithSlash: boolean = true): Observable<ServiceResponse> {
        this.logger.debug(`Invoked PUT with URL ${url}`);
        let _url:string = this.getServiceTypeUrl(url, type);
        this.logger.debug(`Invoked ${AdminHttpService.name}::put using URL ${_url}`);
        if (formatWithSlash) {
            if (!_url.endsWith("/")) {
                _url += "/";
            }
        }

        let headers: any = this.getHeaders(token);
        this.logger.debug("Headers " + JSON.stringify(headers));

        return this.httpService.put(_url, body, {
            timeout: this.configService.getHTTPTimeOut(),
            headers
        }).pipe(map(o => AdminHttpService.convertAxiosResponse(o)));
    }

    delete(url: string, token: string, type: string): Observable<ServiceResponse> {
        const _url:string = this.getServiceTypeUrl(url, type);
        this.logger.debug(`Invoked ${AdminHttpService.name}::delete using URL ${_url}`);

        let headers: any = this.getHeaders(token);

        return this.httpService.delete(_url, {
            timeout: this.configService.getHTTPTimeOut(),
            headers
        }).pipe(map(o => AdminHttpService.convertAxiosResponse(o)));
    }
}

