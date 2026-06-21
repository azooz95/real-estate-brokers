import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller()
export class ProjectsController {
  constructor(private projects: ProjectsService) {}

  @Get('projects')
  list() {
    return this.projects.list();
  }

  @Get('projects/:id/units')
  listUnits(@Param('id') id: string, @Query('type') type?: string) {
    return this.projects.listUnits(id, type);
  }
}
