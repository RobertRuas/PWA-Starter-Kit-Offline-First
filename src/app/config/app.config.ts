export const appConfig = {
  name: 'PWA Starter Kit',
  shortName: 'PWA Kit',
  description: 'Aplicação mobile-first com suporte offline',
  version: '1.0.0',
  schemaVersion: 1,
  theme: {
    primary: '#24527A',
    accent: '#26736B',
    success: '#2E7D32',
    warning: '#F57C00',
    danger: '#C62828',
  },
  features: {
    localDatabase: true,
    dataExport: true,
    attachments: false,
    audioRecording: false,
    sync: false,
    authentication: false,
  },
} as const;

export type AppConfig = typeof appConfig;
