import { describe, it, expect, beforeEach } from 'vitest'
import { db } from '../../src/core/database/db'
import { syncQueue } from '../../src/core/sync/queue'

describe('syncQueue', () => {
  beforeEach(async () => {
    await db.syncQueue.clear()
  })

  it('adiciona item à fila', async () => {
    await syncQueue.add({
      entityType: 'record',
      entityId: 'abc-123',
      operation: 'create',
      payload: '{}',
      createdAt: new Date().toISOString(),
    })

    const count = await syncQueue.pendingCount()
    expect(count).toBe(1)
  })

  it('lista itens pendentes', async () => {
    await syncQueue.add({
      entityType: 'record',
      entityId: '1',
      operation: 'create',
      payload: '{}',
      createdAt: new Date().toISOString(),
    })

    const pending = await syncQueue.getPending()
    expect(pending).toHaveLength(1)
    expect(pending[0].status).toBe('pending')
    expect(pending[0].attemptCount).toBe(0)
  })

  it('marca item como concluído', async () => {
    await syncQueue.add({
      entityType: 'record',
      entityId: '1',
      operation: 'update',
      payload: '{}',
      createdAt: new Date().toISOString(),
    })

    const pending = await syncQueue.getPending()
    await syncQueue.markCompleted(pending[0].id!)

    const remaining = await syncQueue.pendingCount()
    expect(remaining).toBe(0)
  })

  it('marca item como falho com backoff exponencial', async () => {
    await syncQueue.add({
      entityType: 'record',
      entityId: '1',
      operation: 'delete',
      payload: '{}',
      createdAt: new Date().toISOString(),
    })

    const pending = await syncQueue.getPending()
    await syncQueue.markFailed(pending[0].id!, 'Erro de rede')

    const item = await db.syncQueue.get(pending[0].id!)
    expect(item?.attemptCount).toBe(1)
    expect(item?.lastError).toBe('Erro de rede')
    expect(item?.nextAttemptAt).toBeDefined()
    expect(item?.status).toBe('pending')
  })

  it('marca como falha permanente após 10 tentativas', async () => {
    await syncQueue.add({
      entityType: 'record',
      entityId: '1',
      operation: 'create',
      payload: '{}',
      createdAt: new Date().toISOString(),
    })

    const pending = await syncQueue.getPending()
    const id = pending[0].id!

    for (let i = 0; i < 10; i++) {
      await syncQueue.markFailed(id, `Tentativa ${i + 1}`)
    }

    const item = await db.syncQueue.get(id)
    expect(item?.status).toBe('failed')
    expect(item?.attemptCount).toBe(10)
  })

  it('limpa toda a fila', async () => {
    await syncQueue.add({
      entityType: 'record',
      entityId: '1',
      operation: 'create',
      payload: '{}',
      createdAt: new Date().toISOString(),
    })
    await syncQueue.add({
      entityType: 'record',
      entityId: '2',
      operation: 'update',
      payload: '{}',
      createdAt: new Date().toISOString(),
    })

    await syncQueue.clear()
    const count = await syncQueue.pendingCount()
    expect(count).toBe(0)
  })
})
