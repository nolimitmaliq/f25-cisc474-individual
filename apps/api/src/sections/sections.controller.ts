import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { SectionsService } from './sections.service';
import { Section } from '@repo/database';

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  // GET /sections - Get all sections
  @Get()
  findAll(): Promise<Section[]> {
    return this.sectionsService.findAll();
  }

  // GET /sections/:id - Get a specific section by ID
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Section> {
    return this.sectionsService.findOne(id);
  }
}