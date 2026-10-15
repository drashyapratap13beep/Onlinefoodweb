import express from 'express';
import cors from 'cors';
import { apiRouter } from '../server/routes/api';
import { initDatabase } from '../server/db';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize MongoDB or embedded document storage
initDatabase().catch((err) => {
  console.warn('Vercel serverless db initialization notice:', err.message);
});

// Support both /api and root mounting for Vercel rewrites
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
