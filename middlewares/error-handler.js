const ServerError = 500;

module.exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || ServerError;
  const message = statusCode === ServerError ? 'Внутренняя ошибка сервера' : err.message;

  res.status(statusCode).send({ message });
  next();

  // if (res.locals.controllerType === 'user') {
  //   if (err.code === 11000) {
  //     statusCode = Conflict;
  //     message = 'Пользователь с таким email уже зарегистрирован';
  //   } else if (err.name === 'ValidationError') {
  //     statusCode = BadRequest;
  //     message = 'Некорректные данные';
  //   } else if (err.name === 'UnauthorizedError') {
  //     statusCode = Unauthorized;
  //     message = 'Некорректный токен';
  //   } else if (err.name === 'NotFound') {
  //     statusCode = NotFound;
  //     message = 'Пользователь не найден';
  //   } else if (res.locals.controllerType === 'card') {
  //     if (err.name === 'CastError') {
  //       statusCode = BadRequest;
  //       message = 'Запрашиваемая кароточка не найдена';
  //     } if (err.name === 'ValidationError') {
  //       statusCode = BadRequest;
  //       message = 'Некорректные данные карточки';
  //     }
  //   }
  // }
  // res.status(statusCode).send({ message });
};
