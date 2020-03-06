import * as mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    author: String,
    content: String,
    title: String
})

const PostModel = mongoose.model<IPost & mongoose.Document>('PostSchema', postSchema);

export default PostModel;

export interface IPost {
    author: string;
    content: string;
    title: string
}