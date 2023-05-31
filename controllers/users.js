const User = require('../models/user');

function handleError(err, res) {
  if (err.name === 'CastError') {
    // Обработка ошибки при неверном формате идентификатора пользователя
    return res.status(400).send({ message: 'Запрашиваемый пользователь не найден' });
  } if (err.name === 'ValidationError') {
    // Обработка ошибки при некорректных данных
    return res.status(400).send({ message: 'Некорректные данные пользователя' });
  }
  // Обработка остальных ошибок
  return res.status(500).send({ message: `Произошла ошибка: ${err.message}` });
}

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => handleError(err, res));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        // Если пользователь не найден
        return res.status(404).send({ message: 'Пользователь не найден' });
      }

      const userData = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      };

      return res.send(userData);
    })
    .catch((err) => handleError(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => handleError(err, res));
};

module.exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        // Если пользователь не найден
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: updatedUser });
    })
    .catch((err) => handleError(err, res));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        // Если пользователь не найден
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: updatedUser });
    })
    .catch((err) => handleError(err, res));
};
