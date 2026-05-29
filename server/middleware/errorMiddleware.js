const errorMiddleware = (err, req, res, next) => {
  if (err.code === 11000) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV !== "production" ? { stack: err.stack } : {})
  });
};

export default errorMiddleware;
