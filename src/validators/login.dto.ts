import { IsString, IsNotEmpty } from "class-validator";

export class LoginDTO {

    @IsNotEmpty()
    @IsString()
    public userName: string;

    @IsNotEmpty()
    @IsString()
    public password: string;

}