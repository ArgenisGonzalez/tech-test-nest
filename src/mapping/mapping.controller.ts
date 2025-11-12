import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OutputDto } from './dto/output.dto';
import { SesEventDto } from './dto/ses-event.dto';
import { MappingService } from './mapping.service';

@ApiTags('Mapping')
@Controller('mapping')
export class MappingController {
  constructor(private readonly mappingService: MappingService) {}
  @Post()
  @ApiOperation({
    summary: 'Transform an AWS SES Event to a simplify response',
  })
  @ApiBody({ type: SesEventDto })
  @ApiResponse({
    status: 200,
    type: OutputDto,
  })
  @ApiResponse({
    status: 400,
  })
  @HttpCode(HttpStatus.OK)
  create(@Body() sesEventDto: SesEventDto) {
    return this.mappingService.transform(sesEventDto);
  }
}
