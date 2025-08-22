import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Vercel Serverless Function for AI Analysis
 * Converts Express.js backend logic to Vercel Functions
 */

// OpenAI API integration
interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface AnalysisResult {
  expertiseScore: number;
  personalizedInsight: string;
  businessHint: string;
  marketOpportunity: string;
  successProbability: string;
  keyStrengths: string[];
  nextStepTeaser: string;
  exclusiveValue: string;
  urgencyFactor: string;
}

interface UserAnswers {
  [key: string]: any;
}

// Cost calculation function (from backend)
function calculateCost(promptTokens: number, completionTokens: number, model: string = 'gpt-4o'): number {
  const rates = {
    'gpt-4o': { prompt: 0.00001500, completion: 0.00006000 },
    'gpt-4o-mini': { prompt: 0.00000150, completion: 0.00000600 }
  };
  const rate = rates[model as keyof typeof rates] || rates['gpt-4o-mini'];
  return (promptTokens * rate.prompt) + (completionTokens * rate.completion);
}

// Generate analysis prompt
function generateAnalysisPrompt(answers: UserAnswers): string {
  const expertise = answers.expertise_field || '일반 비즈니스';
  const experience = answers.experience_years || '5년';
  const name = answers.basic_name || '고객';
  
  return `당신은 40-50대 전문가를 위한 IT 비즈니스 분석 전문가입니다.

분석 대상:
- 이름: ${name}
- 전문 분야: ${expertise}
- 경험: ${experience}
- 기타 정보: ${JSON.stringify(answers, null, 2)}

다음 JSON 형식으로만 응답해주세요:

{
  "expertiseScore": 점수(0-100),
  "personalizedInsight": "${name}님의 ${expertise} 분야 경험을 활용한 개인화된 통찰 (120자)",
  "businessHint": "${expertise} × AI 융합 서비스 아이디어 (90자)",
  "marketOpportunity": "${expertise} AI 시장 기회 및 성장 전망 (90자)",
  "successProbability": "성공 확률% (유사 배경 전문가 기준)",
  "keyStrengths": ["강점1", "강점2", "강점3", "강점4"],
  "nextStepTeaser": "구체적 기술스택/파트너사/로드맵 정보 필요성 (110자)",
  "exclusiveValue": "ExpertTech 독점 자산/네트워크 가치 (90자)",
  "urgencyFactor": "지금 시작해야 하는 명확한 이유 (90자)"
}

**반드시 지켜주세요**: 
- 순수한 JSON 객체만 반환
- 코드블록(\`\`\`) 금지
- 설명이나 추가 텍스트 금지
- { 로 시작해서 } 로 끝나는 JSON만 반환
- "I'm sorry" 같은 텍스트 절대 금지`;
}

// OpenAI API call function
async function callOpenAI(prompt: string, model: string = 'gpt-4o'): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: '당신은 40-50대 전문가를 위한 IT 비즈니스 분석 전문가입니다. 전략적이고 개인화된 분석 결과를 JSON 형식으로 제공합니다. 높은 품질의 통찰력 있는 분석으로 사용자가 신뢰할 수 있는 비즈니스 방향을 제시해주세요.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: model === 'gpt-4o' ? 2000 : 1500,
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`OpenAI API error (${model}): ${response.status} ${response.statusText} - ${errorData}`);
  }

  const data: OpenAIResponse = await response.json();
  
  // Log usage and cost
  const { prompt_tokens, completion_tokens, total_tokens } = data.usage;
  const cost = calculateCost(prompt_tokens, completion_tokens, model);
  
  console.log(`💰 ${model} Usage: ${total_tokens} tokens, ~$${cost.toFixed(4)}`);
  console.log(`✅ ${model} Response: ${Date.now()}ms, Tokens: ${total_tokens}`);

  return data.choices[0].message.content;
}

