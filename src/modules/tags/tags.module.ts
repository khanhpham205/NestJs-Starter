import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagsSchema } from './schemas/tags.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: 'Tags',
            schema: TagsSchema,
        }]),
    ],
    controllers: [TagsController],
    providers: [TagsService],
})
export class TagsModule {}
