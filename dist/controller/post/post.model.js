import * as mongoose from 'mongoose';
const postSchema = new mongoose.Schema({
    author: String,
    content: String,
    title: String
});
const PostModel = mongoose.model('PostSchema', postSchema);
export default PostModel;
//# sourceMappingURL=post.model.js.map