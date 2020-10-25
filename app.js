const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./common/errorHadler');
const config = require('./config/config');
const errMsg = require('./config/messages');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect(config.CONNECTION_STR, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const corsOptions = {
  origin: [
    'https://ne2020.tk',
    'http://localhost:8080',
    'https://localhost:8080',
    'https://dubovik02.github.com',
    'https://dubovik02.github.io',
  ],
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use('*', cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.use(router);

app.use((req, res, next) => {
  next(new NotFoundError(errMsg.ERR_MESSAGE_SOURCE_NOT_FOUND));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
});
