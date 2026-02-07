// db.js
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { pg } from 'pg'

const pool = new pg.Pool({connectinString: process.env.DATABASE_URL})
const adapter = new PrismaPg(pool)  


const prisma = new PrismaClient();

// 🔍 Agregamos un log de depuración (solo se verá en Render)
if (!process.env.DATABASE_URL) {
  console.error("⚠️ ALERTA: La variable DATABASE_URL no se detecta en el sistema.");
}

export default prisma;