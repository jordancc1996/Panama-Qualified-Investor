import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const topicEnum = z.enum(['Routes', 'Costs', 'Tax', 'Process', 'Audiences', 'Market']);

const research = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
  schema: z
    .object({
      type: z.enum(['report', 'brief']),
      title: z.string(),
      metaTitle: z.string(),
      description: z.string(),
      slug: z.string(),
      topic: topicEnum,
      published: z.coerce.date(),
      updated: z.coerce.date().optional(),
      reviewedBy: z.string().optional(),
      pdf: z.string().optional(),
      keyFindings: z.array(z.string()).min(3).max(5).optional(),
      related: z.array(z.string()),
      draft: z.boolean().default(false),
    })
    .superRefine((data, ctx) => {
      if (data.type === 'report' && !data.pdf) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Reports require a pdf path',
          path: ['pdf'],
        });
      }
      if (data.type === 'brief' && data.pdf) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Briefs should not include a pdf path',
          path: ['pdf'],
        });
      }
    }),
});

export const collections = { research };
