import { FormData } from "src/interface/form-builder.interface";

export class FormResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
}

export class FormListResponseDto extends FormResponseDto<FormData[]> {}