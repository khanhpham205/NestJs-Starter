import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
    async handleThumbnail(file: Express.Multer.File) {
        // resize (sharp)
        // move to final storage
        // return public URL
    }
}
