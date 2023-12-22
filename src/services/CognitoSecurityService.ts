import {Injectable, Logger} from "@nestjs/common";
import {Buffer} from "buffer";
import {AdminHttpService} from "../lib/AdminHttpService";
import {lastValueFrom} from "rxjs";
import {ServiceResponse} from "../lib/ServiceResponse";
import {AppConfig} from "../configsettings/AppConfig";
import { TokenUtil } from '../lib/TokenUtil';
import { SecurityService } from './SecurityService';
// import {CognitoIdentityServiceProvider} from "aws-sdk";

@Injectable()
export class CognitoSecurityService implements SecurityService {

    private readonly logger = new Logger(CognitoSecurityService.name);

    constructor(public readonly httpService: AdminHttpService, public readonly config: AppConfig) {}

    async hasPermissions(token: string): Promise<boolean> {
        let cognitoToken: any;

        try {
            const idToken = TokenUtil.parseAuthheader(token)
            // cognitoToken = TokenUtil.getCognitoToken(token);
            await this.verifyToken(idToken);
            // const accessToken = TokenUtil.getAccessToken(token);

            // Make sure we definitely have the Id and Access Token
            if (idToken && TokenUtil.hasExpired(idToken)) {
                this.logger.error("Token has expired");
                return;
            } else if (idToken) {
                return true;
            } else {
                this.logger.error("Invalid Token. Missing required token parameters");
                return;
            }

        } catch (err) {
            this.logger.error(err, "Failed creating Permission Service");
            throw new Error(err);
        }
    }

    async verifyToken(token: any): Promise<void> {
        this.logger.debug("::verifyCognitoToken");
        //
        // // Verifier that expects valid access tokens:
        // const verifier = CognitoJwtVerifier.create({
        //     userPoolId: process.env.USER_POOL_ID,
        //     tokenUse: "id",
        //     clientId: process.env.USER_POOL_CLIENT_ID,
        // });
        //
        // try {
        //     this.logger.debug("::Verifying Token");
        //     await verifier.verify(token);
        //     this.logger.debug("::Verified Ok!");
        // } catch (err) {
        //     this.logger.debug("::FAILED Verify!");
        //     this.logger.error(err);
        //     throw err;
        // }
    }


    public async getRefreshToken(cognitoToken: any): Promise<ServiceResponse> {
        if (typeof cognitoToken === "string") {
            try {
                cognitoToken = JSON.parse(cognitoToken)
            } catch (err) {
                return ServiceResponse.createFailed(err);
            }
        }

        // const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
        // try {
        //     const result = await cognitoIdentityServiceProvider.initiateAuth({
        //         AuthFlow: 'REFRESH_TOKEN_AUTH',
        //         ClientId: this.config.getUserPoolAppClientId(),
        //         AuthParameters: {
        //             REFRESH_TOKEN: cognitoToken.refresh_token,
        //             SECRET_HASH: this.config.getUserPoolAppSecret()
        //         }
        //     }).promise();
        //     return ServiceResponse.createSuccess([result.AuthenticationResult]);
        // } catch (error) {
        //     console.error(error);
        //     const sr = new ServiceResponse();
        //     sr.addData({ message: "Failed", statusCode: 401 })
        //     sr.statusCode = 401;
        //     return sr;
        // }
    }

    hasAdmin() {
        // const idToken = this.getIdToken();
        // const decodedIdToken = TokenService.decodeToken(this.idToken);
        // return (decodedIdToken["cognito:groups"] && decodedIdToken["cognito:groups"].includes("Admin"));
    }

    public async getToken(code: string):Promise<ServiceResponse> {
        if (code) {
            this.logger.debug("Using code " + code);

            const encodedString = Buffer.from(this.config.getTokenClientId() + ":" + this.config.getTokenClientSecret()).toString('base64');

            try {
                const headers: any = {
                    "Authorization" : "Basic " + encodedString,
                    "Content-Type": "application/x-www-form-urlencoded"
                }

                this.logger.debug("Invoking HTTP Service");

                let url = this.config.getTokenURL() +
                    `?grant_type=authorization_code&client_id=${this.config.getTokenClientId()}&scope=email&redirect_uri=${this.config.getTokenRedirectURI()}&code=${code}`
                return lastValueFrom(this.httpService.rawPost(url,
                {
                    "grant_type" : "authorization_code",
                    "client_id" : this.config.getTokenClientId(),
                    "scope": "email",
                    "redirect_uri" : this.config.getTokenRedirectURI(),
                    "code": code
                },headers));
            } catch (err) {
                this.logger.error(err);
                throw new Error("Could not retrieve Token");
            }
        } else {
            this.logger.warn("Code was not provided to fetch token");
            throw new Error("Missing authorization code");
        }
    }

}