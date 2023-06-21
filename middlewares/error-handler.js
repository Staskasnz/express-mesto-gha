const BadRequest = 400;
const Unauthorized = 401;
const NotFound = 404;
const Conflict = 409;
const ServerError = 500;

module.exports.errorHandler = (err, req, res, next) => {
  let statusCode = ServerError;
  let message = 'Внутренняя ошибка сервера';
  console.log(res.locals);

  if (res.locals.controllerType === 'user') {
    if (err.code === 11000) {
      statusCode = Conflict;
      message = 'Пользователь с таким email уже зарегистрирован';
    } else if (err.name === 'ValidationError') {
      statusCode = BadRequest;
      message = 'Некорректные данные';
    } else if (err.name === 'UnauthorizedError') {
      statusCode = Unauthorized;
      message = 'Некорректный токен';
    } else if (err.name === 'NotFound') {
      statusCode = NotFound;
      message = 'Пользователь не найден';
    } else if (res.locals.controllerType === 'card') {
      if (err.name === 'CastError') {
        statusCode = BadRequest;
        message = 'Запрашиваемая кароточка не найдена';
      } if (err.name === 'ValidationError') {
        statusCode = BadRequest;
        message = 'Некорректные данные карточки';
      }
    }
  }
  res.status(statusCode).json({ message });
  next();
};
