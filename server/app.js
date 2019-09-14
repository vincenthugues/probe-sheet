import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import errorHandler from 'errorhandler';
import morgan from 'morgan';
import 'dotenv/config';

import models, { sequelize } from './models';
import mockData from './models/mockData';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import sheetsRouter from './routes/sheets';
import targetsRouter from './routes/targets';
import probesRouter from './routes/probes';
import commentsRouter from './routes/comments';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static(path.join(__dirname, '/client/build')));
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

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));

app.get('/session', async (req, res) => res.send(req.context.user));
app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/sheets', sheetsRouter);
app.use('/targets', targetsRouter);
app.use('/probes', probesRouter);
app.use('/comments', commentsRouter);

// error handling middleware should be loaded after loading the routes
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

const seedDatabase = async () => {
  await models.User.create(
    {
      username: 'John Doe',
      email: 'john.doe@example.com',
      password: '$2b$10$HBxA1MI.Ig/QKoGlbsp3rePkjNDUlgWtMHUElMFPJAjtXgvlcZ6UW', // "admin"
      sheets: mockData.sheets,
    },
    {
      include: [models.Sheet],
    },
  );

  await models.Target.bulkCreate(mockData.targets);
  await models.Probe.bulkCreate(mockData.probes);
  await models.Comment.bulkCreate(mockData.comments);
};

sequelize.sync({ force: process.env.ERASE_DB_ON_SYNC }).then(() => {
  if (process.env.ERASE_DB_ON_SYNC) {
    seedDatabase();
  }

  app.listen(PORT, () => {
    /* eslint-disable-next-line no-console */
    console.log(`App listening on port ${PORT}`);
  });
});
