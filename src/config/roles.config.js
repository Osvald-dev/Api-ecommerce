import dotenv from 'dotenv';
dotenv.config();

const ROLE_CFG = {
    ADMIN: process.env.ADMIN_ROLE,
    ADMIN_EMAIL:process.env.ADMIN_EMAIL,
    ADMIN_PASS:process.env.ADMIN_PASS,
    USER: process.env.USER_ROLE
};

export default ROLE_CFG;
