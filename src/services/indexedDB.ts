import { openDB, IDBPDatabase } from 'idb';
import { FormData, StoredFormData } from '../types';

const DB_NAME = 'FormDataDB';
const STORE_NAME = 'formSubmissions';
const DB_VERSION = 1;

interface FormDataDB {
  formSubmissions: {
    key: number;
    value: StoredFormData;
    indexes: { synced: boolean; timestamp: string };
  };
}

export const initDB = async (): Promise<IDBPDatabase<FormDataDB>> => {
  return openDB<FormDataDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true
        });
        store.createIndex('synced', 'synced', { unique: false });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    },
  });
};

export const saveFormData = async (formData: FormData): Promise<number> => {
  const db = await initDB();
  const dataToSave: Omit<StoredFormData, 'id'> = {
    ...formData,
    synced: false,
    timestamp: new Date().toISOString()
  };
  const id = await db.add(STORE_NAME, dataToSave as StoredFormData);
  return id as number;
};

export const getAllFormData = async (): Promise<StoredFormData[]> => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const getUnsyncedData = async (): Promise<StoredFormData[]> => {
  const db = await initDB();
  const allData = await db.getAll(STORE_NAME);
  return allData.filter(item => !item.synced);
};

export const markAsSynced = async (id: number): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const record = await store.get(id);
  if (record) {
    record.synced = true;
    record.syncedAt = new Date().toISOString();
    await store.put(record);
  }
  await tx.done;
};

export const deleteFormData = async (id: number): Promise<void> => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};

export const clearAllData = async (): Promise<void> => {
  const db = await initDB();
  return db.clear(STORE_NAME);
};
