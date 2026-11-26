
export type OfficialValuation = {
  version: number;
  status: string | null;
  method: string | null;
  advanced: boolean;
  results: Record<string, unknown>;
  adoption: {
    analysisVersion: number;
    exportId: string;
    reason: string;
  } | null;
};

export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Unexpected database response');
  }
  return value as Record<string, unknown>;
}

export function safeId(value: unknown): string {
  const id = typeof value === 'number' && Number.isSafeInteger(value)
    ? String(value)
    : typeof value === 'string' ? value : '';

  if (!/^[1-9][0-9]{0,18}$/.test(id) ||
      (id.length === 19 && id > '9223372036854775807')) {
    throw new Error('Invalid or unsafe database identifier');
  }
  return id;
}

export function integer(value: unknown, minimum = 0): number {
  if (typeof value !== 'number' ||
      !Number.isSafeInteger(value) ||
      value < minimum ||
      value > 2147483647) {
    throw new Error('Invalid database version');
  }
  return value;
}

export function parseOfficial(value: unknown): OfficialValuation {
  const row = record(value);
  const version = integer(row['version']);
  const status = row['status'];

  if (status !== null && typeof status !== 'string') {
    throw new Error('Invalid official valuation status');
  }

  if (version === 0) {
    return {
      version, status, method: null,
      advanced: false, results: {}, adoption: null
    };
  }

  const method = row['method'];
  if (typeof method !== 'string' || !method.trim()) {
    throw new Error('Official valuation method missing');
  }

  const advanced = method.startsWith('P19 ');
  const raw = row['adoption'];

  if (advanced !== (raw !== null && raw !== undefined)) {
    throw new Error('Official valuation adoption is inconsistent');
  }

  const a = advanced ? record(raw) : null;

  if (a && typeof a['reason'] !== 'string') {
    throw new Error('Official adoption reason missing');
  }

  return {
    version, status, method, advanced,
    results: record(row['results']),
    adoption: a ? {
      analysisVersion: integer(a['analysis_version'], 1),
      exportId: safeId(a['export_id']),
      reason: String(a['reason'])
    } : null
  };
}

export function errorMessage(value: unknown): string {
  if (value && typeof value === 'object' && 'message' in value) {
    return String(value.message);
  }
  return 'Operation failed';
}

export function adoptionSelectionKey(
  officialVersion: number,
  analysisVersion: number,
  exportId: string
): string {
  return [
    integer(officialVersion),
    integer(analysisVersion, 1),
    safeId(exportId)
  ].join(':');
}
