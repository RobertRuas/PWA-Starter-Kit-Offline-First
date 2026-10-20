import { describe, it, expect } from 'vitest';
import { appConfig } from '../../src/app/config/app.config';
import { isFeatureEnabled } from '../../src/app/config/feature-flags';

describe('appConfig', () => {
  it('deve ter nome e versão definidos', () => {
    expect(appConfig.name).toBeTruthy();
    expect(appConfig.version).toBeTruthy();
  });

  it('deve ter cores do tema definidas', () => {
    expect(appConfig.theme.primary).toMatch(/^#/);
    expect(appConfig.theme.accent).toMatch(/^#/);
  });

  it('deve ter feature flags booleanas', () => {
    expect(typeof appConfig.features.localDatabase).toBe('boolean');
    expect(typeof appConfig.features.sync).toBe('boolean');
  });
});

describe('isFeatureEnabled', () => {
  it('deve retornar true para localDatabase', () => {
    expect(isFeatureEnabled('localDatabase')).toBe(true);
  });

  it('deve retornar false para sync', () => {
    expect(isFeatureEnabled('sync')).toBe(false);
  });
});
