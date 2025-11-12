import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Get('parse')
  async parse(@Query('source') source: string) {
    return await this.emailService.parseEmail(source);
  }
}
