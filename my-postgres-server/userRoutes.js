// userRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('./db');

// Получение всех пользователей
router.get('/users', async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT * FROM users');
    res.json(allUsers.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Обновление пользователя
router.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;

  try {
    const updateUserQuery = `
      UPDATE users
      SET name = $1, email = $2
      WHERE id = $3
    `;
    await pool.query(updateUserQuery, [name, email, userId]);
    
    res.json({ message: 'Пользователь успешно обновлен' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавление нового пользователя
router.post('/users', async (req, res) => {
  const { name, email } = req.body;

  try {
    const insertUserQuery = `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING *
    `;
    const newUser = await pool.query(insertUserQuery, [name, email]);

    res.status(201).json(newUser.rows[0]); // Отправляем нового пользователя в ответе
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление пользователя
router.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Выполняем SQL-запрос на удаление пользователя из базы данных
    const deleteUserQuery = `
      DELETE FROM users
      WHERE id = $1
    `;
    await pool.query(deleteUserQuery, [userId]);

    // Если удаление прошло успешно, возвращаем успешный статус и сообщение
    res.status(200).json({ message: 'Пользователь успешно удален' });
  } catch (error) {
    // В случае ошибки отправляем статус 500 и сообщение об ошибке
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера при удалении пользователя' });
  }
});

module.exports = router;
