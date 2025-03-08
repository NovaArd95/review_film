import mysql from 'mysql2/promise';

interface DbConfig {
  host: string;
  user: string;
  password: string;
  database: string;
  waitForConnections: boolean;
  connectionLimit: number;
  queueLimit: number;
}

const dbConfig: DbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'review_film',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a connection pool instead of new connections
const pool = mysql.createPool(dbConfig);

export async function executeQuery<T>({ 
  query, 
  values 
}: { 
  query: string; 
  values?: any[] 
}): Promise<T> {
  try {
    // Use pool.execute instead of creating new connection
    const [results] = await pool.execute(query, values);
    return results as T;
  } catch (error: any) {
    // More detailed error handling
    console.error('Database Error:', {
      message: error.message,
      code: error.code,
      query: query,
      values: values
    });
    throw new Error(error.message || 'Database Error occurred');
  }
}

export default {
  executeQuery
};