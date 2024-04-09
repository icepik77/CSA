// server.js

const express = require('express');
const cors = require('cors');
const pool = require('./db');
const userRoutes = require('./userRoutes'); 
const projectsRoutes = require('./projectsRoutes'); 
const taskRoutes = require('./taskRoutes'); 
const commentRoutes = require('./commentRoutes'); 
const actionRoutes = require('./actionRoutes'); 

const app = express();

// Middleware для обработки JSON
app.use(cors());
app.use(express.json());

// Используем маршруты пользователей
app.use('/', userRoutes);
app.use('/', projectsRoutes);
app.use('/', taskRoutes);
app.use('/', commentRoutes);
app.use('/', actionRoutes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
