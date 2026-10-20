import { z } from 'zod/v4'

export const recordFormSchema = z.object({
  title: z
    .string()
    .min(1, 'O título é obrigatório')
    .max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'A descrição deve ter no máximo 500 caracteres')
    .default(''),
})

export type RecordFormData = z.infer<typeof recordFormSchema>
