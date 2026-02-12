import React from 'react';
import { List, Card, Image, Tag, Button, Space, Popconfirm, Empty } from 'antd';
import { DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import type { LibraryItem } from '../../types';

interface LibraryListProps {
  items: LibraryItem[];
  onDelete: (id: string) => void;
  onUseTemplate?: (item: LibraryItem) => void;
}

const LibraryList: React.FC<LibraryListProps> = ({ items, onDelete, onUseTemplate }) => {
  if (items.length === 0) {
    return (
      <Empty
        description="素材库为空"
        style={{ marginTop: 60 }}
      />
    );
  }

  return (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3, xl: 3, xxl: 4 }}
      dataSource={items}
      renderItem={(item) => (
        <List.Item>
          <Card
            hoverable
            style={{
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease'
            }}
            bodyStyle={{ padding: 16 }}
            cover={
              item.generatedContent?.mainImage ? (
                <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
                  <Image
                    src={item.generatedContent.mainImage}
                    alt={item.product.name}
                    style={{ 
                      height: 200, 
                      objectFit: 'cover',
                      width: '100%'
                    }}
                    preview={false}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                    {item.product.category}
                  </div>
                </div>
              ) : (
                <div style={{ 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  color: '#999',
                  fontSize: 16,
                  fontWeight: 500
                }}>
                  无图片
                </div>
              )
            }
            actions={
              onUseTemplate
                ? [
                    <Button
                      key="use"
                      type="link"
                      icon={<CopyOutlined />}
                      onClick={() => onUseTemplate(item)}
                      style={{ fontWeight: 600 }}
                    >
                      使用模板
                    </Button>,
                    <Popconfirm
                      key="delete"
                      title="确定删除吗？"
                      onConfirm={() => onDelete(item.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button 
                        type="link" 
                        danger 
                        icon={<DeleteOutlined />}
                        style={{ fontWeight: 600 }}
                      >
                        删除
                      </Button>
                    </Popconfirm>,
                  ]
                : [
                    <Popconfirm
                      key="delete"
                      title="确定删除吗？"
                      onConfirm={() => onDelete(item.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button 
                        type="link" 
                        danger 
                        icon={<DeleteOutlined />}
                        style={{ fontWeight: 600 }}
                      >
                        删除
                      </Button>
                    </Popconfirm>,
                  ]
            }
          >
            <Card.Meta
              title={
                <span style={{ 
                  fontSize: 16, 
                  fontWeight: 700, 
                  color: '#667eea',
                  display: 'block',
                  marginBottom: 8
                }}>
                  {item.product.name}
                </span>
              }
              description={
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  <div style={{ fontSize: 14 }}>
                    <span style={{ color: '#999', fontWeight: 500 }}>品牌：</span>
                    <span style={{ fontWeight: 600 }}>{item.product.brand}</span>
                  </div>
                  {item.generatedContent?.title && (
                    <div style={{ 
                      fontSize: 14, 
                      lineHeight: 1.5,
                      color: '#666'
                    }}>
                      {item.generatedContent.title}
                    </div>
                  )}
                  {item.tags.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      {item.tags.map((tag) => (
                        <Tag 
                          key={tag} 
                          style={{ 
                            marginBottom: 4,
                            padding: '4px 12px',
                            borderRadius: 16,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: '#fff',
                            border: 'none',
                            fontWeight: 500
                          }}
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}
                  <div style={{ 
                    fontSize: 12, 
                    color: '#999',
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: '1px solid #f0f0f0'
                  }}>
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </Space>
              }
            />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default LibraryList;
