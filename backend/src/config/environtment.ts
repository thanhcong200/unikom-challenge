import dotenv from 'dotenv-safe';
dotenv.config()

// app
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT || 3000;
export const LOG_LEVEL = process.env.LOG_LEVEL || 'debug';
export const LOG_OUTPUT_JSON = Number(process.env.LOG_OUTPUT_JSON) || 1

// security
export const CORS = process.env.CORS || '';
export const JWT_SECRET: string = String(process.env.JWT_SECRET);
export const JWT_EXPIRES_IN: string = String(process.env.JWT_EXPIRES_IN)
export const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

// database
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = Number(process.env.DB_PORT) || 5432;
export const DB_USER = process.env.DB_USER || 'unikom';
export const DB_PASS = process.env.DB_PASS || 'unikom123a@A';
export const DB_NAME = process.env.DB_NAME || 'unikom';
export const DB_SYNC = NODE_ENV === 'development' ? true : false;
export const DB_LOG = NODE_ENV === 'development' ? true : false;

// redis
export const REDIS_URI = process.env.REDIS_URI;