const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error-handler');
const urlRegex = require('./regex/url-regex');
const NotFoundError = require('./errors/notfound-error');

// const allowedCors = [
//   'https://praktikum.tk',
//   'http://praktikum.tk',
//   'localhost:3000',
//   'https://staskasnz.nomoreparties.sbs',
//   'https://api.staskasnz.nomoreparties.sbs',
// ];

const { PORT = 3000 } = process.env;
const app = express();

// app.use((req, res, next) => {
//   const { origin } = req.headers;

//   const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную

//   // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
//   const requestHeaders = req.headers['access-control-request-headers'];

//   // Если это предварительный запрос, добавляем нужные заголовки
//   if (method === 'OPTIONS') {
//     // разрешаем кросс-доменные запросы с этими заголовками
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     // завершаем обработку запроса и возвращаем результат клиенту
//     return res.end();
//   }
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }

//   return next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlRegex),
    about: Joi.string().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(5),
  }),
}), login);

app.use((req, res, next) => {
  auth(req, res, next);
});

mongoose.connect('mongodb://127.0.0.1/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый путь не найден'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
