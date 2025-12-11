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
  async generateMetadata(document: string): Promise<CaseMetadata> {
    this.logger.log('Generating metadata from buffer and schema');
    const response = await this.openai.responses.parse({
      model: 'gpt-5.1', // TODO make this configurable
      // TODO: move into a separate prompt template file
      input: prompt(document),
      text: {
        format: zodTextFormat(CaseSchema, 'case_metadata'),
      },
    });
    if (!response.output_parsed) {
      throw new Error('Failed to parse response from OpenAI');
    }
    this.logger.log('Received response from OpenAI for metadata generation');
    return response.output_parsed;

    /** Prompt template for extracting case metadata
     * Here you can of course iterate and iterate to get better results
     * You could make it more specific to each type of document or source
     * I've tried to keep it general enough to work across a variety of legal documents
     * */
    function prompt(document: string): string {
      return `
Extract case metadata from the following legal document using the supplied schema.

Here is some more info about what each field means:

title: The title of the case  
decisionType: The type of decision (e.g., judgment, order)  
dateOfDecision: The date when the decision was made. Format as YYYY-MM-DD  
office: The office or chamber that issued the decision  
court: The name of the court OR administrative tribunal/board/authority that issued the decision  
caseNumber: The official case number  
summary: A brief summary of the case and its conclusion

${document}
  `.trim();
    }
  }
}
