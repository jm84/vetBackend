import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Species } from '../species/entities/species.entity';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { Breed } from './entities/breed.entity';

@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breed)
    private readonly breedsRepository: Repository<Breed>,
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
  ) {}

  async create(dto: CreateBreedDto): Promise<Breed> {
    await this.ensureSpeciesExists(dto.specieId);

    const breed = this.breedsRepository.create({
      specieId: dto.specieId,
      name: dto.name.trim(),
    });

    try {
      return await this.breedsRepository.save(breed);
    } catch (error) {
      this.handleUniqueError(error);
    }
  }

  findAll(): Promise<Breed[]> {
    return this.breedsRepository.find({
      relations: { species: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Breed> {
    const breed = await this.breedsRepository.findOne({
      where: { id },
      relations: { species: true },
    });

    if (!breed) {
      throw new NotFoundException(`No existe una raza con id ${id}`);
    }

    return breed;
  }

  async update(id: string, dto: UpdateBreedDto): Promise<Breed> {
    const breed = await this.breedsRepository.findOneBy({ id });

    if (!breed) {
      throw new NotFoundException(`No existe una raza con id ${id}`);
    }

    if (dto.specieId !== undefined) {
      await this.ensureSpeciesExists(dto.specieId);
      breed.specieId = dto.specieId;
    }

    if (dto.name !== undefined) {
      breed.name = dto.name.trim();
    }

    try {
      return await this.breedsRepository.save(breed);
    } catch (error) {
      this.handleUniqueError(error);
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.breedsRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`No existe una raza con id ${id}`);
    }
  }

  private async ensureSpeciesExists(specieId: string): Promise<void> {
    const species = await this.speciesRepository.findOneBy({ id: specieId });
    if (!species) {
      throw new NotFoundException(`No existe una especie con id ${specieId}`);
    }
  }

  private handleUniqueError(error: unknown): never {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const errorCode = String((error as { code: unknown }).code);
      if (errorCode === '23505') {
        throw new ConflictException(
          'Ya existe una raza con ese nombre para la especie indicada',
        );
      }
    }

    throw error;
  }
}
