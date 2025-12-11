import {
  Controller,
  Get,
  Logger,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { CaseMetadataQueryDto } from './dtos';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  // TODO: Error handling for file uploads
  // TODO: Validate file types and sizes
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'A single file upload',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    // Handle the uploaded file here
    await this.appService.handleUploadedFile(file);
    return `File ${file.originalname} uploaded successfully.`;
  }

  //lets create a controller that fetches a specific document based on case metadata
  //lets allow any query parameters to be passed in and use them to filter the documents
  @Get('documents')
  async getDocuments(@Query() query: CaseMetadataQueryDto): Promise<string[]> {
    this.logger.log(
      'Fetching documents with query parameters: ' + JSON.stringify(query),
    );
    const documentIds = await this.appService.getDocuments(query);
    return documentIds;
  }
}
export type Optional<T> = {
  [K in keyof T]?: T[K];
};
