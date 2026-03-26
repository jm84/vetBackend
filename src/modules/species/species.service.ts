import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { Species } from './entities/species.entity';

@Injectable()
export class SpeciesService {
  constructor(
    @InjectRepository(Species)
    private readonly speciesRepository: Repository<Species>,
  ) {}

  async create(dto: CreateSpeciesDto): Promise<Species> {
    const species = this.speciesRepository.create({
      name: dto.name.trim(),
    });

    try {
      return await this.speciesRepository.save(species);
    } catch (error) {
      this.handleUniqueError(error, 'Ya existe una especie con ese nombre');
    }
  }

  findAll(): Promise<Species[]> {
    return this.speciesRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Species> {
    const species = await this.speciesRepository.findOneBy({ id });

    if (!species) {
      throw new NotFoundException(`No existe una especie con id ${id}`);
    }

    return species;
  }

  async update(id: string, dto: UpdateSpeciesDto): Promise<Species> {
    const species = await this.findOne(id);

    if (dto.name !== undefined) {
      species.name = dto.name.trim();
    }

    try {
      return await this.speciesRepository.save(species);
    } catch (error) {
      this.handleUniqueError(error, 'Ya existe una especie con ese nombre');
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.speciesRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`No existe una especie con id ${id}`);
    }
  }

  private handleUniqueError(error: unknown, message: string): never {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const errorCode = String((error as { code: unknown }).code);
      if (errorCode === '23505') {
        throw new ConflictException(message);
      }
    }

    throw error;
  }
}
