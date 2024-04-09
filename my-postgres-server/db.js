// db.js

const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Dark1271',
  port: 5432, // Порт PostgreSQL
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Ошибка подключения к базе данных:', err);
  }
  console.log('Успешное подключение к базе данных');
  release(); // Освобождение клиента
});

module.exports = pool;
