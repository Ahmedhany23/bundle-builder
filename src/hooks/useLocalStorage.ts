const STORAGE_KEY = "bundle-builder-state";
const STORAGE_VERSION = 1;

type StoragePayload<T> = {
  version: number;
  data: T;
};

export function loadFromStorage<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as StoragePayload<T>;

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      parsed.version !== STORAGE_VERSION
    ) {
      clearStorage();
      return fallback;
    }

    return parsed.data;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(value: T): void {
  try {
    const payload: StoragePayload<T> = {
      version: STORAGE_VERSION,
      data: value,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // storage full or unavailable — fail silently
  }
}

export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // no-op
  }
}
