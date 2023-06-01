const mongoose = require('mongoose');
const Card = require('../models/card');

const BadReques = 400;
const NotFound = 404;
const ServerError = 500;

function handleError(err, res) {
  if (err.name === 'CastError') {
    // Обработка ошибки при неверном формате идентификатора пользователя
    return res.status(BadReques).send({ message: 'Запрашиваемая кароточка не найдена' });
  } if (err.name === 'ValidationError') {
    // Обработка ошибки при некорректных данных
    return res.status(BadReques).send({ message: 'Некорректные данные карточки' });
  }
  // Обработка остальных ошибок
  return res.status(ServerError).send({ message: 'Внутренняя ошибка сервера' });
}

function handle404(card, res) {
  if (!card) {
    return res.status(NotFound).send({ message: 'Карточка не найдена' });
  }
  return res.send({ data: card });
}

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => handleError(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => handleError(err, res));
};

module.exports.deleteCard = (req, res) => {
  if (!mongoose.isValidObjectId(req.params.cardId)) { // тут у меня произошла проблеиа,
    // так как в тесте есть проверка на отсутствие карточки по определенному айди
    // и проверка на некорректно введеный айди, не совсем понятно в чем отличие.
    // Получается тут проверка что введено именно айди а не слово какое-нибудь.
    // Причем без этой проверки тест не проходился
    return res.status(BadReques).json({ message: 'Некорректные данные карточки' });
  }
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => handle404(card, res))
    .catch((err) => handleError(err, res));
  return null; // устраняет ошибку ESLint
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => handle404(card, res))
    .catch((err) => handleError(err, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => handle404(card, res))
    .catch((err) => handleError(err, res));
};
