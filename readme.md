# 🪑 MuebleMarket Backend

MuebleMarket es una plataforma web completa para la compraventa de muebles de segunda mano. Este repositorio contiene el backend del proyecto, desarrollado como parte del Web Development Bootcamp de KeepCoding, con un enfoque realista, escalable y listo para despliegue.

> **¡Ahora en producción!** El sistema está completamente desplegado y funcional en https://bananapeels.duckdns.org/

## 👥 Equipo de desarrollo

Este proyecto ha sido desarrollado en equipo por:
- Aida Fuentes
- Javier Rodríguez
- Noemí Martín
- Roberto Gómez

## 📦 Tecnologías principales

- **Node.js & Express** – API REST robusta y modular.
- **MongoDB & Mongoose** – Persistencia flexible y potente.
- **JWT & bcrypt** – Autenticación segura mediante tokens y encriptación.
- **Express-validator & Zod** – Validación de datos precisa.
- **Multer** – Subida de imágenes.
- **CORS + Rate Limiting** – Seguridad en producción.
- **Socket.IO** – Chat en tiempo real y notificaciones.
- **Nodemailer** – Envío de correos electrónicos.
- **i18n** – Internacionalización.
- **Express-session + Connect-Mongo** – Gestión de sesiones persistentes.

---

## 📁 Estructura del proyecto

```
ROOT
│
├── bin/ # Entrypoint del servidor
├── controllers/ # Lógica de negocio de usuarios, anuncios, favoritos, etc.
├── lib/ # Configuración de servicios (ej. mongoose)
├── models/ # Esquemas de Mongoose para User y Advert
├── middlewares/ # Validaciones, autenticación, rate-limiting
├── public/ # Archivos estáticos, imágenes, etc.
├── routes/ # Definición de rutas agrupadas
├── sockets/ # Lógica de WebSockets (chat, notificaciones)
├── utils/ # Utilidades auxiliares (helpers)
└── app.js # Configuración y carga principal de la app
```

---

## 🔐 Autenticación y Seguridad

- JWT emitido en `/login` y validado por `authMiddleware`.
- Protección de rutas privadas (CRUD de anuncios, perfil, favoritos).
- Rate limiting por IP en login y registro.
- CORS controlado para permitir frontend remoto o local.

---

## 🔧 Endpoints principales

> Todos bajo el prefijo `/api`

### Público

- `POST /register` – Crear cuenta
- `POST /login` – Obtener token
- `GET /adverts` – Buscar anuncios por nombre, precio o tags
- `GET /adverts/:id/:slug?` – Ver detalle de anuncio
- `GET /users/:username/adverts` – Ver anuncios de un miembro
- `GET /tags` – Obtener lista de tags disponibles

### Privado (requiere JWT)

- `GET /myAdverts` – Mis anuncios
- `POST /adverts` – Crear anuncio
- `PUT /adverts/:id` – Editar anuncio propio
- `DELETE /adverts/:id` – Borrar anuncio
- `PATCH /adverts/:id/toggle-reserved` – Marcar como reservado/no reservado
- `PATCH /adverts/:id/toggle-sold` – Marcar como vendido/no vendido
- `GET /favorites` – Listar favoritos
- `POST /favorites/:advertId` – Añadir a favoritos
- `DELETE /favorites/:advertId` – Quitar de favoritos
- `PUT /users/me` – Actualizar perfil
- `DELETE /users/me` – Borrar cuenta y anuncios propios
- `POST /auth/forgot-password` – Enviar email de recuperación
- `POST /auth/reset-password` – Resetear contraseña
- `GET/POST /chat/*` – Chat privado por anuncio

---

## 🧪 Validación de anuncios

Todos los anuncios pasan por el middleware `validateAdvert`, que:

- Verifica nombre, descripción, tipo (`buy`/`sell`), precio, tags.
- Asegura al menos un tag válido.
- Controla tipo y tamaño de imagen (máx. 10MB, JPG/PNG/WEBP/etc.).

---

## 🌍 Internacionalización

Este backend está preparado para consumir y servir datos sin atarse a un idioma. El cliente (frontend) es responsable de traducir las respuestas. Se soporta `slug` SEO-friendly para URLs limpias en los anuncios.

---

## 📚 Dependencias

- bcrypt
- connect-mongo
- cookie-parser
- cors
- cross-env
- debug
- dotenv
- express
- express-rate-limit
- express-session
- express-validator
- http-errors
- i18n
- jsonwebtoken
- mongoose
- morgan
- multer
- nodemailer
- socket.io
- zod
```

## ⚙️ Configuración

1. Crear `.env` con:
```
MONGO_URI=your_mongo_connection_string
JWT_TOKEN=your_secret_token
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
```

2. Instalar dependencias:
```bash
npm install
```

3. Ejecutar servidor:
```bash
npm start
```

## 📌 Notas finales

- La lógica del chat y notificaciones se encuentra modularizada en `sockets/`.
- Las imágenes se sirven desde `public/images/` o codificadas en base64.
- El servidor está preparado para despliegue en AWS / DigitalOcean / Render, etc.

"Hazlo o no lo hagas, pero no lo intentes" – Maestro Yoda

Este backend está diseñado para evolucionar fácilmente, incluyendo soporte para apps móviles, notificaciones en tiempo real y otras plataformas cliente. 🚀