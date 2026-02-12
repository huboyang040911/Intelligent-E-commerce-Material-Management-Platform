import React, { useState } from 'react';
import { Upload, message, Image, Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import { imageService } from '../../services/imageService';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxCount?: number;
  title?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxCount = 5,
  title = '上传图片',
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as File);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    setPreviewImage(src);
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = async ({ fileList: newFileList }) => {
    const validImages: string[] = [];
    
    for (const file of newFileList) {
      if (file.status === 'done' && file.originFileObj) {
        try {
          const validation = imageService.validateImageFile(file.originFileObj);
          if (!validation.valid) {
            message.error(validation.error);
            continue;
          }
          const base64 = await imageService.convertFileToBase64(file.originFileObj);
          validImages.push(base64);
        } catch (error) {
          message.error('图片处理失败');
        }
      } else if (file.url) {
        validImages.push(file.url);
      }
    }
    
    onChange(validImages);
  };

  const uploadButton = (
    <button style={{ 
      border: 0, 
      background: 'none',
      color: '#667eea'
    }} type="button">
      <PlusOutlined style={{ fontSize: 24 }} />
      <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600 }}>上传</div>
    </button>
  );

  return (
    <div>
      <div style={{ marginBottom: 12, fontSize: 15, fontWeight: 600, color: '#667eea' }}>
        {title}
      </div>
      <Upload
        listType="picture-card"
        fileList={images.map((url, index) => ({
          uid: `${index}`,
          name: `image-${index}`,
          status: 'done' as const,
          url,
        }))}
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => false}
        maxCount={maxCount}
      >
        {images.length >= maxCount ? null : uploadButton}
      </Upload>
      {previewImage && (
        <Image
          src={previewImage}
          style={{ display: 'none' }}
          preview={{
            open: previewOpen,
            onOpenChange: (open) => setPreviewOpen(open),
          }}
        />
      )}
    </div>
  );
};

export default ImageUploader;
