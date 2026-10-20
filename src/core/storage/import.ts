import { z } from 'zod';
import { db } from '../database/db';
import { exampleRecordSchema } from '../../features/example-records/schemas/example-record.schema';
import { ImportError } from '../errors/app-error';
import { logger } from '../logging/logger';
import type { ExportData } from './export';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const exportMetadataSchema = z.object({
  appName: z.string(),
  appVersion: z.string(),
  exportVersion: z.string(),
  exportDate: z.string(),
  tables: z.record(z.string(), z.number()),
});

const exportDataSchema = z.object({
  metadata: exportMetadataSchema,
  data: z.record(z.string(), z.array(z.unknown())),
});

export interface ImportResult {
  imported: number;
  rejected: number;
  duplicated: number;
  errors: string[];
}

export async function validateImportFile(file: File): Promise<ExportData> {
  if (file.size > MAX_FILE_SIZE) {
    throw new ImportError(`Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  if (!file.name.endsWith('.json')) {
    throw new ImportError('Formato de arquivo não suportado. Use um arquivo .json');
  }

  let content: string;
  try {
    content = await file.text();
  } catch {
    throw new ImportError('Não foi possível ler o arquivo');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new ImportError('O arquivo não contém JSON válido');
  }

  const result = exportDataSchema.safeParse(parsed);
  if (!result.success) {
    throw new ImportError('Estrutura do arquivo de exportação inválida');
  }

  return result.data as ExportData;
}

export async function importData(
  exportData: ExportData,
  mode: 'merge' | 'replace',
): Promise<ImportResult> {
  const result: ImportResult = {
    imported: 0,
    rejected: 0,
    duplicated: 0,
    errors: [],
  };

  if (mode === 'replace') {
    await db.exampleRecords.clear();
  }

  const records = exportData.data['exampleRecords'] ?? [];
  for (const raw of records) {
    const validation = exampleRecordSchema.safeParse(raw);
    if (!validation.success) {
      result.rejected++;
      result.errors.push(`Registro inválido: ${validation.error.issues[0]?.message}`);
      continue;
    }

    const record = validation.data;
    const existing = await db.exampleRecords.get(record.id);
    if (existing && mode === 'merge') {
      result.duplicated++;
      continue;
    }

    try {
      await db.exampleRecords.put(record);
      result.imported++;
    } catch {
      result.rejected++;
      result.errors.push(`Falha ao importar registro ${record.id}`);
    }
  }

  logger.info('Importação concluída', result);
  return result;
}
