import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MappingModule } from './mapping/mapping.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [MappingModule, EmailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
