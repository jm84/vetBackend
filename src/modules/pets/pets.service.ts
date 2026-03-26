import {
	ConflictException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../auth/enums/role.enum';
import { Breed } from '../breeds/entities/breed.entity';
import { Client } from '../clients/entities/client.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';

interface JwtActor {
	sub: string;
	role: Role;
}

export interface PaginatedPetsResponse {
	data: Pet[];
	meta: {
		total: number;
		page: number;
		pageSize: number;
		totalPages: number;
	};
}

@Injectable()
export class PetsService {
	private readonly pageSize = 10;

	constructor(
		@InjectRepository(Pet)
		private readonly petsRepository: Repository<Pet>,
		@InjectRepository(Client)
		private readonly clientsRepository: Repository<Client>,
		@InjectRepository(Breed)
		private readonly breedsRepository: Repository<Breed>,
	) {}

	async create(createPetDto: CreatePetDto): Promise<Pet> {
		const client = await this.clientsRepository.findOneBy({ id: createPetDto.clientId });

		if (!client) {
			throw new NotFoundException(
				`No existe un cliente con id ${createPetDto.clientId}`,
			);
		}

		const breed = await this.breedsRepository.findOneBy({ id: createPetDto.breedId });

		if (!breed) {
			throw new NotFoundException(
				`No existe una raza con id ${createPetDto.breedId}`,
			);
		}

		if (createPetDto.microchip) {
			const existing = await this.petsRepository.findOneBy({
				microchip: createPetDto.microchip,
			});

			if (existing) {
				throw new ConflictException('Ya existe una mascota con ese microchip');
			}
		}

		const pet = this.petsRepository.create({
			...createPetDto,
			birthdate: new Date(createPetDto.birthdate),
			weightCurrent: createPetDto.weightCurrent ?? null,
			color: createPetDto.color ?? null,
			microchip: createPetDto.microchip ?? null,
			sterilized: createPetDto.sterilized ?? false,
			isActive: createPetDto.isActive ?? true,
		});

		return this.petsRepository.save(pet);
	}

	async findAll(page = 1): Promise<PaginatedPetsResponse> {
		const safePage = page < 1 ? 1 : page;
		const skip = (safePage - 1) * this.pageSize;
		const [data, total] = await this.petsRepository.findAndCount({
			relations: { breed: { species: true } },
			order: { createdAt: 'DESC' },
			skip,
			take: this.pageSize,
		});

		return this.buildPaginatedResponse(data, total, safePage);
	}

	async findByClient(clientId: string, page = 1): Promise<PaginatedPetsResponse> {
		const safePage = page < 1 ? 1 : page;
		const skip = (safePage - 1) * this.pageSize;
		const [data, total] = await this.petsRepository.findAndCount({
			where: { clientId },
			relations: { breed: { species: true } },
			order: { createdAt: 'DESC' },
			skip,
			take: this.pageSize,
		});

		return this.buildPaginatedResponse(data, total, safePage);
	}

	async findById(id: string, actor?: JwtActor): Promise<Pet> {
		const pet = await this.petsRepository.findOne({
			where: { id },
			relations: { breed: { species: true } },
		});

		if (!pet) {
			throw new NotFoundException(`No existe una mascota con id ${id}`);
		}

		if (actor?.role === Role.CLIENTE && pet.clientId !== actor.sub) {
			throw new ForbiddenException('No tienes acceso a esta mascota');
		}

		return pet;
	}

	async update(id: string, updatePetDto: UpdatePetDto): Promise<Pet> {
		const pet = await this.petsRepository.findOneBy({ id });

		if (!pet) {
			throw new NotFoundException(`No existe una mascota con id ${id}`);
		}

		if (updatePetDto.breedId !== undefined) {
			const breed = await this.breedsRepository.findOneBy({ id: updatePetDto.breedId });

			if (!breed) {
				throw new NotFoundException(
					`No existe una raza con id ${updatePetDto.breedId}`,
				);
			}
		}

		if (updatePetDto.microchip && updatePetDto.microchip !== pet.microchip) {
			const existing = await this.petsRepository.findOneBy({
				microchip: updatePetDto.microchip,
			});

			if (existing) {
				throw new ConflictException('Ya existe una mascota con ese microchip');
			}
		}

		const payload: Partial<Pet> = {
			name: updatePetDto.name,
			breedId: updatePetDto.breedId,
			sex: updatePetDto.sex,
			weightCurrent: updatePetDto.weightCurrent,
			color: updatePetDto.color,
			microchip: updatePetDto.microchip,
			sterilized: updatePetDto.sterilized,
			isActive: updatePetDto.isActive,
		};

		if (updatePetDto.birthdate) {
			payload.birthdate = new Date(updatePetDto.birthdate);
		}

		Object.assign(pet, payload);

		return this.petsRepository.save(pet);
	}

	async remove(id: string): Promise<void> {
		const result = await this.petsRepository.delete(id);

		if (!result.affected) {
			throw new NotFoundException(`No existe una mascota con id ${id}`);
		}
	}

	async findForMe(clientId: string, page = 1): Promise<PaginatedPetsResponse> {
		return this.findByClient(clientId, page);
	}

	private buildPaginatedResponse(
		data: Pet[],
		total: number,
		page: number,
	): PaginatedPetsResponse {
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
