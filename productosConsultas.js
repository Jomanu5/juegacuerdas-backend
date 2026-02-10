// import pkg from '@prisma/client';
// const { PrismaClient } = pkg;

// const prisma = new PrismaClient()

import prisma from "./db.js";

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

export const obtenerProductosPorFiltros = async ({ categoria, precioMax, ordenPrecio }) => {
  const where = {};

  if (categoria && categoria.trim() !=="") {
    where.categoria = {
        equals:categoria,
        mode:'insensitive'
    }
  }
  
  if (precioMax){
    where.precio = {lte:parseInt(precioMax)}
  }

  const orderBy = ordenPrecio ? {precio: ordenPrecio} : {createdAt: 'desc'}


    return await prisma.producto.findMany({
        where: where,
        orderBy: ordenPrecio ? { precio: ordenPrecio } : { createdAt: 'desc' }

  });
};

export const obtenerProductosPorId = async (id) =>{

    return await prisma.producto.findUnique({
        where:
        {id: parseInt(id)}
        
    })
}


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


export const obtenerProductosPaginados = async (pagina = 1, limite = 10) => {
    const saltar = (pagina - 1) * limite;

    const [productos, totalProductos] = await Promise.all([
        prisma.producto.findMany({
            take: limite,           // Cuántos traer (ej: 10)
            skip: saltar,           // Cuántos saltar (ej: 20 para la pág 3)
            orderBy: {
                createdAt: 'desc'   // Los más nuevos primero
            }
        }),
        prisma.producto.count()     // Necesario para que el frontend sepa cuántas páginas hay
    ]);


    return {
        productos,
        totalProductos,
        totalPaginas: Math.ceil(totalProductos / limite),
        paginaActual: pagina
    };
};

export const productos = await prisma.producto.findMany({
    orderBy: {
        createdAt: 'desc'
    }
}) 

