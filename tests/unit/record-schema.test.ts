import { describe, it, expect } from 'vitest'
import { recordFormSchema } from '../../src/features/example-records/schemas/record.schema'

describe('recordFormSchema', () => {
  it('valida dados corretos', () => {
    const result = recordFormSchema.safeParse({
      title: 'Teste',
      description: 'Uma descrição',
    })
    expect(result.success).toBe(true)
  })

  it('rejeita título vazio', () => {
    const result = recordFormSchema.safeParse({
      title: '',
      description: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita título maior que 100 caracteres', () => {
    const result = recordFormSchema.safeParse({
      title: 'a'.repeat(101),
      description: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejeita descrição maior que 500 caracteres', () => {
    const result = recordFormSchema.safeParse({
      title: 'Título válido',
      description: 'x'.repeat(501),
    })
    expect(result.success).toBe(false)
  })

  it('aceita descrição vazia', () => {
    const result = recordFormSchema.safeParse({
      title: 'Título válido',
      description: '',
    })
    expect(result.success).toBe(true)
  })
})
