import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            articles: true,
          },
        },
      },
    });
  }

  update(id: number, dto: UpdateCategoryDto) {
    return this.prisma.category.update({
      data: dto,
      where: { id },
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}
