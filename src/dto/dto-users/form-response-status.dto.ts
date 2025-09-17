import { ApiProperty } from '@nestjs/swagger';
import { StandardResponseDto } from '../common/standard-response.dto';

export class FormResponseStatusDto {
  @ApiProperty({ description: 'Indica se o usuário respondeu o formulário', example: true })
  respondeuForm: boolean;
}

export class FormResponseStatusResponseDto extends StandardResponseDto<FormResponseStatusDto> {}