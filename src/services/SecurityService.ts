import { ServiceResponse } from '../lib/ServiceResponse';

export interface SecurityService {

  hasPermissions(token: string): Promise<boolean> | boolean;
  verifyToken(token: any): Promise<void> | void;
  getRefreshToken(token: any): Promise<ServiceResponse> | ServiceResponse;
  getToken(code: string):Promise<ServiceResponse> | ServiceResponse;

}