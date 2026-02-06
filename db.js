// db.js
import { PrismaClient } from '@prisma/client';

//  Forzamos a Prisma a usar la variable de entorno de Render
if (!process.env.DATABASE_URL) {
  console.error("❌ ERROR: La variable DATABASE_URL no está definida en el sistema.");
}


const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default prisma;