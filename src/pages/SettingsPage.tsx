import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, Modal, message, Typography, Divider, Space, Row, Col, Avatar } from 'antd';
import { AppstoreOutlined, DatabaseOutlined, SettingOutlined, FileTextOutlined, UserOutlined, LockOutlined, EditOutlined, SaveOutlined, LogoutOutlined, PictureOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Content, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;

// 虚拟用户数据
const initialUserInfo = {
  username: 'admin',
  employeeId: 'EMP001',
  department: '运营部',
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
};

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(initialUserInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [loginForm] = Form.useForm();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isSettingsPage = location.pathname === '/settings';

  // 登录验证
  const handleLogin = (values: { username: string; password: string }) => {
    if (values.username === 'admin' && values.password === '123') {
      setIsAuthenticated(true);
      setLoginModalVisible(false);
      message.success('登录成功');
    } else {
      message.error('用户名或密码错误');
      // 3秒后提示返回首页
      setTimeout(() => {
        Modal.confirm({
          title: '登录失败',
          content: '请检查用户名和密码，是否需要返回首页？',
          onOk: () => navigate('/'),
          onCancel: () => {}
        });
      }, 1000);
    }
  };

  // 处理设置按钮点击
  const handleSettingsClick = () => {
    if (!isAuthenticated) {
      setLoginModalVisible(true);
    } else {
      navigate('/settings');
    }
  };

  // 处理个人信息修改
  const handleSaveUserInfo = (values: any) => {
    setUserInfo(values);
    setIsEditing(false);
    message.success('个人信息已更新');
  };

  // 处理登出
  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginModalVisible(true);
    message.info('已登出');
  };

  // 登录模态框
  const renderLoginModal = () => (
    <Modal
      title={null}
      open={loginModalVisible}
      footer={null}
      onCancel={() => {
        setLoginModalVisible(false);
        // 如果不是在设置页面，点击取消后不做任何操作
        // 如果是在设置页面，点击取消后返回首页
        if (isSettingsPage) {
          navigate('/');
        }
      }}
      style={{
        borderRadius: 16,
      }}
      bodyStyle={{
        padding: 0,
        borderRadius: 16,
      }}
      maskStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      closeIcon={
        <div style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          background: 'rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          cursor: 'pointer'
        }}>
          ✕
        </div>
      }
    >
      <div style={{ 
        maxWidth: 400, 
        margin: '0 auto',
        textAlign: 'center',
        padding: 32
      }}>
        {/* 头部标题区域 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            fontSize: 48, 
            marginBottom: 16,
            textAlign: 'center'
          }}>🔒</div>
          <div style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: '#667eea',
            marginBottom: 8
          }}>
            设置访问验证
          </div>
          <div style={{ 
            fontSize: 14, 
            color: '#999'
          }}>
            请输入验证信息以访问设置页面
          </div>
        </div>
        
        <Form
          form={loginForm}
          onFinish={handleLogin}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label={
              <span style={{ 
                fontSize: 14, 
                fontWeight: 600, 
                color: '#666',
                marginBottom: 8,
                display: 'block'
              }}>
                用户名
              </span>
            }
            rules={[{ required: true, message: '请输入用户名' }]}
            style={{
              marginBottom: 16,
            }}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#667eea' }} />} 
              placeholder="请输入用户名" 
              style={{
                height: 48,
                borderRadius: 12,
                border: '1px solid #e0e0e0',
                fontSize: 16,
                padding: '0 16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease'
              }}
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            label={
              <span style={{ 
                fontSize: 14, 
                fontWeight: 600, 
                color: '#666',
                marginBottom: 8,
                display: 'block'
              }}>
                密码
              </span>
            }
            rules={[{ required: true, message: '请输入密码' }]}
            style={{
              marginBottom: 24,
            }}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#667eea' }} />} 
              placeholder="请输入密码" 
              style={{
                height: 48,
                borderRadius: 12,
                border: '1px solid #e0e0e0',
                fontSize: 16,
                padding: '0 16px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease'
              }}
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              style={{
                height: 52,
                fontSize: 16,
                fontWeight: 600,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              登录验证
            </Button>
          </Form.Item>
          
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            fontSize: 14,
            marginTop: 24,
            padding: 16,
            background: '#f9f9f9',
            borderRadius: 12,
            border: '1px solid #f0f0f0'
          }}>
            <div style={{ marginBottom: 8, fontWeight: 600, color: '#666' }}>测试账号信息</div>
            <div style={{ marginBottom: 4 }}>用户名：<span style={{ color: '#667eea', fontWeight: 500 }}>admin</span></div>
            <div>密码：<span style={{ color: '#667eea', fontWeight: 500 }}>123</span></div>
          </div>
        </Form>
      </div>
    </Modal>
  );

  // 未登录时显示登录模态框
  React.useEffect(() => {
    if (!isAuthenticated && isSettingsPage) {
      setLoginModalVisible(true);
    }
  }, [isAuthenticated, isSettingsPage]);

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
            onClick={handleSettingsClick}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 8px',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: isSettingsPage ? '#667eea' : 'transparent',
              color: isSettingsPage ? '#fff' : '#666',
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
        
        {isAuthenticated ? (
          <div style={{ height: 'calc(100vh - 60px)', overflow: 'auto', padding: 24 }}>
            {/* 顶部标题 */}
            <div style={{ marginBottom: 24 }}>
              <Title level={2} style={{ margin: 0, color: '#1a1a1a' }}>设置</Title>
              <Paragraph style={{ margin: '8px 0 12px 0', color: '#666' }}>
                管理个人信息和系统设置
              </Paragraph>
              <div style={{ height: 1, background: 'linear-gradient(90deg, #f0f0f0 0%, transparent 100%)' }}></div>
            </div>

            {/* 个人信息卡片 */}
            <Card title="个人信息" hoverable style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                <Avatar size={80} style={{ marginRight: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  {userInfo.name.charAt(0)}
                </Avatar>
                <div>
                  <Title level={4} style={{ margin: 0 }}>{userInfo.name}</Title>
                <Text style={{ color: '#666' }}>{userInfo.department}</Text>
                </div>
                <Button 
                  type="primary" 
                  icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
                  onClick={() => setIsEditing(!isEditing)}
                  style={{ marginLeft: 'auto' }}
                >
                  {isEditing ? '取消' : '编辑'}
                </Button>
              </div>

              {isEditing ? (
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={userInfo}
                  onFinish={handleSaveUserInfo}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '请输入姓名' }]}
                      >
                        <Input placeholder="请输入姓名" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="employeeId"
                        label="工号"
                        rules={[{ required: true, message: '请输入工号' }]}
                      >
                        <Input placeholder="请输入工号" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="username"
                        label="用户名"
                        rules={[{ required: true, message: '请输入用户名' }]}
                      >
                        <Input placeholder="请输入用户名" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="department"
                        label="部门"
                        rules={[{ required: true, message: '请输入部门' }]}
                      >
                        <Input placeholder="请输入部门" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="邮箱"
                        rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入有效的邮箱地址' }]}
                      >
                        <Input placeholder="请输入邮箱" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="电话"
                        rules={[{ required: true, message: '请输入电话' }]}
                      >
                        <Input placeholder="请输入电话" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block size="large">
                      保存修改
                    </Button>
                  </Form.Item>
                </Form>
              ) : (
                <div>
                  <Row gutter={16}>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4, color: '#666' }}>姓名</Text>
                        <Text>{userInfo.name}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4, color: '#666' }}>工号</Text>
                        <Text>{userInfo.employeeId}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4, color: '#666' }}>用户名</Text>
                        <Text>{userInfo.username}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4, color: '#666' }}>部门</Text>
                        <Text>{userInfo.department}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4, color: '#666' }}>邮箱</Text>
                        <Text>{userInfo.email}</Text>
                      </div>
                    </Col>
                    <Col span={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ display: 'block', marginBottom: 4, color: '#666' }}>电话</Text>
                        <Text>{userInfo.phone}</Text>
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </Card>

            {/* 安全设置卡片 */}
            <Card title="安全设置" hoverable style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 24 }}>
                <Text strong style={{ display: 'block', marginBottom: 8, color: '#666' }}>账号安全</Text>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: '#f9f9f9', borderRadius: 8, marginBottom: 8 }}>
                  <div>
                    <Text>修改密码</Text>
                    <Text style={{ display: 'block', fontSize: 12, color: '#999', marginTop: 4 }}>
                      定期修改密码以保障账号安全
                    </Text>
                  </div>
                  <Button>修改</Button>
                </div>
              </div>

              <Divider />

              <Button 
                type="default" 
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{ marginTop: 16 }}
              >
                退出登录
              </Button>
            </Card>

            {/* 系统信息卡片 */}
            <Card title="系统信息" hoverable>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: 'block', marginBottom: 4, color: '#666' }}>版本</Text>
                <Text>v1.0.0</Text>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Text strong style={{ display: 'block', marginBottom: 4, color: '#666' }}>更新时间</Text>
                <Text>2026-02-03</Text>
              </div>
              <div>
                <Text strong style={{ display: 'block', marginBottom: 4, color: '#666' }}>系统状态</Text>
                <Text style={{ color: '#52c41a' }}>正常运行</Text>
              </div>
            </Card>
          </div>
        ) : (
          <div style={{ 
            height: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#999'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
              <Title level={4} style={{ marginBottom: 16 }}>设置需要验证</Title>
              <Paragraph style={{ marginBottom: 24 }}>
                请点击左侧导航栏中的设置按钮，并输入验证信息
              </Paragraph>
              <Button type="primary" onClick={() => setLoginModalVisible(true)}>
                立即验证
              </Button>
            </div>
          </div>
        )}
      </Content>

      {/* 登录模态框 */}
      {renderLoginModal()}
    </Layout>
  );
};

export default SettingsPage;