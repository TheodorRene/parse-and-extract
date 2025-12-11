import z from 'zod';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const CaseSchema = z.object({
  title: z.string(),
  decisionType: z.string(),
  dateOfDecision: z.string(),
  office: z.string(),
  court: z.string(),
  caseNumber: z.string(),
  summary: z.string(),
});
export type CaseMetadata = z.infer<typeof CaseSchema>;

// these unfortunately have to be in sync since NestJS doesnt support Zod directly
export class CaseMetadataQueryDto {
  @ApiPropertyOptional()
  title?: string;

  @ApiPropertyOptional()
  decisionType?: string;

  @ApiPropertyOptional()
  dateOfDecision?: string;

  @ApiPropertyOptional()
  office?: string;

  @ApiPropertyOptional()
  court?: string;

  @ApiPropertyOptional()
  caseNumber?: string;

  @ApiPropertyOptional()
  summary?: string;
}
