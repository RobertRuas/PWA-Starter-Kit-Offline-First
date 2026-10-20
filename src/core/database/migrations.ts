import { db } from './db';

export async function checkDatabaseHealth(): Promise<{
  isOpen: boolean;
  version: number;
  tables: string[];
}> {
  try {
    await db.open();
    return {
      isOpen: db.isOpen(),
      version: db.verno,
      tables: db.tables.map((t) => t.name),
    };
  } catch {
    return {
      isOpen: false,
      version: 0,
      tables: [],
    };
  }
}
