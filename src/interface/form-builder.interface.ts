export interface FormVisibilityField {
  field: string;
  isVisible: boolean;
}

export interface FormData {
  id?: number;
  companyId: number;
  formData: {
    schema: any;
    uiSchema?: any;
    formOptions?: any;
  };
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDefault?: boolean;
}

export interface IFormBuilderRepository {
  getLatestForm(companyId?: number): Promise<FormData | null>;
  getFormById(id: number): Promise<FormData | null>;
  saveForm(formData: FormData): Promise<FormData>;
  updateForm(id: number, formData: Partial<FormData>): Promise<FormData>;
  getAllForms(companyId?: number): Promise<FormData[]>;
  deleteForm(id: number): Promise<boolean>;
  clearDefaultForms(companyId: number): Promise<void>;
  setAsDefault(id: number): Promise<FormData>;
}