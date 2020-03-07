import { IsString, IsObject } from 'class-validator';

class UserDto {

    @IsString()
    public name: string;

    @IsString()
    public email: string;

    @IsString()
    public password: string;

    @IsObject()
    public address: object;

}

export default UserDto;