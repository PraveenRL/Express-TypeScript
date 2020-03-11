import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import Users from "../users/users.entity";

@Entity()
class Address {
    @PrimaryGeneratedColumn()
    public id: string;

    @Column()
    public street: string;

    @Column()
    public city: string;

    @Column()
    public country: string;

    @OneToOne(() => Users, (users: Users) => users.address) /* Bi-Directional */
    public users: Users
}

export default Address;