import mysql from 'mysql2/promise';

// On crée un type pour éviter les erreurs TypeScript sur l'objet global
const globalForDb = globalThis as unknown as { dbPool: mysql.Pool };

// On réutilise le pool existant s'il y en a un, sinon on le crée
const pool = globalForDb.dbPool || mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Mets ton mot de passe s'il y en a un sur Laragon
    database: 'farfadets_db',
    waitForConnections: true,
    connectionLimit: 5, // On limite à 5 connexions max en local pour être tranquille
    queueLimit: 0
});

// En mode développement, on stocke le pool dans l'objet global pour que Next.js le réutilise
if (process.env.NODE_ENV !== 'production') {
    globalForDb.dbPool = pool;
}

export default pool;