import React, { useState } from 'react';
import { Form, Input, Select, Switch, Button, Row, Col, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Product } from '../../types';
import { productService } from '../../services/productService';
import ImageUploader from '../ImageUploader';

const { TextArea } = Input;

const categories = [
  { label: '服装', value: '服装' },
  { label: '鞋靴', value: '鞋靴' },
  { label: '箱包', value: '箱包' },
  { label: '数码', value: '数码' },
  { label: '家居', value: '家居' },
  { label: '美妆', value: '美妆' },
  { label: '食品', value: '食品' },
  { label: '母婴', value: '母婴' },
  { label: '运动', value: '运动' },
  { label: '其他', value: '其他' },
];

const targetAudiences = [
  { label: '儿童', value: '儿童' },
  { label: '青少年', value: '青少年' },
  { label: '成人', value: '成人' },
  { label: '老人', value: '老人' },
  { label: '通用', value: '通用' },
];

interface ProductFormProps {
  onSubmit: (product: Product) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onSubmit }) => {
  const [form] = Form.useForm();
  const [images, setImages] = useState<string[]>([]);
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const productData = {
        ...values,
        images,
        referenceImages,
      };

      const validation = productService.validateProduct(productData);
      if (!validation.valid) {
        validation.errors.forEach((error) => {
          message.error(error);
        });
        return;
      }

      const product = productService.createProduct(productData);
      onSubmit(product);

      form.resetFields();
      setImages([]);
      setReferenceImages([]);
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        saveToLibrary: false,
      }}
    >
      {/* 基础信息 */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#999', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
          基础信息
        </h4>
        
        <Form.Item
          label={<span style={{ fontWeight: 500, color: '#666', fontSize: 14 }}>商品名称</span>}
          name="name"
          rules={[{ required: true, message: '请输入商品名称' }]}
          style={{ marginBottom: 16 }}
        >
          <Input 
            placeholder="例如：透气运动跑鞋" 
            size="large"
            style={{ borderRadius: 8, height: 44 }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontWeight: 500, color: '#666', fontSize: 14 }}>品牌</span>}
              name="brand"
              rules={[{ required: true, message: '请输入品牌' }]}
              style={{ marginBottom: 16 }}
            >
              <Input 
                placeholder="品牌名" 
                size="large"
                style={{ borderRadius: 8, height: 44 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={<span style={{ fontWeight: 500, color: '#666', fontSize: 14 }}>类目</span>}
              name="category"
              rules={[{ required: true, message: '请选择类目' }]}
              style={{ marginBottom: 16 }}
            >
              <Select 
                placeholder="例如：运动鞋" 
                options={categories}
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* 属性规格 */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#999', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
          属性规格
        </h4>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label={<span style={{ fontWeight: 500, color: '#666', fontSize: 14 }}>材质</span>} 
              name="material"
              style={{ marginBottom: 16 }}
            >
              <Input 
                placeholder="例如：网面/棉质" 
                size="large"
                style={{ borderRadius: 8, height: 44 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label={<span style={{ fontWeight: 500, color: '#666', fontSize: 14 }}>颜色</span>} 
              name="color"
              style={{ marginBottom: 16 }}
            >
              <Input 
                placeholder="例如：黑/白" 
                size="large"
                style={{ borderRadius: 8, height: 44 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label={<span style={{ fontWeight: 500, color: '#666', fontSize: 14 }}>尺寸</span>} 
              name="size"
              style={{ marginBottom: 16 }}
            >
              <Input 
                placeholder="例如：36-44" 
                size="large"
                style={{ borderRadius: 8, height: 44 }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label={<span style={{ fontWeight: 500, color: '#666', fontSize: 14 }}>适用人群</span>} 
              name="targetAudience"
              style={{ marginBottom: 16 }}
            >
              <Select 
                placeholder="例如：青年男性" 
                allowClear 
                options={targetAudiences}
                size="large"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>

      {/* 视觉素材 */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#999', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
          视觉素材
        </h4>
        
        <Form.Item
          label={<span style={{ fontWeight: 500, color: '#666', fontSize: 14 }}>商品图片</span>}
          style={{ marginBottom: 16 }}
        >
          <ImageUploader
            images={images}
            onChange={setImages}
            maxCount={5}
            title=""
          />
        </Form.Item>

        <Form.Item 
          label={<span style={{ fontWeight: 500, color: '#666', fontSize: 14 }}>历史爆款参考图</span>}
          style={{ marginBottom: 16 }}
        >
          <ImageUploader
            images={referenceImages}
            onChange={setReferenceImages}
            maxCount={3}
            title=""
          />
        </Form.Item>
      </div>

      {/* 其他设置 */}
      <div style={{ marginBottom: 16 }}>
        <h4 style={{ fontSize: 13, fontWeight: 600, color: '#999', marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>
          其他设置
        </h4>
        
        <Form.Item
          label={<span style={{ fontWeight: 500, color: '#666', fontSize: 14 }}>参考链接</span>}
          name="referenceLink"
          style={{ marginBottom: 16 }}
        >
          <Input 
            placeholder="请输入参考链接" 
            size="large"
            style={{ borderRadius: 8, height: 44 }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 500, color: '#666', fontSize: 14 }}>保存到素材库</span>}
          name="saveToLibrary"
          valuePropName="checked"
          style={{ marginBottom: 0 }}
        >
          <Switch />
        </Form.Item>
      </div>
    </Form>
  );
};

export default ProductForm;
