/**
 * Thin wrapper around the File System Access API plus a tiny IndexedDB
 * key-value store for persisting the user's `FileSystemFileHandle` between
 * sessions. When the browser lacks File System Access, callers are expected
 * to fall back to a regular download/upload flow.
 */

const IDB_NAME = 'budget-fs';
const IDB_STORE = 'handles';
const IDB_KEY = 'budgetDbHandle';

export function isFsAccessSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'showSaveFilePicker' in window &&
    'showOpenFilePicker' in window
  );
}

export async function pickOpenHandle(): Promise<FileSystemFileHandle> {
  const [handle] = await window.showOpenFilePicker({
    types: [
      {
        description: 'Budget database',
        accept: { 'application/x-sqlite3': ['.db', '.sqlite'] }
      }
    ],
    excludeAcceptAllOption: false
  });
  return handle;
}

export async function pickSaveHandle(suggestedName = 'budget.db'): Promise<FileSystemFileHandle> {
  return window.showSaveFilePicker({
    suggestedName,
    types: [
      {
        description: 'Budget database',
        accept: { 'application/x-sqlite3': ['.db'] }
      }
    ]
  });
}

export async function readHandle(handle: FileSystemFileHandle): Promise<Uint8Array> {
  const file = await handle.getFile();
  const buf = await file.arrayBuffer();
  return new Uint8Array(buf);
}

export async function writeHandle(handle: FileSystemFileHandle, bytes: Uint8Array): Promise<void> {
  await ensurePermission(handle, 'readwrite');
  const writable = await handle.createWritable();
  await writable.write(bytes as unknown as BufferSource);
  await writable.close();
}

export async function ensurePermission(
  handle: FileSystemFileHandle,
  mode: 'read' | 'readwrite'
): Promise<boolean> {
  // `queryPermission`/`requestPermission` are not universally typed.
  const h = handle as FileSystemFileHandle & {
    queryPermission?: (o: { mode: 'read' | 'readwrite' }) => Promise<PermissionState>;
    requestPermission?: (o: { mode: 'read' | 'readwrite' }) => Promise<PermissionState>;
  };
  if (!h.queryPermission || !h.requestPermission) return true;
  const current = await h.queryPermission({ mode });
  if (current === 'granted') return true;
  const requested = await h.requestPermission({ mode });
  return requested === 'granted';
}

// --- Handle persistence via IndexedDB ---

function openIdb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function storeHandle(handle: FileSystemFileHandle): Promise<void> {
  const db = await openIdb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(handle, IDB_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function loadStoredHandle(): Promise<FileSystemFileHandle | null> {
  const db = await openIdb();
  const handle = await new Promise<FileSystemFileHandle | null>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
    req.onsuccess = () => resolve((req.result as FileSystemFileHandle | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return handle;
}

export async function clearStoredHandle(): Promise<void> {
  const db = await openIdb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).delete(IDB_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}
