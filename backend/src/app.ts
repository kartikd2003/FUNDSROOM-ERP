import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';
import { notFound } from './middleware/notFound.middleware';

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL!,
    ],
    credentials: true,
  })
);
app.use(express.json());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
