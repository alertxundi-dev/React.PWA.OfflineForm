import React from 'react';
import { useTranslation } from 'react-i18next';
import { Wifi, WifiOff } from 'lucide-react';
import { StatusBarProps } from '../types';
import '../styles/StatusBar.css';

const StatusBar: React.FC<StatusBarProps> = ({ isOnline }) => {
  const { t } = useTranslation('common');

  return (
    <div className={`status-bar ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? (
        <>
          <Wifi size={20} />
          <span>{t('status.online')}</span>
        </>
      ) : (
        <>
          <WifiOff size={20} />
          <span>{t('status.offline')}</span>
        </>
      )}
    </div>
  );
};

export default StatusBar;
