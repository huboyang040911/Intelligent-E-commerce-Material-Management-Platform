import type { Product } from '../types';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface CopywritingRequest {
  model: string;
  messages: ChatMessage[];
}

interface CopywritingResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
      reasoning_content?: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    completion_tokens_details: {
      reasoning_tokens: number;
    };
    prompt_tokens_details: {
      cached_tokens: number;
    };
    prompt_cache_hit_tokens: number;
    prompt_cache_miss_tokens: number;
  };
  system_fingerprint: string;
}

export type CopywritingStyle = 'bestseller' | 'emotional' | 'professional' | 'humorous' | 'storytelling' | 'minimalist';

export const copywritingService = {
  generateTitle: async (product: Product): Promise<string> => {
    try {
      console.log('Generating title with Silicon Flow API for:', product.name);
      
      // 获取API密钥
      const apiKey = import.meta.env.VITE_SILICON_FLOW_API_KEY;
      if (!apiKey) {
        throw new Error('Silicon Flow API key is not configured');
      }
      
      // 构建messages
      const messages = copywritingService.buildTitleMessages(product);
      console.log('Generated messages for title:', messages);
      
      // 构建请求参数
      const payload: CopywritingRequest = {
        model: 'Qwen/Qwen3-VL-8B-Instruct',
        messages
      };
      
      // 发送请求
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
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
      const data: CopywritingResponse = await response.json();
      
      // 检查响应数据
      if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
        throw new Error('Invalid API response: no content returned');
      }
      
      const title = data.choices[0].message.content.trim();
      console.log('Generated title:', title);
      return title;
    } catch (error) {
      console.error('Failed to generate title with Silicon Flow API:', error);
      // 回退到本地生成
      return copywritingService.fallbackGenerateTitle(product);
    }
  },
  
  generateSellingPoints: async (product: Product): Promise<string[]> => {
    try {
      console.log('Generating selling points with Silicon Flow API for:', product.name);
      
      // 获取API密钥
      const apiKey = import.meta.env.VITE_SILICON_FLOW_API_KEY;
      if (!apiKey) {
        throw new Error('Silicon Flow API key is not configured');
      }
      
      // 构建messages
      const messages = copywritingService.buildSellingPointsMessages(product);
      console.log('Generated messages for selling points:', messages);
      
      // 构建请求参数
      const payload: CopywritingRequest = {
        model: 'Qwen/Qwen3-VL-8B-Instruct',
        messages
      };
      
      // 发送请求
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
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
      const data: CopywritingResponse = await response.json();
      
      // 检查响应数据
      if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
        throw new Error('Invalid API response: no content returned');
      }
      
      const content = data.choices[0].message.content.trim();
      console.log('Generated selling points content:', content);
      
      // 解析卖点列表
      const sellingPoints = copywritingService.parseSellingPoints(content);
      console.log('Parsed selling points:', sellingPoints);
      return sellingPoints;
    } catch (error) {
      console.error('Failed to generate selling points with Silicon Flow API:', error);
      // 回退到本地生成
      return copywritingService.fallbackGenerateSellingPoints(product);
    }
  },
  
  generateDescription: async (product: Product): Promise<string> => {
    try {
      console.log('Generating description with Silicon Flow API for:', product.name);
      
      // 获取API密钥
      const apiKey = import.meta.env.VITE_SILICON_FLOW_API_KEY;
      if (!apiKey) {
        throw new Error('Silicon Flow API key is not configured');
      }
      
      // 构建messages
      const messages = copywritingService.buildDescriptionMessages(product);
      console.log('Generated messages for description:', messages);
      
      // 构建请求参数
      const payload: CopywritingRequest = {
        model: 'Qwen/Qwen3-VL-8B-Instruct',
        messages
      };
      
      // 发送请求
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
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
      const data: CopywritingResponse = await response.json();
      
      // 检查响应数据
      if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
        throw new Error('Invalid API response: no content returned');
      }
      
      const description = data.choices[0].message.content.trim();
      console.log('Generated description:', description);
      return description;
    } catch (error) {
      console.error('Failed to generate description with Silicon Flow API:', error);
      // 回退到本地生成
      return copywritingService.fallbackGenerateDescription(product);
    }
  },
  
  generateDescriptionWithStyle: async (product: Product, style: CopywritingStyle): Promise<string> => {
    try {
      console.log('Generating description with style:', style, 'for:', product.name);
      
      // 获取API密钥
      const apiKey = import.meta.env.VITE_SILICON_FLOW_API_KEY;
      if (!apiKey) {
        throw new Error('Silicon Flow API key is not configured');
      }
      
      // 构建messages based on style
      let messages: ChatMessage[] = [];
      switch (style) {
        case 'bestseller':
          messages = copywritingService.buildBestsellerDescriptionMessages(product);
          break;
        case 'emotional':
          messages = copywritingService.buildEmotionalDescriptionMessages(product);
          break;
        case 'professional':
          messages = copywritingService.buildProfessionalDescriptionMessages(product);
          break;
        case 'humorous':
          messages = copywritingService.buildHumorousDescriptionMessages(product);
          break;
        case 'storytelling':
          messages = copywritingService.buildStorytellingDescriptionMessages(product);
          break;
        case 'minimalist':
          messages = copywritingService.buildMinimalistDescriptionMessages(product);
          break;
        default:
          messages = copywritingService.buildDescriptionMessages(product);
      }
      
      console.log('Generated messages for description with style:', messages);
      
      // 构建请求参数
      const payload: CopywritingRequest = {
        model: 'Qwen/Qwen3-VL-8B-Instruct',
        messages
      };
      
      // 发送请求
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
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
      const data: CopywritingResponse = await response.json();
      
      // 检查响应数据
      if (!data.choices || data.choices.length === 0 || !data.choices[0].message.content) {
        throw new Error('Invalid API response: no content returned');
      }
      
      const description = data.choices[0].message.content.trim();
      console.log('Generated description with style:', description);
      return description;
    } catch (error) {
      console.error('Failed to generate description with style:', error);
      // 回退到本地生成
      return copywritingService.fallbackGenerateDescription(product);
    }
  },
  
  buildTitleMessages: (product: Product): ChatMessage[] => {
    return [
      {
        role: 'system',
        content: '你是一个专业的电商文案生成助手，擅长为各种商品生成吸引人的标题。请根据提供的商品信息，生成一个简洁、吸引人的商品标题，不超过20个字。'
      },
      {
        role: 'user',
        content: `请为以下商品生成一个吸引人的标题：\n商品名称：${product.name}\n类目：${product.category}\n品牌：${product.brand}\n材质：${product.material || '未知'}\n颜色：${product.color || '未知'}\n尺寸：${product.size || '未知'}\n适用人群：${product.targetAudience || '未知'}\n\n要求：\n1. 标题要简洁，不超过20个字\n2. 要包含商品的主要卖点\n3. 要有吸引力，能够引起消费者的购买欲望\n4. 不要包含任何标点符号\n5. 直接返回标题，不要有任何前缀或后缀`
      }
    ];
  },
  
  buildSellingPointsMessages: (product: Product): ChatMessage[] => {
    return [
      {
        role: 'system',
        content: '你是一个专业的电商文案生成助手，擅长为各种商品生成吸引人的卖点。请根据提供的商品信息，生成2-3个简洁、吸引人的商品卖点，每个卖点不超过30个字。'
      },
      {
        role: 'user',
        content: `请为以下商品生成2-3个吸引人的卖点：\n商品名称：${product.name}\n类目：${product.category}\n品牌：${product.brand}\n材质：${product.material || '未知'}\n颜色：${product.color || '未知'}\n尺寸：${product.size || '未知'}\n适用人群：${product.targetAudience || '未知'}\n\n要求：\n1. 每个卖点要简洁，不超过30个字\n2. 要突出商品的主要优势和特点\n3. 要有吸引力，能够引起消费者的购买欲望\n4. 每个卖点单独一行\n5. 直接返回卖点列表，不要有任何前缀或后缀`
      }
    ];
  },
  
  buildDescriptionMessages: (product: Product): ChatMessage[] => {
    return [
      {
        role: 'system',
        content: '你是一个专业的电商文案生成助手，擅长为各种商品生成详细、吸引人的商品描述。请根据提供的商品信息，生成一段100字左右的商品描述，突出商品的特点和优势。'
      },
      {
        role: 'user',
        content: `请为以下商品生成一段详细的商品描述：\n商品名称：${product.name}\n类目：${product.category}\n品牌：${product.brand}\n材质：${product.material || '未知'}\n颜色：${product.color || '未知'}\n尺寸：${product.size || '未知'}\n适用人群：${product.targetAudience || '未知'}\n\n要求：\n1. 描述要详细，在100字左右\n2. 要突出商品的主要特点、优势和卖点\n3. 要有吸引力，能够引起消费者的购买欲望\n4. 语言要流畅、自然，符合电商平台的表达风格\n5. 直接返回描述内容，不要有任何前缀或后缀`
      }
    ];
  },
  
  // 爆款风格描述 - 抓住眼球，突出卖点，适合快速吸引流量
  buildBestsellerDescriptionMessages: (product: Product): ChatMessage[] => {
    return [
      {
        role: 'system',
        content: '你是一个专业的电商爆款文案生成专家，擅长创作能够快速吸引流量、引发购买冲动的商品描述。你的文案要充满激情，突出商品的核心卖点，使用具有冲击力的词汇和表达手法。'
      },
      {
        role: 'user',
        content: `请为以下商品生成一段爆款风格的商品描述：\n商品名称：${product.name}\n类目：${product.category}\n品牌：${product.brand}\n材质：${product.material || '未知'}\n颜色：${product.color || '未知'}\n尺寸：${product.size || '未知'}\n适用人群：${product.targetAudience || '未知'}\n\n要求：\n1. 风格要热情洋溢，充满感染力，能够快速抓住消费者眼球\n2. 突出商品的核心卖点和独特优势，强调稀缺性和紧迫感\n3. 使用有力的动词和形容词，营造热销氛围\n4. 长度在100字左右，语言简洁有力\n5. 直接返回描述内容，不要有任何前缀或后缀`
      }
    ];
  },
  
  // 情感共鸣描述 - 触动用户情感，建立品牌连接
  buildEmotionalDescriptionMessages: (product: Product): ChatMessage[] => {
    return [
      {
        role: 'system',
        content: '你是一个擅长情感营销的电商文案专家，能够通过细腻的情感表达触动消费者内心，建立商品与消费者之间的情感连接。你的文案要温暖、感性，能够引发共鸣。'
      },
      {
        role: 'user',
        content: `请为以下商品生成一段情感共鸣风格的商品描述：\n商品名称：${product.name}\n类目：${product.category}\n品牌：${product.brand}\n材质：${product.material || '未知'}\n颜色：${product.color || '未知'}\n尺寸：${product.size || '未知'}\n适用人群：${product.targetAudience || '未知'}\n\n要求：\n1. 风格要温暖感性，能够触动消费者的情感\n2. 描述商品如何融入日常生活，带来情感价值\n3. 使用细腻的场景描写，让消费者产生代入感\n4. 长度在100字左右，语言流畅自然\n5. 直接返回描述内容，不要有任何前缀或后缀`
      }
    ];
  },
  
  // 专业测评描述 - 客观专业，突出品质和性价比
  buildProfessionalDescriptionMessages: (product: Product): ChatMessage[] => {
    return [
      {
        role: 'system',
        content: '你是一个专业的产品测评专家，擅长从客观专业的角度分析商品的优缺点，为消费者提供有价值的购买参考。你的文案要数据详实，分析深入，突出商品的品质和性价比。'
      },
      {
        role: 'user',
        content: `请为以下商品生成一段专业测评风格的商品描述：\n商品名称：${product.name}\n类目：${product.category}\n品牌：${product.brand}\n材质：${product.material || '未知'}\n颜色：${product.color || '未知'}\n尺寸：${product.size || '未知'}\n适用人群：${product.targetAudience || '未知'}\n\n要求：\n1. 风格要专业客观，体现深度分析\n2. 突出商品的品质、工艺和技术特点\n3. 可以适当对比同类产品，突出性价比\n4. 长度在100字左右，语言严谨准确\n5. 直接返回描述内容，不要有任何前缀或后缀`
      }
    ];
  },
  
  // 幽默风趣描述 - 轻松幽默，增加互动和传播
  buildHumorousDescriptionMessages: (product: Product): ChatMessage[] => {
    return [
      {
        role: 'system',
        content: '你是一个幽默风趣的电商文案创作者，擅长用轻松幽默的语言描述商品，让消费者在欢笑中记住商品的特点，增加内容的互动性和传播性。'
      },
      {
        role: 'user',
        content: `请为以下商品生成一段幽默风趣风格的商品描述：\n商品名称：${product.name}\n类目：${product.category}\n品牌：${product.brand}\n材质：${product.material || '未知'}\n颜色：${product.color || '未知'}\n尺寸：${product.size || '未知'}\n适用人群：${product.targetAudience || '未知'}\n\n要求：\n1. 风格要轻松幽默，充满趣味性\n2. 使用俏皮的语言和比喻，让描述生动有趣\n3. 在幽默中自然融入商品的卖点\n4. 长度在100字左右，语言活泼可爱\n5. 直接返回描述内容，不要有任何前缀或后缀`
      }
    ];
  },
  
  // 故事营销描述 - 通过故事讲述，增强记忆点
  buildStorytellingDescriptionMessages: (product: Product): ChatMessage[] => {
    return [
      {
        role: 'system',
        content: '你是一个擅长故事营销的电商文案专家，能够通过生动的故事讲述来呈现商品的价值和特点，让消费者在故事中理解商品的意义，增强记忆点和情感连接。'
      },
      {
        role: 'user',
        content: `请为以下商品生成一段故事营销风格的商品描述：\n商品名称：${product.name}\n类目：${product.category}\n品牌：${product.brand}\n材质：${product.material || '未知'}\n颜色：${product.color || '未知'}\n尺寸：${product.size || '未知'}\n适用人群：${product.targetAudience || '未知'}\n\n要求：\n1. 风格要叙事性强，通过故事来呈现商品\n2. 创造一个与商品相关的生动场景或故事\n3. 在故事中自然融入商品的特点和价值\n4. 长度在100字左右，语言流畅有画面感\n5. 直接返回描述内容，不要有任何前缀或后缀`
      }
    ];
  },
  
  // 简约高级描述 - 简洁有力，突出品质感
  buildMinimalistDescriptionMessages: (product: Product): ChatMessage[] => {
    return [
      {
        role: 'system',
        content: '你是一个擅长简约高级风格的电商文案专家，能够用简洁有力的语言表达商品的品质感和高级感，通过最少的文字传达最丰富的信息，体现商品的精致和品味。'
      },
      {
        role: 'user',
        content: `请为以下商品生成一段简约高级风格的商品描述：\n商品名称：${product.name}\n类目：${product.category}\n品牌：${product.brand}\n材质：${product.material || '未知'}\n颜色：${product.color || '未知'}\n尺寸：${product.size || '未知'}\n适用人群：${product.targetAudience || '未知'}\n\n要求：\n1. 风格要简约克制，语言精炼有力\n2. 突出商品的材质、工艺和设计感\n3. 使用优雅、有品质感的词汇\n4. 长度在100字左右，留白得当，意味深长\n5. 直接返回描述内容，不要有任何前缀或后缀`
      }
    ];
  },
  
  parseSellingPoints: (content: string): string[] => {
    // 按行分割内容
    const lines = content.split('\n');
    
    // 过滤空行和无效行
    const sellingPoints = lines
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 2); // 最多返回2个卖点
    
    // 如果没有足够的卖点，使用默认卖点
    if (sellingPoints.length === 0) {
      return ['品质保证', '值得信赖'];
    }
    
    return sellingPoints;
  },
  
  // 回退到本地生成
  fallbackGenerateTitle: (product: Product): string => {
    console.log('Falling back to local title generation for:', product.name);
    
    const parts = [
      product.brand,
      product.material,
      product.color,
      product.name,
      product.targetAudience
    ].filter(Boolean);
    
    return parts.join(' ').trim() || product.name || '未命名商品';
  },
  
  // 回退到本地生成
  fallbackGenerateSellingPoints: (product: Product): string[] => {
    console.log('Falling back to local selling points generation for:', product.name);
    
    const sellingPoints = [];
    
    if (product.material) {
      sellingPoints.push(`${product.material}材质，品质保证`);
    }
    
    if (product.color) {
      sellingPoints.push(`${product.color}配色，时尚百搭`);
    }
    
    if (product.targetAudience) {
      sellingPoints.push(`适合${product.targetAudience}，专属设计`);
    }
    
    // 如果没有足够的卖点，使用默认卖点
    if (sellingPoints.length === 0) {
      return ['品质保证', '值得信赖'];
    }
    
    return sellingPoints.slice(0, 2);
  },
  
  // 回退到本地生成
  fallbackGenerateDescription: (product: Product): string => {
    console.log('Falling back to local description generation for:', product.name);
    
    let description = `${product.brand} ${product.name}，`;
    
    if (product.material) {
      description += `采用${product.material}材质，`;
    }
    
    if (product.color) {
      description += `有${product.color}等多种颜色可选，`;
    }
    
    if (product.size) {
      description += `尺寸齐全，${product.size}，`;
    }
    
    if (product.targetAudience) {
      description += `适合${product.targetAudience}使用，`;
    }
    
    description += `品质保证，值得信赖。`;
    
    return description;
  }
};
