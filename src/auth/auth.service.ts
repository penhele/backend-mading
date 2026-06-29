import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { comparePassword, hashPassword } from '../utils/password.util';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = await this.jwt.signAsync(payload);

    return {
      accessToken: accessToken,
      user: payload,
    };
  }

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        username: dto.username,
      },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await hashPassword(dto.password);

    const newUser = await this.prisma.user.create({
      data: {
        username: dto.username,
        password: hashedPassword,
        name: dto.name,
      },
    });

    const payload = {
      sub: newUser.id,
      username: newUser.username,
      role: newUser.role,
    };

    const accessToken = await this.jwt.signAsync(payload);

    return {
      message: 'User registered successfully',
      accessToken: accessToken,
      user: payload,
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }
}
