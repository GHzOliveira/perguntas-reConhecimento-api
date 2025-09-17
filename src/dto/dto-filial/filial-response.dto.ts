import { ApiProperty } from '@nestjs/swagger';
import { Filial } from '@prisma/client';

export class FilialResponseDto implements Partial<Filial> {
  @ApiProperty({ description: 'ID da filial', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID da empresa', example: 1 })
  companyId: number;

  @ApiProperty({ description: 'Nome da filial', example: 'Filial Centro' })
  filial: string;

  @ApiProperty({ description: 'Quantidade de colaboradores', example: 50 })
  quantidadeColaboradores: number;

  @ApiProperty({ description: 'Link único para a filial', example: 'filial-centro-123' })
  linkUnico: string;

  @ApiProperty({ description: 'Status da filial', example: 'ACTIVE' })
  status: string;

  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização' })
  updatedAt: Date;
}

export class FiliaisCreateResponseDto {
    @ApiProperty({ type: [FilialResponseDto], description: 'Lista de filiais criadas' })
    filiais: Filial[];
  
    @ApiProperty({ description: 'Link único para acesso às filiais em lote', example: 'http://exemplo.com/filiais/lote-123' })
    linkUnico: string;
  }

export class FilialListResponseDto {
  @ApiProperty({ description: 'Sucesso da operação', example: true })
  success: boolean;

  @ApiProperty({ description: 'Mensagem de resposta', example: 'Lista de filiais retornada com sucesso' })
  message: string;

  @ApiProperty({ description: 'Dados das filiais', type: [FilialResponseDto] })
  data: FilialResponseDto[];
}