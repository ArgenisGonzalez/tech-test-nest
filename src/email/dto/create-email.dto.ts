import { IsNotEmpty, IsString } from 'class-validator';

export class ParseEmailQueryDto {
  @IsString()
  @IsNotEmpty()
  source: string;
}
