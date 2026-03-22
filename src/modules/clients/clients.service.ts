import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginatedClientsResponse } from './clients.types';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientsService {
  private readonly pageSize = 10;

  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const newClient = this.clientsRepository.create({
      ...createClientDto,
      birthdate: new Date(createClientDto.birthdate),
    });

    try {
      return await this.clientsRepository.save(newClient);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findAll(page = 1): Promise<PaginatedClientsResponse> {
    const safePage = page < 1 ? 1 : page;
    const skip = (safePage - 1) * this.pageSize;

    const [data, total] = await this.clientsRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: this.pageSize,
    });

    return this.buildPaginatedResponse(data, total, safePage);
  }

  async findById(id: string): Promise<Client> {
    const client = await this.clientsRepository.findOneBy({ id });

    if (!client) {
      throw new NotFoundException(`No existe un cliente con id ${id}`);
    }

    return client;
  }

  async findByName(name: string, page = 1): Promise<PaginatedClientsResponse> {
    const normalizedName = name.trim().toLowerCase();
    const safePage = page < 1 ? 1 : page;
    const skip = (safePage - 1) * this.pageSize;

    const [data, total] = await this.clientsRepository.findAndCount({
      where: {
        name: ILike(`%${normalizedName}%`),
      },
      order: { createdAt: 'DESC' },
      skip,
      take: this.pageSize,
    });

    return this.buildPaginatedResponse(data, total, safePage);
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.clientsRepository.findOneBy({ id });

    if (!client) {
      throw new NotFoundException(`No existe un cliente con id ${id}`);
    }

    const payload: Partial<Client> = {
      name: updateClientDto.name,
      address: updateClientDto.address,
      phone: updateClientDto.phone,
      sex: updateClientDto.sex,
      email: updateClientDto.email,
      avatar: updateClientDto.avatar,
    };

    if (updateClientDto.birthdate) {
      payload.birthdate = new Date(updateClientDto.birthdate);
    }

    Object.assign(client, payload);

    try {
      return await this.clientsRepository.save(client);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.clientsRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`No existe un cliente con id ${id}`);
    }
  }

  private buildPaginatedResponse(
    data: Client[],
    total: number,
    page: number,
  ): PaginatedClientsResponse {
    const totalPages = Math.max(1, Math.ceil(total / this.pageSize));

    return {
      data,
      meta: {
        total,
        page,
        pageSize: this.pageSize,
        totalPages,
      },
    };
  }

  private handleDatabaseError(error: unknown): never {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const errorCode = String((error as { code: unknown }).code);

      if (errorCode === '23505') {
        throw new ConflictException('Ya existe un cliente con ese email');
      }
    }

    throw error;
  }
}
