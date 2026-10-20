import { z } from 'zod';

export const exampleRecordSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  description: z.string().max(2000, 'Descrição deve ter no máximo 2000 caracteres').default(''),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const exampleRecordFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(200, 'Título deve ter no máximo 200 caracteres'),
  description: z.string().max(2000, 'Descrição deve ter no máximo 2000 caracteres').default(''),
});

export type ExampleRecordFormData = z.infer<typeof exampleRecordFormSchema>;
