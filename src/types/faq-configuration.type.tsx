export interface AddFaqForm {
  questionArabic: string;
  questionEnglish: string;
  descriptionArabic: string;
  descriptionEnglish: string;
  category: { value: number; label: string } | null;
  status: 'active' | 'inactive';
}

export interface FaqItem {
  id: number;
  question: string;
  questionLa: string;
  answer: string;
  answerLa: string;
  status: boolean;
  category: {
    id: number;
    name: string;
    nameLa: string;
  };
}
