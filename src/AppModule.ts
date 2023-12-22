import {Logger, Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {AppConfig} from "./configsettings/AppConfig";
import {AdminHttpService} from "./lib/AdminHttpService";
import {AppClientService} from "./services/AppClientService";
import {HttpModule} from "@nestjs/axios";
import {AuthGuard} from "./filters/AuthGuard";
import {SecureService} from "./services/SecureService";
import {CognitoSecurityService} from "./services/CognitoSecurityService";
import {SecureController} from "./controllers/SecureController";
// import {ThrottlerGuard, ThrottlerModule} from "@nestjs/throttler";
// import {APP_GUARD} from "@nestjs/core";
// import {AdminAuthGuard} from "./filters/AdminAuthGuard";
import {PingController} from "./controllers/PingController";
import { ProfileController } from './controllers/ProfileController';
import { ProfileService } from './services/ProfileService';
import { LocalSecurityService } from './services/LocalSecurityService';

const envPaths = [".env"];
const stage = process.env["STAGE"];
if (stage) {
    console.log(`Using Stage ${stage} and trying to load .env.${stage} ...`);
    envPaths.push(`.env.${stage}`);
} else {
    console.log(
        "Hmmmm, it appears there is no stage that can be set to perform???!!!"
    );
}

console.log("Environments supported in this deployment ", envPaths);

const getSecurityService = () => {
    if (stage === "__LOCAL_DEV__") {
        Logger.debug("Using Local Security Service");
        return LocalSecurityService;
    } else {
        Logger.debug("Using Cognito Security Service");
        return CognitoSecurityService;
    }
};

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: envPaths,
            isGlobal: true,
            expandVariables: true,
        }),
        // ThrottlerModule.forRoot({
        //     ttl: 1,
        //     limit: 3,
        // }),
        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                timeout: Number(configService.get("HTTP_TIMEOUT")),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [
      PingController,
      ProfileController,
      SecureController
    ],
    providers: [
        AppClientService,
        SecureService,
        ProfileService,
        // {
        //     provide: APP_GUARD,
        //     useClass: ThrottlerGuard,
        // },
        {
            provide: "SecurityService",
            useClass: getSecurityService(),
        },
        AppConfig,
        AdminHttpService,
        {
            provide: "AuthGuard",
            useClass: AuthGuard,
        },
        // {
        //     provide: "AdminAuthGuard",
        //     useClass: AdminAuthGuard,
        // },
    ],
})
export class AppModule {
}
