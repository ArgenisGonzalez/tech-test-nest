import { Test, TestingModule } from '@nestjs/testing';
import { SesEventDto } from './dto/ses-event.dto';
import { MappingService } from './mapping.service';

describe('MappingService', () => {
  let service: MappingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MappingService],
    }).compile();

    service = module.get<MappingService>(MappingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('transform', () => {
    it('should transform SES event to output DTO correctly', () => {
      const input: SesEventDto = {
        Records: [
          {
            eventVersion: '1.0',
            eventSource: 'aws:ses',
            ses: {
              receipt: {
                timestamp: '2015-09-11T20:32:33.936Z',
                processingTimeMillis: 500,
                recipients: ['recipient@example.com'],
                spamVerdict: { status: 'PASS' },
                virusVerdict: { status: 'PASS' },
                spfVerdict: { status: 'PASS' },
                dkimVerdict: { status: 'PASS' },
                dmarcVerdict: { status: 'PASS' },
                dmarcPolicy: 'reject',
                action: {
                  type: 'SNS',
                  topicArn: 'arn:aws:sns:us-east-1:012345678912:example-topic',
                },
              },
              mail: {
                timestamp: '2015-09-11T20:32:33.936Z',
                source: 'sender@example.com',
                messageId: 'd6iitobk75ur44p8kdnnp7g2n800',
                destination: ['recipient@example.com', 'recipient2@test.com'],
                headersTruncated: false,
                headers: [],
                commonHeaders: {
                  returnPath: '0000@amazonses.com',
                  from: ['sender@example.com'],
                  date: 'Fri, 11 Sep 2015 20:32:32 +0000',
                  to: ['recipient@example.com'],
                  cc: ['cc@example.com'],
                  messageId: '<61967230@example.com>',
                  subject: 'Example subject',
                },
              },
            },
          },
        ],
      };

      const result = service.transform(input);

      expect(result).toBeDefined();
      expect(result.spam).toBe(true);
      expect(result.virus).toBe(true);
      expect(result.dns).toBe(true);
      expect(result.mes).toBe('septiembre');
      expect(result.retrasado).toBe(false);
      expect(result.emisor).toBe('sender');
      expect(result.receptor).toEqual(['recipient', 'recipient2']);
    });

    it('should handle processing time > 1000ms correctly', () => {
      const input: SesEventDto = {
        Records: [
          {
            eventVersion: '1.0',
            eventSource: 'aws:ses',
            ses: {
              receipt: {
                timestamp: '2015-03-15T10:00:00.000Z',
                processingTimeMillis: 1500,
                recipients: ['test@example.com'],
                spamVerdict: { status: 'FAIL' },
                virusVerdict: { status: 'FAIL' },
                spfVerdict: { status: 'FAIL' },
                dkimVerdict: { status: 'PASS' },
                dmarcVerdict: { status: 'PASS' },
                dmarcPolicy: 'none',
                action: {
                  type: 'SNS',
                  topicArn: 'arn:aws:sns:us-east-1:012345678912:example-topic',
                },
              },
              mail: {
                timestamp: '2015-03-15T10:00:00.000Z',
                source: 'test@domain.com',
                messageId: 'test123',
                destination: ['user@example.com'],
                headersTruncated: false,
                headers: [],
                commonHeaders: {
                  returnPath: 'test@amazonses.com',
                  from: ['test@domain.com'],
                  date: 'Sun, 15 Mar 2015 10:00:00 +0000',
                  to: ['user@example.com'],
                  cc: [],
                  messageId: '<test@example.com>',
                  subject: 'Test',
                },
              },
            },
          },
        ],
      };

      const result = service.transform(input);

      expect(result.spam).toBe(false);
      expect(result.virus).toBe(false);
      expect(result.dns).toBe(false);
      expect(result.mes).toBe('marzo');
      expect(result.retrasado).toBe(true);
      expect(result.emisor).toBe('test');
      expect(result.receptor).toEqual(['user']);
    });

    it('should handle missing or invalid data gracefully', () => {
      const input: any = {
        Records: [
          {
            eventVersion: '1.0',
            eventSource: 'aws:ses',
            ses: {
              receipt: {
                processingTimeMillis: null,
                spamVerdict: {},
                virusVerdict: {},
                spfVerdict: {},
                dkimVerdict: {},
                dmarcVerdict: {},
              },
              mail: {
                timestamp: null,
                source: null,
                destination: null,
              },
            },
          },
        ],
      };

      const result = service.transform(input);

      expect(result).toBeDefined();
      expect(result.spam).toBe(false);
      expect(result.virus).toBe(false);
      expect(result.dns).toBe(false);
      expect(result.mes).toBe('desconocido');
      expect(result.retrasado).toBe(false);
      expect(result.emisor).toBe('desconocido');
      expect(result.receptor).toEqual([]);
    });
  });
});
