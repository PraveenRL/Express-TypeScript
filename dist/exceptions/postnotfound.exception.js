import HttpException from './http.exceptions';
class PostNotFoundException extends HttpException {
    constructor(id) {
        super(404, `Post with id ${id} not found`);
    }
}
export default PostNotFoundException;
//# sourceMappingURL=postnotfound.exception.js.map