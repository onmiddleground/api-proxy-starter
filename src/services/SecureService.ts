import {Injectable} from "@nestjs/common";
import { MyDTO } from '../model/MyDTO';
import {TokenService, TokenUtil} from "../lib/TokenUtil";
import {AppClientService} from "./AppClientService";
import {ServiceResponse} from "../lib/ServiceResponse";
import {AppConfig} from "../configsettings/AppConfig";

@Injectable()
export class SecureService {
    constructor(public readonly appClientService: AppClientService, public readonly appConfig: AppConfig) {}

    private static SERVICE_NAME = "YOURSERVICENAME";

    async get(id: string, token?: string) {
        let privateToken: string;
        if (!token) {
            privateToken = TokenService.generateToken("anonymous","anonymous");
        } else {
            privateToken = await TokenUtil.generateDownstreamToken(token);
        }
        return this.appClientService.defaultGet(privateToken,
          this.appConfig.getDownstreamServiceDetails(SecureService.SERVICE_NAME),
          SecureService.SERVICE_NAME
        );
    }

    async getMany(nextToken?: string, token?: string, sortAscending: boolean = false): Promise<ServiceResponse> {
        let privateToken: string = await TokenUtil.generateDownstreamToken(token);

        let rootUrl = this.appConfig.getDownstreamServiceDetails(SecureService.SERVICE_NAME);
        // TODO: Need to fix
        let url = rootUrl + "?";
        if (nextToken) {
            url += "nextToken=" + nextToken
        }

        // TODO: Need to fix
        return this.appClientService.defaultGet(privateToken, url + `&sortAscending=${sortAscending}`, SecureService.SERVICE_NAME);
    }

    async create(token : string, dto: MyDTO) {
        const privateToken: string = await TokenUtil.generateDownstreamToken(token);
        return this.appClientService.defaultPost(privateToken,
          this.appConfig.getDownstreamServiceDetails(SecureService.SERVICE_NAME),
          dto,
          SecureService.SERVICE_NAME
        );
    }

    async update(token : string, id: string, dto: MyDTO, isAdmin: boolean = false) {
        const privateToken: string = await TokenUtil.generateDownstreamToken(token);
        let downstreamServiceDetails;
        if (isAdmin) {
            downstreamServiceDetails = this.appConfig.getDownstreamServiceDetails(SecureService.SERVICE_NAME);
            return this.appClientService.defaultPut(privateToken,
              downstreamServiceDetails + "mycontext/" + id,
              dto,
              SecureService.SERVICE_NAME
            );
        } else {
            downstreamServiceDetails = this.appConfig.getDownstreamServiceDetails(SecureService.SERVICE_NAME);
            return this.appClientService.defaultPut(privateToken,
              // URIResolver(URIContexts.THREAD,id),
              downstreamServiceDetails,
              dto,
              SecureService.SERVICE_NAME
            );
        }
    }

    // TODO: FIx delete
    async delete(token: string, id: string, isAdmin: boolean = false) {
        // const privateToken: string = await TokenUtil.generateDownstreamToken(token);
        // if (isAdmin) {
        //     return this.appClientService.defaultDelete(privateToken,
        //       URIResolver(URIContexts.ADMIN) + "mycontext/" + id,
        //       SecureService.SERVICE_NAME
        //     );
        // } else {
        //     return this.appClientService.defaultDelete(privateToken,
        //       URIResolver(URIContexts.THREADS) + id,
        //       SecureService.SERVICE_NAME
        //     );
        // }
    }
}