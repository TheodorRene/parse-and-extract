import { Injectable, Logger } from '@nestjs/common';
import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(AppService.name);

  getHello(): Promise<string> {
    return readPdf('testfiles/curia.pdf');
  }
  getHtml(): string {
    return readHtml('testfiles/mfkn.html');
  }
  async getText(): Promise<string> {
    const document = await this.prisma.document.findUnique({
      where: { id: 1 },
    });
    return document?.content || 'No document found';
  }
  async handleUploadedFile(file: Express.Multer.File): Promise<void> {
    this.logger.log(
      `Handling uploaded file: ${file.originalname} with mimetype: ${file.mimetype}`,
    );
    const fileType =
      file.mimetype === 'application/pdf'
        ? 'pdf'
        : file.mimetype === 'text/html'
          ? 'html'
          : 'unknown';

    let content = '';
    if (fileType === 'pdf') {
      content = await readPdfFromBuffer(file.buffer);
    } else if (fileType === 'html') {
      content = readHtmlFromBuffer(file.buffer);
    } else {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    const createDocument = await this.prisma.document.create({
      data: {
        title: file.originalname,
        content,
        type: fileType,
      },
    });
    this.logger.log('Created document:', createDocument);
  }
}
async function readPdfFromBuffer(buffer: Buffer): Promise<string> {
  const data = new PDFParse({ data: buffer });
  const text = await data.getText();
  return text.text;
}

async function readPdf(path: string): Promise<string> {
  const buffer = fs.readFileSync(path);
  const data = new PDFParse({ data: buffer });
  const text = await data.getText();
  return text.text;
}

function readHtmlFromBuffer(buffer: Buffer): string {
  const dom = new JSDOM(buffer.toString('utf-8'));
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  if (!article || !article.content) {
    throw new Error('Could not parse HTML document');
  } // Maybe convert to markdown?
  return article.content;
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
