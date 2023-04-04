import dotenv from 'dotenv';

dotenv.config();

const DB_CFG ={
    MONGO: {
        OPTIONS: null,
        URI: process.env.MONGO_URI
    },

}
export default DB_CFG;