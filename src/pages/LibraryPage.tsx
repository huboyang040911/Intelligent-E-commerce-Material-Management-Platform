import React from 'react';
import { Layout, Typography, Empty, Menu, Button } from 'antd';
const { Sider } = Layout;
import { AppstoreOutlined, DatabaseOutlined, SettingOutlined, FileTextOutlined, PictureOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { libraryService } from '../services/productService';
import LibraryList from '../components/LibraryList';

const { Content } = Layout;
const { Title } = Typography;

const LibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const items = libraryService.getLibrary();

  const handleDelete = (id: string) => {
    libraryService.deleteFromLibrary(id);
  };

  const handleUseTemplate = (item: any) => {
    console.log('Use template:', item);
  };

  const isGeneratePage = location.pathname === '/generate';

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
              background: location.pathname === '/' ? '#667eea' : 'transparent',
              color: location.pathname === '/' ? '#fff' : '#666',
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
              background: isGeneratePage ? '#667eea' : 'transparent',
              color: isGeneratePage ? '#fff' : '#666',
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
        
        <div style={{ padding: 24, background: 'transparent' }}>
        {items.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 80, 
            color: '#999',
            background: 'rgba(255,255,255,0.95)',
            borderRadius: 16,
            fontSize: 16
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
            <div>素材库为空，请在生成页面将商品保存到素材库</div>
          </div>
        ) : (
          <div style={{ 
            marginBottom: 24, 
            background: 'rgba(255,255,255,0.95)', 
            padding: 20, 
            borderRadius: 16,
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
          }}>
            <h2 style={{ 
              margin: '0 0 20px 0', 
              fontSize: 20, 
              fontWeight: 700, 
              color: '#667eea',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span>我的素材库</span>
              <span style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                padding: '2px 10px',
                borderRadius: 12,
                fontSize: 14
              }}>
                {items.length}
              </span>
            </h2>
            <LibraryList
              items={items}
              onDelete={handleDelete}
              onUseTemplate={handleUseTemplate}
            />
          </div>
        )}</div>
      </Content>
    </Layout>
  );
};

export default LibraryPage;
