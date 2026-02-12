import React, { useState } from 'react';
import { Layout, Card, Input, Button, Row, Col, Space, Typography, Radio, message, Image, Spin, Upload } from 'antd';
import { PictureOutlined, FileTextOutlined, DatabaseOutlined, SettingOutlined, AppstoreOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { siliconFlowService } from '../services/siliconFlowService';

const { Content, Sider } = Layout;
const { TextArea } = Input;
const { Title } = Typography;

const ImageGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [prompt, setPrompt] = useState('');
  const [imageSize, setImageSize] = useState('1024x1024');
  const [style, setStyle] = useState('default');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [generationMode, setGenerationMode] = useState<'text2image' | 'image2image'>('text2image');
  const [referenceImage, setReferenceImage] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const isImageGeneratorPage = location.pathname === '/image-generator';

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setUploading(true);
    try {
      // 实现本地图片处理逻辑
      // 1. 读取本地文件并转换为base64格式
      const base64Url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      // 2. 将base64 URL设置为参考图片
      setReferenceImage(base64Url);
      message.success('图片上传成功');
      
      // 3. 调用onSuccess回调，通知Upload组件上传成功
      if (onSuccess) {
        onSuccess?.(file);
      }
    } catch (error) {
      console.error('图片上传失败:', error);
      message.error('图片上传失败，请重试');
      
      // 4. 调用onError回调，通知Upload组件上传失败
      if (onError) {
        onError?.(error);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      message.error('请输入图片描述');
      return;
    }

    if (generationMode === 'image2image' && !referenceImage) {
      message.error('请上传参考图片');
      return;
    }

    setGenerating(true);
    setError('');
    setResult('');

    try {
      let imageUrl: string;
      if (generationMode === 'text2image') {
        imageUrl = await siliconFlowService.generateImageFromPrompt(prompt, imageSize);
      } else {
        imageUrl = await siliconFlowService.generateImageFromImage(prompt, referenceImage, negativePrompt);
      }
      setResult(imageUrl);
      setGenerating(false);
      message.success('图片生成成功');
    } catch (err) {
      console.error('图片生成失败:', err);
      setError('图片生成失败，请重试');
      setGenerating(false);
      message.error('图片生成失败，请检查控制台获取详细信息');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
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
        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 20, 
          right: 20, 
          height: 1, 
          background: 'linear-gradient(90deg, transparent 0%, #f0f0f0 50%, transparent 100%)' 
        }}></div>
        
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
              background: isImageGeneratorPage ? '#667eea' : 'transparent',
              color: isImageGeneratorPage ? '#fff' : '#666',
              height: 80,
              width: '100%'
            }}
          >
            <PictureOutlined style={{ fontSize: 22, marginBottom: 4 }} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>图片生成</span>
          </div>
        </div>

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
          
          <div style={{ padding: 24, background: '#ffffff', borderBottom: '1px solid #f0f0f0' }}>
            <Row align="middle" justify="space-between">
              <Col>
                <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>AI 图像生成工具</Title>
              </Col>
            </Row>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card title="生成模式" hoverable style={{ marginBottom: 24 }}>
                  <Radio.Group 
                    value={generationMode} 
                    onChange={(e) => setGenerationMode(e.target.value)} 
                    buttonStyle="solid"
                  >
                    <Space wrap>
                      <Radio.Button value="text2image">文本到图像</Radio.Button>
                      <Radio.Button value="image2image">图像到图像</Radio.Button>
                    </Space>
                  </Radio.Group>
                </Card>

                {generationMode === 'image2image' && (
                  <Card title="参考图片" hoverable style={{ marginBottom: 24 }}>
                    <div style={{ textAlign: 'center', marginBottom: 16 }}>
                      {referenceImage ? (
                        <div>
                          <Image
                            src={referenceImage}
                            alt="参考图片"
                            style={{ width: '100%', maxWidth: 300, borderRadius: 8, marginBottom: 16 }}
                            preview={true}
                          />
                          <Button onClick={() => setReferenceImage('')}>移除图片</Button>
                        </div>
                      ) : (
                        <Upload
                          customRequest={handleUpload}
                          showUploadList={false}
                          maxCount={1}
                        >
                          <Button 
                            icon={<UploadOutlined />} 
                            loading={uploading}
                          >
                            上传参考图片
                          </Button>
                        </Upload>
                      )}
                    </div>
                  </Card>
                )}

                <Card title="选择风格" hoverable style={{ marginBottom: 24 }}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={8}>
                      <div 
                        style={{
                          padding: 20,
                          border: '2px solid #f0f0f0',
                          borderRadius: 12,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: style === 'product' ? '#f0f4ff' : 'transparent',
                          borderColor: style === 'product' ? '#667eea' : '#f0f0f0'
                        }}
                        onClick={() => setStyle('product')}
                      >
                        <div style={{ fontSize: 32, marginBottom: 12 }}>📦</div>
                        <span style={{ fontWeight: 600 }}>商品生成</span>
                        <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>生成电商商品海报</p>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div 
                        style={{
                          padding: 20,
                          border: '2px solid #f0f0f0',
                          borderRadius: 12,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: style === 'social' ? '#f0f4ff' : 'transparent',
                          borderColor: style === 'social' ? '#667eea' : '#f0f0f0'
                        }}
                        onClick={() => setStyle('social')}
                      >
                        <div style={{ fontSize: 32, marginBottom: 12 }}>📱</div>
                        <span style={{ fontWeight: 600 }}>抖音风格</span>
                        <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>生成抖音短视频配图</p>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div 
                        style={{
                          padding: 20,
                          border: '2px solid #f0f0f0',
                          borderRadius: 12,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: style === 'poster' ? '#f0f4ff' : 'transparent',
                          borderColor: style === 'poster' ? '#667eea' : '#f0f0f0'
                        }}
                        onClick={() => setStyle('poster')}
                      >
                        <div style={{ fontSize: 32, marginBottom: 12 }}>🎨</div>
                        <span style={{ fontWeight: 600 }}>海报风格</span>
                        <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>生成活动宣传海报</p>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div 
                        style={{
                          padding: 20,
                          border: '2px solid #f0f0f0',
                          borderRadius: 12,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: style === 'scene' ? '#f0f4ff' : 'transparent',
                          borderColor: style === 'scene' ? '#667eea' : '#f0f0f0'
                        }}
                        onClick={() => setStyle('scene')}
                      >
                        <div style={{ fontSize: 32, marginBottom: 12 }}>🌄</div>
                        <span style={{ fontWeight: 600 }}>场景合成</span>
                        <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>生成场景化图片</p>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div 
                        style={{
                          padding: 20,
                          border: '2px solid #f0f0f0',
                          borderRadius: 12,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: style === 'holiday' ? '#f0f4ff' : 'transparent',
                          borderColor: style === 'holiday' ? '#667eea' : '#f0f0f0'
                        }}
                        onClick={() => setStyle('holiday')}
                      >
                        <div style={{ fontSize: 32, marginBottom: 12 }}>🎄</div>
                        <span style={{ fontWeight: 600 }}>节日主题</span>
                        <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>生成节日主题海报</p>
                      </div>
                    </Col>
                    <Col xs={24} sm={8}>
                      <div 
                        style={{
                          padding: 20,
                          border: '2px solid #f0f0f0',
                          borderRadius: 12,
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: style === 'custom' ? '#f0f4ff' : 'transparent',
                          borderColor: style === 'custom' ? '#667eea' : '#f0f0f0'
                        }}
                        onClick={() => setStyle('custom')}
                      >
                        <div style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
                        <span style={{ fontWeight: 600 }}>自定义</span>
                        <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>自定义生成风格</p>
                      </div>
                    </Col>
                  </Row>
                </Card>

                <Card title="图片描述" hoverable style={{ marginBottom: 24 }}>
                  <TextArea
                    rows={6}
                    placeholder={generationMode === 'text2image' ? "请输入图片描述，例如：an island near sea, with seagulls, moon shining over the sea, light house, boats in the background" : "请输入编辑指令，例如：将这张图片中的猫变成狗，保持背景不变"}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    style={{ fontSize: 16, lineHeight: 1.6 }}
                  />
                  {generationMode === 'image2image' && (
                    <div style={{ marginTop: 16 }}>
                      <TextArea
                        rows={3}
                        placeholder="请输入负面提示词，描述你不想要的效果（可选）"
                        value={negativePrompt}
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        style={{ fontSize: 14, lineHeight: 1.6 }}
                      />
                    </div>
                  )}
                  <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ color: '#666', fontSize: 12 }}>
                        提示：描述越详细，生成效果越好
                      </span>
                    </div>
                    <Space>
                      <Button
                        onClick={() => {
                          setPrompt('');
                          setNegativePrompt('');
                        }}
                      >
                        清空
                      </Button>
                      <Button
                        type="primary"
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || generating}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          padding: '0 32px',
                          height: 40
                        }}
                      >
                        {generating ? (
                          <Spin size="small" style={{ color: '#fff' }} />
                        ) : (
                          '生成图片'
                        )}
                      </Button>
                    </Space>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card 
                  hoverable 
                  style={{ 
                    marginBottom: 24,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none'
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🎨</div>
                    <h3 style={{ margin: 0, color: '#fff' }}>AI 图像生成</h3>
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: 14, lineHeight: 1.6 }}>
                    使用 AI 技术，为您的商品快速生成专业的营销图片，提升品牌形象和销售效果。
                  </p>
                </Card>

                <Card title="使用提示" hoverable style={{ marginBottom: 24 }}>
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: '#666' }}>
                    <p style={{ marginBottom: 12 }}>1. 上传清晰的商品图片，建议使用白底图</p>
                    <p style={{ marginBottom: 12 }}>2. 选择合适的生成模式和风格</p>
                    <p style={{ marginBottom: 12 }}>3. 填写详细的图片描述</p>
                    <p>4. 点击生成按钮，等待图片生成完成</p>
                  </div>
                </Card>

                <Card title="生成结果" hoverable>
                  {result ? (
                    <div>
                      <Image
                        src={result}
                        alt="生成的图片"
                        style={{ width: '100%', borderRadius: 8, marginBottom: 16 }}
                        preview={true}
                      />
                      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = result;
                            link.download = `generated-image-${Date.now()}.png`;
                            link.click();
                          }}
                        >
                          下载图片
                        </Button>
                        <Button
                          onClick={() => setResult('')}
                        >
                          重新生成
                        </Button>
                      </Space>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                      <div style={{ fontSize: 48, marginBottom: 16 }}>🖼️</div>
                      <p style={{ color: '#666' }}>生成的图片将显示在这里</p>
                    </div>
                  )}
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ImageGeneratorPage;