import {IsNotEmpty, IsNumber} from "class-validator";

export class ValueBody {
    @IsNumber({ maxDecimalPlaces: 6}, { message: "value must be a valid number with a maximum of 6 decimals"})
    @IsNotEmpty()
    public value: number;
}