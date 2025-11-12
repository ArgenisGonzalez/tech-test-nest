import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HeaderDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  value: string;
}

export class CommonHeadersDto {
  @ApiProperty()
  @IsString()
  returnPath: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  from: string[];

  @ApiProperty()
  @IsString()
  date: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  to: string[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  cc: string[];

  @ApiProperty()
  @IsString()
  messageId: string;

  @ApiProperty()
  @IsString()
  subject: string;
}
export class VerdictDto {
  @ApiProperty()
  @IsString()
  status: string;
}

export class ActionDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  topicArn: string;
}

export class MailDto {
  @ApiProperty({ example: '2015-09-11T20:32:33.936Z' })
  @IsString()
  timestamp: string;

  @ApiProperty({ example: 'sender@example.com' })
  @IsString()
  source: string;

  @ApiProperty({ example: 'd6iitobk75ur44p8kdnnp7g2n800' })
  @IsString()
  messageId: string;

  @ApiProperty({ type: [String], example: ['recipient@example.com'] })
  @IsArray()
  @IsString({ each: true })
  destination: string[];

  @ApiProperty({ example: false })
  @IsBoolean()
  headersTruncated: boolean;

  @ApiProperty({ type: [HeaderDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeaderDto)
  headers: HeaderDto[];

  @ApiProperty({ type: () => CommonHeadersDto })
  @ValidateNested({ each: true })
  @Type(() => CommonHeadersDto)
  commonHeaders: CommonHeadersDto;
}

export class ReceiptDto {
  @ApiProperty({ example: '2015-09-11T20:32:33.936Z' })
  @IsString()
  timestamp: string;

  @ApiProperty({ example: 222 })
  @IsNumber()
  processingTimeMillis: number;

  @ApiProperty({ type: [String], example: ['recipient@example.com'] })
  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ApiProperty({ type: () => VerdictDto })
  @ValidateNested()
  @Type(() => VerdictDto)
  spamVerdict: VerdictDto;

  @ApiProperty({ type: () => VerdictDto })
  @ValidateNested()
  @Type(() => VerdictDto)
  virusVerdict: VerdictDto;

  @ApiProperty({ type: () => VerdictDto })
  @ValidateNested()
  @Type(() => VerdictDto)
  spfVerdict: VerdictDto;

  @ApiProperty({ type: () => VerdictDto })
  @ValidateNested()
  @Type(() => VerdictDto)
  dkimVerdict: VerdictDto;

  @ApiProperty({ type: () => VerdictDto })
  @ValidateNested()
  @Type(() => VerdictDto)
  dmarcVerdict: VerdictDto;

  @ApiProperty({ example: 'reject' })
  @IsString()
  dmarcPolicy: string;

  @ApiProperty({ type: () => ActionDto })
  @ValidateNested()
  @Type(() => ActionDto)
  action: ActionDto;
}
export class SesDto {
  @ApiProperty({ type: ReceiptDto })
  @ValidateNested({ each: true })
  @Type(() => ReceiptDto)
  receipt: ReceiptDto;

  @ApiProperty({ type: MailDto })
  @ValidateNested({ each: true })
  @Type(() => MailDto)
  mail: MailDto;
}

export class RecordDto {
  @ApiProperty({ example: '1.0' })
  @IsString()
  eventVersion: string;

  @ApiProperty({ example: 'aws:ses' })
  @IsString()
  eventSource: string;

  @ApiProperty({ type: SesDto })
  @ValidateNested({ each: true })
  @Type(() => SesDto)
  ses: SesDto;
}

export class SesEventDto {
  @ApiProperty({
    type: [RecordDto],
    description: 'A list of records of SES Event',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecordDto)
  Records!: RecordDto[];
}
