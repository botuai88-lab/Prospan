export enum DocumentType {
  CLINICAL_STUDY = 'Nghiên cứu lâm sàng',
  MARKETING = 'Tài liệu Marketing',
  LEGAL = 'Pháp lý/Quy định',
  GUIDELINE = 'Hướng dẫn sử dụng',
  OTHER = 'Khác'
}

export interface ExtractedMetadata {
  title: string;
  publicationDate?: string;
  ingredients?: string[];
  mechanism?: string;
  indications?: string[];
  contraindications?: string[];
  population?: string;
  dosage?: string;
  results?: string[];
  source?: string;
  summary: string;
}

export interface ProspanDocument {
  id: string;
  fileName: string;
  type: DocumentType;
  uploadDate: string;
  content: string; // The full raw text
  metadata: ExtractedMetadata;
  status: 'processing' | 'ready' | 'error';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  citations?: string[]; // IDs of documents cited
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  LIBRARY = 'LIBRARY',
  SEARCH = 'SEARCH',
  DOCUMENT_DETAIL = 'DOCUMENT_DETAIL'
}