import * as XLSX from 'xlsx';
import type { Product } from '../types';

export const parseExcelFile = async (file: File): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const products: Product[] = jsonData.map((row: any, index) => ({
          id: `product_${Date.now()}_${index}`,
          name: row['商品名称'] || row['name'] || '',
          category: row['类目'] || row['category'] || '',
          brand: row['品牌'] || row['brand'] || '',
          material: row['材质'] || row['material'] || '',
          size: row['尺寸'] || row['size'] || '',
          color: row['颜色'] || row['color'] || '',
          targetAudience: row['适用人群'] || row['targetAudience'] || '',
          images: [],
          referenceImages: [],
          referenceLink: row['参考链接'] || row['referenceLink'] || '',
          saveToLibrary: row['保存到素材库'] === 'true' || row['saveToLibrary'] === true,
          createdAt: new Date(),
        }));
        
        resolve(products);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const exportToExcel = (products: Product[]): void => {
  const worksheet = XLSX.utils.json_to_sheet(products.map(p => ({
    '商品名称': p.name,
    '类目': p.category,
    '品牌': p.brand,
    '材质': p.material || '',
    '尺寸': p.size || '',
    '颜色': p.color || '',
    '适用人群': p.targetAudience || '',
    '参考链接': p.referenceLink || '',
    '保存到素材库': p.saveToLibrary ? 'true' : 'false',
  })));
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '商品信息');
  XLSX.writeFile(workbook, '商品信息模板.xlsx');
};
