export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  material?: string;
  size?: string;
  color?: string;
  targetAudience?: string;
  images: string[];
  referenceImages?: string[];
  referenceLink?: string;
  saveToLibrary: boolean;
  createdAt: Date;
}

export interface GeneratedContent {
  productId: string;
  mainImage: string;
  title: string;
  sellingPoints: string[];
  description?: string;
  status: 'pending' | 'generated' | 'failed';
  error?: string;
  createdAt: Date;
}

export interface LibraryItem {
  id: string;
  product: Product;
  generatedContent?: GeneratedContent;
  tags: string[];
  createdAt: Date;
}

export interface GenerateProgress {
  total: number;
  completed: number;
  failed: number;
  currentProductId?: string;
}

export type InputMode = 'form' | 'excel';
