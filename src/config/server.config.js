import dotenv from 'dotenv';
dotenv.config();

const CONFIG = {
    ALLOWED_ORIGINS: [
        'http://localhost:3000',
        'http://localhost:8080',
        'http://127.0.0.1:5173',
        process.env.ALLOWED_ORIGINS,
        process.env.ALLOWED_ORIGINS_ALTER,
        process.env.ALLOWED_ORIGIN_WS
    ], 
    HOST: process.env.HOST,
    MODE: process.env.NODE_ENV,
    PORT: process.env.PORT,
    USER_COOKIES_EXPIRES: process.env.EXPIRES_USER_COOKIE_MILISECONDS
}

export default CONFIG;