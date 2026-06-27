import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateArticleDto) {
    return 'This action adds a new article';
  }

  async findAll() {
    return this.prisma.article.findMany();
  }

  async update(id: string, dto: UpdateArticleDto) {
    return `This action updates a #${id} article`;
  }

  async remove(id: string) {
    return this.prisma.article.delete({
      where: { id },
    });
  }
}
