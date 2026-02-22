export interface LocalizedString {
  en: string;
  cn: string;
}

export interface LocalizedList {
  en: string[];
  cn: string[];
}

export interface KnowledgeItem {
  id: string;
  title: LocalizedString;
  type: string;
  jurisdiction: LocalizedString; // Added jurisdiction
  date: string;
  summary: LocalizedString;
  url: string;
}

export interface Party {
  name: string;
  type: 'Regulator' | 'Company' | 'Product' | 'Other';
}

export interface UpdateItem {
  id: string;
  date: string;
  title: LocalizedString;
  source: string;
  content: LocalizedString;
  analysis: LocalizedString;
  parties?: Party[];
  url?: string; // Added URL
}

export interface StatItem {
  label: LocalizedString;
  count: number;
  trend: 'up' | 'down' | 'stable';
}

export interface FocusArea {
  name: LocalizedString;
  summary: LocalizedString;
  citation?: string;
  relatedEvents?: {
    title: LocalizedString;
    url?: string;
  }[];
}

export interface RiskReport {
  lastUpdated: string;
  score: string;
  summary: LocalizedList; // Changed to list for 3 bullet points
  stats: {
    legislation: StatItem;
    enforcement: StatItem;
  };
  focusAreas: FocusArea[];
}
