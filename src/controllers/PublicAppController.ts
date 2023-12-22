import { Controller, Get, HttpCode, Logger, Query, Req } from '@nestjs/common';
// import { Request } from 'express';
import { FastifyRequest, FastifyReply } from 'fastify';

@Controller('/public')
// @SkipThrottle()
export class PublicAppController {
    private readonly logger = new Logger(PublicAppController.name);

    // Express
    // async getPublicData(@Req() request: Request, @Query("nextToken") nextToken: string) {

    constructor() {}
    @Get('/')
    @HttpCode(200)
    async getPublicData(@Req() request: FastifyRequest['raw'], @Query("nextToken") nextToken: string) {
        this.logger.log(request, "THis will get some public data");
        // return this.someService.getSomeData(nextToken);
        return "Nothing yet";
    }
}
