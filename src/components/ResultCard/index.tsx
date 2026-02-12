import React, { useState } from 'react';
import { Card, Image, Input, Button, Space, Modal, Tag, message } from 'antd';
import { DownloadOutlined, EditOutlined, RedoOutlined, EyeOutlined } from '@ant-design/icons';
import type { GeneratedContent, Product } from '../../types';
import { imageService } from '../../services/imageService';

const { TextArea } = Input;

interface ResultCardProps {
  product: Product;
  content: GeneratedContent;
  onRegenerate: (product: Product) => void;
  onSaveToLibrary?: (product: Product, content: GeneratedContent) => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ product, content, onRegenerate, onSaveToLibrary }) => {
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(content.title);
  const [editedSellingPoints, setEditedSellingPoints] = useState(content.sellingPoints);
  const [editedDescription, setEditedDescription] = useState(content.description || '');
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDownload = async () => {
    if (content.status === 'generated') {
      await imageService.downloadSingle(content, product.name);
    }
  };

  const handleSave = () => {
    if (onSaveToLibrary) {
      onSaveToLibrary(product, {
        ...content,
        title: editedTitle,
        sellingPoints: editedSellingPoints,
        description: editedDescription,
      });
      message.success('已保存到素材库');
    }
  };

  const handleEditSave = () => {
    setEditing(false);
    message.success('修改已保存');
  };

  const handleEditCancel = () => {
    setEditedTitle(content.title);
    setEditedSellingPoints(content.sellingPoints);
    setEditedDescription(content.description || '');
    setEditing(false);
  };

  if (content.status === 'failed') {
    return (
      <Card 
        title={
          <span style={{ fontSize: 16, fontWeight: 700, color: '#ff4d4f' }}>
            {product.name}
          </span>
        } 
        style={{ height: '100%', border: '2px solid #ffccc7' }}
      >
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
          <p style={{ color: '#ff4d4f', fontSize: 16, fontWeight: 500 }}>生成失败</p>
          <p style={{ color: '#666', fontSize: 14, marginTop: 8, maxWidth: '80%', margin: '8px auto' }}>
            {content.error || '未知错误，请检查控制台获取详细信息'}
          </p>
          <Button 
            icon={<RedoOutlined />} 
            onClick={() => onRegenerate(product)}
            style={{ marginTop: 16, height: 40, fontWeight: 600 }}
          >
            重新生成
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <span style={{ fontSize: 16, fontWeight: 700, color: '#4a5568' }}>
          {product.name}
        </span>
      }
      extra={
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => setPreviewOpen(true)}
            style={{ fontWeight: 600, color: '#ffffff', background: 'transparent', border: 'none' }}
          >
            预览
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => setEditing(true)}
            style={{ fontWeight: 600, color: '#ffffff', background: 'transparent', border: 'none' }}
          >
            编辑
          </Button>
          <Button
            icon={<RedoOutlined />}
            onClick={() => onRegenerate(product)}
            style={{ fontWeight: 600, color: '#ffffff', background: 'transparent', border: 'none' }}
          >
            重新生成
          </Button>
        </Space>
      }
      style={{ height: '100%' }}
    >
      <div style={{ marginBottom: 16, maxWidth: 400, margin: '0 auto' }}>
        <Image
          src={content.mainImage}
          alt={product.name}
          style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          preview={{
            open: previewOpen,
            onOpenChange: (open) => setPreviewOpen(open),
          }}
        />
      </div>

      {editing ? (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#667eea' }}>标题</label>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              size="large"
            />
          </div>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#667eea' }}>卖点</label>
            {editedSellingPoints.map((point, index) => (
              <TextArea
                key={index}
                value={point}
                onChange={(e) => {
                  const newPoints = [...editedSellingPoints];
                  newPoints[index] = e.target.value;
                  setEditedSellingPoints(newPoints);
                }}
                style={{ marginBottom: 8 }}
                rows={2}
                size="large"
              />
            ))}
          </div>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#667eea' }}>商品描述</label>
            <TextArea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={4}
              size="large"
            />
          </div>
          <Space>
            <Button 
              type="primary" 
              onClick={handleEditSave}
              style={{ height: 40, fontWeight: 600 }}
            >
              保存
            </Button>
            <Button 
              onClick={handleEditCancel}
              style={{ height: 40, fontWeight: 600 }}
            >
              取消
            </Button>
          </Space>
        </Space>
      ) : (
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#667eea' }}>标题</label>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{content.title}</p>
          </div>
          <div>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#667eea' }}>卖点</label>
            {content.sellingPoints.map((point, index) => (
              <Tag 
                key={index} 
                style={{ 
                  marginBottom: 8, 
                  padding: '6px 14px',
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 20,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  border: 'none'
                }}
              >
                {point}
              </Tag>
            ))}
          </div>
          {content.description && (
            <div>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: 8, color: '#667eea' }}>商品描述</label>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#666', textAlign: 'justify' }}>{content.description}</p>
            </div>
          )}
          <Space style={{ marginTop: 16 }}>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={handleDownload}
              style={{ height: 40, fontWeight: 600 }}
            >
              下载
            </Button>
            {onSaveToLibrary && (
              <Button 
                onClick={handleSave}
                style={{ height: 40, fontWeight: 600 }}
              >
                保存到素材库
              </Button>
            )}
          </Space>
        </Space>
      )}
    </Card>
  );
};

export default ResultCard;
