import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AppConfig {
    constructor(private configService: ConfigService) {}

    // getIncomingRequestRootURI(): string {
    //     return this.configService.get<string>('INCOMING_REQUEST_ROOT_URI');
    // }

    getContexts() {
        return JSON.parse(this.configService.get<string>('URI_CONTEXTS'));
    }

    replacePlaceholders(src: string, params: any) {
        let result = src;
        for (let i = 0; i < params.length; i++) {
            const param = params[i];

            let re = new RegExp("%" + i + "%", 'g');
            result = result.replace(re, param);
        }

        return result;
    }

    getDownstreamServiceDetails(key: string, params?: any[]) {
        let targetUrl: string;
        const _contexts = this.getContexts();
        if (_contexts) {
            targetUrl = _contexts.get(key);

            let _params = params;
            if (!targetUrl) {
                throw new Error(`Missing env value ${key}`);
            }

            if (!targetUrl.endsWith("/")) {
                targetUrl = "/" + targetUrl;
            }

            if (params) {
                if (!(params instanceof Array)) {
                    _params = [params];
                }
                targetUrl = this.replacePlaceholders(targetUrl, _params);
            }
            return targetUrl + "/";
        }
        throw new Error("Could not locate URIContext using app config for key " + key);
    }

    getHTTPTimeOut(): number {
        return Number(this.configService.get<number>('HTTP_TIMEOUT'));
    }

    getTokenURL(): string {
        return this.configService.get<string>("TOKEN_URL");
    }

    getTokenClientId(): string {
        return this.configService.get<string>("TOKEN_CLIENT_ID");
    }

    getTokenClientSecret(): string {
        return this.configService.get<string>("TOKEN_CLIENT_SECRET");
    }

    getTokenRedirectURI(): string {
        return this.configService.get<string>("TOKEN_REDIRECT_URI");
    }

    getServiceTypeUrl(type: string) {
        return this.configService.get<string>(type.toUpperCase() + "_SERVICE_ROOT_URL");
    }

    getUserPoolAppSecret() {
        return this.configService.get<string>("USER_POOL_SECRET");
    }

    getUserPoolAppClientId() {
        return this.configService.get<string>("USER_POOL_CLIENT_ID");
    }
}
