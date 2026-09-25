import express from 'express';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Ruta no encontrada',
    },
  });
});

app.listen(PORT, () => {
  console.log(`Backend To-Do List disponible en http://localhost:${PORT}`);
});