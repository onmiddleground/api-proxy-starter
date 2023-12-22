import {ArgumentMetadata, BadRequestException, Injectable, PipeTransform} from '@nestjs/common';

@Injectable()
export class ImageUploadValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (value.mimetype === "image/png" || value.mimetype === "image/jpeg" || value.mimetype === "image/jpg") {
            return value;
        } else {
            throw new BadRequestException('Invalid Avatar File type');
        }
    }
}
