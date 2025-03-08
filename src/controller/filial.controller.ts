import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  HttpStatus, 
  NotFoundException, 
  Param, 
  ParseIntPipe, 
  Post, 
  Put 
} from '@nestjs/common';
import { CreateFilialDto, CreateFiliaisDto } from '../dto/dto-filial/create-filial.dto';
import { FilialService } from 'src/services/filial.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Filial } from '@prisma/client';
import { FiliaisCreateResponseDto, FilialResponseDto } from 'src/dto/dto-filial/filial-response.dto';
import { UpdateFilialDto } from 'src/dto/dto-filial/update-filial.dto';
import { StandardResponseDto } from 'src/dto/common/standard-response.dto';

@ApiTags('Filiais')
@Controller('filial')
export class FilialController {
  constructor(private readonly filialService: FilialService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova filial' })
  @ApiBody({ type: CreateFilialDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Filial criada com sucesso',
    type: FilialResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos' 
  })
  async create(@Body() createFilialDto: CreateFilialDto): Promise<StandardResponseDto<FilialResponseDto>> {
    try {
      const filial = await this.filialService.create(createFilialDto);
      return {
        success: true,
        message: 'Filial criada com sucesso',
        data: filial
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('batch')
  @ApiOperation({ summary: 'Criar múltiplas filiais' })
  @ApiBody({ type: CreateFiliaisDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Filiais criadas com sucesso',
    type: [FilialResponseDto]
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Dados inválidos' 
  })
  async createMany(@Body() createFiliaisDto: CreateFiliaisDto): Promise<StandardResponseDto<FiliaisCreateResponseDto>> {
    try {
      const resultado = await this.filialService.createMany(createFiliaisDto);
      return {
        success: true,
        message: 'Filiais criadas com sucesso',
        data: resultado
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('company/:companyId')
  @ApiOperation({ summary: 'Adicionar filial a uma empresa' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa' })
  @ApiBody({ type: CreateFilialDto })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Filial adicionada à empresa com sucesso',
    type: FilialResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Empresa não encontrada' 
  })
  async addToCompany(
    @Param('companyId', ParseIntPipe) companyId: number,
    @Body() createFilialDto: CreateFilialDto
  ): Promise<StandardResponseDto<FilialResponseDto>> {
    try {
      const filial = await this.filialService.addToCompany(companyId, createFilialDto);
      return {
        success: true,
        message: 'Filial adicionada à empresa com sucesso',
        data: filial
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Erro ao adicionar filial à empresa');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as filiais' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de filiais retornada com sucesso',
    type: [FilialResponseDto]
  })
  async findAll(): Promise<StandardResponseDto<FilialResponseDto[]>> {
    const filiais = await this.filialService.findAll();
    return {
      success: true,
      message: 'Lista de filiais retornada com sucesso',
      data: filiais as FilialResponseDto[]
    };
  }

  @Get('company/:companyId')
  @ApiOperation({ summary: 'Buscar filiais por ID da empresa' })
  @ApiParam({ name: 'companyId', description: 'ID da empresa' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de filiais da empresa retornada com sucesso',
    type: [FilialResponseDto]
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Empresa não encontrada' 
  })
  async findByCompanyId(@Param('companyId', ParseIntPipe) companyId: number): Promise<StandardResponseDto<FilialResponseDto[]>> {
    try {
      const filiais = await this.filialService.findByCompanyId(companyId);
      return {
        success: true,
        message: 'Filiais da empresa encontradas com sucesso',
        data: filiais as FilialResponseDto[]
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Empresa com ID ${companyId} não encontrada`);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar filial por ID' })
  @ApiParam({ name: 'id', description: 'ID da filial' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Filial encontrada',
    type: FilialResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Filial não encontrada' 
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<StandardResponseDto<FilialResponseDto>> {
    try {
      const filial = await this.filialService.findOne(id);
      if (!filial) {
        throw new NotFoundException(`Filial com ID ${id} não encontrada`);
      }
      return {
        success: true,
        message: 'Filial encontrada com sucesso',
        data: filial as FilialResponseDto
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Erro ao buscar filial com ID ${id}`);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar filial' })
  @ApiParam({ name: 'id', description: 'ID da filial' })
  @ApiBody({ type: UpdateFilialDto })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Filial atualizada com sucesso',
    type: FilialResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Filial não encontrada' 
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFilialDto: UpdateFilialDto
  ): Promise<StandardResponseDto<FilialResponseDto>> {
    try {
      const filial = await this.filialService.update(id, updateFilialDto);
      return {
        success: true,
        message: 'Filial atualizada com sucesso',
        data: filial as FilialResponseDto
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Filial com ID ${id} não encontrada`);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir filial' })
  @ApiParam({ name: 'id', description: 'ID da filial' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Filial excluída com sucesso',
    type: FilialResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Filial não encontrada' 
  })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<StandardResponseDto<FilialResponseDto>> {
    try {
      const filial = await this.filialService.delete(id);
      return {
        success: true,
        message: 'Filial excluída com sucesso',
        data: filial as FilialResponseDto
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Filial com ID ${id} não encontrada`);
    }
  }
}