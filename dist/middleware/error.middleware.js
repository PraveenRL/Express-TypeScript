function errorMiddleWare(error, request, response, next) {
    const status = error.status || 500;
    const message = error.message || "Something went wrong";
    response
        .status(status)
        .send({ status, message });
}
export default errorMiddleWare;
//# sourceMappingURL=error.middleware.js.map