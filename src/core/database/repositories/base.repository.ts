import type { EntityTable } from 'dexie';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export class BaseRepository<T extends BaseEntity> {
  protected table: EntityTable<T, 'id'>;

  constructor(table: EntityTable<T, 'id'>) {
    this.table = table;
  }

  async getAll(): Promise<T[]> {
    return this.table.toArray();
  }

  async getById(id: string): Promise<T | undefined> {
    // Dexie's IDType generic requires explicit cast for string keys
    return this.table.get(id as never);
  }

  async create(entity: T): Promise<string> {
    return this.table.add(entity) as Promise<string>;
  }

  async update(id: string, changes: Partial<T>): Promise<number> {
    return this.table.update(
      id as never,
      { ...changes, updatedAt: new Date().toISOString() } as never,
    );
  }

  async remove(id: string): Promise<void> {
    return this.table.delete(id as never);
  }

  async count(): Promise<number> {
    return this.table.count();
  }

  async clear(): Promise<void> {
    return this.table.clear();
  }

  async bulkCreate(entities: T[]): Promise<void> {
    await this.table.bulkAdd(entities);
  }
}
