import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import * as fs from 'fs';
import { simpleParser } from 'mailparser';
import { EmailService } from './email.service';

jest.mock('fs');
jest.mock('axios');
jest.mock('mailparser');

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();
    service = module.get<EmailService>(EmailService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('parseEmail', () => {
    it('should parse email with JSON attachment', async () => {
      const mockJsonContent = {
        test: 'data',
        nested: { value: 123 },
      };

      const mockParsedEmail = {
        textAsHtml: {
          attachments: [
            {
              filename: 'data.json',
              content: Buffer.from(JSON.stringify(mockJsonContent)),
            },
          ],
        },
        html: '<p>Email body</p>',
      };

      (fs.readFileSync as jest.Mock).mockReturnValue(
        Buffer.from('email content'),
      );
      (simpleParser as jest.Mock).mockResolvedValue(mockParsedEmail);

      const result = await service.parseEmail('test.eml');

      expect(result).toEqual(mockJsonContent);
      expect(fs.readFileSync).toHaveBeenCalled();
      expect(simpleParser).toHaveBeenCalled();
    });

    it('should parse email from URL', async () => {
      const mockJsonContent = { data: 'from url' };
      const emailBuffer = Buffer.from('email content');

      const mockParsedEmail = {
        textAsHtml: {
          attachments: [
            {
              filename: 'data.json',
              content: Buffer.from(JSON.stringify(mockJsonContent)),
            },
          ],
        },
      };

      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: emailBuffer,
      });
      (simpleParser as jest.Mock).mockResolvedValue(mockParsedEmail);

      const result = await service.parseEmail('http://example.com/email.eml');

      expect(result).toEqual(mockJsonContent);
      expect(axios.get).toHaveBeenCalledWith('http://example.com/email.eml', {
        responseType: 'arraybuffer',
      });
    });

    it('should extract JSON from direct link in email body', async () => {
      const mockJsonContent = { source: 'direct link' };

      const mockParsedEmail = {
        html: '<a href="http://example.com/data.json">Link to JSON</a>',
        textAsHtml: { attachments: [] },
      };

      (fs.readFileSync as jest.Mock).mockReturnValue(
        Buffer.from('email content'),
      );
      (simpleParser as jest.Mock).mockResolvedValue(mockParsedEmail);
      (axios.get as jest.Mock).mockResolvedValueOnce({
        data: mockJsonContent,
      });

      const result = await service.parseEmail('test.eml');

      expect(result).toEqual(mockJsonContent);
      expect(axios.get).toHaveBeenCalledWith('http://example.com/data.json');
    });

    it('should extract JSON from nested link', async () => {
      const mockJsonContent = { source: 'nested link' };

      const mockParsedEmail = {
        html: '<a href="http://example.com/page">Link to page</a>',
        textAsHtml: { attachments: [] },
      };

      const mockWebPage =
        '<html><a href="http://example.com/data.json">JSON Link</a></html>';

      (fs.readFileSync as jest.Mock).mockReturnValue(
        Buffer.from('email content'),
      );
      (simpleParser as jest.Mock).mockResolvedValue(mockParsedEmail);
      (axios.get as jest.Mock)
        .mockResolvedValueOnce({ data: mockWebPage }) // First call for webpage
        .mockResolvedValueOnce({ data: mockJsonContent }); // Second call for JSON

      const result = await service.parseEmail('test.eml');

      expect(result).toEqual(mockJsonContent);
      expect(axios.get).toHaveBeenCalledTimes(2);
    });

    it('should throw BadRequestException when no JSON found', async () => {
      const mockParsedEmail = {
        html: '<p>No links here</p>',
        textAsHtml: { attachments: [] },
      };

      (fs.readFileSync as jest.Mock).mockReturnValue(
        Buffer.from('email content'),
      );
      (simpleParser as jest.Mock).mockResolvedValue(mockParsedEmail);

      await expect(service.parseEmail('test.eml')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.parseEmail('test.eml')).rejects.toThrow(
        'No JSON found in attachments or links',
      );
    });

    it('should throw BadRequestException on file read error', async () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      await expect(service.parseEmail('invalid.eml')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.parseEmail('invalid.eml')).rejects.toThrow(
        'Error parsing email: File not found',
      );
    });

    it('should throw BadRequestException on invalid URL', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(
        service.parseEmail('http://invalid-url.com/email.eml'),
      ).rejects.toThrow(BadRequestException);
    });
    it('should throw BadRequestException for non-.eml file extensions', async () => {
      await expect(service.parseEmail('test.txt')).rejects.toThrow(
        new BadRequestException(
          'Error parsing email: File must have .eml extension',
        ),
      );
      expect(fs.readFileSync).not.toHaveBeenCalled();
    });
  });
});
