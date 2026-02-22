import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
    async handleThumbnail(_file: Express.Multer.File) {
        // resize (sharp)
        // move to final storage
        // return public URL
    }
}
