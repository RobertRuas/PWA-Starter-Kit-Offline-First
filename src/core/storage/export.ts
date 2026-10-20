import { appConfig } from '../../app/config/app.config';
import { db } from '../database/db';
import { logger } from '../logging/logger';

export interface ExportMetadata {
  appName: string;
  appVersion: string;
  exportVersion: string;
  exportDate: string;
  tables: Record<string, number>;
}

export interface ExportData {
  metadata: ExportMetadata;
  data: Record<string, unknown[]>;
}

export async function exportAllData(): Promise<ExportData> {
  const tables: Record<string, number> = {};
  const data: Record<string, unknown[]> = {};

  const exampleRecords = await db.exampleRecords.toArray();
  tables['exampleRecords'] = exampleRecords.length;
  data['exampleRecords'] = exampleRecords;

  const metadata: ExportMetadata = {
    appName: appConfig.name,
    appVersion: appConfig.version,
    exportVersion: '1.0',
    exportDate: new Date().toISOString(),
    tables,
  };

  logger.info('Dados exportados com sucesso', tables);
  return { metadata, data };
}

export function downloadExport(exportData: ExportData): void {
  const json = JSON.stringify(exportData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${appConfig.shortName.toLowerCase()}-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
