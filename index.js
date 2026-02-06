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
    eliminarProducto 
} from './productosConsultas.js';




const app = express ();
app.use (cors ());
app.use (express.json ())
app.use(registrarActividad)



//REGISTRO. Usuario 1 = admin.
app.post ('/api-tienda/auth/', async (req, res) => {
    try {
        const {nombre, email, password} = req.body;
        await registrarUsuario (nombre, email, password);
        res.status (201).json ({message: 'Usuario registrado exitosamente'});
    } catch (error) {
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
        res.status(500).json({error: 'error al obtener la lista de usuarios'})
    }
})




// --- RUTAS DE PRODUCTOS ---

app.get('/api-tienda/productos', async (req, res) => {
    try {
        const productos = await obtenerProductos();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el catálogo' });
    }
});

app.post('/api-tienda/productos', validarToken, esAdmin, async (req, res) => {
    try {
        const nuevoProducto = await crearProducto(req.body);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

app.delete('/api-tienda/productos/:id', validarToken, esAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await eliminarProducto(id);
        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'No se pudo eliminar el producto' });
    }
});


// LEVANTAR EL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen (PORT,()=>{
    console.log (`Server is running on port ${PORT}`);
    });



