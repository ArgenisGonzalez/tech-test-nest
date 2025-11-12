import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class OutputDto {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    const spamStatus = obj?.Records?.[0]?.ses?.receipt?.spamVerdict?.status;
    return spamStatus === 'PASS';
  })
  spam: boolean;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    const virusStatus = obj?.Records?.[0]?.ses?.receipt?.virusVerdict?.status;
    return virusStatus === 'PASS';
  })
  virus: boolean;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    const receipt = obj?.Records?.[0]?.ses?.receipt;
    const spfPass = receipt?.spfVerdict?.status === 'PASS';
    const dkimPass = receipt?.dkimVerdict?.status === 'PASS';
    const dmarcPass = receipt?.dmarcVerdict?.status === 'PASS';
    return spfPass && dkimPass && dmarcPass;
  })
  dns: boolean;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    const timestamp = obj?.Records?.[0]?.ses?.mail?.timestamp;
    if (!timestamp) return 'desconocido';

    const date = new Date(timestamp);
    const months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    return months[date.getMonth()];
  })
  mes: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    const processingTime =
      obj?.Records?.[0]?.ses?.receipt?.processingTimeMillis;
    return processingTime > 1000;
  })
  retrasado: boolean;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    const source = obj?.Records?.[0]?.ses?.mail?.source;
    if (!source) return 'desconocido';
    return source.split('@')[0];
  })
  emisor: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => {
    const destinations = obj?.Records?.[0]?.ses?.mail?.destination;
    if (!destinations || !Array.isArray(destinations)) return [];
    return destinations.map((email) => email.split('@')[0]);
  })
  receptor: string[];
}
