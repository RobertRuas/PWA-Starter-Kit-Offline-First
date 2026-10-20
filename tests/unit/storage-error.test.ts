import { describe, it, expect } from 'vitest'
import {
  StorageError,
  isQuotaExceededError,
  handleStorageError,
} from '../../src/core/errors/storage-error'

describe('StorageError', () => {
  it('identifica QuotaExceededError', () => {
    const error = new DOMException('Quota exceeded', 'QuotaExceededError')
    expect(isQuotaExceededError(error)).toBe(true)
  })

  it('não identifica erros comuns como QuotaExceeded', () => {
    expect(isQuotaExceededError(new Error('Qualquer erro'))).toBe(false)
    expect(isQuotaExceededError(null)).toBe(false)
    expect(isQuotaExceededError('string')).toBe(false)
  })

  it('handleStorageError retorna StorageError para quota', () => {
    const error = new DOMException('Quota exceeded', 'QuotaExceededError')
    const result = handleStorageError(error, 'create')

    expect(result).toBeInstanceOf(StorageError)
    expect(result.message).toContain('insuficiente')
    expect(result.operation).toBe('create')
  })

  it('handleStorageError retorna StorageError para erros genéricos', () => {
    const error = new Error('Falha genérica')
    const result = handleStorageError(error, 'update')

    expect(result).toBeInstanceOf(StorageError)
    expect(result.message).toBe('Falha genérica')
    expect(result.operation).toBe('update')
  })
})
