// db.js
import { PrismaClient } from '@prisma/client';

// En Prisma 7, el constructor debe ir vacío si la URL está en el sistema.
const prisma = new PrismaClient();

// 🔍 Agregamos un log de depuración (solo se verá en Render)
if (!process.env.DATABASE_URL) {
  console.error("⚠️ ALERTA: La variable DATABASE_URL no se detecta en el sistema.");
}

export default prisma;