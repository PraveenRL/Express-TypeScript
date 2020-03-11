import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinTable } from "typeorm";
import Users from "../users/users.entity";
import Category from "../category/category.entity";

@Entity()
class Post {
    @PrimaryGeneratedColumn()
    public id?: number;

    @Column()
    public title: string;

    @Column()
    public content: string;

    @ManyToOne(() => Users, (author: Users) => author.post)
    public author: Users;

    @ManyToMany(() => Category)
    @JoinTable()
    categories: Category[];
}

export default Post;