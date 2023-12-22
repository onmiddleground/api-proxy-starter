import {Controller, Get, Req} from "@nestjs/common";
// import {Request} from 'express';

@Controller("/ping")
export class PingController {
    @Get("/")
    async ping() {
        console.log("Ping Ok");
        return {
            message: "Pinged!!"
        };
    }
}
