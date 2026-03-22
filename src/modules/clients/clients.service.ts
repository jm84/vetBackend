import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client, PaginatedClientsResponse } from './clients.types';

@Injectable()
export class ClientsService {
  private readonly pageSize = 10;
  private readonly clients: Client[] = [];

  create(createClientDto: CreateClientDto): Client {
    const newClient: Client = {
      id: randomUUID(),
      ...createClientDto,
    };

    this.clients.push(newClient);

    return newClient;
  }

  findAll(page = 1): PaginatedClientsResponse {
    return this.paginate(this.clients, page);
  }

  findById(id: string): Client {
    const client = this.clients.find((item) => item.id === id);

    if (!client) {
      throw new NotFoundException(`No existe un cliente con id ${id}`);
    }

    return client;
  }

  findByName(name: string, page = 1): PaginatedClientsResponse {
    const normalizedName = name.trim().toLowerCase();

    const results = this.clients.filter((client) =>
      client.name.toLowerCase().includes(normalizedName),
    );

    return this.paginate(results, page);
  }

  update(id: string, updateClientDto: UpdateClientDto): Client {
    const index = this.clients.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException(`No existe un cliente con id ${id}`);
    }

    this.clients[index] = {
      ...this.clients[index],
      ...updateClientDto,
      id,
    };

    return this.clients[index];
  }

  remove(id: string): void {
    const index = this.clients.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new NotFoundException(`No existe un cliente con id ${id}`);
    }

    this.clients.splice(index, 1);
  }

  private paginate(data: Client[], page: number): PaginatedClientsResponse {
    const safePage = page < 1 ? 1 : page;
    const startIndex = (safePage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    const totalPages = Math.max(1, Math.ceil(data.length / this.pageSize));

    return {
      data: data.slice(startIndex, endIndex),
      meta: {
        total: data.length,
        page: safePage,
        pageSize: this.pageSize,
        totalPages,
      },
    };
  }
}
