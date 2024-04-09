// commentRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('./db');

// Получение всех комментариев
router.get('/comments', async (req, res) => {
  try {
    const allComments = await pool.query('SELECT * FROM comments');
    res.json(allComments.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Обновление комментария
router.put('/comments/:id', async (req, res) => {
  const commentId = req.params.id;
  const { name, description } = req.body;

  try {
    const updateCommentQuery = `
      UPDATE comments
      SET name = $1, description = $2
      WHERE id = $3
    `;
    await pool.query(updateCommentQuery, [name, description, commentId]);
    
    res.json({ message: 'Комментарий успешно обновлен' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавление нового комментария
router.post('/comments', async (req, res) => {
  const { name, description } = req.body;

  try {
    const insertCommentQuery = `
      INSERT INTO comments (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const newComment = await pool.query(insertCommentQuery, [name, description]);

    res.status(201).json(newComment.rows[0]); // Отправляем новый комментарий в ответе
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление комментария
router.delete('/comments/:id', async (req, res) => {
  const commentId = req.params.id;

  try {
    // Выполняем SQL-запрос на удаление комментария из базы данных
    const deleteCommentQuery = `
      DELETE FROM comments
      WHERE id = $1
    `;
    await pool.query(deleteCommentQuery, [commentId]);

    // Если удаление прошло успешно, возвращаем успешный статус и сообщение
    res.status(200).json({ message: 'Комментарий успешно удален' });
  } catch (error) {
    // В случае ошибки отправляем статус 500 и сообщение об ошибке
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера при удалении комментария' });
  }
});

module.exports = router;
