import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MappingModule } from './mapping/mapping.module';

@Module({
  imports: [MappingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
