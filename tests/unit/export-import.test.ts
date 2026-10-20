import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '../../src/core/database/db'
import { exampleRecordRepository } from '../../src/core/database/repositories/example-record.repository'
import { exportAllData } from '../../src/core/storage/export'
import { importData } from '../../src/core/storage/import'

describe('exportação e importação', () => {
  beforeEach(async () => {
    await db.exampleRecords.clear()
  })

  it('exporta dados com metadados', async () => {
    await exampleRecordRepository.create({ title: 'Registro', description: 'Desc' })

    const data = await exportAllData()

    expect(data.appName).toBe('PWA Starter Kit')
    expect(data.version).toBe('1')
    expect(data.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(data.records).toHaveLength(1)
  })

  it('ida e volta: exportar e importar recupera dados', async () => {
    await exampleRecordRepository.create({ title: 'A', description: 'Desc A' })
    await exampleRecordRepository.create({ title: 'B', description: 'Desc B' })

    const exported = await exportAllData()
    await db.exampleRecords.clear()

    const result = await importData(JSON.stringify(exported))

    expect(result.success).toBe(true)
    expect(result.imported).toBe(2)
    expect(result.skipped).toBe(0)

    const all = await exampleRecordRepository.getAll()
    expect(all).toHaveLength(2)
  })

  it('importação pula registros duplicados', async () => {
    const record = await exampleRecordRepository.create({ title: 'Dup', description: '' })

    const exported = await exportAllData()
    const result = await importData(JSON.stringify(exported))

    expect(result.success).toBe(true)
    expect(result.imported).toBe(0)
    expect(result.skipped).toBe(1)

    const count = await exampleRecordRepository.count()
    expect(count).toBe(1)
  })

  it('rejeita JSON inválido', async () => {
    const result = await importData('não é json')

    expect(result.success).toBe(false)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0]).toContain('JSON válido')
  })

  it('rejeita formato incompatível', async () => {
    const result = await importData(JSON.stringify({ foo: 'bar' }))

    expect(result.success).toBe(false)
    expect(result.errors[0]).toContain('formato')
  })

  it('rejeita registro com campos faltando', async () => {
    const badData = {
      appName: 'Test',
      version: '1',
      exportedAt: new Date().toISOString(),
      records: [{ id: '1', title: 'Faltam campos' }],
    }

    const result = await importData(JSON.stringify(badData))
    expect(result.success).toBe(false)
  })
})
