export interface PlayerKPI {
  cognition: number;
  technical: number;
  physical: number;
  psychology: number;
  medical: number;
  skillVideoUrl: string;
}

export type PerformanceLevel = "diamond" | "gold" | "silver";

export interface PlayerCard {
  id: string;
  fullNameEn: string;
  fullNameAr: string;
  sport: string;
  playerNumber: string;
  position: string;
  country: string;
  countryCode: string;
  performance: PerformanceLevel;
  photoUrl: string | null;
  birthYear?: string;
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
