
export interface Category {
  value: number;
  label: string;
}

export interface Type {
  value: number;
  label: string;
}

export interface Site {
  value: number;
  label: string;
  violationCount?: number;
  latitude?: number;
  longitude?: number;
}

export interface Zone {
  value: number;
  label: string;
}

export interface CommonContextType {
  categories: Category[];
  types: Type[];
  sites: Site[];
  zones: Zone[];
  isLoading: boolean;
  error: Error | null;
}