import { IsString, IsNotEmpty, IsNumber, IsEmail } from "class-validator";

export class CreateUserDTO{

    @IsString()
    @IsNotEmpty()
    public first_name: string;

    @IsString()
    @IsNotEmpty()
    public last_name: string;

    @IsNumber()
    @IsNotEmpty()
    public age: number;

    @IsString()
    @IsNotEmpty()
    public gender: string;

    @IsString()
    @IsNotEmpty()
    public phone: string;

    @IsEmail()
    @IsNotEmpty()
    public email: string;

    @IsString()
    @IsNotEmpty()
    public address: string;

    @IsString()
    @IsNotEmpty()
    public password_hashed: string;

}