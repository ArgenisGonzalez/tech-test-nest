import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParseEmailQueryDto } from './dto/create-email.dto';
import { EmailService } from './email.service';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @ApiOperation({
    summary: 'Parse an .eml email source',
    description:
      'Accepts either a remote URL or a local path to an .eml file, parses it, and extracts any JSON attachments or linked JSON data within the email body.',
  })
  @ApiQuery({
    name: 'source',
    type: String,
    required: true,
    example:
      'https://gist.github.com/ArgenisGonzalez/a668b2116142b32aaa7243dbbb6c6885/raw/d9303da4cfdf34526bf6c511509076546084fe16/test-con-link-a-un-json.eml',
    description: 'URL or local file path to the .eml source to parse.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Email parsed successfully. Returns JSON extracted from the email.',
    schema: {
      example: {
        messageId: 'abc123@example.com',
        subject: 'Test email',
        json: { eventSource: 'aws:ses', spamVerdict: 'PASS' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request – if the source is invalid or no JSON content could be parsed.',
  })
  @HttpCode(HttpStatus.OK)
  @Get('parse')
  async parse(@Query() query: ParseEmailQueryDto) {
    return await this.emailService.parseEmail(query.source);
  }
}
