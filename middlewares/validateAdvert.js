import { z } from 'zod';

// ✅ Conversión de string → array si solo hay un tag
const preprocessTags = (val) => {
    if (typeof val === 'string') return [val];
    return val;
};

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

    price: z.preprocess(
        (val) => Number(val),
        z.number().min(0, 'El precio debe ser un número positivo'),
    ),

    type: z.enum(['buy', 'sell'], {
        errorMap: () => ({ message: 'El tipo debe ser "buy" o "sell"' }),
    }),

    tags: z.preprocess(
        preprocessTags,
        z.array(z.string()).min(1, 'Al menos un tag es obligatorio'),
    ),
});

export const validateAdvert = (req, res, next) => {
    const result = advertSchema.safeParse(req.body);

    const errorList = [];

    if (!result.success) {
        result.error.errors.forEach((err) => {
            errorList.push({ field: err.path[0], message: err.message });
        });
    }

    if (req.file) {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/jpg',
        ];
        const maxSize = 5 * 1024 * 1024;

        if (!allowedTypes.includes(req.file.mimetype)) {
            errorList.push({
                field: 'image',
                message: 'El tipo de imagen no es válido',
            });
        }

        if (req.file.size > maxSize) {
            errorList.push({
                field: 'image',
                message: 'La imagen supera el tamaño permitido (5MB)',
            });
        }
    }

    if (errorList.length > 0) {
        console.log('🛑 Validación fallida. Errores:');
        console.log('BODY:', req.body);
        console.log('FILE:', req.file);
        console.log('ERRORS:', errorList);
        return res.status(400).json({ errors: errorList });
    }

    req.body = result.data;
    next();
};