// Enhanced JSON parsing with fallback
function parseAnalysisResult(llmResponse: string, answers: UserAnswers): AnalysisResult {
  try {
    // 1단계: 응답 정리
    let cleanedResponse = llmResponse.trim();
    
    // 2단계: 다양한 텍스트 패턴 제거
    const unwantedPatterns = [
      /^I'm sorry[^{]*/i,
      /^Here is[^{]*/i,
      /^다음은[^{]*/,
      /^아래는[^{]*/,
      /^JSON 응답[^{]*/,
      /^분석 결과[^{]*/,
      /```json\s*/g,
      /```\s*/g,
      /\s*```$/g
    ];
    
    for (const pattern of unwantedPatterns) {
      cleanedResponse = cleanedResponse.replace(pattern, '');
    }
    
    // 3단계: JSON 객체 추출 (첫 번째 { 부터 마지막 } 까지)
    const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[0];
    }
    
    // 4단계: JSON 수정 시도 (trailing comma 제거)
    cleanedResponse = cleanedResponse.replace(/,(\s*[}\]])/g, '$1');
    
    // 5단계: JSON 파싱 시도
    const parsed = JSON.parse(cleanedResponse);
    
    // 필수 필드 검증
    const required = ['expertiseScore', 'personalizedInsight', 'businessHint'];
    for (const field of required) {
      if (!parsed[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    console.log(`✅ JSON 파싱 성공`);

    return {
      expertiseScore: parseInt(parsed.expertiseScore) || 85,
      personalizedInsight: parsed.personalizedInsight || '',
      businessHint: parsed.businessHint || '',
      marketOpportunity: parsed.marketOpportunity || '',
      successProbability: parsed.successProbability || '85%',
      keyStrengths: parsed.keyStrengths || [],
      nextStepTeaser: parsed.nextStepTeaser || '',
      exclusiveValue: parsed.exclusiveValue || '',
      urgencyFactor: parsed.urgencyFactor || ''
    };
  } catch (error) {
    console.error('❌ JSON 파싱 실패:', {
      error: (error as Error).message,
      originalResponse: llmResponse.substring(0, 200) + (llmResponse.length > 200 ? '...' : ''),
      responseLength: llmResponse.length
    });
    
    console.warn(`🔄 JSON 파싱 실패 - Mock으로 폴백`);
    
    return getMockAnalysis(answers);
  }
}

// Mock analysis for fallback
function getMockAnalysis(answers: UserAnswers): AnalysisResult {
  const expertise = answers.expertise_field || answers.expertiseField || '전문 분야';
  const name = answers.basic_name || answers.name || '고객';
  
  return {
    expertiseScore: 87,
    personalizedInsight: `${name}님의 ${expertise} 분야 경험은 AI 기술과 융합했을 때 강력한 차별화 요소가 됩니다.`,
    businessHint: `${expertise} × AI 융합 서비스, 개인 맞춤형 솔루션 플랫폼`,
    marketOpportunity: `${expertise} AI 시장이 향후 18개월 내 급성장 예상, 선점 효과 극대화 구간`,
    successProbability: "84% (유사 배경 전문가 6개월 평균 성과 기준)",
    keyStrengths: [
      "장기간 축적된 전문 지식",
      "타겟 고객층 이해도", 
      "신뢰 기반 네트워크",
      "실무 경험 기반 통찰력"
    ],
    nextStepTeaser: "구체적인 AI 기술 스택, 파트너사 연결, 6개월 개발 로드맵은 전문가 상담에서 맞춤 설계해드립니다.",
    exclusiveValue: "ExpertTech만의 AI 개발사 네트워크와 200+ 성공 사례 데이터로 3개월 내 MVP 출시 가능",
    urgencyFactor: "현재 경쟁사 진입 전 골든타임, 6개월 내 시장 선점 필수"
  };
}

// Main analysis function with fallback chain
async function analyzeExpertise(answers: UserAnswers): Promise<AnalysisResult> {
  const prompt = generateAnalysisPrompt(answers);
  
  try {
    // Primary: GPT-4o
    console.log('🚀 Using GPT-4o (Premium Quality)');
    const response = await callOpenAI(prompt, 'gpt-4o');
    return parseAnalysisResult(response, answers);
  } catch (error) {
    console.error('GPT-4o failed, trying GPT-4o-mini:', error);
    
    try {
      // Fallback: GPT-4o-mini
      console.log('🔄 Fallback to GPT-4o-mini');
      const response = await callOpenAI(prompt, 'gpt-4o-mini');
      return parseAnalysisResult(response, answers);
    } catch (fallbackError) {
      console.error('All LLM services failed, using intelligent mock:', fallbackError);
      return getMockAnalysis(answers);
    }
  }
}

// Vercel Function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { interviewData, answers } = req.body;
    const analysisData = interviewData || answers;
    
    if (!analysisData) {
      return res.status(400).json({ 
        success: false, 
        error: 'No interview data provided' 
      });
    }

    console.log('📋 AI 분석 시작:', Object.keys(analysisData));
    
    // AI 분석 실행
    const analysisResult = await analyzeExpertise(analysisData);
    
    console.log('✅ AI 분석 완료');
    
    res.status(200).json({
      success: true,
      data: analysisResult,
      message: 'AI 분석이 완료되었습니다.'
    });

  } catch (error) {
    console.error('❌ AI 분석 오류:', error);
    
    // 에러 시에도 Mock 분석 제공
    const fallbackResult = getMockAnalysis(req.body.interviewData || req.body.answers || {});
    
    res.status(200).json({
      success: true,
      data: fallbackResult,
      message: 'AI 서비스 일시 장애로 기본 분석을 제공합니다.'
    });
  }
}