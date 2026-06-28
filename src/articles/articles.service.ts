import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateArticleDto) {
    return this.prisma.article.create({
      data: dto,
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
