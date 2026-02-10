import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import pkgJwt from 'jsonwebtoken'
const jwt = pkgJwt

import pkgBcrypt from 'bcryptjs'
const bcrypt = pkgBcrypt
import { obtenerTodosLosUsuarios, obtenerUsuario, registrarUsuario} from './consultas.js'
import secretKey from './secretKey.js'
import { registrarActividad,validarToken,esAdmin } from './middlewares.js'

import { 
    crearProducto, 
    obtenerProductos, 
    actualizarProducto, 
    eliminarProducto, 
    obtenerProductosPorId,
    obtenerProductosPorFiltros
} from './productosConsultas.js';




const app = express ();
app.use(cors({
  origin: '*' 
}));app.use (express.json ())
app.use(registrarActividad)



//REGISTRO. Usuario 1 = admin.
app.post ('/api-tienda/auth/register', async (req, res) => {
    try {
        const {nombre, email, password} = req.body;
        await registrarUsuario (nombre, email, password);
        res.status (201).json ({message: 'Usuario registrado exitosamente'});
    } catch (error) {
        console.error(error)
        res.status(500).send ( 'Error al registrar el usuario');
        
    }
})

//LOGIN

app.post ('/api-tienda/auth/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const usuario = await obtenerUsuario (email);

        if (!usuario || !bcrypt.compareSync (password, usuario.password)) {
            return res.status (401).json ({error: 'Credenciales invalidas'});
        }
        const token = jwt.sign (
            {email : usuario.email, rol: usuario.rol},
            secretKey,
            {expiresIn: '1h'}   
        )
        res.json ({token});
        
    } catch (error) {
        console.error(error)
        res.status (500).send ('Error en el proceso de login');
        
    }
})


app.get('/api-tienda/usuarios/perfil', validarToken, async (req,res)=>{
    try {
        const {email} = req.usuario
        const usuario = await obtenerUsuario(email)

        if (!usuario){
            return res.status(404).json({error: 'usuario no encontrado'})
        }

        const {password, ...datosPublicos} = usuario

        res.json(datosPublicos)
    } catch (error) {
        console.error(error)
        res.status(500).json({error:'error al obtener datos de perfil'})
        
    }
})





app.get('/api-tienda/usuarios', validarToken, esAdmin, async (req,res)=>{
    try {
        const usuarios = await obtenerTodosLosUsuarios()
        const usuariosLimpios = usuarios.map(u =>{
            const {password,...datos} = u
            return datos
        })

        res.json(usuariosLimpios)

        
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'error al obtener la lista de usuarios'})
    }
})




// --- RUTAS DE PRODUCTOS ---

app.get('/api-tienda/productos', async (req, res) => {
    try {
        console.log("📥 Parámetros recibidos desde el front:", req.query);

        const { categoria, precioMax, ordenPrecio, page } = req.query;
        
        const resultado = await obtenerProductosPorFiltros({
            categoria,
            precioMax,
            ordenPrecio
        });

        res.json({
            productos: resultado,
            totalProducts: resultado.length,
            totalPages: 1,
            paginaActual: parseInt(page) || 1
        });

    } catch (error) {
        console.error("Error en Santiago:", error);
        res.status(500).json({ error: 'Error al obtener el catálogo' });
    }
});


app.get ('/api-tienda/productos/:id', async (req,res) => {
    const {id} = req.params;
    console.log(`🎻 Petición recibida para el producto ID: ${id}`)
    try {
        const producto = await obtenerProductosPorId(id);
        console.log("Instrumento encontrado:", producto); // Log de resultado

        if (!producto){
            return res.status(404).json({
                error:"el producto no existe"
            })
        }
        res.json(producto);
    } catch (error) {
    console.error("Error al buscar producto:", error);
    res.status(500).json({ 
      error: "Error interno del servidor al procesar la búsqueda." 
    });
  }
});

app.post('/api-tienda/productos', validarToken, esAdmin, async (req, res) => {
    try {
        const nuevoProducto = await crearProducto(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

app.delete('/api-tienda/productos/:id', validarToken, esAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await eliminarProducto(id);
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'No se pudo eliminar el producto' });
    }
});




// LEVANTAR EL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen (PORT,()=>{
    console.log (`Server is running on port ${PORT}`);
    });




export default app


