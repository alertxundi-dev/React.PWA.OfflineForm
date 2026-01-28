import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esCommon from './locales/es/common.json';
import esForm from './locales/es/form.json';
import enCommon from './locales/en/common.json';
import enForm from './locales/en/form.json';
import ptCommon from './locales/pt/common.json';
import ptForm from './locales/pt/form.json';

const resources = {
  es: {
    common: esCommon,
    form: esForm
  },
  en: {
    common: enCommon,
    form: enForm
  },
  pt: {
    common: ptCommon,
    form: ptForm
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'es',
    fallbackLng: 'es',
    defaultNS: 'common',
    ns: ['common', 'form'],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
