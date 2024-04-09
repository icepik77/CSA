// projectRoutes.js

const express = require('express');
const router = express.Router();
const pool = require('./db');

// Получение всех проектов
router.get('/projects', async (req, res) => {
  try {
    const allProjects = await pool.query('SELECT * FROM projects');
    res.json(allProjects.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Обновление проекта
router.put('/projects/:id', async (req, res) => {
  const projectId = req.params.id;
  const { name, description } = req.body;

  try {
    const updateProjectQuery = `
      UPDATE projects
      SET name = $1, description = $2
      WHERE id = $3
    `;
    await pool.query(updateProjectQuery, [name, description, projectId]);
    
    res.json({ message: 'Проект успешно обновлен' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавление нового проекта
router.post('/projects', async (req, res) => {
  const { name, description } = req.body;

  try {
    const insertProjectQuery = `
      INSERT INTO projects (name, description)
      VALUES ($1, $2)
      RETURNING *
    `;
    const newProject = await pool.query(insertProjectQuery, [name, description]);

    res.status(201).json(newProject.rows[0]); // Отправляем новый проект в ответе
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удаление проекта
router.delete('/projects/:id', async (req, res) => {
  const projectId = req.params.id;

  try {
    // Выполняем SQL-запрос на удаление проекта из базы данных
    const deleteProjectQuery = `
      DELETE FROM projects
      WHERE id = $1
    `;
    await pool.query(deleteProjectQuery, [projectId]);

    // Если удаление прошло успешно, возвращаем успешный статус и сообщение
    res.status(200).json({ message: 'Проект успешно удален' });
  } catch (error) {
    // В случае ошибки отправляем статус 500 и сообщение об ошибке
    console.error(error.message);
    res.status(500).json({ message: 'Ошибка сервера при удалении проекта' });
  }
});

module.exports = router;
