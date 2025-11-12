import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import { simpleParser } from 'mailparser';
import path from 'path';

@Injectable()
export class EmailService {
  async parseEmail(source: string): Promise<any> {
    try {
      let emailBuffer: Buffer;

      if (source.startsWith('http')) {
        const response = await axios.get(source, {
          responseType: 'arraybuffer',
        });
        emailBuffer = Buffer.from(response.data);
      } else {
        const filePath = path.resolve(source);
        emailBuffer = fs.readFileSync(filePath);
      }

      const parsed = await simpleParser(emailBuffer);
      const attachment = parsed?.textAsHtml.attachments?.find((att) =>
        att.filename?.endsWith('.json'),
      );

      if (attachment) {
        return JSON.parse(attachment.content.toString('utf-8'));
      }

      const body = parsed.html || parsed.textAsHtml || '';
      const $ = cheerio.load(body);
      const links = $('a')
        .map((_, el) => $(el).attr('href'))
        .get()
        .filter((x) => !!x);

      for (const link of links) {
        if (link.endsWith('.json')) {
          const { data } = await axios.get(link);
          return data;
        }

        const page = await axios.get(link);
        const $$ = cheerio.load(page.data);
        const jsonLink = $$('a[href$=".json"]').attr('href');
        if (jsonLink) {
          const { data } = await axios.get(jsonLink);
          return data;
        }
      }

      throw new BadRequestException('No JSON found in attachments or links');
    } catch (error) {
      throw new BadRequestException(`Error parsing email: ${error.message}`);
    }
  }
}
