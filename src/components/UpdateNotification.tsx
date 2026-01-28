import React from 'react';
import { RefreshCw, X } from 'lucide-react';
import { UpdateNotificationProps } from '../types';

const UpdateNotification: React.FC<UpdateNotificationProps> = ({ 
  newVersionAvailable, 
  updateInstalling, 
  onUpdate, 
  onDismiss 
}) => {
  if (!newVersionAvailable) return null;

  return (
    <div className="update-notification">
      <div className="update-content">
        <RefreshCw className={`update-icon ${updateInstalling ? 'spinning' : ''}`} size={20} />
        <span className="update-text">
          {updateInstalling ? 'Instalando actualización...' : 'Nueva versión disponible'}
        </span>
        <div className="update-actions">
          {!updateInstalling && (
            <button 
              onClick={onUpdate}
              className="update-btn primary"
            >
              Actualizar
            </button>
          )}
          <button 
            onClick={onDismiss}
            className="update-btn secondary"
            disabled={updateInstalling}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateNotification;
