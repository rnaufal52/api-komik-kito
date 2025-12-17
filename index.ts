import express from 'express';
import dotenv from 'dotenv';
import comicRoutes from './src/routes/comicRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/api', comicRoutes);

app.get('/', (req, res) => {
  res.send('Express + TypeScript Server');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
