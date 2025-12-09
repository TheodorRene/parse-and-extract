import { PDFParse } from 'pdf-parse';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function readPdfFromBuffer(buffer: Buffer): Promise<string> {
  const data = new PDFParse({ data: buffer });
  const text = await data.getText();
  return text.text;
}

export function readHtmlFromBuffer(buffer: Buffer): string {
  const dom = new JSDOM(buffer.toString('utf-8'));
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  if (!article || !article.content) {
    throw new Error('Could not parse HTML document');
  } // TODO: Convert to Markdown as a cleanup step
  return article.content;
}
