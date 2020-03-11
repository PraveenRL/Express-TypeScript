import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";

import Address from "../address/address.entity";

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

    @OneToOne(() => Address)
    @JoinColumn()
    public address: Address;
}

export default Users;

/**
 * The One-To-One is a relationship where the row of a table 'A' may be linked to just
 * one row of a table 'B' and vice versa.
**/