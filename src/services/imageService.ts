import JSZip from 'jszip';
import type { GeneratedContent } from '../types';

export const imageService = {
  downloadSingle: async (content: GeneratedContent, productName: string): Promise<void> => {
    const link = document.createElement('a');
    link.href = content.mainImage;
    link.download = `${productName}_主图.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadBatch: async (contents: GeneratedContent[], productNames: Record<string, string>): Promise<void> => {
    const zip = new JSZip();

    for (const content of contents) {
      if (content.status === 'generated' && content.mainImage) {
        const productName = productNames[content.productId] || 'product';
        
        const base64Data = content.mainImage.split(',')[1];
        zip.file(`${productName}_主图.png`, base64Data, { base64: true });
        
        const textContent = `标题：${content.title}\n\n卖点：\n${content.sellingPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}`;
        zip.file(`${productName}_文案.txt`, textContent);
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `商品图文草稿_${new Date().getTime()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  convertFileToBase64: (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  validateImageFile: (file: File): { valid: boolean; error?: string } => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      return { valid: false, error: '仅支持 JPG、PNG、WebP 格式的图片' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: '图片大小不能超过 10MB' };
    }

    return { valid: true };
  },
};
