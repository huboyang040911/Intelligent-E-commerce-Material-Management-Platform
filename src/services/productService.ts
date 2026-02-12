import type { Product, LibraryItem } from '../types';

const PRODUCTS_KEY = 'product_content_generator_products';
const LIBRARY_KEY = 'product_content_generator_library';

export const productService = {
  saveProducts: (products: Product[]): void => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save products:', error);
    }
  },

  getProducts: (): Product[] => {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get products:', error);
      return [];
    }
  },

  clearProducts: (): void => {
    localStorage.removeItem(PRODUCTS_KEY);
  },

  createProduct: (productData: Partial<Product>): Product => {
    return {
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: productData.name || '',
      category: productData.category || '',
      brand: productData.brand || '',
      material: productData.material || '',
      size: productData.size || '',
      color: productData.color || '',
      targetAudience: productData.targetAudience || '',
      images: productData.images || [],
      referenceImages: productData.referenceImages || [],
      referenceLink: productData.referenceLink || '',
      saveToLibrary: productData.saveToLibrary || false,
      createdAt: new Date(),
    };
  },

  validateProduct: (product: Partial<Product>): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!product.name || product.name.trim() === '') {
      errors.push('商品名称不能为空');
    }
    if (!product.category || product.category.trim() === '') {
      errors.push('类目不能为空');
    }
    if (!product.brand || product.brand.trim() === '') {
      errors.push('品牌不能为空');
    }
    if (!product.images || product.images.length === 0) {
      errors.push('请至少上传一张商品图片');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};

export const libraryService = {
  saveToLibrary: (item: LibraryItem): void => {
    try {
      const library = libraryService.getLibrary();
      library.push(item);
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
    } catch (error) {
      console.error('Failed to save to library:', error);
    }
  },

  getLibrary: (): LibraryItem[] => {
    try {
      const data = localStorage.getItem(LIBRARY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get library:', error);
      return [];
    }
  },

  deleteFromLibrary: (id: string): void => {
    try {
      const library = libraryService.getLibrary();
      const filtered = library.filter(item => item.id !== id);
      localStorage.setItem(LIBRARY_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete from library:', error);
    }
  },

  clearLibrary: (): void => {
    localStorage.removeItem(LIBRARY_KEY);
  },

  createLibraryItem: (product: Product, generatedContent?: any, tags: string[] = []): LibraryItem => {
    return {
      id: `library_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      product,
      generatedContent,
      tags,
      createdAt: new Date(),
    };
  },
};
