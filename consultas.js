// ✅ Importación estándar (Node buscará en node_modules automáticamente)
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

// Configuración del Adaptador (Correcto para Prisma 7 + PostgreSQL)
import { PrismaPg } from '@prisma/adapter-pg';
import pkgPg from 'pg';
const { Pool } = pkgPg;
import 'dotenv/config';

// 1. Conexión física
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// 2. Adaptador
const adapter = new PrismaPg(pool);

// 3. Cliente con adaptador
const prisma = new PrismaClient({ adapter });

export const registrarUsuario = async (nombre, email, password) => {
    // Importación dinámica para bcrypt (truco para evitar conflictos ESM/CJS)
    const bcrypt = (await import('bcryptjs')).default;
    const passwordEncriptada = bcrypt.hashSync(password, 10);
    
    return await prisma.usuarioTienda.create({
        data: {
            nombre,
            email,
            password: passwordEncriptada,
            rol: "ADMIN"
        }
    });
};

export const obtenerUsuario = async (email) => {
    return await prisma.usuarioTienda.findUnique({
        where: { email }
    });
};


export const obtenerTodosLosUsuarios = async () =>{
    return await prisma.usuarioTienda.findMany()
}