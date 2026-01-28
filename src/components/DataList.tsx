import React, { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { getAllFormData, deleteFormData, getUnsyncedData, markAsSynced } from '../services/indexedDB';
import { syncPendingData } from '../services/apiService';
import { StoredFormData, SyncProgress, DataListProps } from '../types';
import '../styles/DataList.css';

const DataList: React.FC<DataListProps> = ({ isOnline, refreshTrigger }) => {
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
    if (window.confirm('¿Estás seguro de que quieres eliminar este registro?')) {
      await deleteFormData(id);
      loadData();
    }
  };

  const handleSync = async (): Promise<void> => {
    if (!isOnline) {
      alert('No hay conexión a internet. Por favor, conéctate para sincronizar.');
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
      alert(`Sincronización completada: ${successCount}/${results.length} registros enviados exitosamente.`);

      loadData();
    } catch (error) {
      alert(`Error durante la sincronización: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSyncing(false);
      setSyncProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="data-list-container">
      <div className="data-list-header">
        <h2>Datos locales almacenados</h2>
        {unsyncedCount > 0 && (
          <button
            onClick={handleSync}
            className="sync-button"
            disabled={!isOnline || isSyncing}
          >
            <RefreshCw size={18} className={isSyncing ? 'spinning' : ''} />
            {isSyncing
              ? `Sincronizando ${syncProgress.current}/${syncProgress.total}...`
              : `Sincronizar (${unsyncedCount})`
            }
          </button>
        )}
      </div>

      {data.length === 0 ? (
        <p className="no-data">No hay datos almacenados</p>
      ) : (
        <div className="data-grid">
          {data.map((item) => (
            <div key={item.id} className={`data-card ${item.synced ? 'synced' : 'unsynced'}`}>
              <div className="card-header">
                <div className="sync-status">
                  {item.synced ? (
                    <>
                      <CheckCircle size={16} className="icon-synced" />
                      <span>Sincronizado</span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="icon-pending" />
                      <span>Pendiente</span>
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
                <p><strong>Nombre:</strong> {item.nombre}</p>
                <p><strong>Apellido:</strong> {item.apellido}</p>
                <p><strong>Email:</strong> {item.email}</p>
                <p><strong>Categoría:</strong> {item.categoria}</p>
                <p><strong>Mensaje:</strong> {item.mensaje}</p>
                <p className="timestamp">
                  <strong>Fecha:</strong> {new Date(item.timestamp).toLocaleString('es-ES')}
                </p>
                {item.syncedAt && (
                  <p className="timestamp">
                    <strong>Sincronizado:</strong> {new Date(item.syncedAt).toLocaleString('es-ES')}
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
