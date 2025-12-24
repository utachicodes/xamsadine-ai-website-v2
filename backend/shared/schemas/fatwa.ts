// High-level TypeScript schema for fatwa-related API responses.
// Can be mirrored in FastAPI (Pydantic) for backend validation.

export type LanguageCode = "wo" | "fr" | "en";

export type FatwaStepType =
  | "clarification"
  | "hukm"
  | "evidence"
  | "explanation"
  | "advice";

export interface TextBlock {
  text: string;
  arabic?: string;
  language: LanguageCode;
}

export interface ReferenceQuran {
  surah: string;
  ayah: number;
  text_ar: string;
  text_tr: string;
}

export interface ReferenceHadith {
  collection: string;
  number: string;
  text_ar: string;
  text_tr: string;
}

export interface ReferenceMaliki {
  book: string;
  chapter: string;
  excerpt: string;
}

export interface ReferenceLocal {
  scholar: string;
  region: string;
  transcript: string;
}

export interface FatwaStep {
  type: FatwaStepType;
  content: TextBlock;
  references?: {
    quran?: ReferenceQuran[];
    hadith?: ReferenceHadith[];
    maliki?: ReferenceMaliki[];
    local?: ReferenceLocal[];
  };
}

export interface FatwaSession {
  id: string;
  language: LanguageCode;
  question: string;
  steps: FatwaStep[];
  createdAt: string;
}


