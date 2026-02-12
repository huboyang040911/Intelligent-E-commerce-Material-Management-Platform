import React from 'react';
import { Layout, Card, Statistic, Row, Col, Progress, Button, Typography, Space } from 'antd';
import { AppstoreOutlined, DatabaseOutlined, SettingOutlined, FileTextOutlined, ArrowUpOutlined, DownloadOutlined, PictureOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { libraryService } from '../services/productService';

const { Content, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 模拟数据
  const totalProducts = 128;
  const generatedContents = 96;
  const libraryItems = libraryService.getLibrary().length;
  const completionRate = Math.round((generatedContents / totalProducts) * 100);
  
  const recentActivities = [
    { id: 1, type: '生成', product: '透气运动跑鞋', time: '2小时前' },
    { id: 2, type: '保存', product: '轻便休闲鞋', time: '5小时前' },
    { id: 3, type: '导入', product: '10个商品', time: '1天前' },
  ];

  const isHomePage = location.pathname === '/';

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左侧白色导航栏 */}
      <Sider 
        width={80} 
        style={{ 
          background: '#ffffff',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 0',
          position: 'relative',
          zIndex: 100,
          borderRight: '1px solid #f0f0f0'
        }}
      >
        {/* 导航栏底部分割线 */}
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 20, 
          right: 20, 
          height: 1, 
          background: 'linear-gradient(90deg, transparent 0%, #f0f0f0 50%, transparent 100%)' 
        }}></div>
        
        {/* Logo */}
        <div style={{ 
          width: 48, 
          height: 48, 
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32,
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
        }}>
          <span style={{ fontSize: 24, color: '#fff' }}>✨</span>
        </div>

        {/* 导航项 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', padding: '0 12px' }}>
          <div 
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 8px',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: isHomePage ? '#667eea' : 'transparent',
              color: isHomePage ? '#fff' : '#666',
              height: 80,
              width: '100%'
            }}
          >
            <FileTextOutlined style={{ fontSize: 22, marginBottom: 4 }} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>首页</span>
          </div>

          <div 
            onClick={() => navigate('/generate')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 8px',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: location.pathname === '/generate' ? '#667eea' : 'transparent',
              color: location.pathname === '/generate' ? '#fff' : '#666',
              height: 80,
              width: '100%'
            }}
          >
            <AppstoreOutlined style={{ fontSize: 22, marginBottom: 4 }} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>工作台</span>
          </div>

          <div 
            onClick={() => navigate('/library')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 8px',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: location.pathname === '/library' ? '#667eea' : 'transparent',
              color: location.pathname === '/library' ? '#fff' : '#666',
              height: 80,
              width: '100%'
            }}
          >
            <DatabaseOutlined style={{ fontSize: 22, marginBottom: 4 }} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>模板库</span>
          </div>

          <div 
            onClick={() => navigate('/image-generator')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 8px',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: location.pathname === '/image-generator' ? '#667eea' : 'transparent',
              color: location.pathname === '/image-generator' ? '#fff' : '#666',
              height: 80,
              width: '100%'
            }}
          >
            <PictureOutlined style={{ fontSize: 22, marginBottom: 4 }} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>图片生成</span>
          </div>
        </div>

        {/* 底部设置 */}
        <div style={{ marginTop: 'auto', width: '100%', padding: '0 12px', marginBottom: 16 }}>
          <div 
            onClick={() => navigate('/settings')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 8px',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: location.pathname === '/settings' ? '#667eea' : 'transparent',
              color: location.pathname === '/settings' ? '#fff' : '#666',
              height: 80,
              width: '100%'
            }}
          >
            <SettingOutlined style={{ fontSize: 22, marginBottom: 4 }} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>设置</span>
          </div>
        </div>
      </Sider>

      <Content style={{ padding: 0, background: '#f5f7fa', borderLeft: '1px solid #f0f0f0' }}>
        <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* 顶部项目名称栏 */}
          <div style={{ 
            padding: '12px 24px', 
            background: '#ffffff', 
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#667eea' }}>XXX公司图文管理平台</span>
              <span style={{ fontSize: 12, color: '#999', backgroundColor: '#f0f0f0', padding: '2px 8px', borderRadius: 10 }}>Beta</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="small">分享</Button>
              <Button 
                size="small" 
                type="primary"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                转换
              </Button>
            </div>
          </div>
          
          {/* 顶部欢迎区域 */}
          <div style={{ padding: 24, background: '#ffffff', borderBottom: '1px solid #f0f0f0' }}>
            <Row align="middle" justify="space-between">
              <Col>
                <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>欢迎回来</Title>
                <Paragraph style={{ margin: '8px 0 0 0', color: '#666' }}>
                  今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}，
                  让我们继续完成未完成的工作
                </Paragraph>
              </Col>
              <Col>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<AppstoreOutlined />}
                    onClick={() => navigate('/generate')}
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    开始生成
                  </Button>
                  <Button 
                    icon={<DatabaseOutlined />}
                    onClick={() => navigate('/library')}
                  >
                    查看素材库
                  </Button>
                </Space>
              </Col>
            </Row>
          </div>

          {/* 主要内容区域 */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            {/* 统计卡片 */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} sm={12} md={8}>
                <Card hoverable>
                  <Statistic 
                    title="总商品数" 
                    value={totalProducts} 
                    prefix={<FileTextOutlined />} 
                    suffix="个"
                    valueStyle={{ color: '#667eea' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card hoverable>
                  <Statistic 
                    title="已生成内容" 
                    value={generatedContents} 
                    prefix={<ArrowUpOutlined />} 
                    suffix="个"
                    valueStyle={{ color: '#764ba2' }}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card hoverable>
                  <Statistic 
                    title="素材库" 
                    value={libraryItems} 
                    prefix={<DatabaseOutlined />} 
                    suffix="个"
                    valueStyle={{ color: '#f093fb' }}
                  />
                </Card>
              </Col>
            </Row>

            {/* 进度和概览 */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={24} md={16}>
                <Card title="项目进度" hoverable>
                  <div style={{ marginBottom: 24 }}>
                    <Text strong>整体完成率</Text>
                    <Progress 
                      percent={completionRate} 
                      strokeColor={{ 
                        '0%': '#667eea', 
                        '100%': '#764ba2' 
                      }} 
                      strokeWidth={10}
                      style={{ marginTop: 12 }}
                    />
                    <Row gutter={16} style={{ marginTop: 24 }}>
                      <Col span={8}>
                        <Text style={{ color: '#666' }}>待处理</Text>
                        <Text strong style={{ marginLeft: 8, color: '#ff4d4f' }}>{totalProducts - generatedContents}</Text>
                      </Col>
                      <Col span={8}>
                        <Text style={{ color: '#666' }}>进行中</Text>
                        <Text strong style={{ marginLeft: 8, color: '#faad14' }}>12</Text>
                      </Col>
                      <Col span={8}>
                        <Text style={{ color: '#666' }}>已完成</Text>
                        <Text strong style={{ marginLeft: 8, color: '#52c41a' }}>{generatedContents}</Text>
                      </Col>
                    </Row>
                  </div>
                  <Button 
                    type="primary" 
                    block 
                    icon={<DownloadOutlined />}
                    onClick={() => navigate('/generate')}
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    查看详情
                  </Button>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card title="最近活动" hoverable>
                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {recentActivities.map((activity) => (
                      <div 
                        key={activity.id} 
                        style={{
                          padding: 12,
                          borderBottom: '1px solid #f0f0f0',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <Text strong>{activity.type}</Text>
                          <Text style={{ marginLeft: 8, color: '#666' }}>{activity.product}</Text>
                        </div>
                        <Text style={{ color: '#999', fontSize: 12 }}>{activity.time}</Text>
                      </div>
                    ))}
                  </div>
                  <Button 
                    block 
                    style={{ marginTop: 16 }}
                    onClick={() => navigate('/generate')}
                  >
                    查看全部
                  </Button>
                </Card>
              </Col>
            </Row>

            {/* 快速操作 */}
            <Card title="快速操作" hoverable>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Button 
                    type="primary" 
                    block 
                    icon={<AppstoreOutlined />}
                    onClick={() => navigate('/generate')}
                    style={{ 
                      height: 80,
                      fontSize: 16,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    商品录入
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Button 
                    block 
                    icon={<ArrowUpOutlined />}
                    onClick={() => navigate('/generate')}
                    style={{ height: 80, fontSize: 16 }}
                  >
                    内容生成
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Button 
                    block 
                    icon={<DownloadOutlined />}
                    onClick={() => navigate('/generate')}
                    style={{ height: 80, fontSize: 16 }}
                  >
                    批量下载
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Button 
                    block 
                    icon={<DatabaseOutlined />}
                    onClick={() => navigate('/library')}
                    style={{ height: 80, fontSize: 16 }}
                  >
                    素材库
                  </Button>
                </Col>
              </Row>
            </Card>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default HomePage;