import {SetMetadata} from '@nestjs/common';

export const AUTH_KEY = 'auth';
export const Auth = (request) => SetMetadata(AUTH_KEY, request);