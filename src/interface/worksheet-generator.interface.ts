import * as ExcelJS from 'exceljs';

export interface WorksheetGeneratorProps {
  users: any[];
  [key: string]: any;
}

export interface WorksheetGenerator {
  generate(workbook: ExcelJS.Workbook, props: WorksheetGeneratorProps): Promise<void>;
}