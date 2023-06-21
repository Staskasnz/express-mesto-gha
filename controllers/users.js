const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFound = 404;

function handleError(err, res, next) {
  res.locals.controllerType = 'user';
  next(err);
}

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      handleError(err, res, next);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => handleError(err, res, next));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        // Если пользователь не найден
        return res.status(NotFound).send({ message: 'Пользователь не найден' });
      }

      const userData = {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      };

      return res.send(userData);
    })
    .catch((err) => handleError(err, res, next));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.send({ data: user.toObject({ useProjection: true }) });
    })
    .catch((err) => handleError(err, res, next));
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        // Если пользователь не найден
        return res.status(NotFound).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: updatedUser });
    })
    .catch((err) => handleError(err, res, next));
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        // Если пользователь не найден
        return res.status(NotFound).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: updatedUser });
    })
    .catch((err) => handleError(err, res, next));
};
