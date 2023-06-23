const Card = require('../models/card');
const { ForbiddenError, NotFoundError } = require('../errors/errors');

function handle404(card, res) {
  if (!card) {
    throw new NotFoundError('Карточка не найдена');
  }
  return res.send({ data: card });
}

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      // Проверяем, является ли текущий пользователь владельцем карточки
      if (card.owner.toString() !== userId.toString()) {
        throw new ForbiddenError('У вас нет прав на удаление этой карточки');
      }

      // Пользователь является владельцем карточки, можно выполнить удаление
      return Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ data: card }))
        .catch(next);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => handle404(card, res))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => handle404(card, res))
    .catch(next);
};
