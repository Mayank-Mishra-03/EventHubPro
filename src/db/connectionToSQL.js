import mysql from 'mysql2/promise';

const connectSQL = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        })
        console.log('Connected to the MySQL database successfully', connection.config.host);
        return connection;
    }
    catch (error) {
        console.error('Error connecting to the MySQL database:', error);
        throw error;
    }
};

export { connectSQL };
