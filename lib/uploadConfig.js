import multer from 'multer';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const uploadPath = join(__dirname, '../public/images');

// Filtro para aceptar solo imágenes con extensiones comunes
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/jpg',
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // ✅ Aceptar
    } else {
        cb(new Error('Solo se permiten imágenes (jpg, png, gif, webp)'), false); // ❌ Rechazar
    }
};

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});

// Instancia de multer con filtro
const upload = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // máximo 5MB por imagen (opcional)
    },
});

export default upload;
