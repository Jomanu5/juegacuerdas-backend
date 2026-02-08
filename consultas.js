import prisma from './db.js'

export const registrarUsuario = async (nombre, email, password) => {
    // Importación dinámica para bcrypt (truco para evitar conflictos ESM/CJS)
    const bcrypt = (await import('bcryptjs')).default;
    const passwordEncriptada = bcrypt.hashSync(password, 10);
    
    return await prisma.usuarioTienda.create({
        data: {
            nombre,
            email,
            password: passwordEncriptada,
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