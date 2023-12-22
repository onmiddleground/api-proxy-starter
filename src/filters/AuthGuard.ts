import { CanActivate, ExecutionContext, Inject, Injectable, Logger } from '@nestjs/common';
import { SecurityService } from '../services/SecurityService';

@Injectable()
export class AuthGuard implements CanActivate {

    private logger: Logger = new Logger(AuthGuard.name);

    constructor(@Inject("SecurityService") private readonly securityService: SecurityService) {
    }

    async canActivate(context: ExecutionContext,): Promise<boolean> {
        this.logger.debug("::canActivate Invoked");

        try {
            const bearerToken = context.switchToHttp().getRequest().headers['authorization'];

            if (!bearerToken) {
                throw new Error("Missing Bearer token");
            }

            return await this.securityService.hasPermissions(bearerToken);
        } catch (err) {
            Logger.error("Failed::AuthGuard::canActivate",err);
            return false;
        }
    }
}