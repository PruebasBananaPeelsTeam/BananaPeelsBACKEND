import { z } from 'zod';

const advertSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),

  description: z
    .string()
    .trim()
    .min(1, 'La descripción es obligatoria')
    .max(500, 'La descripción no puede tener más de 500 caracteres'),

  price: z
    .preprocess((val) => Number(val), z.number().min(0, 'El precio debe ser un número positivo')),

  type: z.enum(['buy', 'sell'], {
    errorMap: () => ({ message: 'El tipo debe ser "buy" o "sell"' }),
  }),

  tags: z
    .array(z.string())
    .min(1, 'Al menos un tag es obligatorio'),
});

export const validateAdvert = (req, res, next) => {
  const result = advertSchema.safeParse(req.body);

  const errorList = []

  if (!result.success) {
    const formatted = result.error.errors.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));
    return res.status(400).json({ errors: formatted });
  }

  if (req.file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/jpg']
    const maxSize = 5 * 1024 / 1024 // Maximo de 5MB

    if (allowedTypes.includes(req.file.mimetype)) {
        errorList.push({ field: 'image', message: 'El tipo de imagen no es válido' });
    }

    if (req.file.size > maxSize) {
        errorList.push({ field: 'image', message: 'El tamaño de la imagen no es válido' });
    }   
}

if (errorList.length > 0) {
    return res.status(400).json({ errors: errorList })
}
  

  req.body = result.data; 
  next();
};
