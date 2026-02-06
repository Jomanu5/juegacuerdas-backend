import jwt from "jsonwebtoken"
import secretKey from "./secretKey.js"

export const validarToken = (req, res, next) =>{
    const authHeader = req.headers ['authorization']
    const token = authHeader?.split (' ')[1]

    if (!token){
        return res.status(401).json({error:'debes iniciar sesion'})
    }



    try {

        const verificado = jwt.verify(token,secretKey)
        req.usuario = verificado;
        next()

    } catch (error) {
        return res.status(403).json({error: 'tu sesion finalizo'})
    }
}

export const esAdmin = (req, res, next) =>{
    if (req.usuario.rol !=='ADMIN') {
        return res.status(403).json({error: 'solo para usuarios administradores'})
    }
    next()
}


export const registrarActividad = (req, res, next) => {
    const ahora = new Date().toLocaleString();
    console.log(`[${ahora}]  Petición a: ${req.method} ${req.path}`);
    next();
};