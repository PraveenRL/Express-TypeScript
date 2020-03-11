import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";

import Address from "../address/address.entity";
import Post from "../post/post.entity";

@Entity()
class Users {
    @PrimaryGeneratedColumn()
    public id: string;

    @Column()
    public name: string;

    @Column()
    public email: string;

    @Column()
    public password: string;

    // @OneToOne(() => Address) /* Uni-Directional */

    @OneToOne(() => Address, (address: Address) => address.users, {     /* Bi-Directional */
        cascade: true,  //Save in address table
        eager: true
    })

    @JoinColumn()
    public address: Address;

    @OneToMany(() => Post, (post: Post) => post.author)
    public post: Post[];
}

export default Users;

/**
 The 'One-To-One' is a relationship where the row of a table 'A' may be linked to just
 one row of a table 'B' and vice versa.

 The 'Ony-To-Many and Many-To-One' is a relationship where a row from table A may be linked to
 multiple rows of table B,
 but a row from table B may be connected to just one row of table A.
**/