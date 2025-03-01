export interface FormVisibilityField {
  field: string;
  isVisible: boolean;
}

export interface FormData {
  id?: number;
  companyId: number;
  formData: any;
  name?: string;
  createdAt?: Date;
}

export interface IFormBuilderRepository {
  getLatestForm(companyId?: number): Promise<FormData | null>;
  saveForm(formData: FormData): Promise<FormData>;
  getAllForms(companyId?: number): Promise<FormData[]>;
}