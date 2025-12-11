import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { OpenAIService } from './openai.service';
import { readHtmlFromBuffer, readPdfFromBuffer } from './utils/parsefile';
import { Optional } from './app.controller';
import { CaseMetadata } from './dtos';

@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private openai: OpenAIService,
  ) {}
  private readonly logger = new Logger(AppService.name);

  private async parse(buffer: Buffer, mimetype: string): Promise<string> {
    if (mimetype === 'application/pdf') {
      return await readPdfFromBuffer(buffer);
    } else if (mimetype === 'text/html') {
      return readHtmlFromBuffer(buffer);
    } else {
      throw new Error(`Unsupported file type: ${mimetype}`);
    }
  }
  async getDocuments(filter: Optional<CaseMetadata>): Promise<string[]> {
    this.logger.log(
      'Fetching documents with filter parameters: ' + JSON.stringify(filter),
    );
    const x = await this.prisma.case.findMany({
      where: { ...filter },
    });
    if (x.length === 0) {
      this.logger.log('No documents found matching filter');
    }
    return x.map((c) => String(c.documentId));
  }

  async handleUploadedFile(file: Express.Multer.File): Promise<void> {
    this.logger.log(
      `Handling uploaded file: ${file.originalname} with mimetype: ${file.mimetype}`,
    );
    const content = await this.parse(file.buffer, file.mimetype);
    const document = await this.openai.generateMetadata(content);

    // We dont need to await these individually, they are all not dependent on each other
    // TODO: do in parallel
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
        document: {
          create: {
            title: document.title,
            content,
            /** We are currently storing the text content of the document
             * we should rather store the file in a blob storage and save the link here
             */
            type: file.mimetype,
          },
        },
      },
    });

    this.logger.log('Created document:');
    this.logger.log('Created case:', createCase);
  }
}
