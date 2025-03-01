import { 
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    HttpStatus,
    Logger
  } from '@nestjs/common';
  import { Company } from '@prisma/client';
  import { CompanyService } from '../services/company.service';
import { CreateCompanyDto } from 'src/dto/dto-company/create-company.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
  
  
  @ApiTags('Companies')
  @Controller('companies')
  export class CompanyController {
    private readonly logger = new Logger(CompanyController.name);
  
    constructor(private readonly companyService: CompanyService) {}
  
    @Post()
    @ApiOperation({ summary: 'Create a new company' })
    @ApiBody({ type: CreateCompanyDto })
    @ApiResponse({ 
      status: HttpStatus.CREATED, 
      description: 'Company created successfully' 
    })
    @ApiResponse({ 
      status: HttpStatus.BAD_REQUEST, 
      description: 'Invalid company data' 
    })
    async createCompany(
      @Body() createCompanyDto: CreateCompanyDto
    ): Promise<Company> {
      this.logger.log(`Creating company with name: ${createCompanyDto.name}`);
      return await this.companyService.create(createCompanyDto.name);
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all companies' })
    @ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'List of all companies' 
    })
    async getAllCompanies(): Promise<Company[]> {
      this.logger.log('Getting all companies');
      return await this.companyService.findAll();
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get company by ID' })
    @ApiParam({ name: 'id', description: 'Company ID' })
    @ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Company found' 
    })
    @ApiResponse({ 
      status: HttpStatus.NOT_FOUND, 
      description: 'Company not found' 
    })
    async getCompanyById(
      @Param('id', ParseIntPipe) id: number
    ): Promise<Company> {
      this.logger.log(`Getting company with id: ${id}`);
      return await this.companyService.findById(id);
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete company by ID' })
    @ApiParam({ name: 'id', description: 'Company ID' })
    @ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Company deleted successfully' 
    })
    @ApiResponse({ 
      status: HttpStatus.NOT_FOUND, 
      description: 'Company not found' 
    })
    async deleteCompany(
      @Param('id', ParseIntPipe) id: number
    ): Promise<Company> {
      this.logger.log(`Deleting company with id: ${id}`);
      return await this.companyService.delete(id);
    }
  }