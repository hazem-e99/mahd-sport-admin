export interface LanguageContextType {
    language: string;
    changeLanguage: (lng: string) => void;
    getValue: (key: string, params?: Record<string, string>) => string;
}