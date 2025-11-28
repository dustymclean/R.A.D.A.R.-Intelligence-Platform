export enum RadarStage {
  RETRIEVE = 0,
  ANALYZE = 1,
  DOCUMENT = 2,
  ADVISE = 3,
  REPORT = 4,
}

export interface RetrievalData {
  content: string;
  source: string;
  timestamp: string;
  classification: 'UNCLASSIFIED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
}

export interface AnalysisResult {
  riskScore: number; // 0-100
  summary: string;
  keywords: string[];
  detectedEntities: string[];
  complianceTags: string[]; // e.g., "NIST-800-53", "GDPR"
}

export interface DocumentationRecord {
  id: string;
  hash: string;
  timestamp: string;
  author: string;
  structuredData: AnalysisResult & RetrievalData;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  frameworkReference?: string;
}

export interface RadarState {
  currentStage: RadarStage;
  retrieval: RetrievalData;
  analysis: AnalysisResult | null;
  documentation: DocumentationRecord | null;
  advice: Recommendation[];
  isProcessing: boolean;
  error: string | null;
}
