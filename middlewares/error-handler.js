const BadReques = 400;
const Unauthorized = 401;
const NotFound = 404;
const Conflict = 409;
const ServerError = 500;

module.exports.errorHandler = (err, req, res) => {
  let statusCode = ServerError;
  let message = 'Внутренняя ошибка сервера';
  if (res.locals.controllerType === 'user') {
    if (err.code === 11000) {
      statusCode = Conflict;
      message = 'Пользователь с таким email уже зарегистрирован';
    } else if (err.name === 'ValidationError') {
      statusCode = BadReques;
      message = 'Некорректные данные';
    } else if (err.name === 'UnauthorizedError') {
      statusCode = Unauthorized;
      message = 'Некорректный токен';
    } else if (err.name === 'NotFound') {
      statusCode = NotFound;
      message = 'Пользователь не найден';
    } else if (res.locals.controllerType === 'card') {
      if (err.name === 'CastError') {
        statusCode = BadReques;
        message = 'Запрашиваемая кароточка не найдена';
      } if (err.name === 'ValidationError') {
        statusCode = BadReques;
        message = 'Некорректные данные карточки';
      }
      statusCode = ServerError;
      message = 'Внутренняя ошибка сервера';
    }
  }
  res.status(statusCode).json({ message });
};
