import express from 'express';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import categoryRoutes from './routes/category.routes.js';
import tagRoutes from './routes/tag.routes.js';
import devAuth from './middlewares/dev-auth.middleware.js';


const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', devAuth);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/tags', tagRoutes);

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