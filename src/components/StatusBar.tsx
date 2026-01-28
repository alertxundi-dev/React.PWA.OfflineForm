import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { StatusBarProps } from '../types';
import '../styles/StatusBar.css';

const StatusBar: React.FC<StatusBarProps> = ({ isOnline }) => {
  return (
    <div className={`status-bar ${isOnline ? 'online' : 'offline'}`}>
      {isOnline ? (
        <>
          <Wifi size={20} />
          <span>Conectado</span>
        </>
      ) : (
        <>
          <WifiOff size={20} />
          <span>Sin conexión - Modo offline</span>
        </>
      )}
    </div>
  );
};

export default StatusBar;
