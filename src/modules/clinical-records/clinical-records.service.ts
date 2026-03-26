import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../auth/enums/role.enum';
import { Pet } from '../pets/entities/pet.entity';
import { CreateAllergyRecordDto } from './dto/create-allergy-record.dto';
import { CreateClinicalEncounterDto } from './dto/create-clinical-encounter.dto';
import { CreateVaccineRecordDto } from './dto/create-vaccine-record.dto';
import { UpdateAllergyRecordDto } from './dto/update-allergy-record.dto';
import { UpdateClinicalEncounterDto } from './dto/update-clinical-encounter.dto';
import {
  ClinicalEncounter,
  ClinicalEncounterStatus,
} from './entities/clinical-encounter.entity';
import { AllergyRecord } from './entities/allergy-record.entity';
import { VaccineRecord } from './entities/vaccine-record.entity';

interface JwtActor {
  sub: string;
  role: Role;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

@Injectable()
export class ClinicalRecordsService {
  private readonly pageSize = 10;

  constructor(
    @InjectRepository(ClinicalEncounter)
    private readonly encountersRepository: Repository<ClinicalEncounter>,
    @InjectRepository(VaccineRecord)
    private readonly vaccinesRepository: Repository<VaccineRecord>,
    @InjectRepository(AllergyRecord)
    private readonly allergiesRepository: Repository<AllergyRecord>,
    @InjectRepository(Pet)
    private readonly petsRepository: Repository<Pet>,
  ) {}

  async createEncounter(
    dto: CreateClinicalEncounterDto,
  ): Promise<ClinicalEncounter> {
    await this.ensurePetExists(dto.petId);

    const encounter = this.encountersRepository.create({
      petId: dto.petId,
      veterinarianUserId: dto.veterinarianUserId,
      reasonForVisit: dto.reasonForVisit,
      anamnesis: dto.anamnesis ?? null,
      physicalExam: dto.physicalExam ?? null,
      diagnosis: dto.diagnosis ?? null,
      treatmentPlan: dto.treatmentPlan ?? null,
      prescriptions: dto.prescriptions ?? null,
      notes: dto.notes ?? null,
      encounterDate: new Date(dto.encounterDate),
      followUpDate: dto.followUpDate ? new Date(dto.followUpDate) : null,
      status: ClinicalEncounterStatus.OPEN,
    });

    return this.encountersRepository.save(encounter);
  }

  async findEncounterById(
    id: string,
    actor: JwtActor,
  ): Promise<ClinicalEncounter> {
    const encounter = await this.encountersRepository.findOneBy({ id });

    if (!encounter) {
      throw new NotFoundException(`No existe una consulta clinica con id ${id}`);
    }

    await this.assertCanAccessPet(encounter.petId, actor);

    if (actor.role === Role.CLIENTE && encounter.status !== ClinicalEncounterStatus.CLOSED) {
      throw new ForbiddenException('Solo puedes ver consultas cerradas');
    }

    return encounter;
  }

  async findEncountersByPet(
    petId: string,
    page: number,
    actor: JwtActor,
  ): Promise<PaginatedResponse<ClinicalEncounter>> {
    await this.assertCanAccessPet(petId, actor);

    const safePage = page < 1 ? 1 : page;
    const skip = (safePage - 1) * this.pageSize;

    const whereCondition =
      actor.role === Role.CLIENTE
        ? { petId, status: ClinicalEncounterStatus.CLOSED }
        : { petId };

    const [data, total] = await this.encountersRepository.findAndCount({
      where: whereCondition,
      order: { encounterDate: 'DESC' },
      skip,
      take: this.pageSize,
    });

    return this.buildPaginatedResponse(data, total, safePage);
  }

