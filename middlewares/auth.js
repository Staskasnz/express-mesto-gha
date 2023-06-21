const jwt = require('jsonwebtoken');

module.exports.auth = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;
  const Unauthorized = 401;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(Unauthorized).send({ message: 'Необходима авторизация' });
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    // отправим ошибку, если не получилось
    return res.status(Unauthorized).send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
