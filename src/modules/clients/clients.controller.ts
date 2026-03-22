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
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FindClientByNameQueryDto } from './dto/find-client-by-name-query.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto);
  }

  @Get()
  findAll(@Query() query: PaginationQueryDto) {
    return this.clientsService.findAll(query.page ?? 1);
  }

  @Get('search/by-id/:id')
  findById(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  @Get('search/by-name')
  findByName(@Query() query: FindClientByNameQueryDto) {
    return this.clientsService.findByName(query.name, query.page ?? 1);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.clientsService.remove(id);
  }
}
