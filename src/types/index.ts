export interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  mensaje: string;
  categoria: 'general' | 'soporte' | 'ventas' | 'feedback';
}

export interface StoredFormData extends FormData {
  id?: number;
  synced: boolean;
  timestamp: string;
  syncedAt?: string;
}

export interface StatusMessage {
  type: 'success' | 'error' | 'warning' | 'info' | '';
  message: string;
}

export interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface SyncResult {
  id: number;
  success: boolean;
  data?: any;
  error?: string;
}

export interface SyncProgress {
  current: number;
  total: number;
}

export interface UpdateNotificationProps {
  newVersionAvailable: boolean;
  updateInstalling: boolean;
  onUpdate: () => void;
  onDismiss: () => void;
}

export interface StatusBarProps {
  isOnline: boolean;
}

export interface FormComponentProps {
  isOnline: boolean;
  onFormSaved?: () => void;
}

export interface DataListProps {
  isOnline: boolean;
  refreshTrigger: number;
}
