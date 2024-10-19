import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, name } = req.body;

    // Verificar que los campos no estén vacíos
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Encriptar la contraseña
    const hashedPassword = await hash(password, 10);

    try {
      // Crear un nuevo usuario en la base de datos
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ error: 'Error al crear el usuario' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
