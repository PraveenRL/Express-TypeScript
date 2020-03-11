import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
class Address {
    @PrimaryGeneratedColumn()
    public id: string;

    @Column()
    public street: string;

    @Column()
    public city: string;

    @Column()
    public county: string;
}

export default Address;