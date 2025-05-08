import mysql from 'mysql2/promise';

// Create a connection pool
const pool = mysql.createPool({
	host: process.env.RDS_HOST,
	user: process.env.RDS_USER,
	password: process.env.RDS_PSW,
	database: process.env.RDS_DB,
	waitForConnections: true,
	connectionLimit: 20,
	queueLimit: 0,
});

export default pool;
