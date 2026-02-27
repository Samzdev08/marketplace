const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'loumn111',
    database: 'Marketplace',
});

db.getConnection()
    .then(() => console.log('Connecté à la base de données MariaDB'))
    .catch(err => console.error('Erreur BDD :', err.message));

module.exports = db;