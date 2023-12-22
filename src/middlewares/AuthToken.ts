import {Injectable, NestMiddleware} from '@nestjs/common';
// import {NextFunction, Request, Response} from 'express';
// import { FastifyRequest, FastifyReply } from 'fastify';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        console.log('Request...', req);
        next();
    }

    // Express
    // use(req: Request, res: Response, next: NextFunction) {
    //     // const authHeader = req.headers.authorization;
    //     // req.headers['bearerToken'] = TokenUtil.parseAuthheader(authHeader);
    //     // req.res.setHeader("bearerToken",TokenUtil.parseAuthheader(authHeader));
    //     next();
    // }
}