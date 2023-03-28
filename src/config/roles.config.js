import dotenv from 'dotenv';
dotenv.config();

const ROLE_CFG = {
    ADMIN: process.env.ADMIN_ROLE,
    USER: process.env.USER_ROLE
};

export default ROLE_CFG;
