import { Body, Controller, Post } from '@nestjs/common';
import { SesEventDto } from './dto/ses-event.dto';
import { MappingService } from './mapping.service';

@Controller('mapping')
export class MappingController {
  constructor(private readonly mappingService: MappingService) {}

  @Post()
  create(@Body() sesEventDto: SesEventDto) {
    return this.mappingService.transform(sesEventDto);
  }
}
