import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import tagRoutes from './routes/tag.routes.js';
import taskRoutes from './routes/task.routes.js';
import authRequired from './middlewares/auth.middleware.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(
  cors({
    origin: ['http://localhost:5173'],
  }),
);

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', authRequired);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Ruta no encontrada',
    },
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend To-Do List disponible en http://localhost:${PORT}`);
});