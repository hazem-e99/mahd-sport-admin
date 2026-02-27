export interface TourStep {
  id: number;
  titleLa: string;
  title: string;
  messageLa: string;
  message: string;
}

export interface TourStepCreatePayload {
  titleLa: string;
  title: string;
  messageLa: string;
  message: string;
}

export interface TourStepUpdatePayload extends TourStepCreatePayload {
  id: number;
}

export interface TourStepDeletePayload {
  id: number;
}

export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string | null;
  errors?: unknown[];
}