  async updateEncounter(
    id: string,
    dto: UpdateClinicalEncounterDto,
  ): Promise<ClinicalEncounter> {
    const encounter = await this.encountersRepository.findOneBy({ id });

    if (!encounter) {
      throw new NotFoundException(`No existe una consulta clinica con id ${id}`);
    }

    const payload: Partial<ClinicalEncounter> = {
      veterinarianUserId: dto.veterinarianUserId,
      reasonForVisit: dto.reasonForVisit,
      anamnesis: dto.anamnesis,
      physicalExam: dto.physicalExam,
      diagnosis: dto.diagnosis,
      treatmentPlan: dto.treatmentPlan,
      prescriptions: dto.prescriptions,
      notes: dto.notes,
    };

    if (dto.encounterDate) {
      payload.encounterDate = new Date(dto.encounterDate);
    }

    if (dto.followUpDate) {
      payload.followUpDate = new Date(dto.followUpDate);
    }

    Object.assign(encounter, payload);

    return this.encountersRepository.save(encounter);
  }

  async closeEncounter(id: string): Promise<ClinicalEncounter> {
    const encounter = await this.encountersRepository.findOneBy({ id });

    if (!encounter) {
      throw new NotFoundException(`No existe una consulta clinica con id ${id}`);
    }

    if (!encounter.diagnosis) {
      throw new ForbiddenException('No puedes cerrar una consulta sin diagnostico');
    }

    encounter.status = ClinicalEncounterStatus.CLOSED;

    return this.encountersRepository.save(encounter);
  }

  async createVaccine(
    petId: string,
    dto: CreateVaccineRecordDto,
  ): Promise<VaccineRecord> {
    await this.ensurePetExists(petId);

    const vaccine = this.vaccinesRepository.create({
      petId,
      vaccineName: dto.vaccineName,
      applicationDate: new Date(dto.applicationDate),
      nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : null,
      lotNumber: dto.lotNumber ?? null,
      veterinarianUserId: dto.veterinarianUserId ?? null,
    });

    return this.vaccinesRepository.save(vaccine);
  }

  async findVaccinesByPet(petId: string, actor: JwtActor): Promise<VaccineRecord[]> {
    await this.assertCanAccessPet(petId, actor);

    return this.vaccinesRepository.find({
      where: { petId },
      order: { applicationDate: 'DESC' },
    });
  }

  async createAllergy(
    petId: string,
    dto: CreateAllergyRecordDto,
  ): Promise<AllergyRecord> {
    await this.ensurePetExists(petId);

    const allergy = this.allergiesRepository.create({
      petId,
      allergen: dto.allergen,
      reaction: dto.reaction,
      severity: dto.severity,
      notes: dto.notes ?? null,
    });

    return this.allergiesRepository.save(allergy);
  }

  async findAllergiesByPet(petId: string, actor: JwtActor): Promise<AllergyRecord[]> {
    await this.assertCanAccessPet(petId, actor);

    return this.allergiesRepository.find({
      where: { petId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateAllergy(
    id: string,
    dto: UpdateAllergyRecordDto,
  ): Promise<AllergyRecord> {
    const allergy = await this.allergiesRepository.findOneBy({ id });

    if (!allergy) {
      throw new NotFoundException(`No existe una alergia con id ${id}`);
    }

    Object.assign(allergy, dto);

    return this.allergiesRepository.save(allergy);
  }

  async removeAllergy(id: string): Promise<void> {
    const result = await this.allergiesRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`No existe una alergia con id ${id}`);
    }
  }

  async findMyClinicalHistory(
    petId: string,
    actor: JwtActor,
    page: number,
  ): Promise<PaginatedResponse<ClinicalEncounter>> {
    return this.findEncountersByPet(petId, page, actor);
  }

  private async ensurePetExists(petId: string): Promise<void> {
    const pet = await this.petsRepository.findOneBy({ id: petId });

    if (!pet) {
      throw new NotFoundException(`No existe una mascota con id ${petId}`);
    }
  }

  private async assertCanAccessPet(petId: string, actor: JwtActor): Promise<void> {
    const pet = await this.petsRepository.findOneBy({ id: petId });

    if (!pet) {
      throw new NotFoundException(`No existe una mascota con id ${petId}`);
    }

    if (actor.role === Role.CLIENTE && pet.clientId !== actor.sub) {
      throw new ForbiddenException('No tienes acceso a esta mascota');
    }
  }

  private buildPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
  ): PaginatedResponse<T> {
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
