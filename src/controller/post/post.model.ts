import * as mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    authorId: {
        ref: "UserSchema",
        type: mongoose.Schema.Types.ObjectId
    },
    authorsId: [    //Two way refering
        {
            ref: "UserSchema",
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    content: String,
    title: String
}, {
    collection: "post"
})

const PostModel = mongoose.model<IPost & mongoose.Document>('PostSchema', postSchema);

export default PostModel;

export interface IPost {
    authorId: string;
    authorsId: Array<any>;
    content: string;
    title: string
}