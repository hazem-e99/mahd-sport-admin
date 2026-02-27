import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import type { LanguageContextType } from '@/types/language-context.type';
import i18n from '../i18n';
import type { LocalizationItem } from '@/api/services/localization.service';
import { useTranslation } from 'react-i18next';

export const LanguageContext = createContext<LanguageContextType>({
    language: 'en',
    changeLanguage: () => { },
    getValue: () => '',
});

export const LanguageProvider = ({ children, localizations }: {
    children: React.ReactNode;
    localizations: LocalizationItem[];
}) => {
    const params = useParams<{ lng: string }>();
    const location = useLocation();
    const navigate = useNavigate();

    const { t } = useTranslation()
    const [language, setLanguage] = useState(() => {
        // Initialize from URL params, localStorage, or default to 'en'
        const urlLang = params.lng;
        const storedLang = localStorage.getItem('language');
        const initialLang = urlLang || storedLang || 'en';
        return ['ar', 'en'].includes(initialLang) ? initialLang : 'en';
    });

    const changeLanguage = useCallback((lng: string) => {
        if (lng === language) return; // Prevent unnecessary updates

        // Update i18n first
        i18n.changeLanguage(lng);
        setLanguage(lng);
        localStorage.setItem('language', lng);

        // Update URL to reflect language change
        const currentPath = location.pathname;
        const pathSegments = currentPath.split('/');

        // Replace the language segment (first non-empty segment) with new language
        if (pathSegments.length > 1 && ['ar', 'en'].includes(pathSegments[1])) {
            pathSegments[1] = lng;
        } else {
            // If no language in URL, add it
            pathSegments.splice(1, 0, lng);
        }

        const newPath = pathSegments.join('/');
        navigate(newPath, { replace: true });

        // Update document properties
        document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lng;
    }, [language, location.pathname, navigate]);

    // Set initial document direction and language on mount
    useEffect(() => {
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
        i18n.changeLanguage(language);
        localStorage.setItem('language', language);
    }, []); // Run only on mount

    // Detect language from URL parameter
    useEffect(() => {
        const urlLanguage = params.lng;
        if (urlLanguage && ['ar', 'en'].includes(urlLanguage) && urlLanguage !== language) {
            // Only update state and document properties, don't navigate
            setLanguage(urlLanguage);
            localStorage.setItem('language', urlLanguage);
            document.documentElement.dir = urlLanguage === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = urlLanguage;

            // Sync i18n without triggering events
            if (i18n.language !== urlLanguage) {
                i18n.changeLanguage(urlLanguage);
            }
        }
    }, [params.lng, language]);

    const getValue = useCallback((key: string, params?: Record<string, string>) => {
        const localization = Array.isArray(localizations) ? localizations.find(item => item.key === key) : null;
        const apiValue = localization?.value;
        return (apiValue && apiValue !== "") ? apiValue : (t(key, params) || key);
    }, [localizations, t]);

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, getValue }}>
            {children}
        </LanguageContext.Provider>
    );
};


export const useLanguage = () => {
    const { language, changeLanguage, getValue } = useContext(LanguageContext);
    return { language, changeLanguage, getValue };
};
