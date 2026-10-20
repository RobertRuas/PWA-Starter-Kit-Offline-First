import { describe, it, expect, beforeEach } from 'vitest'
import { exampleRecordRepository } from '../../src/core/database/repositories/example-record.repository'
import { db } from '../../src/core/database/db'

describe('exampleRecordRepository', () => {
  beforeEach(async () => {
    await db.exampleRecords.clear()
  })

  it('cria um registro com ID e timestamps', async () => {
    const record = await exampleRecordRepository.create({
      title: 'Teste',
      description: 'Descrição',
    })

    expect(record.id).toBeDefined()
    expect(record.title).toBe('Teste')
    expect(record.description).toBe('Descrição')
    expect(record.status).toBe('active')
    expect(record.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(record.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('busca registro por ID', async () => {
    const created = await exampleRecordRepository.create({
      title: 'Busca',
      description: '',
    })

    const found = await exampleRecordRepository.getById(created.id!)
    expect(found?.title).toBe('Busca')
  })

  it('retorna undefined para ID inexistente', async () => {
    const found = await exampleRecordRepository.getById('inexistente')
    expect(found).toBeUndefined()
  })

  it('lista todos os registros', async () => {
    await exampleRecordRepository.create({ title: 'A', description: '' })
    await exampleRecordRepository.create({ title: 'B', description: '' })

    const all = await exampleRecordRepository.getAll()
    expect(all).toHaveLength(2)
  })

  it('atualiza título e atualiza updatedAt', async () => {
    const record = await exampleRecordRepository.create({
      title: 'Original',
      description: '',
    })

    await new Promise((r) => setTimeout(r, 10))
    await exampleRecordRepository.update(record.id!, { title: 'Modificado' })

    const updated = await exampleRecordRepository.getById(record.id!)
    expect(updated?.title).toBe('Modificado')
    expect(updated?.updatedAt).not.toBe(record.updatedAt)
  })

  it('remove registro', async () => {
    const record = await exampleRecordRepository.create({
      title: 'Remover',
      description: '',
    })

    await exampleRecordRepository.remove(record.id!)
    const found = await exampleRecordRepository.getById(record.id!)
    expect(found).toBeUndefined()
  })

  it('filtra por status', async () => {
    const r = await exampleRecordRepository.create({
      title: 'Ativo',
      description: '',
    })
    await exampleRecordRepository.update(r.id!, { status: 'archived' })

    await exampleRecordRepository.create({
      title: 'Outro ativo',
      description: '',
    })

    const active = await exampleRecordRepository.getByStatus('active')
    expect(active).toHaveLength(1)
    expect(active[0].title).toBe('Outro ativo')
  })

  it('conta registros', async () => {
    await exampleRecordRepository.create({ title: 'Um', description: '' })
    await exampleRecordRepository.create({ title: 'Dois', description: '' })

    const count = await exampleRecordRepository.count()
    expect(count).toBe(2)
  })

  it('limpa todos os registros', async () => {
    await exampleRecordRepository.create({ title: 'X', description: '' })
    await exampleRecordRepository.clear()

    const count = await exampleRecordRepository.count()
    expect(count).toBe(0)
  })
})
