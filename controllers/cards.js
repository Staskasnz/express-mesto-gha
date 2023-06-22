const Card = require('../models/card');

const Forbidden = 403;
const NotFound = 404;

function handleError(err, res, next) {
  res.locals.controllerType = 'card';
  next(err);
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
  const userId = req.user._id;

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NotFound).send({ message: 'Карточка не найдена' });
      }

      // Проверяем, является ли текущий пользователь владельцем карточки
      if (card.owner.toString() !== userId.toString()) {
        return res.status(Forbidden).send({ message: 'У вас нет прав на удаление этой карточки', sravnenie: card.owner.toString() !== userId.toString(), sravnenie2: card.owner !== userId });
      }

      // Пользователь является владельцем карточки, можно выполнить удаление
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ data: card }))
        .catch((err) => handleError(err, res));
    })
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
