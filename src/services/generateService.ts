import type { Product, GeneratedContent, GenerateProgress } from '../types';
import { generateTitle, generateSellingPoints } from '../utils/textGenerator';
import { copywritingService, type CopywritingStyle } from './copywritingService';
import { siliconFlowService } from './siliconFlowService';

export const generateService = {
  generateSingle: async (product: Product, copywritingStyle?: CopywritingStyle): Promise<GeneratedContent> => {
    try {
      console.log('Generating content for product:', product.name);
      console.log('Using image:', product.images[0]);
      console.log('Using copywriting style:', copywritingStyle);
      
      // 检查必要的字段
      if (!product.name) {
        throw new Error('商品名称不能为空');
      }
      
      if (!product.images || product.images.length === 0) {
        throw new Error('商品图片不能为空');
      }
      
      const title = await generateTitle(product);
      console.log('Generated title:', title);
      
      const sellingPoints = await generateSellingPoints(product);
      console.log('Generated selling points:', sellingPoints);
      
      let description: string;
      if (copywritingStyle) {
        description = await copywritingService.generateDescriptionWithStyle(product, copywritingStyle);
      } else {
        description = await copywritingService.generateDescription(product);
      }
      console.log('Generated description:', description);
      
      const mainImage = await siliconFlowService.generateImage(product, sellingPoints);
      console.log('Generated image successfully with Silicon Flow API');
      console.log('Generated image URL:', mainImage);

      return {
        productId: product.id,
        mainImage,
        title,
        sellingPoints,
        description,
        status: 'generated',
        createdAt: new Date(),
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to generate content for product:', product.name);
      console.error('Error details:', errorMessage);
      console.error('Full error:', error);
      return {
        productId: product.id,
        mainImage: '',
        title: '',
        sellingPoints: [],
        description: '',
        status: 'failed',
        error: errorMessage,
        createdAt: new Date(),
      };
    }
  },

  generateBatch: async (
    products: Product[],
    onProgress?: (progress: GenerateProgress) => void,
    copywritingStyles?: Record<string, string> | CopywritingStyle
  ): Promise<GeneratedContent[]> => {
    const results: GeneratedContent[] = [];
    const total = products.length;

    for (let i = 0; i < total; i++) {
      const product = products[i];
      
      if (onProgress) {
        onProgress({
          total,
          completed: i,
          failed: results.filter(r => r.status === 'failed').length,
          currentProductId: product.id,
        });
      }

      try {
        let copywritingStyle: CopywritingStyle | undefined;
        if (typeof copywritingStyles === 'object' && !Array.isArray(copywritingStyles)) {
          // 每个商品有不同的风格
          copywritingStyle = copywritingStyles[product.id] as CopywritingStyle;
        } else {
          // 所有商品使用相同的风格
          copywritingStyle = copywritingStyles as CopywritingStyle;
        }
        
        const result = await generateService.generateSingle(product, copywritingStyle);
        results.push(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to generate content for product:', product.name);
        console.error('Error details:', errorMessage);
        // 添加失败的结果到数组中
        results.push({
          productId: product.id,
          mainImage: '',
          title: '',
          sellingPoints: [],
          status: 'failed',
          error: errorMessage,
          createdAt: new Date(),
        });
      }

      if (onProgress) {
        onProgress({
          total,
          completed: i + 1,
          failed: results.filter(r => r.status === 'failed').length,
          currentProductId: product.id,
        });
      }

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  },

  regenerate: async (product: Product, copywritingStyle?: CopywritingStyle): Promise<GeneratedContent> => {
    return generateService.generateSingle(product, copywritingStyle);
  },
};
