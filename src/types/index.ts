export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SearchParams {
  query?: string;
  category?: string;
  type?: string;
  severity?: string;
}

export interface CreatePestData {
  name: string;
  scientificName?: string;
  description: string;
  type: string;
  commonNames?: string[];
  images?: string[];
  symptoms?: string[];
  lifecycle?: string;
  habitat?: string;
  distribution?: string[];
  severity?: string;
}

export interface CreateDiseaseData {
  name: string;
  scientificName?: string;
  description: string;
  type: string;
  commonNames?: string[];
  images?: string[];
  symptoms?: string[];
  causes?: string[];
  transmission?: string[];
  severity?: string;
}

export interface CreateCropData {
  name: string;
  scientificName?: string;
  description?: string;
  category: string;
  commonNames?: string[];
  images?: string[];
  growingSeasons?: string[];
  varieties?: string[];
}

export interface CreateLivestockData {
  name: string;
  scientificName?: string;
  description?: string;
  category: string;
  commonNames?: string[];
  images?: string[];
  breeds?: string[];
}

export interface CreateControlMeasureData {
  name: string;
  description: string;
  method: string;
  instructions?: string[];
  materials?: string[];
  dosage?: string;
  frequency?: string;
  precautions?: string[];
  effectiveness?: number;
  cost?: string;
  environmentalImpact?: string;
}

export interface CreateDocumentData {
  title: string;
  description?: string;
  type: string;
  fileUrl?: string;
  downloadUrl?: string;
  author?: string;
  publisher?: string;
  publishDate?: Date;
  tags?: string[];
  keywords?: string[];
  language?: string;
  fileSize?: number;
  pageCount?: number;
  isPublic?: boolean;
}

export interface CreateFAQData {
  question: string;
  answer: string;
  category?: string;
  tags?: string[];
  order?: number;
}

export interface CreateContactSubmissionData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
