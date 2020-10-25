const Articles = require('../models/article');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const errMsg = require('../config/messages');

// Список статей
module.exports.readArticles = (req, res, next) => {
  Articles.find({})
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};
// получение статей текущего пользователя
module.exports.getUserArticles = (req, res, next) => {
  Articles.find({ owner: req.params.id }).select('+owner').sort({ date: -1 })
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(next);
};
// Создание статьи
module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, source, date, link, image,
  } = req.body;
  const owner = req.user._id;
  Articles.create({
    keyword, title, text, source, date, link, image, owner,
  })
    .then((article) => {
      res.status(200).send({ data: article });
    })
    .catch(next);
};
// Удаление статьи
module.exports.deleteArticleById = (req, res, next) => {
  Articles.findById(req.params.id).select('+owner')
    .then((article) => {
      if (!article) {
        throw new NotFoundError(errMsg.ERR_MESSAGE_ARTICLE_NOT_FOUND);
      } else if (article.owner.toString() === req.user._id) {
        Articles.findByIdAndDelete(article._id)
          .then((removedArticle) => {
            res.status(200).send({ data: removedArticle });
          })
          .catch(next);
      } else {
        throw new ForbiddenError(errMsg.ERR_MESSAGE_FORBIDDEN);
      }
    })
    .catch(next);
};
