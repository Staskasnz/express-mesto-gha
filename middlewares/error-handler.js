const ServerError = 500;

module.exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || ServerError;
  const message = statusCode === ServerError ? 'Внутренняя ошибка сервера' : err.message;

  res.status(statusCode).send({ error: message });
  next();
};
