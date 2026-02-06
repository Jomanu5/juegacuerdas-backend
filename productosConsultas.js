import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient()

export const crearProducto = async (data) =>{
    return await prisma.producto.create({
        data:{
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: data.precio,
            categoria: data.categoria,
            imagenUrl: data.imagenUrl
        }
    })
}

export const obtenerProductos = async () => {
    return await prisma.producto.findMany({
        orderBy: { createdAt: 'desc' }
    });
};


export const actualizarProducto = async (id, data) => {
    return await prisma.producto.update({
        where: { id: Number(id) },
        data
    });
};

export const eliminarProducto = async (id) => {
    return await prisma.producto.delete({
        where: { id: Number(id) }
    });
};