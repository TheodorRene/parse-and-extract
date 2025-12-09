import {
  Controller,
  Get,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Get('html')
  getHtml(): string {
    return this.appService.getHtml();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    // Handle the uploaded file here
    this.logger.log(`Env: ${process.env.DATABASE_URL}`);
    this.logger.log(file, 'Uploaded File');
    await this.appService.handleUploadedFile(file);
    return `File ${file.originalname} uploaded successfully.`;
  }
}
