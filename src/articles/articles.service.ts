import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) {}

  async create(dto: CreateArticleDto, file?: Express.Multer.File) {
    let imageUrl: string | null = null;

    if (file) {
      const upload = await this.cloudinary.uploadFile(file)
      imageUrl = upload.secure_url
    }

    
    return this.prisma.article.create({
      data: {...dto, image_url: imageUrl},
    });
  }

  async findAll() {
    return this.prisma.article.findMany({
      include: {
        category: true,
        user: true,
      },
    });
  }

  async findOne(slug: string) {
    return this.prisma.article.findUnique({
      where: { slug },
      include: {
        category: true,
        user: true,
      },
    });
  }

  async update(id: string, dto: UpdateArticleDto) {
    return this.prisma.article.update({
      data: dto,
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
