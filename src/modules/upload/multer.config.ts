import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
    storage: diskStorage({
        destination: './uploads/tmp',
        filename: (_req, file, cb) => {
            const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, unique + extname(file.originalname));
        },
    }),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB – chỉ dùng cho ảnh, thumbnail
    },
};
