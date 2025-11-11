import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { OutputDto } from './dto/output.dto';
import { SesEventDto } from './dto/ses-event.dto';

@Injectable()
export class MappingService {
  transform(sesEventDto: SesEventDto) {
    const plainObject = JSON.parse(JSON.stringify(sesEventDto));
    const output = plainToClass(OutputDto, plainObject, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
      enableImplicitConversion: true,
    });
    return output;
  }
}
