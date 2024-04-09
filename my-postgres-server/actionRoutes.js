// taskRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('./db');

// Получение всех действий
router.get('/actions', async (req, res) => {
  try {
    const allActions = await pool.query('SELECT * FROM actions');
    res.json(allActions.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Обновление действия
router.put('/actions/:id', async (req, res) => {
  const actionId = req.params.id;
  const { name, description, type } = req.body;

  try {
    const updateActionQuery = `
      UPDATE actions
      SET name = $1, description = $2, type = $3
      WHERE id = $4
    `;
    await pool.query(updateActionQuery, [name, description, type, actionId]);
    
    res.json({ message: 'Действие успешно обновлено' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавление нового действия
router.post('/actions', async (req, res) => {
  const { name, description, type } = req.body;

  try {
    const insertActionQuery = `
      INSERT INTO actions (name, description, type)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const newAction = await pool.query(insertActionQuery, [name, description, type]);

    res.status(201).json(newAction.rows[0]); // Отправляем новое действие в ответе
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление действия
router.delete('/actions/:id', async (req, res) => {
  const actionId = req.params.id;

  try {
    // Выполняем SQL-запрос на удаление действия из базы данных
    const deleteActionQuery = `
      DELETE FROM actions
      WHERE id = $1
    `;
    await pool.query(deleteActionQuery, [actionId]);

    // Если удаление прошло успешно, возвращаем успешный статус и сообщение
    res.status(200).json({ message: 'Действие успешно удалено' });
  } catch (error) {
    // В случае ошибки отправляем статус 500 и сообщение об ошибке
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера при удалении действия' });
  }
});

module.exports = router;
