import {
    Body,
    Controller,
    Get,
    Headers,
    Logger,
    Post,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {AuthGuard} from "../filters/AuthGuard";
// import {FileInterceptor} from "@nestjs/platform-fastify";
import {ImageUploadValidationPipe} from "../filters/ImageUploadValidationPipe";
import {ServiceResponse} from "../lib/ServiceResponse";
import {ProfileService} from "../services/ProfileService";
import {ProfileRequest} from "../model/ProfileRequest";
import {ProfileDTO} from "../model/ProfileDTO";
// import { Request } from 'express';

@Controller('/profile')
@UseGuards(AuthGuard)
export class ProfileController {
    private readonly logger = new Logger(ProfileController.name);

    constructor(private readonly service: ProfileService) {}

    @Get("/")
    async findByUserId(@Headers("authorization") token: string) {
        this.logger.debug("::INVOKED Profile::findByUserId");
        return this.service.findByUserId(token);
    }

    @Post('/avatar')
    // @UseInterceptors(FileInterceptor('avatar'))
    async getAvatar(@Req() request: Request, @Headers("authorization") token: string, @UploadedFile(new ImageUploadValidationPipe()) avatar: any) {
        if (avatar) {
            return this.service.saveAvatar(token, avatar);
        } else {
            return ServiceResponse.createFailed("Invalid Avatar");
        }
    }

    @Post('/')
    async saveProfile(@Req() request: Request, @Headers("authorization") token: string, @Body() profile: ProfileRequest) {
        const profileDTO = new ProfileDTO();
        profileDTO.location = profile.location;
        profileDTO.birthday = profile.birthday;
        profileDTO.title = profile.title;
        return this.service.save(token, profileDTO);
    }
}
