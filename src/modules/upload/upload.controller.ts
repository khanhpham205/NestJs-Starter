import {
    Controller,
    Post,
    UseGuards,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { multerConfig } from './multer.config';
import { imageFileFilter } from './file-filter';

@Controller('upload')
export class UploadController {
    @Post('thumbnail')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('file', {
            ...multerConfig,
            fileFilter: imageFileFilter,
        }),
    )
    uploadThumbnail(@UploadedFile() file: Express.Multer.File) {
        return {
            filename: file.filename,
            path: file.path,
            size: file.size,
        };
    }



    
}
