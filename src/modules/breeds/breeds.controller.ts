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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { BreedsService } from './breeds.service';

@Controller('breeds')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Breeds')
@ApiBearerAuth('bearer')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Post()
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA)
  create(@Body() dto: CreateBreedDto) {
    return this.breedsService.create(dto);
  }

  @Get()
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  findAll() {
    return this.breedsService.findAll();
  }

  @Get(':id')
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  findOne(@Param('id') id: string) {
    return this.breedsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA)
  update(@Param('id') id: string, @Body() dto: UpdateBreedDto) {
    return this.breedsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.VETERINARIO_ADMIN)
  remove(@Param('id') id: string) {
    return this.breedsService.remove(id);
  }
}
