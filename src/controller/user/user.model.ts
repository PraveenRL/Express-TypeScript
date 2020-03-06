import { Schema, model, Document } from 'mongoose';

const userSchema = new Schema({
    name: String,
    email: String,
    password: String
}, {
    collection: "user"
})

const UserModel = model<IUser & Document>('UserSchema', userSchema);

export default UserModel;

export interface IUser {
    _id: string
    name: string;
    email: string;
    password: string;
}