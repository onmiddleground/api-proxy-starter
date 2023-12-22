import {IsNotEmpty, MaxLength, MinLength, validate} from "class-validator";

export class MyDTO {

    @MinLength(5, {
        message: 'Title must have at least 5 characters',
    })
    @MaxLength(100, {
        message: 'Title cannot exceed 100 characters',
    })
    @IsNotEmpty({message : "title is a required field"})
    title: string;

    @IsNotEmpty({message : "description is a required field"})
    description: string;

    validate() {
        return validate(this)
    }
}