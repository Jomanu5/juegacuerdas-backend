// db.js
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg'; // 1. Importamos el paquete completo como 'pkg'

const { Pool } = pkg; // 2. Desestructuramos 'Pool' desde el paquete

// 3. Configuración de la conexión
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;