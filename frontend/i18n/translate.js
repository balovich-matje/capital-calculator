import { dictionaries } from './dictionaries.js';

const STORAGE_KEY = 'capital-calculator-language';

export const getInitialLanguage = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && dictionaries[saved]) {
        return saved;
    }

    const browserLanguage = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return dictionaries[browserLanguage] ? browserLanguage : 'en';
};

export const setLanguage = (lang) => {
    if (!dictionaries[lang]) {
        return;
    }

    localStorage.setItem(STORAGE_KEY, lang);
};

export const t = (lang, key) => {
    return dictionaries[lang]?.[key] || dictionaries.en[key] || key;
};

export const getLocale = (lang) => {
    const locales = {
        en: 'en-US',
        de: 'de-DE',
        ru: 'ru-RU'
    };

    return locales[lang] || 'en-US';
};
