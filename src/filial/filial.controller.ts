import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { FilialService } from './filial.service';
import { CreateFilialDto } from './dto/create-filial.dto';

@Controller('filial')
export class FilialController {
  constructor(private readonly filialService: FilialService) {}

  @Post()
  create(@Body() createFilialDto: CreateFilialDto) {
    return this.filialService.create(
      createFilialDto.filial,
      createFilialDto.quantidadeColaboradores,
    );
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.filialService.delete(+id);
  }

  @Get()
  findAll() {
    return this.filialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filialService.findOne(+id);
  }
}
