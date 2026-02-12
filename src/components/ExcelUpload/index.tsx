import React, { useState } from 'react';
import { Upload, Button, message, Table } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { parseExcelFile, exportToExcel } from '../../utils/excelParser';
import type { Product } from '../../types';

interface ExcelUploadProps {
  onProductsImported: (products: Product[]) => void;
}

const ExcelUpload: React.FC<ExcelUploadProps> = ({ onProductsImported }) => {
  const [loading, setLoading] = useState(false);
  const [importedProducts, setImportedProducts] = useState<Product[]>([]);

  const handleUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    setLoading(true);

    try {
      const products = await parseExcelFile(file as File);
      
      if (products.length === 0) {
        message.warning('Excel 文件中没有找到有效的商品数据');
        setLoading(false);
        onError?.(new Error('No data found'));
        return;
      }

      setImportedProducts(products);
      message.success(`成功导入 ${products.length} 条商品数据`);
      onSuccess?.(products);
    } catch (error) {
      message.error('Excel 文件解析失败，请检查文件格式');
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImport = () => {
    onProductsImported(importedProducts);
    setImportedProducts([]);
    message.success('商品数据已添加到列表');
  };

  const handleDownloadTemplate = () => {
    const templateData: Product[] = [
      {
        id: '1',
        name: '示例商品名称',
        category: '服装',
        brand: '示例品牌',
        material: '棉',
        size: 'L',
        color: '白色',
        targetAudience: '成人',
        images: [],
        referenceImages: [],
        referenceLink: '',
        saveToLibrary: false,
        createdAt: new Date(),
      },
    ];
    exportToExcel(templateData);
  };

  const columns = [
    { title: '商品名称', dataIndex: 'name', key: 'name' },
    { title: '类目', dataIndex: 'category', key: 'category' },
    { title: '品牌', dataIndex: 'brand', key: 'brand' },
    { title: '材质', dataIndex: 'material', key: 'material' },
    { title: '尺寸', dataIndex: 'size', key: 'size' },
    { title: '颜色', dataIndex: 'color', key: 'color' },
    { title: '适用人群', dataIndex: 'targetAudience', key: 'targetAudience' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Upload
          accept=".xlsx,.xls"
          customRequest={handleUpload}
          showUploadList={false}
        >
          <Button 
            icon={<UploadOutlined />} 
            loading={loading}
            style={{ height: 40, fontWeight: 600 }}
          >
            上传 Excel 文件
          </Button>
        </Upload>
        <Button
          icon={<DownloadOutlined />}
          onClick={handleDownloadTemplate}
          style={{ 
            marginLeft: 8,
            height: 40,
            fontWeight: 600
          }}
        >
          下载模板
        </Button>
      </div>

      {importedProducts.length > 0 && (
        <div className="fade-in">
          <Table
            dataSource={importedProducts}
            columns={columns}
            rowKey="id"
            pagination={false}
            scroll={{ x: true }}
            style={{ 
              marginBottom: 16,
              borderRadius: 12,
              overflow: 'hidden'
            }}
          />
          <Button 
            type="primary" 
            onClick={handleConfirmImport} 
            block
            style={{ 
              height: 48,
              fontSize: 16,
              fontWeight: 600
            }}
          >
            确认导入 ({importedProducts.length} 条)
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExcelUpload;
