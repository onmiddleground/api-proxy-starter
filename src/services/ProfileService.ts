import {Injectable, Logger} from "@nestjs/common";
import {AppConfig} from "../configsettings/AppConfig";
import {TokenService, TokenUtil} from "../lib/TokenUtil";
import {ServiceResponse} from "../lib/ServiceResponse";
import {AppClientService} from "./AppClientService";
import {ProfileDTO} from "../model/ProfileDTO";

// TODO: Implement AWS SDK v3
// const AWS = require('aws-sdk');

@Injectable()
export class ProfileService {
    private readonly logger = new Logger(ProfileService.name);

    private static SERVICE_NAME = "PROFILE";

    constructor(private readonly appConfig: AppConfig, private readonly httpService: AppClientService) {}

    protected async upload(userName, extension, data): Promise<any> {
        return undefined;
        // const s3 = new AWS.S3({ region: this.appConfig.getRegion() || "us-east-1" });
        // this.logger.debug(`Uploading Avatar for username ${userName}`);
        //
        // const params = {
        //     Bucket: this.appConfig.getAssetFolderName(),
        //     Key: `avatars/${userName}.${extension}`,
        //     Body: Readable.from(data),
        //     ContentType: "image/png"
        // }
        // const uploadedImage = await s3.upload(params).promise();
        // console.log(JSON.stringify(uploadedImage));
        //
        // return uploadedImage;
    }

    protected getDecodedToken(token: string) {
        try {
            if (token) {
                const parts = token.split(" ");
                if (parts.length > 1) {
                    return TokenService.decodeToken(parts[1]);
                }
            }
        } catch (err) {
            throw new Error("Invalid Token");
        }
    }

    protected getFileExtension(avatar) {
        let extension = avatar.mimetype.split("/");
        if (extension.length > 1) {
            extension = extension[1];
        }
        return extension;
    }

    // async saveAvatar(token: string, avatar: Express.Multer.File): Promise<ServiceResponse> {
    async saveAvatar(token: string, avatar: any): Promise<any> {
        const decoded = this.getDecodedToken(token);
        const userName = decoded["cognito:username"];
        if (!userName) {
        //     return ServiceResponse.createFailed("Invalid token or username when uploading Avatar");
        }
        try {
            const response = await this.upload(userName,"png",avatar.buffer);
            if (response && response.$metadata && response.$metadata.httpStatusCode === 200) {
                return ServiceResponse.createSuccess({message: "Upload Ok"});
            }
        } catch (err) {
            console.log(err);
            this.logger.error("Failed saving Avatar",err);
            throw err;
        }
    }

    async save(token: string, profileDTO: ProfileDTO): Promise<ServiceResponse> {
        const decoded = this.getDecodedToken(token);
        const userName = decoded["cognito:username"];
        if (!userName) {
            return ServiceResponse.createFailed("Invalid token or username is missing");
        }
        try {
            const privateToken: string = await TokenUtil.generateDownstreamToken(token);
            return this.httpService.defaultPost(privateToken,
              this.appConfig.getDownstreamServiceDetails(ProfileService.SERVICE_NAME),
              profileDTO,
              ProfileService.SERVICE_NAME
            );
        } catch (err) {
            this.logger.error(err);
            return ServiceResponse.createFailed("Failed Saving Profile");
        }
    }

    async findByUserId(token: string): Promise<ServiceResponse> {
        const decoded = this.getDecodedToken(token);
        const userName = decoded["cognito:username"];
        if (!userName) {
            return ServiceResponse.createFailed("Invalid token or username is missing");
        }
        try {
            return this.httpService.defaultGet(
                await TokenUtil.generateDownstreamToken(token),
                this.appConfig.getDownstreamServiceDetails(ProfileService.SERVICE_NAME),
                ProfileService.SERVICE_NAME
            );
        } catch (err) {
            this.logger.error(err);
            return ServiceResponse.createFailed("Failed Getting a Profile");
        }
    }
}