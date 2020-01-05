import express from 'express';
import path from 'path';
import helmet from 'helmet';
import cors from 'cors';
import errorHandler from 'errorhandler';
import morgan from 'morgan';
import 'dotenv/config';

import models, { sequelize } from './models';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import sheetsRouter from './routes/sheets';
import targetsRouter from './routes/targets';
import probesRouter from './routes/probes';
import commentsRouter from './routes/comments';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(async (req, res, next) => {
  req.context = {
    models,
  };
  next();
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/sheets', sheetsRouter);
app.use('/api/targets', targetsRouter);
app.use('/api/probes', probesRouter);
app.use('/api/comments', commentsRouter);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../../client/build/index.html')));

// error handling middleware should be loaded after loading the routes
if (app.get('env') === 'development') {
  app.use(errorHandler());
}

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    /* eslint-disable-next-line no-console */
    console.log(`App listening on port ${PORT}`);
  });
});
