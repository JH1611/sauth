import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SignUpDto } from './dto/sign-up.dto';
import { hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

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
}
