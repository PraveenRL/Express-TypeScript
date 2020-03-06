import * as mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    authorId: String,
    content: String,
    title: String
}, {
    collection: "post"
})

const PostModel = mongoose.model<IPost & mongoose.Document>('PostSchema', postSchema);

export default PostModel;

export interface IPost {
    authorId: string;
    content: string;
    title: string
}