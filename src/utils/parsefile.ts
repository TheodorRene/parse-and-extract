import { PDFParse } from 'pdf-parse';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const data = new PDFParse({ data: buffer });
  const text = await data.getText();
  return text.text;
}

// This was at first a general implementation but as we assume that we are be going to consume more documents
// from the same source we should add some custom cleaning
export function extractTextFromHtml(buffer: Buffer): string {
  const dom = new JSDOM(buffer.toString('utf-8'));

  // Lets get the div with id "sidebar" and keep that data as well
  const sidebar = dom.window.document.getElementById('sidebar');

  // lets extract all text content from the sidebar elements and its children, this is a special naevneneshus
  // and can of course be conditional based on the source of the document
  const sidebarText = sidebar?.textContent || '';

  // Extract the main article content using Readability
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  if (!article || !article.content) {
    throw new Error('Could not parse HTML document');
  } // TODO: Convert to Markdown as a cleanup step
  return sidebarText + '\n' + article.textContent;
}
