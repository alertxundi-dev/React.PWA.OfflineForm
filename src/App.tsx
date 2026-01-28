import React, { useState } from 'react';
import FormComponent from './components/FormComponent';
import DataList from './components/DataList';
import StatusBar from './components/StatusBar';
import UpdateNotification from './components/UpdateNotification';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useServiceWorkerUpdate } from './hooks/useServiceWorkerUpdate';
import { Database } from 'lucide-react';
import './styles/App.css';

const App: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const { newVersionAvailable, updateInstalling, updateServiceWorker, dismissUpdate } = useServiceWorkerUpdate();

  const handleFormSaved = (): void => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="app">
      <UpdateNotification
        newVersionAvailable={newVersionAvailable}
        updateInstalling={updateInstalling}
        onUpdate={updateServiceWorker}
        onDismiss={dismissUpdate}
      />

      <StatusBar isOnline={isOnline} />

      <header className="app-header">
        <Database size={32} />
        <h1>PWA Offline Form</h1>
        <p>Aplicación con soporte offline y sincronización automática</p>
      </header>

      <main className="app-main">
        <section className="form-section">
          <h2>Nuevo Formulario</h2>
          <FormComponent
            isOnline={isOnline}
            onFormSaved={handleFormSaved}
          />
        </section>

        <section className="data-section">
          <DataList
            isOnline={isOnline}
            refreshTrigger={refreshTrigger}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>© 2026 PWA Offline Form - Desarrollado con React</p>
      </footer>
    </div>
  );
};

export default App;
