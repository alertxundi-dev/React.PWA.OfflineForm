import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormComponent from './components/FormComponent';
import DataList from './components/DataList';
import StatusBar from './components/StatusBar';
import UpdateNotification from './components/UpdateNotification';
import LanguageSelector from './components/LanguageSelector';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useServiceWorkerUpdate } from './hooks/useServiceWorkerUpdate';
import { Database } from 'lucide-react';
import './styles/App.css';

const App: React.FC = () => {
  const { t } = useTranslation('common');
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
        <LanguageSelector />
        <Database size={32} />
        <h1>{t('app.title')}</h1>
        <p>{t('app.description')}</p>
      </header>

      <main className="app-main">
        <section className="form-section">
          <h2>{t('sections.newForm')}</h2>
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
        <p>{t('app.footer')}</p>
      </footer>
    </div>
  );
};

export default App;
