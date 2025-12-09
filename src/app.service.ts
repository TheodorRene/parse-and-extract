import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

@Injectable()
export class AppService {
  getHello(): Promise<string> {
    return readPdf('testfiles/curia.pdf');
  }
  getHtml(): string {
    return readHtml('testfiles/mfkn.html');
  }
}

async function readPdf(path: string): Promise<string> {
  const buffer = fs.readFileSync(path);
  const data = new PDFParse({ data: buffer });
  const text = await data.getText();
  return text.text;
}

function readHtml(path: string): string {
  const buffer = fs.readFileSync(path, 'utf-8');
  const dom = new JSDOM(buffer);
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  if (!article || !article.content) {
    throw new Error('Could not parse HTML document');
  } // Maybe convert to markdown?
  return article.content;
}
