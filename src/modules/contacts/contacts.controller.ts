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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactsPaginationQueryDto } from './dto/contacts-pagination-query.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Controller('contacts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Contacts')
@ApiBearerAuth('bearer')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA)
  create(@Body() dto: CreateContactDto) {
    return this.contactsService.create(dto);
  }

  @Get()
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  findAll(@Query() query: ContactsPaginationQueryDto) {
    return this.contactsService.findAll(query.page ?? 1);
  }

  @Get('search/by-client/:clientId')
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  findByClient(
    @Param('clientId') clientId: string,
    @Query() query: ContactsPaginationQueryDto,
  ) {
    return this.contactsService.findByClient(clientId, query.page ?? 1);
  }

  @Get('search/by-pet/:petId')
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  findByPet(
    @Param('petId') petId: string,
    @Query() query: ContactsPaginationQueryDto,
  ) {
    return this.contactsService.findByPet(petId, query.page ?? 1);
  }

  @Get(':id')
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA)
  update(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.contactsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(Role.VETERINARIO_ADMIN)
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
