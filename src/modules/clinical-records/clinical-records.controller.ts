import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ClinicalPaginationQueryDto } from './dto/pagination-query.dto';
import { CreateAllergyRecordDto } from './dto/create-allergy-record.dto';
import { CreateClinicalEncounterDto } from './dto/create-clinical-encounter.dto';
import { CreateVaccineRecordDto } from './dto/create-vaccine-record.dto';
import { UpdateAllergyRecordDto } from './dto/update-allergy-record.dto';
import { UpdateClinicalEncounterDto } from './dto/update-clinical-encounter.dto';
import { ClinicalRecordsService } from './clinical-records.service';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    role: Role;
  };
}

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClinicalRecordsController {
  constructor(private readonly clinicalRecordsService: ClinicalRecordsService) {}

  @Post('clinical-encounters')
  @Roles(Role.VETERINARIO_ADMIN, Role.VETERINARIO)
  createEncounter(@Body() dto: CreateClinicalEncounterDto) {
    return this.clinicalRecordsService.createEncounter(dto);
  }

  @Get('clinical-encounters/:id')
  @Roles(
    Role.VETERINARIO_ADMIN,
    Role.VETERINARIO,
    Role.RECEPCIONISTA,
    Role.CLIENTE,
  )
  findEncounterById(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.clinicalRecordsService.findEncounterById(id, req.user);
  }

  @Get('clinical-encounters/by-pet/:petId')
  @Roles(
    Role.VETERINARIO_ADMIN,
    Role.VETERINARIO,
    Role.RECEPCIONISTA,
    Role.CLIENTE,
  )
  findEncountersByPet(
    @Param('petId') petId: string,
    @Query() query: ClinicalPaginationQueryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.clinicalRecordsService.findEncountersByPet(
      petId,
      query.page ?? 1,
      req.user,
    );
  }

  @Patch('clinical-encounters/:id')
  @Roles(Role.VETERINARIO_ADMIN, Role.VETERINARIO)
  updateEncounter(@Param('id') id: string, @Body() dto: UpdateClinicalEncounterDto) {
    return this.clinicalRecordsService.updateEncounter(id, dto);
  }

  @Patch('clinical-encounters/:id/close')
  @Roles(Role.VETERINARIO_ADMIN, Role.VETERINARIO)
  closeEncounter(@Param('id') id: string) {
    return this.clinicalRecordsService.closeEncounter(id);
  }

  @Post('pets/:petId/vaccines')
  @Roles(Role.VETERINARIO_ADMIN, Role.VETERINARIO)
  createVaccine(@Param('petId') petId: string, @Body() dto: CreateVaccineRecordDto) {
    return this.clinicalRecordsService.createVaccine(petId, dto);
  }

  @Get('pets/:petId/vaccines')
  @Roles(
    Role.VETERINARIO_ADMIN,
    Role.VETERINARIO,
    Role.RECEPCIONISTA,
    Role.CLIENTE,
  )
  findVaccines(@Param('petId') petId: string, @Req() req: RequestWithUser) {
    return this.clinicalRecordsService.findVaccinesByPet(petId, req.user);
  }

  @Post('pets/:petId/allergies')
  @Roles(Role.VETERINARIO_ADMIN, Role.VETERINARIO)
  createAllergy(@Param('petId') petId: string, @Body() dto: CreateAllergyRecordDto) {
    return this.clinicalRecordsService.createAllergy(petId, dto);
  }

  @Get('pets/:petId/allergies')
  @Roles(
    Role.VETERINARIO_ADMIN,
    Role.VETERINARIO,
    Role.RECEPCIONISTA,
    Role.CLIENTE,
  )
  findAllergies(@Param('petId') petId: string, @Req() req: RequestWithUser) {
    return this.clinicalRecordsService.findAllergiesByPet(petId, req.user);
  }

  @Patch('allergies/:id')
  @Roles(Role.VETERINARIO_ADMIN, Role.VETERINARIO)
  updateAllergy(@Param('id') id: string, @Body() dto: UpdateAllergyRecordDto) {
    return this.clinicalRecordsService.updateAllergy(id, dto);
  }

  @Delete('allergies/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.VETERINARIO_ADMIN, Role.VETERINARIO)
  removeAllergy(@Param('id') id: string) {
    return this.clinicalRecordsService.removeAllergy(id);
  }

  @Get('me/pets/:petId/clinical-history')
  @Roles(Role.CLIENTE)
  getMyClinicalHistory(
    @Param('petId') petId: string,
    @Query() query: ClinicalPaginationQueryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.clinicalRecordsService.findMyClinicalHistory(
      petId,
      req.user,
      query.page ?? 1,
    );
  }
}
