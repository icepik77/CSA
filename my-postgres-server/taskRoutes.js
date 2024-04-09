// taskRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('./db');

// Получение всех задач
router.get('/tasks', async (req, res) => {
  try {
    const allTasks = await pool.query('SELECT * FROM tasks');
    res.json(allTasks.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Обновление задачи
router.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const { name, description, status } = req.body;

  try {
    const updateTaskQuery = `
      UPDATE tasks
      SET name = $1, description = $2, status = $3
      WHERE id = $4
    `;
    await pool.query(updateTaskQuery, [name, description, status, taskId]);
    
    res.json({ message: 'Задача успешно обновлена' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавление новой задачи
router.post('/tasks', async (req, res) => {
  const { name, description, status } = req.body;

  try {
    const insertTaskQuery = `
      INSERT INTO tasks (name, description, status)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const newTask = await pool.query(insertTaskQuery, [name, description, status]);

    res.status(201).json(newTask.rows[0]); // Отправляем новую задачу в ответе
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление задачи
router.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    // Выполняем SQL-запрос на удаление задачи из базы данных
    const deleteTaskQuery = `
      DELETE FROM tasks
      WHERE id = $1
    `;
    await pool.query(deleteTaskQuery, [taskId]);

    // Если удаление прошло успешно, возвращаем успешный статус и сообщение
    res.status(200).json({ message: 'Задача успешно удалена' });
  } catch (error) {
    // В случае ошибки отправляем статус 500 и сообщение об ошибке
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера при удалении задачи' });
  }
});

module.exports = router;
