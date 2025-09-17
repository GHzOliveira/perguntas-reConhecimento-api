import { Injectable, Logger } from '@nestjs/common';
import { CreateFiliaisDto, CreateFilialDto } from 'src/dto/dto-filial/create-filial.dto';
import { UpdateFilialDto } from 'src/dto/dto-filial/update-filial.dto';
import { FilialRepository } from 'src/repositories/filial.repositorie';
import { FilialResponseDto } from 'src/dto/dto-filial/filial-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class FilialService {
  private readonly logger = new Logger(FilialService.name);

  constructor(private readonly filialRepository: FilialRepository) {}

  async createMany(createFiliaisDto: CreateFiliaisDto) {
    this.logger.log(`Criando novas filiais: ${createFiliaisDto.filiais}`);
    const resultado = await this.filialRepository.createMany(createFiliaisDto);
    return resultado;
  }

  async create(createFilialDto: CreateFilialDto): Promise<FilialResponseDto> {
    this.logger.log(`Criando nova filial: ${createFilialDto.filial}`);
    const filial = await this.filialRepository.create(createFilialDto);
    return plainToClass(FilialResponseDto, filial);
  }

  async addToCompany(companyId: number, createFilialDto: CreateFilialDto): Promise<FilialResponseDto> {
    this.logger.log(`Adicionando nova filial à empresa ${companyId}`);
    const filial = await this.filialRepository.addToCompany(companyId, createFilialDto);
    return plainToClass(FilialResponseDto, filial);
  }

  async delete(filialId: number): Promise<FilialResponseDto> {
    this.logger.log(`Deletando filial: ${filialId}`);
    const filial = await this.filialRepository.delete(filialId);
    return plainToClass(FilialResponseDto, filial);
  }

  async update(id: number, updateFilialDto: UpdateFilialDto): Promise<FilialResponseDto> {
    this.logger.log(`Atualizando filial ${id}`);
    const filial = await this.filialRepository.update(id, updateFilialDto);
    return plainToClass(FilialResponseDto, filial);
  }

  async findAll(): Promise<FilialResponseDto[]> {
    this.logger.log('Buscando todas as filiais');
    const filiais = await this.filialRepository.findAll();
    return filiais.map(filial => plainToClass(FilialResponseDto, filial));
  }

  async findOne(id: number): Promise<FilialResponseDto> {
    this.logger.log(`Buscando filial: ${id}`);
    const filial = await this.filialRepository.findOne(id);
    return plainToClass(FilialResponseDto, filial);
  }

  async findByCompanyId(companyId: number): Promise<FilialResponseDto[]> {
    this.logger.log(`Buscando filiais da empresa: ${companyId}`);
    const filiais = await this.filialRepository.findByCompanyId(companyId);
    
    if (!filiais || filiais.length === 0) {
      this.logger.warn(`Nenhuma filial encontrada para a empresa ${companyId}`);
    } else {
      this.logger.log(`Encontradas ${filiais.length} filiais para a empresa ${companyId}`);
    }
    
    return filiais.map(filial => plainToClass(FilialResponseDto, filial));
  }
}