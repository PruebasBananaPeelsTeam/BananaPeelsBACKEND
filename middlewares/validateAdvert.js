import { z } from 'zod';
const aviableTags = ['Garden', 'Decoration', 'Ilumination', 'Forniture']; //se que no es recomendable esto aqui , pero es un fix in Xtreme

// ✅ Convert string → array if only one tag is present
const preprocessTags = (val) => {
    if (typeof val === 'string') return [val];
    return val;
};

const advertSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .max(20, 'Name cannot exceed 100 characters')
        .regex(/^[a-zA-Z0-9\s]+$/, 'Name can only contain letters and numbers'),

    description: z
        .string()
        .trim()
        .min(1, 'Description is required')
        .max(150, 'Description cannot exceed 150 characters')
        .regex(/^[a-zA-Z0-9\s]+$/, 'Description can only contain letters and numbers'),

    price: z.preprocess(
        (val) => Number(val),
        z.number().min(0, 'Price must be a positive number')
        .max(9999999, 'Price cannot exceed 7 digits'),
    ),

    type: z.enum(['buy', 'sell'], {
        errorMap: () => ({ message: 'Type must be either "buy" or "sell"' }),
    }),

    tags: z.preprocess(
        preprocessTags,
        z.array(z.string())
            .min(1, 'At least one tag is required')
            .refine(
                (tags) => tags.every((tag) => aviableTags.includes(tag)),
                {
                    message: `Tags must be one of: ${aviableTags.join(', ')}`,
                }
            )
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
        const maxSize = 10 * 1024 * 1024;

        if (!allowedTypes.includes(req.file.mimetype)) {
            errorList.push({
                field: 'image',
                message: 'Image type is not allowed',
            });
        }

        if (req.file.size > maxSize) {
            errorList.push({
                field: 'image',
                message: 'Image exceeds the allowed size (10MB)',
            });
        }
    }

    if (errorList.length > 0) {
        console.log('🛑 Validation failed. Errors:');
        console.log('BODY:', req.body);
        console.log('FILE:', req.file);
        console.log('ERRORS:', errorList);
        return res.status(400).json({ errors: errorList });
    }

    req.body = result.data;
    next();
};
