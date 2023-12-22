import {MaxLength, MinLength, validate} from "class-validator";

export class ProfileDTO {
    @MinLength(3)
    @MaxLength(100)
    location: string;

    birthday: string;

    title: string;

    async validate(): Promise<any> {
        return validate(this);
    }
}