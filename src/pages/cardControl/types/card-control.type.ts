export interface PlayerKPI {
  cognition: number;
  technical: number;
  physical: number;
  psychology: number;
  medical: number;
  skillVideoUrl: string;
}

export interface Nationality {
  Id: number;
  NameAr: string;
  NameEn: string;
  Code: string;
  Image: string;
}

export type PerformanceLevel = "diamond" | "gold" | "silver";

export interface PlayerCard {
  id: string;
  fullNameEn: string;
  fullNameAr: string;
  sport: string;
  playerNumber: string;
  position: string;
  nationality: Nationality | null;
  performance: PerformanceLevel;
  photoUrl: string | null;
  birthYear?: string;
  birthDate?: string;
  location?: string;
  status: boolean;
  orderIndex: number;
  kpi: PlayerKPI;
}

export interface CardControlFilters {
  pageNumber: number;
  pageSize: number;
  search?: string;
  filterBy?: string;
  department?: string;
}
