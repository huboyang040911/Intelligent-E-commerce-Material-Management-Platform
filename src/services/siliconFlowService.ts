import type { Product } from '../types';

interface SiliconFlowImageRequest {
  model: string;
  prompt: string;
  image_size: string;
  batch_size: number;
  num_inference_steps: number;
  guidance_scale: number;
}

interface SiliconFlowImageEditRequest {
  model: string;
  prompt: string;
  image: string;
  image2?: string;
  image3?: string;
  negative_prompt?: string;
  seed?: number;
  num_inference_steps?: number;
  cfg?: number;
}

interface SiliconFlowImageResponse {
  images: {
    url: string;
  }[];
  timings: {
    inference: number;
  };
  seed: number;
}

export const siliconFlowService = {
  generateImage: async (product: Product, sellingPoints: string[]): Promise<string> => {
    try {
      console.log('Generating image with Silicon Flow API for:', product.name);
      
      // 获取API密钥
      const apiKey = import.meta.env.VITE_SILICON_FLOW_API_KEY;
      if (!apiKey) {
        throw new Error('Silicon Flow API key is not configured');
      }
      
      // 构建prompt
      const prompt = siliconFlowService.buildPrompt(product, sellingPoints);
      console.log('Generated prompt:', prompt);
      
      // 构建请求参数
      const payload: SiliconFlowImageRequest = {
        model: 'Kwai-Kolors/Kolors',
        prompt,
        image_size: '1024x1024',
        batch_size: 1,
        num_inference_steps: 20,
        guidance_scale: 7.5
      };
      
      // 发送请求
      const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      // 检查响应状态
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
      }
      
      // 解析响应
      const data: SiliconFlowImageResponse = await response.json();
      
      // 检查响应数据
      if (!data.images || data.images.length === 0 || !data.images[0].url) {
        throw new Error('Invalid API response: no image URL returned');
      }
      
      console.log('Image generated successfully:', data.images[0].url);
      return data.images[0].url;
    } catch (error) {
      console.error('Failed to generate image with Silicon Flow API:', error);
      throw error;
    }
  },

  generateImageFromPrompt: async (prompt: string, imageSize: string = '1024x1024'): Promise<string> => {
    try {
      console.log('Generating image from prompt:', prompt);
      
      // 获取API密钥
      const apiKey = import.meta.env.VITE_SILICON_FLOW_API_KEY;
      if (!apiKey) {
        throw new Error('Silicon Flow API key is not configured');
      }
      
      // 构建请求参数
      const payload: SiliconFlowImageRequest = {
        model: 'Kwai-Kolors/Kolors',
        prompt,
        image_size: imageSize,
        batch_size: 1,
        num_inference_steps: 20,
        guidance_scale: 7.5
      };
      
      // 发送请求
      const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      // 检查响应状态
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API request failed: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
      }
      
      // 解析响应
      const data: SiliconFlowImageResponse = await response.json();
      
      // 检查响应数据
      if (!data.images || data.images.length === 0 || !data.images[0].url) {
        throw new Error('Invalid API response: no image URL returned');
      }
      
      console.log('Image generated successfully:', data.images[0].url);
      return data.images[0].url;
    } catch (error) {
      console.error('Failed to generate image from prompt:', error);
      throw error;
    }
  },
  
  buildPrompt: (product: Product, sellingPoints: string[]): string => {
    // 构建基础prompt
    let prompt = `${product.name}, ${product.category}, ${product.brand}`;
    
    // 添加材质
    if (product.material) {
      prompt += `, ${product.material}材质`;
    }
    
    // 添加颜色
    if (product.color) {
      prompt += `, ${product.color}`;
    }
    
    // 添加适用人群
    if (product.targetAudience) {
      prompt += `, 适合${product.targetAudience}`;
    }
    
    // 添加卖点
    if (sellingPoints && sellingPoints.length > 0) {
      prompt += `, ${sellingPoints.join(', ')}`;
    }
    
    // 添加风格描述
    prompt += `, 高质量产品照片, 专业摄影, 白色背景, 清晰细节, 商业风格, 4K分辨率`;
    
    return prompt;
  },

  generateImageFromImage: async (prompt: string, imageUrl: string, negativePrompt?: string): Promise<string> => {
    try {
      console.log('Generating image from image with Silicon Flow API');
      console.log('Using image URL:', imageUrl);
      
      // 获取API密钥
      const apiKey = import.meta.env.VITE_SILICON_FLOW_API_KEY;
      if (!apiKey) {
        throw new Error('Silicon Flow API key is not configured');
      }
      
      // 构建请求参数
      const payload: SiliconFlowImageEditRequest = {
        model: 'Qwen/Qwen-Image-Edit-2509',
        prompt,
        image: imageUrl,
        negative_prompt: negativePrompt,
        num_inference_steps: 50,
        cfg: 4.0
      };
      
      console.log('Sending payload:', JSON.stringify(payload, null, 2));
      
      // 发送请求
      const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      console.log('Response status:', response.status);
      
      // 检查响应状态
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error response:', errorData);
        throw new Error(`API request failed: ${response.status} ${JSON.stringify(errorData)}`);
      }
      
      // 解析响应
      const data: SiliconFlowImageResponse = await response.json();
      console.log('Success response:', data);
      
      // 检查响应数据
      if (!data.images || data.images.length === 0 || !data.images[0].url) {
        throw new Error('Invalid API response: no image URL returned');
      }
      
      console.log('Image generated successfully:', data.images[0].url);
      return data.images[0].url;
    } catch (error) {
      console.error('Failed to generate image from image:', error);
      throw error;
    }
  }
};
