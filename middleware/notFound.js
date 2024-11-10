export const notFoundMiddleware = (req, res, next) => {
  res.send("<h1>Route not found</h1>");
};
