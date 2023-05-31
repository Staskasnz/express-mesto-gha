const Card = require('../models/card');

function handleError(err, res) {
  if (err.name === 'CastError') {
    // Обработка ошибки при неверном формате идентификатора пользователя
    return res.status(400).send({ message: 'Запрашиваемая кароточка не найдена' });
  } if (err.name === 'ValidationError') {
    // Обработка ошибки при некорректных данных
    console.log(err.errors);
    return res.status(400).send({ message: 'Некорректные данные карточки' });
  }
  // Обработка остальных ошибок
  return res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
}

function handle404(card, res) {
  if (!card) {
    return res.status(404).send({ message: 'Карточка не найдена' });
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
  Card.findByIdAndRemove(req.params.id)
    .then((card) => handle404(card, res))
    .catch((err) => handleError(err, res));
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
