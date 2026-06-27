import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  image_url!: string;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsUUID()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  catego
}
