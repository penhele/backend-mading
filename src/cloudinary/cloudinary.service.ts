import { Injectable } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
    constructor() {}

    async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
      return new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: 'mading-online' },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            if (!result) {
              return reject(new Error('Cloudinary upload returned no result.'));
            }
            resolve(result);
          },
        );
        
        Readable.from(file.buffer).pipe(upload);
      });
    }
}
