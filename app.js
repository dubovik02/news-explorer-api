require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const {
  createUserRouter, loginRouter, usersRouter, articlesRouter,
} = require('./routes/index');
const NotFoundError = require('./errors/NotFoundError');

const castErrorName = 'CastError';
const validationErrName = 'ValidationError';

const { PORT = 3000 } = process.env;
const app = express();

const { NODE_ENV = 'develop' } = process.env;
const CONNECTION_STR = (NODE_ENV === 'production' ? process.env.CONNECTION_STR : 'mongodb://localhost:27017/newsdb');
// const { CONNECTION_STR = 'mongodb://localhost:27017/newsdb' } = process.env;
mongoose.connect(CONNECTION_STR, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(helmet());

app.use(limiter);

app.use(requestLogger);

app.use('/signup', createUserRouter);
app.use('/signin', loginRouter);
app.use(auth);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === castErrorName) {
    res.status(400).send({ message: 'Некорректный формат ID' });
  } else if (err.name === validationErrName) {
    res.status(400).send({ message: err.message });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server has been started at port ${PORT}`);
});
