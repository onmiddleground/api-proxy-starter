import {IsDate, MaxLength} from "class-validator";

export class ProfileRequest {
    @MaxLength(40)
    location: string;

    birthday: string;

    @MaxLength(40)
    title: string;
}