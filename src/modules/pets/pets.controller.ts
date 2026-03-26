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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreatePetDto } from './dto/create-pet.dto';
import { PetsByClientQueryDto } from './dto/pets-by-client-query.dto';
import { PetsPaginationQueryDto } from './dto/pets-pagination-query.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { PetsService } from './pets.service';

interface RequestWithUser extends Request {
	user: {
		sub: string;
		role: Role;
	};
}

@Controller('pets')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('Pets')
@ApiBearerAuth('bearer')
export class PetsController {
	constructor(private readonly petsService: PetsService) {}

	@Post()
	@Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA)
	create(@Body() createPetDto: CreatePetDto) {
		return this.petsService.create(createPetDto);
	}

	@Get()
	@Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
	findAll(@Query() query: PetsPaginationQueryDto) {
		return this.petsService.findAll(query.page ?? 1);
	}

	@Get('search/by-client/:clientId')
	@Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA, Role.VETERINARIO)
	findByClient(
		@Param('clientId') clientId: string,
		@Query() query: PetsByClientQueryDto,
	) {
		return this.petsService.findByClient(clientId, query.page ?? 1);
	}

	@Get('me/pets')
	@Roles(Role.CLIENTE)
	findMine(@Req() req: RequestWithUser, @Query() query: PetsPaginationQueryDto) {
		return this.petsService.findForMe(req.user.sub, query.page ?? 1);
	}

	@Get(':id')
	@Roles(
		Role.VETERINARIO_ADMIN,
		Role.RECEPCIONISTA,
		Role.VETERINARIO,
		Role.CLIENTE,
	)
	findById(@Param('id') id: string, @Req() req: RequestWithUser) {
		return this.petsService.findById(id, req.user);
	}

	@Patch(':id')
	@Roles(Role.VETERINARIO_ADMIN, Role.RECEPCIONISTA)
	update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto) {
		return this.petsService.update(id, updatePetDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	@Roles(Role.VETERINARIO_ADMIN)
	remove(@Param('id') id: string) {
		return this.petsService.remove(id);
	}
}
