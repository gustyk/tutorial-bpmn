import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Frontmatter schema untuk halaman modul (/jalur/NN)
const moduleSchema = z.object({
  caseId: z.string().optional(),
  module: z.number().int().positive().optional(),
  spine: z.boolean().optional(),
  introduces: z.array(z.string()).optional(),
  reuses: z.array(z.string()).optional(),
  negativeReuse: z.array(z.string()).optional(),
  prevModule: z.number().int().positive().optional(),
  estMinutes: z.number().int().positive().optional(),
});

// Frontmatter schema untuk halaman notasi (/notasi/<slug>)
const notationSchema = z.object({
  notationId: z.string().regex(/^[PCFAGRDE][0-9]{2}$/).optional(),
  tier: z.enum(['A', 'B', 'C']).optional(),
  introducedIn: z.string().nullable().optional(),
  confusedWith: z.array(z.string()).optional(),
});

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({
      extend: moduleSchema.merge(notationSchema),
    }),
  }),
};
