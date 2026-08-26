/**
 * TypeScript types for CMS Documentation System
 * Used by admin documentation dashboard and HTML guide
 */

export interface EditableContent {
  name: string;
  line: string;
  description?: string;
}

export interface ImageInfo {
  folder: string;
  files: string[];
  requirements?: {
    dimensions?: string;
    format?: string[];
    maxSize?: string;
  };
}

export interface IconInfo {
  source: string;
  used: string[];
}

export interface CardStructure {
  component?: string;
  dataFile?: string;
  fields?: string[];
}

export type SectionStatus = 'CMS Enabled' | 'Local Files Only' | 'Database-Driven';

export interface SectionDocumentation {
  id: string;
  name: string;
  status: SectionStatus;
  filePath: string;
  lineNumbers: string;
  editableContent: EditableContent[];
  images?: ImageInfo;
  icons?: IconInfo;
  cmsPath?: string;
  cmsEnabled: boolean;
  description: string;
  cardStructure?: CardStructure;
  database?: {
    collection?: string;
    model?: string;
  };
  apiEndpoint?: string;
}

export interface PageDocumentation {
  id: string;
  name: string;
  path: string;
  sections: SectionDocumentation[];
  description: string;
}

export interface ServicePageDocumentation extends PageDocumentation {
  slug: string;
  features: string[];
}
