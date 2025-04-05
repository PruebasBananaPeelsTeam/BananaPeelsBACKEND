import multer from 'multer'; // multipart/form-data
import path from 'node:path'; // routes builder
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Esto es para que funcione __dirname con ESModules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Ruta destino para guardar imágenes
const uploadPath = join(__dirname, '../public/images');

// Configuramos multer para guardar imágenes en /public/images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

export default upload;