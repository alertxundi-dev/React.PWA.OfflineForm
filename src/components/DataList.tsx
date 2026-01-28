import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { getAllFormData, deleteFormData, getUnsyncedData, markAsSynced } from '../services/indexedDB';
import { syncPendingData } from '../services/apiService';
import { StoredFormData, SyncProgress, DataListProps } from '../types';
import '../styles/DataList.css';

const DataList: React.FC<DataListProps> = ({ isOnline, refreshTrigger }) => {
  const { t } = useTranslation(['common', 'form']);
  const [data, setData] = useState<StoredFormData[]>([]);
  const [unsyncedCount, setUnsyncedCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgress>({ current: 0, total: 0 });

  const loadData = async (): Promise<void> => {
    const allData = await getAllFormData();
    setData(allData);
    const unsynced = allData.filter(item => !item.synced);
    setUnsyncedCount(unsynced.length);
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm(t('common:messages.deleteConfirm'))) {
      await deleteFormData(id);
      loadData();
    }
  };

  const handleSync = async (): Promise<void> => {
    if (!isOnline) {
      alert(t('common:messages.noConnection'));
      return;
    }

    setIsSyncing(true);
    setSyncProgress({ current: 0, total: unsyncedCount });

    try {
      const unsyncedData = await getUnsyncedData();

      const results = await syncPendingData(
        unsyncedData,
        (current, total) => {
          setSyncProgress({ current, total });
        }
      );

      for (const result of results) {
        if (result.success) {
          await markAsSynced(result.id);
        }
      }

      const successCount = results.filter(r => r.success).length;
      alert(t('common:messages.syncComplete', { success: successCount, total: results.length }));

      loadData();
    } catch (error) {
      alert(t('common:messages.syncError', { error: error instanceof Error ? error.message : 'Unknown error' }));
    } finally {
      setIsSyncing(false);
      setSyncProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="data-list-container">
      <div className="data-list-header">
        <h2>{t('common:sections.storedData')}</h2>
        {unsyncedCount > 0 && (
          <button
            onClick={handleSync}
            className="sync-button"
            disabled={!isOnline || isSyncing}
          >
            <RefreshCw size={18} className={isSyncing ? 'spinning' : ''} />
            {isSyncing
              ? `${t('common:status.syncing')} ${syncProgress.current}/${syncProgress.total}`
              : `${t('common:buttons.sync')} (${unsyncedCount})`
            }
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <p className="no-data">{t('common:messages.noData')}</p>
      ) : (
        <div className="data-grid">
          {data.map((item) => (
            <div key={item.id} className={`data-card ${item.synced ? 'synced' : 'unsynced'}`}>
              <div className="card-header">
                <div className="sync-status">
                  {item.synced ? (
                    <>
                      <CheckCircle size={16} className="icon-synced" />
                      <span>{t('common:status.synced')}</span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="icon-pending" />
                      <span>{t('common:status.pending')}</span>
                    </>
                  )}
                </div>
                <button
                  onClick={() => item.id && handleDelete(item.id)}
                  className="delete-button"
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="card-content">
                <p><strong>{t('form:fields.name')}:</strong> {item.nombre}</p>
                <p><strong>{t('form:fields.lastName')}:</strong> {item.apellido}</p>
                <p><strong>{t('form:fields.email')}:</strong> {item.email}</p>
                <p><strong>{t('form:fields.category')}:</strong> {item.categoria}</p>
                <p><strong>{t('form:fields.message')}:</strong> {item.mensaje}</p>
                <p className="timestamp">
                  <strong>{t('form:fields.date')}:</strong> {new Date(item.timestamp).toLocaleString()}
                </p>
                {item.syncedAt && (
                  <p className="timestamp">
                    <strong>{t('form:fields.syncedAt')}:</strong> {new Date(item.syncedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataList;
