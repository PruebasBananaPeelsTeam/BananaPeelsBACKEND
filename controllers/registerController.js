import User from '../models/User.js';

//Crear nuevo usuario

export async function createUser(req, res, next) {
  try {
    const { email, password, username } = req.body;

    // Hashear contraseña usando el método estático
    const hashedPassword = await User.hashPassword(password);

    // Crear una instancia de usuario
    const user = new User({
      email,
      password: hashedPassword, //con la contraseña hasheada
      username,
    });

    // Guardar en la base de datos
    await user.save();

    // Respuesta de éxito
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
}
