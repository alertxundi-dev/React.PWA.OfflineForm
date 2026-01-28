import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Save, CheckCircle, AlertCircle } from 'lucide-react';
import { saveFormData } from '../services/indexedDB';
import { sendFormDataToAPI } from '../services/apiService';
import { FormData, StatusMessage, FormComponentProps } from '../types';
import '../styles/FormComponent.css';

const FormComponent: React.FC<FormComponentProps> = ({ isOnline, onFormSaved }) => {
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
            message: '¡Datos enviados a la API exitosamente!'
          });
          setFormData({ nombre: '', apellido: '', email: '', mensaje: '', categoria: 'general' });
        } else {
          await saveFormData(formData);
          setStatus({
            type: 'warning',
            message: 'Error al enviar a la API. Datos guardados localmente para sincronizar después.'
          });
        }
      } else {
        await saveFormData(formData);
        setStatus({
          type: 'info',
          message: 'Sin conexión. Datos guardados localmente. Se sincronizarán cuando vuelvas a estar online.'
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
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Tu nombre"
          />
        </div>

        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            placeholder="Tu apellido"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="tu@email.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="categoria">Categoría</label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
          >
            <option value="general">General</option>
            <option value="soporte">Soporte</option>
            <option value="ventas">Ventas</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
            placeholder="Escribe tu mensaje aquí..."
            rows={5}
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting}
        >
          <Save size={20} />
          {isSubmitting ? 'Guardando...' : 'Guardar'}
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
