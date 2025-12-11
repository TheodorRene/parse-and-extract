// this is the service that interacts with OpenAI's API
import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod.js';
import { CaseMetadata, CaseSchema } from './dtos';

@Injectable()
export class OpenAIService {
  private readonly logger = new Logger(OpenAIService.name);
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  async generateMetadata(stringData: string): Promise<CaseMetadata> {
    this.logger.log('Generating metadata from buffer and schema');
    const response = await this.openai.responses.parse({
      model: 'gpt-5.1', // TODO make this configurable
      // TODO: move into a separate prompt template file
      input:
        'Extract case metadata from the following legal document using the supplied schema:\n\n' +
        stringData +
        'Here is some more info about what each field means:\n\n' +
        'title: The title of the case\n' +
        'decisionType: The type of decision (e.g., judgment, order)\n' +
        'dateOfDecision: The date when the decision was made. Format as YYYY-MM-DD\n' +
        'office: The office or chamber that issued the decision\n' +
        'court: The court where the case was heard\n' +
        'caseNumber: The official case number\n' +
        'summary: A brief summary of the case and its conclusion\n\n',
      text: {
        format: zodTextFormat(CaseSchema, 'case_metadata'),
      },
    });
    if (!response.output_parsed) {
      throw new Error('Failed to parse response from OpenAI');
    }
    this.logger.log('Received response from OpenAI for metadata generation');
    return response.output_parsed;
  }
}
