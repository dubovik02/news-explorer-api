const Articles = require('../models/article');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// Список статей
module.exports.readArticles = (req, res, next) => {
  Articles.find({})
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch(() => {
      next(new ServerError());
    });
};
// Создание статьи
module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, link, image,
  } = req.body;
  const owner = req.user._id;
  Articles.create({
    keyword, title, text, date, link, image, owner,
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
        throw new NotFoundError(`Статья c ID ${req.params.id} не существует`);
      } else if (article.owner.toString() === req.user._id) {
        Articles.findByIdAndDelete(article._id)
          .then((removedArticle) => {
            res.status(200).send({ data: removedArticle });
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Нет прав на удаление');
      }
    })
    .catch(next);
};
