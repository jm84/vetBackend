import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { OAuth2Client } from 'google-auth-library';
import { randomBytes } from 'node:crypto';
import { DataSource, Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { GoogleLoginDto } from './dto/google-login.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { Pwd } from './entities/pwd.entity';
import { Role } from './enums/role.enum';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID ?? '',
  );

  constructor(
    @InjectRepository(Pwd)
    private readonly pwdRepository: Repository<Pwd>,
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerAuthDto: RegisterAuthDto) {
    const existing = await this.pwdRepository.findOne({
      where: {
        client: { email: registerAuthDto.email },
      },
      relations: { client: true },
    });

    if (existing) {
      throw new ConflictException('Ya existe una cuenta con ese email');
    }

    const now = new Date();
    const hashPass = await argon2.hash(registerAuthDto.password);

    const saved = await this.dataSource.transaction(async (manager) => {
      const clientsRepository = manager.getRepository(Client);
      const pwdRepository = manager.getRepository(Pwd);

      const client = clientsRepository.create({
        name: registerAuthDto.name,
        address: registerAuthDto.address,
        phone: registerAuthDto.phone,
        birthdate: new Date(registerAuthDto.birthdate),
        sex: registerAuthDto.sex,
        email: registerAuthDto.email,
        avatar: registerAuthDto.avatar,
      });

      const createdClient = await clientsRepository.save(client);

      const expirationDate =
        registerAuthDto.timeToExpire && registerAuthDto.timeToExpire > 0
          ? new Date(
              now.getTime() + registerAuthDto.timeToExpire * 24 * 60 * 60 * 1000,
            )
          : null;

      const credentials = pwdRepository.create({
        hashPass,
        clientId: createdClient.id,
        role: registerAuthDto.role ?? Role.RECEPCIONISTA,
        isActive: registerAuthDto.isActive ?? true,
        creationDate: now,
        expirationDate,
        timeToExpire: registerAuthDto.timeToExpire ?? null,
        isSecurity: registerAuthDto.isSecurity ?? false,
      });

      return pwdRepository.save(credentials);
    });

    return {
      id: saved.id,
      clientId: saved.clientId,
      role: saved.role,
      isActive: saved.isActive,
      creationDate: saved.creationDate,
      expirationDate: saved.expirationDate,
      timeToExpire: saved.timeToExpire,
      isSecurity: saved.isSecurity,
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const credentials = await this.pwdRepository.findOne({
      where: {
        client: { email: loginAuthDto.email },
      },
      relations: { client: true },
    });

    if (!credentials || !credentials.isActive) {
      throw new UnauthorizedException('Credenciales invalidas o inactivas');
    }

    if (credentials.expirationDate && credentials.expirationDate.getTime() < Date.now()) {
      throw new UnauthorizedException('La credencial esta expirada');
    }

    const isMatch = await argon2.verify(
      credentials.hashPass,
      loginAuthDto.password,
    );

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const payload: JwtPayload = {
      sub: credentials.clientId,
      role: credentials.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      token_type: 'Bearer',
      expires_in: process.env.JWT_EXPIRES_IN ?? '1h',
      role: credentials.role,
      clientId: credentials.clientId,
      email: credentials.client.email,
    };
  }

  async loginWithGoogle(googleLoginDto: GoogleLoginDto) {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new UnauthorizedException('GOOGLE_CLIENT_ID no esta configurado');
    }

    const ticket = await this.googleClient.verifyIdToken({
      idToken: googleLoginDto.idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googlePayload = ticket.getPayload();

    if (!googlePayload?.email || !googlePayload.email_verified) {
      throw new UnauthorizedException('Token de Google invalido');
    }

    const email = googlePayload.email.toLowerCase();

    const client = await this.dataSource.getRepository(Client).findOneBy({ email });

    if (!client) {
      throw new UnauthorizedException(
        'No existe cuenta interna para este email. Registrese primero.',
      );
    }

    let credentials = await this.pwdRepository.findOneBy({ clientId: client.id });

    if (!credentials) {
      const randomSecret = randomBytes(32).toString('hex');
      const hashPass = await argon2.hash(randomSecret);

      const newCredentials = this.pwdRepository.create({
        clientId: client.id,
        hashPass,
        role: Role.CLIENTE,
        isActive: true,
        creationDate: new Date(),
        expirationDate: null,
        timeToExpire: null,
        isSecurity: true,
      });

      credentials = await this.pwdRepository.save(newCredentials);
    }

    if (!credentials.isActive) {
      throw new UnauthorizedException('La cuenta esta inactiva');
    }

    if (credentials.expirationDate && credentials.expirationDate.getTime() < Date.now()) {
      throw new UnauthorizedException('La credencial esta expirada');
    }

    const payload: JwtPayload = {
      sub: credentials.clientId,
      role: credentials.role,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      token_type: 'Bearer',
      expires_in: process.env.JWT_EXPIRES_IN ?? '1h',
      role: credentials.role,
      clientId: credentials.clientId,
      email: client.email,
      provider: 'google',
    };
  }
}
