import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.JWT_SECRET || 'clave_provisoria';
export default secretKey;