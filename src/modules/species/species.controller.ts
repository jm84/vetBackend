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
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateSpeciesDto } from './dto/create-species.dto';
import { UpdateSpeciesDto } from './dto/update-species.dto';
import { SpeciesService } from './species.service';

@Controller('species')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SpeciesController {
  constructor(private readonly speciesService: SpeciesService) {}

  @Post()
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA)
  create(@Body() dto: CreateSpeciesDto) {
    return this.speciesService.create(dto);
  }

  @Get()
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  findAll() {
    return this.speciesService.findAll();
  }

  @Get(':id')
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  findOne(@Param('id') id: string) {
    return this.speciesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA)
  update(@Param('id') id: string, @Body() dto: UpdateSpeciesDto) {
    return this.speciesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.VETERINARIO_ADMIN)
  remove(@Param('id') id: string) {
    return this.speciesService.remove(id);
  }
}
