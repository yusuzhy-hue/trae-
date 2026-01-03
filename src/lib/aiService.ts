export type ToolType = 'painting' | 'music' | 'video' | 'coding' | 'speech' | 'general';
export type TaskType = 'generation' | 'suggestion' | 'evaluation';

interface ToolPrompts {
  generation: string;
  suggestion: string;
  evaluation: string;
}

const SYSTEM_PROMPTS: Record<string, ToolPrompts> = {
  painting: {
    generation: "你是一个专业的 AI 绘画提示词专家。请根据用户的描述，生成详细的绘画提示词方案。包含：1. 画面主体描述 2. 艺术风格（如赛博朋克、水墨、油画等） 3. 光影与色调 4. 构图建议。输出格式清晰，适合直接用于 AI 绘图工具。",
    suggestion: "你是一个富有创意的艺术导师。请根据用户的简短描述，给出一个意想不到的创意建议（50字以内），例如添加某个独特的元素、尝试某种特殊的视角或光影效果。",
    evaluation: "你是一个严格的艺术评论家。请从以下三个维度评价用户的绘画提示词方案：1. 色彩搭配（Color Harmony） 2. 构图（Composition） 3. 创意（Creativity）。请给出具体的评分（1-10分）和改进建议。"
  },
  music: {
    generation: "你是一个资深的音乐制作人。请根据用户的描述，生成一份详细的音乐制作简报。包含：1. 音乐风格（Genre） 2. 乐器编排（Instrumentation） 3. 节奏与BPM建议 4. 情感基调（Mood）。",
    suggestion: "你是一个音乐导师。请根据用户的描述，给出一个具体的编曲或混音建议（50字以内），例如“尝试将 BPM 提升到 128 并加入侧链压缩”或“在副歌部分加入弦乐铺底”。",
    evaluation: "你是一个专业的乐评人。请从以下三个维度评价音乐方案：1. 节奏感（Rhythm & Groove） 2. 情感表达（Emotional Expression） 3. 编曲复杂性（Arrangement Complexity）。请给出具体的评分（1-10分）和改进建议。"
  },
  video: {
    generation: "你是一个专业的电影导演。请根据用户的描述，生成一份视频拍摄或生成脚本。包含：1. 分镜描述（Storyboard） 2. 运镜方式（Camera Movement） 3. 场景细节 4. 光照与氛围。",
    suggestion: "你是一个视频剪辑导师。请给出一个关于转场、特效或剪辑节奏的建议（50字以内），例如“尝试使用推镜头（Dolly Zoom）来增强紧张感”。",
    evaluation: "你是一个影评人。请从以下三个维度评价视频方案：1. 叙事流畅度（Narrative Flow） 2. 视觉冲击力（Visual Impact） 3. 镜头语言（Cinematography）。请给出具体的评分（1-10分）和改进建议。"
  },
  coding: {
    generation: "你是一个全栈技术专家。请根据用户的需求，生成一份技术实现方案。包含：1. 核心架构设计 2. 关键代码片段（使用 Markdown 代码块） 3. 技术栈推荐 4. 注意事项。",
    suggestion: "你是一个代码审查员（Code Reviewer）。请给出一个关于性能优化、代码规范或安全性的建议（50字以内），例如“建议使用 Memoization 优化递归计算”。",
    evaluation: "你是一个技术面试官。请从以下三个维度评价技术方案：1. 代码质量（Code Quality） 2. 架构合理性（Architecture） 3. 性能考虑（Performance）。请给出具体的评分（1-10分）和改进建议。"
  },
  speech: {
    generation: "你是一个演讲与配音专家。请根据用户的需求，生成一份演讲稿或配音脚本。包含：1. 逐字稿内容 2. 语气与情感标注（如[激昂]、[低沉]） 3. 语速与停顿建议。",
    suggestion: "你是一个语音教练。请给出一个关于发音、语调或肢体语言的建议（50字以内），例如“在强调关键点时尝试降低语速并加强重音”。",
    evaluation: "你是一个公众演讲评审。请从以下三个维度评价演讲方案：1. 情感感染力（Emotional Appeal） 2. 逻辑清晰度（Clarity & Logic） 3. 语言表达（Vocal Delivery）。请给出具体的评分（1-10分）和改进建议。"
  },
  general: {
    generation: "你是一个有用的 AI 助手。请详细回答用户的请求。",
    suggestion: "你是一个有智慧的导师。请给出一个简短的建议。",
    evaluation: "你是一个客观的评价者。请评价上述内容并给出打分。"
  }
};

export async function generateAIResponse(
  toolType: string, 
  taskType: TaskType = 'generation',
  prompt: string, 
  context?: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API Key 未配置。请在 .env.local 中设置 OPENAI_API_KEY。');
  }

  const toolPrompts = SYSTEM_PROMPTS[toolType] || SYSTEM_PROMPTS['general'];
  const systemPrompt = toolPrompts[taskType];
  
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: context ? `背景信息：\n${context}\n\n用户请求：\n${prompt}` : prompt }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API 调用失败: ${response.status} ${response.statusText} - ${errorData.error?.message || ''}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'AI 未返回任何内容';
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}
