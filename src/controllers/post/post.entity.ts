import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
class PostEntity{
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    public name: string;

    @Column()
    public email: string;
}

export default PostEntity;