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
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FindClientByNameQueryDto } from './dto/find-client-by-name-query.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('clients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA)
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  findAll(@Query() query: PaginationQueryDto) {
    return this.clientsService.findAll(query.page ?? 1);
  }

  @Get('search/by-id/:id')
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  findById(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  @Get('search/by-name')
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  findByName(@Query() query: FindClientByNameQueryDto) {
    return this.clientsService.findByName(query.name, query.page ?? 1);
  }

  @Get(':id')
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  findOne(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  @Patch(':id')
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA)
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.VETERINARIO_ADMIN)
  remove(@Param('id') id: string) {
    this.clientsService.remove(id);
  }
}
