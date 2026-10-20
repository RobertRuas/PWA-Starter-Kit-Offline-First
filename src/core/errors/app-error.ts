export class AppError extends Error {
  readonly code: string;
  readonly recoverable: boolean;

  constructor(message: string, code: string, recoverable: boolean = true) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.recoverable = recoverable;
  }
}

export class StorageError extends AppError {
  constructor(message: string) {
    super(message, 'STORAGE_ERROR', true);
    this.name = 'StorageError';
  }
}

export class ValidationError extends AppError {
  readonly fields: Record<string, string[]>;

  constructor(message: string, fields: Record<string, string[]> = {}) {
    super(message, 'VALIDATION_ERROR', true);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class ImportError extends AppError {
  constructor(message: string) {
    super(message, 'IMPORT_ERROR', true);
    this.name = 'ImportError';
  }
}

export class SyncError extends AppError {
  readonly permanent: boolean;

  constructor(message: string, permanent: boolean = false) {
    super(message, 'SYNC_ERROR', !permanent);
    this.name = 'SyncError';
    this.permanent = permanent;
  }
}
