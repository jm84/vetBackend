import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { Pet } from '../pets/entities/pet.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

export interface PaginatedContactsResponse {
  data: Contact[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

@Injectable()
export class ContactsService {
  private readonly pageSize = 10;

  constructor(
    @InjectRepository(Contact)
    private readonly contactsRepository: Repository<Contact>,
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @InjectRepository(Pet)
    private readonly petsRepository: Repository<Pet>,
  ) {}

  async create(dto: CreateContactDto): Promise<Contact> {
    await this.ensureClientAndPetExist(dto.clientId, dto.petId);

    const contact = this.contactsRepository.create({
      clientId: dto.clientId,
      petId: dto.petId,
    });

    try {
      return await this.contactsRepository.save(contact);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async findAll(page = 1): Promise<PaginatedContactsResponse> {
    const safePage = page < 1 ? 1 : page;
    const skip = (safePage - 1) * this.pageSize;

    const [data, total] = await this.contactsRepository.findAndCount({
      relations: { client: true, pet: true },
      order: { creationDate: 'DESC' },
      skip,
      take: this.pageSize,
    });

    return this.buildPaginatedResponse(data, total, safePage);
  }

  async findOne(id: string): Promise<Contact> {
    const contact = await this.contactsRepository.findOne({
      where: { id },
      relations: { client: true, pet: true },
    });

    if (!contact) {
      throw new NotFoundException(`No existe un contacto con id ${id}`);
    }

    return contact;
  }

  async findByClient(clientId: string, page = 1): Promise<PaginatedContactsResponse> {
    const safePage = page < 1 ? 1 : page;
    const skip = (safePage - 1) * this.pageSize;

    const [data, total] = await this.contactsRepository.findAndCount({
      where: { clientId },
      relations: { client: true, pet: true },
      order: { creationDate: 'DESC' },
      skip,
      take: this.pageSize,
    });

    return this.buildPaginatedResponse(data, total, safePage);
  }

  async findByPet(petId: string, page = 1): Promise<PaginatedContactsResponse> {
    const safePage = page < 1 ? 1 : page;
    const skip = (safePage - 1) * this.pageSize;

    const [data, total] = await this.contactsRepository.findAndCount({
      where: { petId },
      relations: { client: true, pet: true },
      order: { creationDate: 'DESC' },
      skip,
      take: this.pageSize,
    });

    return this.buildPaginatedResponse(data, total, safePage);
  }

  async update(id: string, dto: UpdateContactDto): Promise<Contact> {
    const contact = await this.contactsRepository.findOneBy({ id });

    if (!contact) {
      throw new NotFoundException(`No existe un contacto con id ${id}`);
    }

    const nextClientId = dto.clientId ?? contact.clientId;
    const nextPetId = dto.petId ?? contact.petId;

    await this.ensureClientAndPetExist(nextClientId, nextPetId);

    if (dto.clientId !== undefined) {
      contact.clientId = dto.clientId;
    }

    if (dto.petId !== undefined) {
      contact.petId = dto.petId;
    }

    try {
      return await this.contactsRepository.save(contact);
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.contactsRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`No existe un contacto con id ${id}`);
    }
  }

  private async ensureClientAndPetExist(
    clientId: string,
    petId: string,
  ): Promise<void> {
    const client = await this.clientsRepository.findOneBy({ id: clientId });
    if (!client) {
      throw new NotFoundException(`No existe un cliente con id ${clientId}`);
    }

    const pet = await this.petsRepository.findOneBy({ id: petId });
    if (!pet) {
      throw new NotFoundException(`No existe una mascota con id ${petId}`);
    }
  }

  private handleDatabaseError(error: unknown): never {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const errorCode = String((error as { code: unknown }).code);

      if (errorCode === '23505') {
        throw new ConflictException(
          'Ese cliente ya esta asociado como contacto de esa mascota',
        );
      }
    }

    throw error;
  }

  private buildPaginatedResponse(
    data: Contact[],
    total: number,
    page: number,
  ): PaginatedContactsResponse {
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
}
