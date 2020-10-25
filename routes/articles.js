const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  readArticles, createArticle, deleteArticleById, getUserArticles,
} = require('../controllers/articles');
const { checkURL } = require('../common/UrlValidator');

router.get('/', readArticles);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
}), getUserArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2),
    text: Joi.string().required().min(2),
    source: Joi.string().required().min(2),
    date: Joi.date().required(),
    link: Joi.string().required().custom(checkURL),
    image: Joi.string().required().custom(checkURL),
    owner: Joi.string().alphanum().length(24).hex(),
  }),
}), createArticle);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
}), deleteArticleById);

module.exports = router;
