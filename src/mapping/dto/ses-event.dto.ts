import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class SesEventDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecordDto)
  Records!: RecordDto[];
}

export class HeaderDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class CommonHeadersDto {
  @IsString()
  returnPath: string;

  @IsArray()
  @IsString({ each: true })
  from: string[];

  @IsString()
  date: string;

  @IsArray()
  @IsString({ each: true })
  to: string[];

  @IsArray()
  @IsString({ each: true })
  cc: string[];

  @IsString()
  messageId: string;

  @IsString()
  subject: string;
}
export class VerdictDto {
  @IsString()
  status: string;
}

export class ActionDto {
  @IsString()
  type: string;

  @IsString()
  topicArn: string;
}

export class MailDto {
  @IsString()
  timestamp: string;

  @IsString()
  source: string;

  @IsString()
  messageId: string;

  @IsArray()
  @IsString({ each: true })
  destination: string[];

  @IsBoolean()
  headersTruncated: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HeaderDto)
  headers: HeaderDto[];

  @ValidateNested({ each: true })
  @Type(() => CommonHeadersDto)
  commonHeaders: CommonHeadersDto;
}

export class ReceiptDto {
  @IsString()
  timestamp: string;

  @IsNumber()
  processingTimeMillis: number;

  @IsArray()
  @IsString({ each: true })
  recipients: string[];

  @ValidateNested()
  @Type(() => VerdictDto)
  spamVerdict: VerdictDto;

  @ValidateNested()
  @Type(() => VerdictDto)
  virusVerdict: VerdictDto;

  @ValidateNested()
  @Type(() => VerdictDto)
  spfVerdict: VerdictDto;

  @ValidateNested()
  @Type(() => VerdictDto)
  dkimVerdict: VerdictDto;

  @ValidateNested()
  @Type(() => VerdictDto)
  dmarcVerdict: VerdictDto;

  @IsString()
  dmarcPolicy: string;

  @ValidateNested()
  @Type(() => ActionDto)
  action: ActionDto;
}
export class SesDto {
  @ValidateNested({ each: true })
  @Type(() => ReceiptDto)
  receipt: ReceiptDto;

  @ValidateNested({ each: true })
  @Type(() => MailDto)
  mail: MailDto;
}

export class RecordDto {
  @IsString()
  eventVersion: string;

  @IsString()
  eventSource: string;

  @ValidateNested({ each: true })
  @Type(() => SesDto)
  ses: SesDto;
}
