import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    HttpCode,
    Logger,
    Param,
    Post, Put,
    Query,
    Req,
    UseGuards
} from '@nestjs/common';
import { SecureService } from '../services/SecureService';
import { AuthGuard } from "../filters/AuthGuard";
import { MyDTO } from "../model/MyDTO";
// import { Request } from 'express';
// import { SkipThrottle } from "@nestjs/throttler";

@Controller('/secure')
@UseGuards(AuthGuard)
export class SecureController {
    private readonly logger = new Logger(SecureController.name);

    constructor(private readonly service: SecureService) { }

    @Get('/:id')
    // @SkipThrottle()
    async getOne(@Req() request: Request, @Headers("authorization") token: string, @Param("id") id: string) {
        return this.service.get(id, token);
    }

    @Get("/")
    @HttpCode(200)
    async getMany(
      @Headers("authorization") token: string,
        @Query("nextToken") nextToken: string,
                 @Query("sortAscending") sortAscending: boolean) {
        return this.service.getMany(nextToken, token, sortAscending);
    }

    // @SkipThrottle()
    @Post("/")
    async create(@Headers("authorization") token: string, @Body() dto: MyDTO) {
        return this.service.create(token, dto);
    }

    @Put("/:id")
    @HttpCode(200)
    async update(@Headers("authorization") token: string, @Param("id") id: string, @Body() dto: MyDTO) {
        return this.service.update(token, id, dto);
    }

    @Delete("/:id")
    @HttpCode(204)
    async delete(@Headers("authorization") token: string, @Param("id") id: string) {
        return this.service.delete(token, id);
    }
}
