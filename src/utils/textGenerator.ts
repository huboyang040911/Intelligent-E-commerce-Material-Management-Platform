import type { Product } from '../types';
import { copywritingService } from '../services/copywritingService';

const categoryTemplates: Record<string, { titleTemplate: string; sellingPointTemplates: string[] }> = {
  '服装': {
    titleTemplate: '{brand} {material}{color}{size} {name} {targetAudience}',
    sellingPointTemplates: [
      '精选{material}面料，{targetAudience}专属设计',
      '舒适透气，{color}色系百搭时尚',
    ],
  },
  '鞋靴': {
    titleTemplate: '{brand} {name} {targetAudience} {color}',
    sellingPointTemplates: [
      '防滑耐磨，{targetAudience}首选',
      '轻便舒适，{color}经典配色',
    ],
  },
  '箱包': {
    titleTemplate: '{brand} {name} {targetAudience} {color}',
    sellingPointTemplates: [
      '大容量多隔层，{targetAudience}必备',
      '{material}材质，{color}时尚百搭',
    ],
  },
  '数码': {
    titleTemplate: '{brand} {name} {targetAudience}专用',
    sellingPointTemplates: [
      '高性能配置，{targetAudience}首选',
      '品质保证，{brand}官方正品',
    ],
  },
  '家居': {
    titleTemplate: '{brand} {name} {targetAudience}家居',
    sellingPointTemplates: [
      '{material}材质，环保健康',
      '简约设计，{targetAudience}居家必备',
    ],
  },
  '美妆': {
    titleTemplate: '{brand} {name} {targetAudience}专用',
    sellingPointTemplates: [
      '温和不刺激，{targetAudience}适用',
      '天然成分，{brand}品质保证',
    ],
  },
  '食品': {
    titleTemplate: '{brand} {name} {targetAudience}零食',
    sellingPointTemplates: [
      '精选原料，健康美味',
      '{brand}品牌，品质保证',
    ],
  },
  '母婴': {
    titleTemplate: '{brand} {name} {targetAudience}专用',
    sellingPointTemplates: [
      '安全材质，呵护{targetAudience}',
      '{brand}品牌，妈妈放心之选',
    ],
  },
  '运动': {
    titleTemplate: '{brand} {name} {targetAudience}运动装备',
    sellingPointTemplates: [
      '专业运动装备，{targetAudience}首选',
      '透气舒适，运动必备',
    ],
  },
  '其他': {
    titleTemplate: '{brand} {name} {targetAudience}',
    sellingPointTemplates: [
      '品质保证，{brand}官方正品',
      '精选商品，{targetAudience}必备',
    ],
  },
};

// 从路径格式的类别中提取主类别
const getMainCategory = (category: string): string => {
  if (!category) return '其他';
  return category.split('/')[0] || '其他';
};

export const generateTitle = async (product: Product): Promise<string> => {
  try {
    // 使用硅基流动API生成标题
    return await copywritingService.generateTitle(product);
  } catch (error) {
    console.error('生成标题失败:', error);
    // 回退到本地生成
    try {
      const mainCategory = getMainCategory(product.category);
      const template = categoryTemplates[mainCategory] || categoryTemplates['其他'];
      let title = template.titleTemplate;
      
      title = title.replace('{brand}', product.brand || '');
      title = title.replace('{name}', product.name || '');
      title = title.replace('{category}', product.category || '');
      title = title.replace('{material}', product.material ? product.material + '材质' : '');
      title = title.replace('{size}', product.size || '');
      title = title.replace('{color}', product.color || '');
      title = title.replace('{targetAudience}', product.targetAudience || '');
      
      return title.replace(/\s+/g, ' ').trim() || '未命名商品';
    } catch (localError) {
      console.error('本地生成标题失败:', localError);
      return product.name || '未命名商品';
    }
  }
};

export const generateSellingPoints = async (product: Product): Promise<string[]> => {
  try {
    // 使用硅基流动API生成卖点
    return await copywritingService.generateSellingPoints(product);
  } catch (error) {
    console.error('生成卖点失败:', error);
    // 回退到本地生成
    try {
      const mainCategory = getMainCategory(product.category);
      const template = categoryTemplates[mainCategory] || categoryTemplates['其他'];
      const points: string[] = [];
      
      template.sellingPointTemplates.forEach(pointTemplate => {
        let point = pointTemplate;
        point = point.replace('{brand}', product.brand || '');
        point = point.replace('{name}', product.name || '');
        point = point.replace('{category}', product.category || '');
        point = point.replace('{material}', product.material || '');
        point = point.replace('{size}', product.size || '');
        point = point.replace('{color}', product.color || '');
        point = point.replace('{targetAudience}', product.targetAudience || '');
        
        const cleaned = point.replace(/\s+/g, ' ').trim();
        if (cleaned) {
          points.push(cleaned);
        }
      });
      
      // 如果没有生成卖点，返回默认卖点
      if (points.length === 0) {
        return ['品质保证', '值得信赖'];
      }
      
      return points.slice(0, 2);
    } catch (localError) {
      console.error('本地生成卖点失败:', localError);
      return ['品质保证', '值得信赖'];
    }
  }
};

export const extractKeywords = (product: Product): string[] => {
  const keywords: string[] = [];
  
  keywords.push(product.brand);
  keywords.push(product.name);
  keywords.push(product.category);
  
  if (product.material) keywords.push(product.material);
  if (product.color) keywords.push(product.color);
  if (product.targetAudience) keywords.push(product.targetAudience);
  
  return keywords;
};
