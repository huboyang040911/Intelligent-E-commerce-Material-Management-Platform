import React, { useState } from 'react';
import { Layout, Tabs, Button, Progress, Row, Col, message, Modal, Space, Card } from 'antd';
import { DownloadOutlined, ClearOutlined, AppstoreOutlined, DatabaseOutlined, SettingOutlined, PlusOutlined, FileExcelOutlined, FileTextOutlined, PictureOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import type { Product, GeneratedContent, InputMode } from '../types';
import { generateService } from '../services/generateService';
import { imageService } from '../services/imageService';
import { libraryService } from '../services/productService';
import ProductForm from '../components/ProductForm';
import ExcelUpload from '../components/ExcelUpload';
import ResultCard from '../components/ResultCard';
import LibraryList from '../components/LibraryList';
import CopywritingStyleModal from '../components/CopywritingStyleModal';

const { Content, Sider } = Layout;

const GeneratePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState<Product[]>([]);
  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>('form');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ total: 0, completed: 0, failed: 0 });
  const [libraryModalVisible, setLibraryModalVisible] = useState(false);
  const [copywritingModalVisible, setCopywritingModalVisible] = useState(false);
  const [selectedCopywritingStyle, setSelectedCopywritingStyle] = useState<string>('bestseller');

  const handleAddProduct = (product: Product) => {
    setProducts([...products, product]);
    message.success('商品已添加');
  };

  const handleProductsImported = (importedProducts: Product[]) => {
    setProducts([...products, ...importedProducts]);
  };

  // 填充测试数据
  const handleFillTestData = () => {
    const testProducts: Product[] = [
      {
        id: `test-${Date.now()}-1`,
        name: '高级纯棉T恤',
        category: '服装/上衣/T恤',
        brand: 'TestBrand',
        material: '100%纯棉',
        size: 'S, M, L, XL',
        color: '白色, 黑色, 灰色',
        targetAudience: '青少年, 成人',
        images: ['/images/T恤.png'],
        referenceLink: 'https://example.com/reference',
        saveToLibrary: true,
        createdAt: new Date()
      },
      {
        id: `test-${Date.now()}-2`,
        name: '商务休闲皮鞋',
        category: '鞋靴/皮鞋/商务皮鞋',
        brand: 'TestBrand',
        material: '真皮',
        size: '38, 39, 40, 41, 42',
        color: '黑色, 棕色',
        targetAudience: '成人, 商务人士',
        images: ['/images/皮鞋.png'],
        referenceLink: '',
        saveToLibrary: true,
        createdAt: new Date()
      },
      {
        id: `test-${Date.now()}-3`,
        name: '智能手环',
        category: '数码/智能设备/智能手环',
        brand: 'TestBrand',
        material: '塑料, 金属',
        size: '均码',
        color: '黑色, 蓝色, 粉色',
        targetAudience: '青少年, 成人, 运动爱好者',
        images: ['/images/智能手环.png'],
        referenceLink: '',
        saveToLibrary: false,
        createdAt: new Date()
      }
    ];

    console.log('Adding test products:', testProducts);
    setProducts(testProducts);
    message.success(`已添加 ${testProducts.length} 个测试商品`);
  };

  const handleGenerate = async () => {
    if (products.length === 0) {
      message.warning('请先添加商品');
      return;
    }

    // 显示文案风格选择弹窗
    setCopywritingModalVisible(true);
  };

  const handleGenerateWithStyle = async (styles: Record<string, string>) => {
    setCopywritingModalVisible(false);
    setGenerating(true);
    setGeneratedContents([]);
    setProgress({ total: products.length, completed: 0, failed: 0 });

    try {
      console.log('开始批量生成内容，商品数量:', products.length);
      console.log('选择的文案风格:', styles);
      console.log('商品详情:', products);
      
      const results = await generateService.generateBatch(products, (prog) => {
        setProgress(prog);
        console.log('生成进度:', prog);
      }, styles);

      console.log('生成结果:', results);
      setGeneratedContents(results);
      
      const successCount = results.filter(r => r.status === 'generated').length;
      const failedCount = results.filter(r => r.status === 'failed').length;
      
      console.log('生成统计：成功', successCount, '个，失败', failedCount, '个');
      
      if (failedCount > 0) {
        message.warning(`生成完成：成功 ${successCount} 个，失败 ${failedCount} 个`);
      } else {
        message.success(`成功生成 ${successCount} 个商品图文草稿`);
      }

      const productsToSave = products.filter(p => p.saveToLibrary);
      if (productsToSave.length > 0) {
        productsToSave.forEach(product => {
          const content = results.find(r => r.productId === product.id);
          if (content && content.status === 'generated') {
            const libraryItem = libraryService.createLibraryItem(product, content, [product.category]);
            libraryService.saveToLibrary(libraryItem);
          }
        });
        message.success(`${productsToSave.length} 个商品已保存到素材库`);
      }
    } catch (error) {
      console.error('批量生成失败:', error);
      message.error('生成失败，请检查控制台获取详细信息');
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async (product: Product) => {
    const result = await generateService.regenerate(product);
    setGeneratedContents(prev => 
      prev.map(c => c.productId === product.id ? result : c)
    );
  };

  const handleSaveToLibrary = (product: Product, content: GeneratedContent) => {
    const libraryItem = libraryService.createLibraryItem(product, content, [product.category]);
    libraryService.saveToLibrary(libraryItem);
  };

  const handleDownloadBatch = async () => {
    const productNames: Record<string, string> = {};
    products.forEach(p => {
      productNames[p.id] = p.name;
    });
    await imageService.downloadBatch(generatedContents, productNames);
  };

  const handleClear = () => {
    setProducts([]);
    setGeneratedContents([]);
    setProgress({ total: 0, completed: 0, failed: 0 });
  };

  const handleUseTemplate = (item: any) => {
    message.info('模板功能开发中');
    setLibraryModalVisible(false);
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
        
        <Row gutter={0} style={{ height: 'calc(100vh - 60px)' }}>
          {/* 左侧：商品输入区域 */}
          <Col xs={24} lg={10} xl={9} style={{ height: '100%', padding: 24, borderRight: '1px solid #f0f0f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>商品录入</h2>
              <p style={{ fontSize: 14, color: '#999', margin: '4px 0 12px 0' }}>输入商品信息以生成内容</p>
              <div style={{ height: 1, background: 'linear-gradient(90deg, #f0f0f0 0%, transparent 100%)' }}></div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8, marginBottom: 20 }}>
              <Card 
                style={{ 
                  borderRadius: 16,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  border: 'none',
                  marginBottom: 20
                }}
                bodyStyle={{ padding: 0 }}
              >
                {/* 标签页切换 */}
                <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0' }}>
                  <div 
                    onClick={() => setInputMode('form')}
                    style={{
                      flex: 1,
                      padding: '16px 24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderBottom: inputMode === 'form' ? '2px solid #667eea' : 'none',
                      color: inputMode === 'form' ? '#667eea' : '#666',
                      fontWeight: inputMode === 'form' ? 600 : 500,
                      fontSize: 15,
                      transition: 'all 0.3s ease',
                      background: inputMode === 'form' ? 'rgba(102,126,234,0.05)' : 'transparent'
                    }}
                  >
                    单品录入
                  </div>
                  <div 
                    onClick={() => setInputMode('excel')}
                    style={{
                      flex: 1,
                      padding: '16px 24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderBottom: inputMode === 'excel' ? '2px solid #667eea' : 'none',
                      color: inputMode === 'excel' ? '#667eea' : '#666',
                      fontWeight: inputMode === 'excel' ? 600 : 500,
                      fontSize: 15,
                      transition: 'all 0.3s ease',
                      background: inputMode === 'excel' ? 'rgba(102,126,234,0.05)' : 'transparent'
                    }}
                  >
                    <FileExcelOutlined style={{ marginRight: 6 }} />
                    批量导入
                  </div>
                </div>

                <div style={{ padding: 24 }}>
                  {inputMode === 'form' ? (
                    <ProductForm onSubmit={handleAddProduct} />
                  ) : (
                    <ExcelUpload onProductsImported={handleProductsImported} />
                  )}
                  
                  {/* 填充测试数据按钮 */}
                  <div style={{ marginTop: 24 }}>
                    <Button
                      type="dashed"
                      block
                      onClick={handleFillTestData}
                      icon={<DatabaseOutlined />}
                      style={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        borderRadius: 8
                      }}
                    >
                      填充测试数据
                    </Button>
                  </div>
                </div>
              </Card>

              {/* 已添加商品列表 */}
              {products.length > 0 && (
                <div className="fade-in">
                  <h4 style={{ 
                    fontSize: 14, 
                    fontWeight: 600, 
                    marginBottom: 12,
                    color: '#666'
                  }}>
                    已添加商品 ({products.length})
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {products.map((product) => (
                      <div 
                        key={product.id} 
                        className="fade-in"
                        style={{ 
                          padding: 12, 
                          border: '1px solid #e8e8e8', 
                          borderRadius: 10, 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: '#fff',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontWeight: 600, 
                            fontSize: 14, 
                            marginBottom: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: '#1a1a1a'
                          }}>{product.name}</div>
                          <div style={{ fontSize: 12, color: '#999' }}>
                            {product.brand} · {product.category}
                          </div>
                        </div>
                        {product.images.length > 0 && (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            style={{ 
                              width: 40, 
                              height: 40, 
                              objectFit: 'cover', 
                              borderRadius: 6, 
                              marginLeft: 12,
                              flexShrink: 0
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 底部生成按钮 */}
            <div style={{ marginTop: 'auto' }}>
              <Button
                type="primary"
                block
                size="large"
                onClick={handleGenerate}
                loading={generating}
                disabled={products.length === 0}
                icon={<PlusOutlined />}
                style={{ 
                  height: 48,
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                }}
              >
                立即生成草稿
              </Button>
              {products.length > 0 && (
                <Button
                  block
                  size="large"
                  onClick={handleClear}
                  style={{ 
                    marginTop: 12, 
                    height: 44,
                    fontSize: 15,
                    fontWeight: 500,
                    borderRadius: 10,
                    borderColor: '#e8e8e8'
                  }}
                  icon={<ClearOutlined />}
                >
                  清空列表
                </Button>
              )}
            </div>
          </Col>

          {/* 右侧：生成结果区域 */}
          <Col xs={24} lg={14} xl={15} style={{ height: '100%', padding: 24, background: '#fafbfc', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>生成结果</h2>
              <p style={{ fontSize: 14, color: '#999', margin: '4px 0 12px 0' }}>
                已生成 {generatedContents.length} 个营销草稿
              </p>
              <div style={{ height: 1, background: 'linear-gradient(90deg, #f0f0f0 0%, transparent 100%)' }}></div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingRight: 8 }}>
              {generating && (
                <div style={{ 
                  marginBottom: 20, 
                  background: '#fff', 
                  padding: 20, 
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }} className="fade-in">
                  <Progress
                    percent={Math.round((progress.completed / progress.total) * 100)}
                    status={progress.failed > 0 ? 'exception' : 'active'}
                    strokeColor={{
                      '0%': '#667eea',
                      '100%': '#764ba2',
                    }}
                    strokeWidth={8}
                  />
                  <div style={{ marginTop: 12, color: '#666', fontSize: 14, textAlign: 'center', fontWeight: 500 }}>
                    正在生成：{progress.completed} / {progress.total}
                    {progress.failed > 0 && ` (失败 ${progress.failed} 个)`}
                  </div>
                </div>
              )}

              {generatedContents.length > 0 ? (
                <Row gutter={[0, 24]}>
                  {generatedContents.map((content) => {
                    const product = products.find(p => p.id === content.productId);
                    if (!product) return null;
                    return (
                      <Col key={content.productId} xs={24}>
                        <ResultCard
                          product={product}
                          content={content}
                          onRegenerate={handleRegenerate}
                          onSaveToLibrary={handleSaveToLibrary}
                        />
                      </Col>
                    );
                  })}
                </Row>
              ) : (
                <div style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 'calc(100% - 80px)',
                  minHeight: 400,
                  color: '#999'
                }}>
                  <div style={{ 
                    width: 80, 
                    height: 80, 
                    background: 'rgba(102, 126, 234, 0.1)', 
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20
                  }}>
                    <AppstoreOutlined style={{ fontSize: 36, color: '#667eea', opacity: 0.6 }} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: '#666' }}>暂无生成内容</div>
                  <div style={{ fontSize: 14 }}>请在左侧录入商品信息并点击生成</div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Content>

      <Modal
        title="素材库"
        open={libraryModalVisible}
        onCancel={() => setLibraryModalVisible(false)}
        footer={null}
        width={1000}
      >
        <LibraryList
          items={libraryService.getLibrary()}
          onDelete={(id) => {
            libraryService.deleteFromLibrary(id);
            message.success('已删除');
          }}
          onUseTemplate={handleUseTemplate}
        />
      </Modal>

      <CopywritingStyleModal
        visible={copywritingModalVisible}
        onCancel={() => setCopywritingModalVisible(false)}
        onGenerate={handleGenerateWithStyle}
        products={products}
      />
    </Layout>
  );
};

export default GeneratePage;
