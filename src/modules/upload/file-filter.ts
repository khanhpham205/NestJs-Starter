import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (_req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return cb(
            new BadRequestException('Only image files are allowed'),
            false,
        );
    }
    cb(null, true);
};
