import React from 'react';
import { 
  TrophyIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

interface AnalysisResult {
  expertiseScore: number;
  marketFitScore: number;
  successProbability: number;
  strengths: string[];
  recommendations: BusinessRecommendation[];
  riskFactors: string[];
  nextSteps: string[];
}

interface BusinessRecommendation {
  id: string;
  title: string;
  description: string;
  marketPotential: number;
  developmentCost: string;
  timeline: string;
  successRate: number;
  targetRevenue: string;
  competitiveAdvantage: string;
}

interface ReportTemplateProps {
  analysisResult: AnalysisResult;
}

const ReportTemplate = ({ analysisResult }: ReportTemplateProps) => {
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="report-template" style={{ 
      width: '210mm', 
      minHeight: 'auto',
      padding: '10mm 15mm',
      backgroundColor: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '12pt',
      lineHeight: '1.6',
      color: '#1f2937'
    }}>
      {/* 헤더 */}
      <div style={{ 
        borderBottom: '3px solid #00a651', 
        marginBottom: '20px',
        paddingBottom: '15px'
      }}>
        <h1 style={{ 
          fontSize: '28pt', 
          fontWeight: 'bold', 
          color: '#00a651',
          margin: '0 0 8px 0',
          textAlign: 'center'
        }}>
          ExpertTech Studio
        </h1>
        <h2 style={{ 
          fontSize: '20pt', 
          fontWeight: 'bold', 
          color: '#1f2937',
          margin: '0 0 8px 0',
          textAlign: 'center'
        }}>
          전문성 분석 리포트
        </h2>
        <div style={{ 
          textAlign: 'center',
          fontSize: '12pt', 
          color: '#6b7280'
        }}>
          생성일: {currentDate} | 맞춤형 비즈니스 기회 분석 결과
        </div>
      </div>

      {/* 핵심 분석 결과 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          fontSize: '18pt', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '20px'
        }}>
          📊 분석 결과 종합
        </h3>
        
        <p style={{ fontSize: '14pt', lineHeight: '1.6', marginBottom: '20px' }}>
          AI 기반 전문성 분석을 통해 도출된 결과, 귀하의 비즈니스 성공 가능성은 매우 높은 수준으로 평가되었습니다.
        </p>

        <div style={{ 
          backgroundColor: '#f8fafc',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '14pt', marginBottom: '15px', textAlign: 'center' }}>
            <strong>전문성 점수: </strong>
            <span style={{ fontSize: '24pt', fontWeight: 'bold', color: '#00a651' }}>
              {analysisResult.expertiseScore}점
            </span>
            <span style={{ marginLeft: '30px', fontSize: '14pt' }}>
              <strong>시장 적합성: </strong>
            </span>
            <span style={{ fontSize: '24pt', fontWeight: 'bold', color: '#ffc72c' }}>
              {analysisResult.marketFitScore}점
            </span>
            <span style={{ marginLeft: '30px', fontSize: '14pt' }}>
              <strong>성공 확률: </strong>
            </span>
            <span style={{ fontSize: '24pt', fontWeight: 'bold', color: '#0ea5e9' }}>
              {analysisResult.successProbability}%
            </span>
          </div>
        </div>
      </div>

      {/* 강점 분석 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          fontSize: '18pt', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '15px'
        }}>
          💪 발견된 핵심 강점
        </h3>
        
        <p style={{ fontSize: '14pt', lineHeight: '1.6', marginBottom: '15px' }}>
          분석 과정에서 다음과 같은 뛰어난 강점들이 확인되었습니다. 이러한 강점들은 비즈니스 성공의 핵심 자산이 될 것입니다.
        </p>

        {analysisResult.strengths.map((strength, index) => (
          <div key={index} style={{ 
            fontSize: '13pt',
            lineHeight: '1.6',
            marginBottom: '10px',
            paddingLeft: '15px'
          }}>
            <strong style={{ color: '#00a651' }}>{index + 1}. </strong>{strength}
          </div>
        ))}

        <div style={{ 
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          borderRadius: '6px',
          padding: '15px',
          marginTop: '15px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '13pt', color: '#065f46', fontWeight: 'bold', margin: '0' }}>
            🎯 이런 강점들을 구체적인 수익으로 연결하는 방법이 궁금하세요? 
            전문가와 함께 맞춤형 실행 계획을 세워보세요!
          </p>
        </div>
      </div>

      {/* 위험 요소 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          fontSize: '18pt', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '15px'
        }}>
          ⚠️ 고려해야 할 위험 요소
        </h3>
        
        <p style={{ fontSize: '14pt', lineHeight: '1.6', marginBottom: '15px' }}>
          성공적인 비즈니스를 위해 미리 대비해야 할 위험 요소들입니다. 전문 상담을 통해 이러한 위험들을 효과적으로 관리할 수 있습니다.
        </p>

        {analysisResult.riskFactors.map((risk, index) => (
          <div key={index} style={{ 
            fontSize: '13pt',
            lineHeight: '1.6',
            marginBottom: '10px',
            paddingLeft: '15px'
          }}>
            <strong style={{ color: '#dc2626' }}>{index + 1}. </strong>{risk}
          </div>
        ))}

        <div style={{ 
          backgroundColor: '#fffbeb',
          border: '1px solid #fed7aa',
          borderRadius: '6px',
          padding: '15px',
          marginTop: '15px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '13pt', color: '#92400e', fontWeight: 'bold', margin: '0' }}>
            🛡️ 위험 요소를 미리 해결한 고객들의 성공률이 평균 87% 더 높습니다. 
            전문 상담으로 위험을 기회로 바꿔보세요!
          </p>
        </div>
      </div>


      {/* 비즈니스 모델 추천 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          fontSize: '18pt', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '15px'
        }}>
          🚀 추천 비즈니스 모델
        </h3>
        
        <p style={{ fontSize: '14pt', lineHeight: '1.6', marginBottom: '20px' }}>
          귀하의 전문성과 시장 상황을 종합적으로 분석한 결과, 다음 비즈니스 모델들이 높은 성공 가능성을 보입니다.
        </p>

        {analysisResult.recommendations.map((rec, index) => (
          <div key={rec.id} style={{ marginBottom: '25px' }}>
            <h4 style={{ 
              fontSize: '16pt', 
              fontWeight: 'bold', 
              color: '#00a651',
              marginBottom: '10px'
            }}>
              {index + 1}순위. {rec.title} (성공률 {rec.successRate}%)
            </h4>
            
            <p style={{ fontSize: '13pt', lineHeight: '1.6', marginBottom: '10px' }}>
              {rec.description}
            </p>
            
            <div style={{ 
              fontSize: '12pt',
              color: '#4b5563',
              marginBottom: '10px'
            }}>
              <strong>💰 개발 비용:</strong> {rec.developmentCost} | 
              <strong> ⏰ 개발 기간:</strong> {rec.timeline} | 
              <strong> 📈 예상 매출:</strong> {rec.targetRevenue}
            </div>
            
            <div style={{ 
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '4px',
              padding: '10px',
              fontSize: '12pt',
              color: '#059669'
            }}>
              <strong>핵심 경쟁 우위:</strong> {rec.competitiveAdvantage}
            </div>
          </div>
        ))}

        <div style={{ 
          backgroundColor: '#ecfccb',
          border: '2px solid #65a30d',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center',
          marginTop: '25px'
        }}>
          <p style={{ fontSize: '14pt', color: '#365314', fontWeight: 'bold', margin: '0 0 10px 0' }}>
            🤔 어떤 모델이 당신에게 가장 적합할까요?
          </p>
          <p style={{ fontSize: '13pt', color: '#4d7c0f', margin: '0' }}>
            각 모델의 성공 요인과 위험도를 정확히 분석해드립니다. 개인별 맞춤 분석으로 성공 확률을 극대화하세요!
          </p>
        </div>
      </div>

      {/* 다음 단계 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          fontSize: '18pt', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '15px'
        }}>
          🎯 권장 다음 단계
        </h3>
        
        <p style={{ fontSize: '14pt', lineHeight: '1.6', marginBottom: '15px' }}>
          성공적인 비즈니스 론칭을 위해 다음 단계들을 순서대로 진행하시기 바랍니다.
        </p>

        {analysisResult.nextSteps.map((step, index) => (
          <div key={index} style={{ 
            fontSize: '13pt',
            lineHeight: '1.6',
            marginBottom: '10px',
            paddingLeft: '15px'
          }}>
            <strong style={{ color: '#0ea5e9' }}>{index + 1}. </strong>{step}
          </div>
        ))}
      </div>

      {/* 전문 상담 안내 */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ 
          fontSize: '18pt', 
          fontWeight: 'bold', 
          color: '#1f2937',
          marginBottom: '15px'
        }}>
          💡 전문 상담이 필요한 이유
        </h3>
        
        <p style={{ fontSize: '14pt', lineHeight: '1.6', marginBottom: '15px' }}>
          AI 분석은 시작일 뿐입니다. 실제 성공을 위해서는 개인의 상황과 목표에 맞는 구체적인 실행 계획이 필요합니다.
        </p>

        <div style={{ fontSize: '13pt', lineHeight: '1.6', marginBottom: '20px' }}>
          <p><strong style={{ color: '#00a651' }}>📊 개인 맞춤 전략:</strong> 당신만의 상황과 목표에 맞는 구체적인 실행 계획 수립</p>
          <p><strong style={{ color: '#00a651' }}>🚀 성공률 2배 증가:</strong> 전문 상담을 받은 고객의 비즈니스 성공률이 평균 2배 높음</p>
          <p><strong style={{ color: '#00a651' }}>💡 위험 요소 해결:</strong> 발견된 위험 요소들을 구체적으로 해결하는 방법 제시</p>
          <p><strong style={{ color: '#00a651' }}>💰 투자 실패 방지:</strong> 혼자 진행하다 실패하는 비용보다 전문 상담이 훨씬 경제적</p>
        </div>

        <div style={{ 
          backgroundColor: '#fef3c7',
          border: '2px solid #ffc72c',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '16pt', color: '#92400e', fontWeight: 'bold', margin: '0 0 10px 0' }}>
            "분석 리포트는 나침반, 전문 상담은 GPS입니다"
          </p>
          <p style={{ fontSize: '13pt', color: '#b45309', margin: '0' }}>
            목적지는 알지만 어떤 길로 가야 하는지는 전문가와 함께 정해야 합니다.
          </p>
        </div>
      </div>

      {/* 연락처 및 특별 혜택 */}
      <div style={{
        backgroundColor: '#00a651',
        color: 'white',
        padding: '25px',
        borderRadius: '10px',
        border: '4px solid #ffc72c',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          fontSize: '20pt', 
          fontWeight: 'bold', 
          margin: '0 0 15px 0',
          textAlign: 'center',
          color: '#ffc72c'
        }}>
          🎁 지금 바로 무료 상담 받으세요! 🎁
        </h2>
        
        <div style={{ 
          fontSize: '14pt', 
          marginBottom: '20px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          특별 혜택: ✅ 개인 맞춤 실행계획서 무료 제공 (30만원 상당)<br/>
          ✅ 1:1 전담 컨설턴트 배정 (3개월 무료 지원) ✅ 실패 위험 요소 체크리스트 증정
        </div>
        
        <div style={{ 
          textAlign: 'center',
          fontSize: '14pt',
          marginBottom: '15px'
        }}>
          <p style={{ margin: '5px 0' }}>🌐 <strong>홈페이지:</strong> www.experttech-studio.com</p>
          <p style={{ margin: '5px 0' }}>📧 <strong>이메일:</strong> contact@experttech.studio</p>
          <p style={{ margin: '5px 0' }}>📞 <strong>전화상담:</strong> 02-1234-5678</p>
          <p style={{ margin: '5px 0' }}>💬 <strong>카카오톡:</strong> @ExpertTech</p>
        </div>

        <div style={{ 
          backgroundColor: '#ffc72c',
          color: '#92400e',
          borderRadius: '8px',
          padding: '15px',
          fontSize: '13pt',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          🚨 한정 혜택! 상담 신청 시 "분석리포트 보고 왔습니다"라고 말씀해주세요! 🚨
        </div>
      </div>

      {/* 푸터 */}
      <div style={{ 
        borderTop: '2px solid #e5e7eb',
        paddingTop: '15px',
        textAlign: 'center',
        fontSize: '11pt',
        color: '#6b7280'
      }}>
        <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '12pt', color: '#00a651' }}>
          ExpertTech Studio - 당신의 전문성을 IT 비즈니스로 발전시켜보세요
        </div>
        <div>
          © 2024 ExpertTech Studio. 전문성 분석 및 비즈니스 컨설팅 전문
        </div>
      </div>
    </div>
  );
};

export default ReportTemplate;