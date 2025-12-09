import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OpenAIService } from './openai.service';
import { readHtmlFromBuffer, readPdfFromBuffer } from './utils/parsefile';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private openai: OpenAIService,
  ) {}
  private readonly logger = new Logger(AppService.name);

  async getText(): Promise<string> {
    const document = await this.prisma.document.findUnique({
      where: { id: 1 },
    });
    return document?.content || 'No document found';
  }

  private async parse(buffer: Buffer, mimetype: string): Promise<string> {
    if (mimetype === 'application/pdf') {
      return await readPdfFromBuffer(buffer);
    } else if (mimetype === 'text/html') {
      return readHtmlFromBuffer(buffer);
    } else {
      throw new Error(`Unsupported file type: ${mimetype}`);
    }
  }

  async handleUploadedFile(file: Express.Multer.File): Promise<void> {
    this.logger.log(
      `Handling uploaded file: ${file.originalname} with mimetype: ${file.mimetype}`,
    );
    const content = await this.parse(file.buffer, file.mimetype);
    const document = await this.openai.generateMetadata(content);

    // We dont need to await these individually, they are all not dependent on each other
    // TODO: do in parallel
    await this.prisma.document.create({
      data: {
        title: document.title,
        content,
        type: file.mimetype,
      },
    });
    // TODO: add relation between document and case
    const createCase = await this.prisma.case.create({
      data: {
        // you could spread, but i prefer explicitness here
        title: document.title,
        decisionType: document.decisionType,
        dateOfDecision: document.dateOfDecision,
        office: document.office,
        court: document.court,
        caseNumber: document.caseNumber,
        summary: document.summary,
      },
    });

    this.logger.log('Created document:');
    this.logger.log('Created case:', createCase);
  }
}
