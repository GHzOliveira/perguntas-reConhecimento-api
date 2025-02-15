import { Injectable, Logger } from '@nestjs/common';
import { CreateFiliaisDto, CreateFilialDto } from '../dto/create-filial.dto';
import { FilialRepository } from 'src/repositories/filial.repositorie';

@Injectable()
export class FilialService {
  private readonly logger = new Logger(FilialService.name);

  constructor(private readonly filialRepository: FilialRepository) {}

  async createMany(createFiliaisDto: CreateFiliaisDto) {
    this.logger.log(`Criando novas filiais: ${createFiliaisDto.filiais}`);
    return await this.filialRepository.createMany(createFiliaisDto);
  }

  async create(createFilialDto: CreateFilialDto) {
    this.logger.log(`Criando nova filial: ${createFilialDto.filial}`);
    return await this.filialRepository.create(createFilialDto);
  }

  async delete(filialId: number) {
    this.logger.log(`Deletando filial: ${filialId}`);
    return await this.filialRepository.delete(filialId);
  }

  async findAll() {
    this.logger.log('Buscando todas as filiais');
    return await this.filialRepository.findAll();
  }

  async findOne(id: number) {
    this.logger.log(`Buscando filial: ${id}`);
    return await this.filialRepository.findOne(id);
  }
}