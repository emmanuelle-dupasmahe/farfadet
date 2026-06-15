import mysql from 'mysql2/promise';

// Création d'un "pool" de connexions pour optimiser les performances
const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;