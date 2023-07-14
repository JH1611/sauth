import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { compare, hash } from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;

    const exists = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (exists) {
      throw new ConflictException('User Already exists');
    }

    await this.prismaService.user.create({
      data: {
        email,
        password: await hash(password, 10),
      },
    });

    return { message: 'Registered Successfully' };
  }

  async signIn(signInDto: SignInDto, response: Response) {
    const { email, password } = signInDto;

    const exists = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (!exists) {
      throw new NotFoundException('Invalid credentials');
    }

    if (!(await compare(password, exists.password))) {
      throw new BadRequestException('Invalid credentials');
    }

    response.cookie('session', this.jwtService.sign({ id: exists.id }), {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    });

    return {
      message: 'Logged in',
    };
  }
}
