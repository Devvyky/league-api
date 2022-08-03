import 'dotenv/config';
import express, { Application, NextFunction, Request, Response } from 'express';
import config from 'config';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import hpp from 'hpp';
require('dotenv').config();

import logger from './logger';
import connect from './database/connection';
import userRouter from './routes/userRouter';
import teamRouter from './routes/teamRouter';
import fixtureRouter from './routes/fixtureRouter';
import { errorHandler } from './middlewares/errorHandler';
import AppError from './utils/appError';

const app: Application = express();

// Set Security Headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, Please try again in an hour!',
});

app.use('/api', limiter);

// Body Parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['category'],
  })
);

// app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/team', teamRouter);
app.use('/api/v1/fixture', fixtureRouter);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello world!');
});

const port = config.get('port') as number;

app.listen(port, () => {
  logger.info(`Server running on port ${port}!`);
  connect();
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(errorHandler);

module.exports = app;
