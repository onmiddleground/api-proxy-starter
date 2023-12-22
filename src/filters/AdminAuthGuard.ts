import {CanActivate, ExecutionContext, Injectable, Logger} from '@nestjs/common';
// import {PermissionService} from "../services/PermissionService";

@Injectable()
export class AdminAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext,): Promise<boolean> {
        let isValid: boolean = false;
        try {
            const bearerToken = context.switchToHttp().getRequest().headers['authorization'];
            if (!bearerToken) {
                throw new Error("Missing Bearer token");
            }
            // const permissionService: PermissionService = await PermissionService.getInstance(bearerToken);
            // return permissionService.hasAdmin();
        } catch (err) {
            Logger.error("Failed::AdminAuthGuard::canActivate",err);
        }

        return isValid;
    }
}