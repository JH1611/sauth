import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../database/prisma.service';
import { InvalidSessionException } from '../exceptions/InvalidSessionException';

function extractJWTFromCookie(req: Request): string {
  return req.cookies['session'];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: extractJWTFromCookie,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ id }: { id: number; iat: number; exp: number }) {
    const exists = await this.prismaService.user.findFirst({ where: { id } });

    if (!exists) {
      throw new InvalidSessionException();
    }

    return { email: exists.email };
  }
}
