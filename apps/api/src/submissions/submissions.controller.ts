import { SubmissionsService} from "./submissions.service";
 import { Controller, Get, Param } from "@nestjs/common";
 import{ Submission } from "@repo/database";

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get()
  async findAll(): Promise<Submission[]> {
    return this.submissionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Submission> {
    return this.submissionsService.findOne(id);
  }

}