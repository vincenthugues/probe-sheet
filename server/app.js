/* eslint-disable no-console */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import errorHandler from 'errorhandler';
import morgan from 'morgan';
import 'dotenv/config';

import models, { sequelize } from './models';
import mockData from './models/mockData';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import sheetsRouter from './routes/sheets';
import targetsRouter from './routes/targets';
import probesRouter from './routes/probes';
import commentsRouter from './routes/comments';

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  req.context = {
    models,
    user: await models.User.findByLogin('John Doe'),
  };
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.get('/session', (req, res) => res.send(models.users[req.context.user.id]));
app.get('/session', async (req, res) => res.send(await req.context.models.User.findByPk(req.context.user.id)));
app.use('/sheets', sheetsRouter);
app.use('/targets', targetsRouter);
app.use('/probes', probesRouter);
app.use('/comments', commentsRouter);

// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

const seedDatabase = async () => {
  await models.User.create(
    {
      username: 'John Doe',
      email: 'john.doe@example.com',
      password: 'abc123',
      sheets: mockData.sheets,
    },
    {
      include: [models.Sheet],
    },
  );

  await models.Target.bulkCreate(mockData.targets);
  await models.Probe.bulkCreate(mockData.probes);
  // await models.Probe.bulkCreate(mockData.comments);
};

sequelize.sync({ force: process.env.ERASE_DB_ON_SYNC }).then(() => {
  if (process.env.ERASE_DB_ON_SYNC) {
    seedDatabase();
  }

  app.listen(process.env.PORT, () => {
    console.log(`App listening on port ${process.env.PORT}!`);
  });
});
