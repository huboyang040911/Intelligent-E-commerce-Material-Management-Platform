import type { Product } from '../types';

// 注意：此函数已被硅基流动API替代
// 保留此函数以确保兼容性
export const composeImageWithText = async (
  product: Product,
  sellingPoints: string[]
): Promise<string> => {
  try {
    console.log('composeImageWithText called - using fallback implementation');
    console.log('Product:', product.name);
    
    // 检查必要的参数
    if (!product || !product.images || product.images.length === 0) {
      throw new Error('商品图片不能为空');
    }
    
    const imageUrl = product.images[0];
    if (!imageUrl) {
      throw new Error('商品图片URL不能为空');
    }
    
    console.log('Using existing image:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error in composeImageWithText:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`处理图片时出错: ${errorMessage}`);
  }
};

const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine + word + ' ';
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine.trim());
  }
  
  return lines;
};

export const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
