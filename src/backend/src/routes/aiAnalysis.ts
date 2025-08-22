import { Router } from 'express';
import { aiAnalysisService } from '../services/aiAnalysisService';
import { asyncHandler } from '../utils/asyncHandler';
import { createApiResponse, createErrorResponse } from '../utils/apiResponse';

const router = Router();

/**
 * POST /api/ai/analyze
 * AI 기반 전문성 분석
 */
router.post('/analyze', async (req, res) => {
  try {
    const { interviewData, answers } = req.body;
    const analysisData = interviewData || answers;

    if (!analysisData || typeof analysisData !== 'object') {
      return res.status(400).json({
        success: false,
        message: '분석할 답변 데이터가 필요합니다.'
      });
    }

    // 실제 AI 분석 서비스 호출
    const analysisResult = await aiAnalysisService.analyzeExpertise(analysisData);
    
    res.json({
      success: true,
      data: analysisResult,
      message: 'AI 분석이 완료되었습니다.'
    });
    
  } catch (error) {
    console.error('AI 분석 중 오류:', error);
    
    // 실패 시 Mock 데이터 반환
    const fallbackResult = aiAnalysisService.getMockAnalysis(req.body.interviewData || req.body.answers || {});
    res.json({
      success: true,
      data: fallbackResult,
      message: 'AI 서비스 일시 장애로 기본 분석을 제공합니다.'
    });
  }
});

export { router as aiAnalysisRouter };
