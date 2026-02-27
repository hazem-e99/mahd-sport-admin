 


export interface UserSurvey {
  id: string;
  name: string;
  nameLa?: string;
  startDate?: string | null;
  endDate?: string | null;
  status?: 'Active' | 'Draft' | 'Closed';
}

export interface QuestionForm {
  id?: number;
  cid?: string;
  name: string;
  nameLa?: string;
  type: 'Text' | 'Rating' | 'Dropdown' | 'Multiple';
  choices?: string[];
  scaleMin?: number;
  scaleMax?: number;
  length?: number;
}

export interface SurveyFormData {
  name: string;
  nameLa?: string;
  description?: string;
  descriptionLa?: string;
  startDate: Date | null;
  endDate: Date | null;
  mode: 'Anonymous' | 'User-Identified';
  access: 'Public' | 'Restricted';
  allowedRoleIds: number[];
  allowExport: boolean;
  questions: QuestionForm[];
  visibility?: number;
}

 
export const QUESTION_TYPE_MAP = {
  Text: 0,
  Multiple: 1,
  Dropdown: 2,
  Rating: 3,
} as const;

export const REVERSE_QUESTION_TYPE_MAP = {
  0: 'Text',
  1: 'Multiple',
  2: 'Dropdown',
  3: 'Rating',
} as const;

export interface CreateSurveyPayload {
  name: string;
  nameLa?: string;
  description?: string;
  descriptionLa?: string;
  startDate: string | null;
  endDate: string | null;
  mode: number; // 0 Anonymous, 1 User-Identified
  allowExport: boolean;
  questions: Array<{
    name: string;
    nameLa?: string;
    type: number;       
    choices: string[];  
    length?: number;   // فقط مع Text
  }>;
  allowedRoleIds: number[];
  visibility: number; // 0 Restricted, 1 Public
}

export interface UpdateSurveyPayloadBody extends Omit<CreateSurveyPayload, 'questions'> {
  questions: Array<{
    id: number;
    name: string;
    nameLa?: string;
    type: number;
    choices: string[];
    length?: number;
  }>;
}

const toTypeCode = (t: QuestionForm['type']): number =>
  QUESTION_TYPE_MAP[t as keyof typeof QUESTION_TYPE_MAP];

const isoOrNull = (d: Date | null): string | null =>
  d instanceof Date ? d.toISOString() : null;

 
const mapChoices = (q: QuestionForm): string[] => {
  if (q.type === 'Dropdown' || q.type === 'Multiple') {
    const cleaned = (q.choices ?? []).map(c => (c ?? '').trim()).filter(Boolean);
    return cleaned.length > 0 ? cleaned : ['Option 1'];
  }
  if (q.type === 'Rating') {
    const min = Number.isFinite(q.scaleMin) ? Number(q.scaleMin) : 1;
    const max = Number.isFinite(q.scaleMax) ? Number(q.scaleMax) : min;
    if (min >= max) return [String(min)];
    return Array.from({ length: (max - min + 1) }, (_, i) => String(min + i));
  }
  // Text
  return [];
};

export function toCreatePayload(form: SurveyFormData): CreateSurveyPayload {
  return {
    name: form.name,
    nameLa: form.nameLa || '',
    description: form.description || '',
    descriptionLa: form.descriptionLa || '',
    startDate: isoOrNull(form.startDate),
    endDate: isoOrNull(form.endDate),
    mode: form.mode === 'Anonymous' ? 0 : 1,
    allowExport: form.allowExport,
    questions: form.questions.map(q => ({
      name: q.name,
      nameLa: q.nameLa || '',
      type: toTypeCode(q.type),
      choices: mapChoices(q),
      ...(q.type === 'Text' && q.length ? { length: q.length } : {}),
    })),
    allowedRoleIds: form.access === 'Restricted' ? (form.allowedRoleIds || []) : [],
    visibility: form.access === 'Restricted' ? 0 : 1,
  };
}

export function toUpdatePayload(form: SurveyFormData): UpdateSurveyPayloadBody {
  return {
    name: form.name,
    nameLa: form.nameLa || '',
    description: form.description || '',
    descriptionLa: form.descriptionLa || '',
    startDate: isoOrNull(form.startDate),
    endDate: isoOrNull(form.endDate),
    mode: form.mode === 'Anonymous' ? 0 : 1,
    allowExport: form.allowExport,
    questions: form.questions.map(q => ({
      id: q.id ?? 0,
      name: q.name,
      nameLa: q.nameLa || '',
      type: toTypeCode(q.type),
      choices: mapChoices(q),
      ...(q.type === 'Text' && q.length ? { length: q.length } : {}),
    })),
    allowedRoleIds: form.access === 'Restricted' ? (form.allowedRoleIds || []) : [],
    visibility: form.access === 'Restricted' ? 0 : 1,
  };
}