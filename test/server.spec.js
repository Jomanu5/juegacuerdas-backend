import { jest } from '@jest/globals';
import request from 'supertest';

// 1. 🎻 EL MOCK VA PRIMERO: Informamos a Jest cómo debe actuar Prisma
// Asegúrate de que la ruta '../db.js' sea exacta
jest.unstable_mockModule('../db.js', () => ({
  default: {
    usuarioTienda: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

// 2. 🎻 CARGA DINÁMICA: Importamos el app y el prisma mockeado
const { default: app } = await import('../index.js');
const { default: prisma } = await import('../db.js');

describe('Auth - Registro y Login', () => {
  
  test('Debería registrar un nuevo usuario exitosamente', async () => {
    // Ahora 'create' sí es una función de Jest y podemos darle un valor
    prisma.usuarioTienda.create.mockResolvedValue({
      id: 1,
      nombre: 'Alumno Prueba',
      email: 'test@juegacuerdas.cl',
      rol: 'CLIENTE'
    });

    const response = await request(app)
      .post('/api-tienda/auth/register')
      .send({
        nombre: 'Alumno Prueba',
        email: 'test@juegacuerdas.cl',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Usuario registrado exitosamente');
  });

  test('Debería fallar el login con credenciales incorrectas', async () => {
    // Simulamos que el usuario no existe en la base de datos de Render
    prisma.usuarioTienda.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post('/api-tienda/auth/login')
      .send({
        email: 'error@juegacuerdas.cl',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
  });
});