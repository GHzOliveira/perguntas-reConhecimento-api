import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateFiliaisDto, CreateFilialDto, UpdateFilialDto } from '../dto/dto-filial/create-filial.dto';
import { FilialService } from 'src/services/filial.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Filiais')
@Controller('filial')
export class FilialController {
  constructor(private readonly filialService: FilialService) { }

  @Post()
  async create(@Body() createFilialDto: CreateFilialDto) {
    return this.filialService.create(createFilialDto);
  }

  @Post('batch')
  async createMany(@Body() body: { filiais: CreateFilialDto[] }) {
    const createFiliaisDto = new CreateFiliaisDto();
    createFiliaisDto.filiais = body.filiais;
    return this.filialService.createMany(createFiliaisDto);
  }

  @Post('company/:companyId')
  async addToCompany(
    @Param('companyId') companyId: string,
    @Body() createFilialDto: CreateFilialDto
  ) {
    return this.filialService.addToCompany(+companyId, createFilialDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.filialService.delete(+id);
  }

  @Get()
  findAll() {
    return this.filialService.findAll();
  }

    /**
   * Busca todas as filiais associadas a uma empresa específica
   */
    @Get('company/:companyId')
    @ApiOperation({ summary: 'Busca filiais por ID da empresa' })
    @ApiParam({ name: 'companyId', description: 'ID da empresa' })
    @ApiResponse({ 
      status: 200,
      description: 'Lista de filiais da empresa retornada com sucesso'
    })
    @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
    findByCompanyId(@Param('companyId', ParseIntPipe) companyId: number) {
      return this.filialService.findByCompanyId(companyId);
    }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filialService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFilialDto: UpdateFilialDto) {
    return this.filialService.update(+id, updateFilialDto);
  }
}
