import { z } from 'zod';

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
        .max(100, 'Name cannot exceed 100 characters'),

    description: z
        .string()
        .trim()
        .min(1, 'Description is required')
        .max(500, 'Description cannot exceed 500 characters'),

    price: z.preprocess(
        (val) => Number(val),
        z.number().min(0, 'Price must be a positive number'),
    ),

    type: z.enum(['buy', 'sell'], {
        errorMap: () => ({ message: 'Type must be either "buy" or "sell"' }),
    }),

    tags: z.preprocess(
        preprocessTags,
        z.array(z.string()).min(1, 'At least one tag is required'),
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
