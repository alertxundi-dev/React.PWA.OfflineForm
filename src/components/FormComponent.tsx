import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';
import { saveFormData } from '../services/indexedDB';
import { sendFormDataToAPI } from '../services/apiService';
import { FormData, StatusMessage, FormComponentProps } from '../types';
import '../styles/FormComponent.css';

const FormComponent: React.FC<FormComponentProps> = ({ isOnline, onFormSaved }) => {
  const { t } = useTranslation('form');
  const categories = t('categories', { returnObjects: true }) as Array<{ value: string; label: string }>;

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    email: '',
    mensaje: '',
    categoria: 'general'
  });

  const [status, setStatus] = useState<StatusMessage>({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      if (isOnline) {
        const result = await sendFormDataToAPI(formData);

        if (result.success) {
          setStatus({
            type: 'success',
            message: t('submitMessages.success')
          });
          setFormData({ nombre: '', apellido: '', email: '', mensaje: '', categoria: 'general' });
        } else {
          await saveFormData(formData);
          setStatus({
            type: 'warning',
            message: t('submitMessages.errorSavedLocal')
          });
        }
      } else {
        await saveFormData(formData);
        setStatus({
          type: 'info',
          message: t('submitMessages.savedLocal')
        });
        setFormData({ nombre: '', apellido: '', email: '', mensaje: '', categoria: 'general' });
      }

      if (onFormSaved) {
        onFormSaved();
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="nombre">{t('fields.name')}</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder={t('placeholders.name')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">{t('fields.lastName')}</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            placeholder={t('placeholders.lastName')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">{t('fields.email')}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder={t('placeholders.email')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">{t('fields.category')}</label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">{t('fields.message')}</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
            placeholder={t('placeholders.message')}
            rows={5}
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          <Save size={20} />
          {isSubmitting ? t('messages.saving', { ns: 'common' }) : t('buttons.save', { ns: 'common' })}
        </button>
      </form>

      {status.message && (
        <div className={`status-message ${status.type}`}>
          {status.type === 'success' && <CheckCircle size={20} />}
          {status.type === 'error' && <AlertCircle size={20} />}
          {status.type === 'warning' && <AlertCircle size={20} />}
          {status.type === 'info' && <AlertCircle size={20} />}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
};

export default FormComponent;
