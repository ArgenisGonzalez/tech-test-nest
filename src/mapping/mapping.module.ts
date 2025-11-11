import { Module } from '@nestjs/common';
import { MappingService } from './mapping.service';
import { MappingController } from './mapping.controller';

@Module({
  controllers: [MappingController],
  providers: [MappingService],
})
export class MappingModule {}
