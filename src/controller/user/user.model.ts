import { Schema, model, Document } from 'mongoose';

const addressSchema = new Schema({     //Relationship = One-To-One (1:1)
    city: String,
    street: String
})

const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    address: addressSchema,
    posts: [
        {
            ref: "PostSchema",
            type: Schema.Types.ObjectId
        }
    ]
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
    address: string;
}