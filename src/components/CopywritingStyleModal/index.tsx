import React from 'react';
import { Modal, Radio, Button, Space } from 'antd';
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import type { Product } from '../../types';

interface CopywritingStyleModalProps {
  visible: boolean;
  onCancel: () => void;
  onGenerate: (styles: Record<string, string>) => void;
  products: Product[];
}

type StyleOption = {
  value: string;
  label: string;
  description: string;
};

const CopywritingStyleModal: React.FC<CopywritingStyleModalProps> = ({
  visible,
  onCancel,
  onGenerate,
  products,
}) => {
  const [currentProductIndex, setCurrentProductIndex] = React.useState(0);
  const [selectedStyles, setSelectedStyles] = React.useState<Record<string, string>>(
    products.reduce((acc, product) => {
      acc[product.id] = 'bestseller';
      return acc;
    }, {} as Record<string, string>)
  );

  const currentProduct = products[currentProductIndex];

  const handleStyleChange = (style: string) => {
    setSelectedStyles(prev => ({
      ...prev,
      [currentProduct.id]: style
    }));
  };

  const styleOptions: StyleOption[] = [
    {
      value: 'bestseller',
      label: '爆款风格',
      description: '抓住眼球，突出卖点，适合快速吸引流量',
    },
    {
      value: 'emotional',
      label: '情感共鸣',
      description: '触动用户情感，建立品牌连接',
    },
    {
      value: 'professional',
      label: '专业测评',
      description: '客观专业，突出品质和性价比',
    },
    {
      value: 'humorous',
      label: '幽默风趣',
      description: '轻松幽默，增加互动和传播',
    },
    {
      value: 'storytelling',
      label: '故事营销',
      description: '通过故事讲述，增强记忆点',
    },
    {
      value: 'minimalist',
      label: '简约高级',
      description: '简洁有力，突出品质感',
    },
  ];

  const handleGenerate = () => {
    onGenerate(selectedStyles);
  };

  const handlePrevious = () => {
    setCurrentProductIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentProductIndex(prev => (prev < products.length - 1 ? prev + 1 : prev));
  };

  if (!currentProduct) return null;

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      style={{
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
      bodyStyle={{
        padding: 0,
        overflow: 'hidden',
      }}
      title={null}
      closeIcon={null}
    >
      {/* 自定义弹窗头部 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        padding: '16px 24px',
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
      }}>
        <h2 style={{
          fontSize: 18,
          fontWeight: 600,
          margin: 0,
        }}>
          AI文案生成
        </h2>
        <button
          onClick={onCancel}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: 4,
            padding: 6,
            cursor: 'pointer',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CloseOutlined style={{ fontSize: 16 }} />
        </button>
      </div>

      {/* 弹窗内容 */}
      <div style={{ padding: 24 }}>
        {/* 副标题 */}
        <div style={{ marginBottom: 24 }}>
          <h3 style={{
            fontSize: 14,
            fontWeight: 500,
            margin: 0,
            color: '#667eea',
          }}>
            基于商品信息智能生成电商文案
          </h3>
        </div>

        {/* 商品导航 */}
        {products.length > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <div style={{
              fontSize: 14,
              fontWeight: 500,
              color: '#333',
            }}>
              商品 {currentProductIndex + 1} / {products.length}
            </div>
            <Space>
              <Button
                icon={<LeftOutlined />}
                onClick={handlePrevious}
                disabled={currentProductIndex === 0}
                style={{ borderColor: '#e8e8e8' }}
              >
                上一个
              </Button>
              <Button
                icon={<RightOutlined />}
                onClick={handleNext}
                disabled={currentProductIndex === products.length - 1}
                style={{ borderColor: '#e8e8e8' }}
              >
                下一个
              </Button>
            </Space>
          </div>
        )}

        {/* 商品信息 */}
        <div style={{
          background: '#ffffff',
          borderRadius: 10,
          padding: 16,
          marginBottom: 24,
          border: '1px solid #f0f0f0',
        }}>
          <h4 style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 12,
            color: '#333',
          }}>
            商品信息
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>商品名称:</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{currentProduct.name}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>品牌:</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{currentProduct.brand}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>类目:</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{currentProduct.category}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>材质:</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{currentProduct.material}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>颜色:</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{currentProduct.color}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>适用人群:</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{currentProduct.targetAudience}</div>
            </div>
          </div>
        </div>

        {/* 选择文案风格 */}
        <div style={{ marginBottom: 24 }}>
          <h4 style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 12,
            color: '#333',
          }}>
            选择文案风格
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {styleOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleStyleChange(option.value)}
                style={{
                  padding: 16,
                  borderRadius: 8,
                  border: selectedStyles[currentProduct.id] === option.value ? '2px solid #667eea' : '1px solid #e8e8e8',
                  background: selectedStyles[currentProduct.id] === option.value ? '#ffffff' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: selectedStyles[currentProduct.id] === option.value ? '0 2px 8px rgba(102, 126, 234, 0.15)' : 'none',
                }}
              >
                <div style={{
                  fontWeight: 500,
                  marginBottom: 8,
                  fontSize: 14,
                  color: selectedStyles[currentProduct.id] === option.value ? '#667eea' : '#333',
                }}>
                  {option.label}
                </div>
                <div style={{
                  fontSize: 12,
                  color: '#666',
                  lineHeight: 1.4,
                }}>
                  {option.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 生成按钮 */}
        <Button
          type="primary"
          block
          size="large"
          onClick={handleGenerate}
          style={{
            height: 48,
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          }}
        >
          生成文案
        </Button>
      </div>
    </Modal>
  );
};

export default CopywritingStyleModal;