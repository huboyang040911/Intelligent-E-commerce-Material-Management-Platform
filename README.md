<<<<<<< HEAD
# Intelligent-E-commerce-Material-Management-Platform
这是一个基于 React + TypeScript + Vite 构建的产品内容生成器与素材管理平台，同时结合AI能力，用于快速生成商品的文案和图片。
=======
# 产品内容生成器

这是一个基于 React + TypeScript + Vite 构建的产品内容生成器，用于快速生成商品的文案和图片。

## 技术栈

- **前端框架**: React 19.2.0
- **开发语言**: TypeScript
- **构建工具**: Vite
- **UI 组件库**: Ant Design 6.2.3
- **路由**: React Router 7.13.0
- **其他依赖**:
  - fabric (图像处理)
  - jszip (文件压缩)
  - xlsx (Excel 解析)
  - @ant-design/icons (图标库)

## 主要功能

1. **产品文案生成**: 基于商品信息自动生成营销文案
2. **图片生成与上传**:
   - 支持图片上传
   - 使用硅基流动 API 生成产品图片
   - 图片合成功能
3. **Excel 批量处理**: 支持上传 Excel 文件批量生成产品内容
4. **产品库管理**: 管理生成的产品内容库
5. **多模态生成**: 结合文字和图像的生成能力
6. **用户界面**: 包含多个功能页面（首页、生成页、图片生成页、库页面、设置页）

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 目录结构

```
src/
├── components/      # 组件
├── pages/           # 页面
├── services/        # 服务
├── utils/           # 工具函数
├── data/            # 数据文件
├── types/           # 类型定义
├── assets/          # 静态资源
├── App.tsx          # 应用入口
└── main.tsx         # 渲染入口
public/              # 公共静态资源
```

## 环境配置

### 硅基流动 API 配置

本项目使用硅基流动平台的大模型服务来生成产品图片。要使用此功能，您需要配置硅基流动 API 密钥。

1. **获取 API 密钥**
   - 访问 [硅基流动平台](https://www.siliconflow.cn/) 并注册账号
   - 在控制台中创建 API 密钥

2. **配置 API 密钥**
   - 复制 `.env.example` 文件并重命名为 `.env`
   - 在 `.env` 文件中添加您的 API 密钥：
     ```
     VITE_SILICON_FLOW_API_KEY=YOUR-API-KEY
     ```

3. **确保 API 密钥安全**
   - `.env` 文件已添加到 `.gitignore` 文件中，确保它不会被提交到版本控制系统
   - 不要在代码中硬编码 API 密钥
   - 不要在公共场合分享您的 API 密钥

## 使用指南

### 生成产品文案
1. 进入 "生成" 页面
2. 填写产品信息（名称、描述、特点等）
3. 点击 "生成文案" 按钮
4. 查看生成的文案结果

### 生成产品图片
1. 进入 "图片生成" 页面
2. 填写图片描述或上传参考图片
3. 点击 "生成图片" 按钮
4. 等待硅基流动 API 生成图片
5. 查看生成的图片结果

### 批量生成
1. 进入 "生成" 页面
2. 点击 "上传 Excel" 按钮
3. 选择包含产品信息的 Excel 文件
4. 点击 "批量生成" 按钮
5. 查看批量生成的结果

### 管理产品库
1. 进入 "库" 页面
2. 查看已生成的产品内容
3. 可以编辑或删除已有的产品内容

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 许可证

MIT License
>>>>>>> 19dd1c7 (Initial commit)
