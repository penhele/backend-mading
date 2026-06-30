import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService, private cloudinary: CloudinaryService) { }

  async create(dto: CreateArticleDto, file?: Express.Multer.File) {
    let imageUrl: string | null = null;

    if (file) {
      const upload = await this.cloudinary.uploadFile(file)
      imageUrl = upload.secure_url
    } else if (dto.image_url) {
      imageUrl = dto.image_url;
    } else if ((dto as any).imageUrl) {
      imageUrl = (dto as any).imageUrl;
    }

    return this.prisma.article.create({
      data: {
        ...dto,
        categoryId: Number(dto.categoryId),
        image_url: imageUrl,
      },
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
    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.content !== undefined) data.content = dto.content;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.userId !== undefined) data.userId = dto.userId;
    if (dto.categoryId !== undefined) data.categoryId = Number(dto.categoryId);

    if (dto.image_url !== undefined) {
      data.image_url = dto.image_url;
    } else if ((dto as any).imageUrl !== undefined) {
      data.image_url = (dto as any).imageUrl;
    }

    return this.prisma.article.update({
      data,
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
