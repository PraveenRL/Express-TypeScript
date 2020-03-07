// dto - data transfer object (DTO)

import { IsString, IsArray } from 'class-validator';

class CreatePostDto {

    @IsString()
    public authorId: string;

    @IsString()
    public content: string;

    @IsString()
    public title: string

    @IsArray()
    public authorsId: Array<any>

}

export default CreatePostDto;