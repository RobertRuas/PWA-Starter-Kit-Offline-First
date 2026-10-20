import { describe, it, expect } from 'vitest';
import { appConfig } from '../../src/app/config/app.config';

describe('export metadata', () => {
  it('deve ter configuração de app válida para exportação', () => {
    expect(appConfig.name).toBeTruthy();
    expect(appConfig.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('deve ter versão de schema definida', () => {
    expect(appConfig.schemaVersion).toBeGreaterThan(0);
  });
});
