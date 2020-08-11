import { IsString, IsNumber } from "class-validator";

export class TableDTO {

    @IsNumber()
    public position: number;

    @IsString()
    public name: string;

    @IsNumber()
    public weight: number;

    @IsString()
    public symbol: string;

}