// HTML 기반 리포트 생성 유틸리티

// HTML 템플릿 생성 함수
const generateReportHTML = (analysisResult: any) => {
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ExpertTech Studio - 전문성 분석 리포트</title>
    <style>
        .report-template {
            width: 210mm;
            min-height: auto;
            padding: 10mm 15mm;
            background-color: white;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            font-size: 12pt;
            line-height: 1.6;
            color: #1f2937;
        }

        @media print {
            @page {
                margin: 5mm 3mm !important;
                size: A4;
            }
            
            .report-template {
                box-sizing: border-box !important;
                page-break-inside: auto !important;
                min-height: auto !important;
                height: auto !important;
                padding: 8mm 10mm !important;
                line-height: 1.4 !important;
            }
            
            .report-template > div {
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
            }
        }
    </style>
</head>
<body>
    <div class="report-template">
        <!-- 헤더 -->
        <div style="border-bottom: 3px solid #00a651; margin-bottom: 20px; padding-bottom: 15px;">
            <h1 style="font-size: 28pt; font-weight: bold; color: #00a651; margin: 0 0 8px 0; text-align: center;">
                ExpertTech Studio
            </h1>
            <h2 style="font-size: 20pt; font-weight: bold; color: #1f2937; margin: 0 0 8px 0; text-align: center;">
                전문성 분석 리포트
            </h2>
            <div style="text-align: center; font-size: 12pt; color: #6b7280;">
                생성일: ${currentDate} | 맞춤형 비즈니스 기회 분석 결과
            </div>
        </div>

        <!-- 핵심 분석 결과 -->
        <div style="margin-bottom: 20px;">
            <h3 style="font-size: 18pt; font-weight: bold; color: #1f2937; margin-bottom: 15px;">
                📊 분석 결과 종합
            </h3>
            
            <p style="font-size: 14pt; line-height: 1.6; margin-bottom: 15px;">
                AI 기반 전문성 분석을 통해 도출된 결과, 귀하의 비즈니스 성공 가능성은 매우 높은 수준으로 평가되었습니다.
            </p>

            <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <div style="font-size: 14pt; margin-bottom: 10px; text-align: center;">
                    <strong>전문성 점수: </strong>
                    <span style="font-size: 24pt; font-weight: bold; color: #00a651;">${analysisResult.expertiseScore}점</span>
                    <span style="margin-left: 20px; font-size: 14pt;"><strong>시장 적합성: </strong></span>
                    <span style="font-size: 24pt; font-weight: bold; color: #ffc72c;">${analysisResult.marketFitScore}점</span>
                    <span style="margin-left: 20px; font-size: 14pt;"><strong>성공 확률: </strong></span>
                    <span style="font-size: 24pt; font-weight: bold; color: #0ea5e9;">${analysisResult.successProbability}%</span>
                </div>
            </div>
        </div>

        <!-- 강점 분석 -->
        <div style="margin-bottom: 20px;">
            <h3 style="font-size: 18pt; font-weight: bold; color: #1f2937; margin-bottom: 10px;">
                💪 발견된 핵심 강점
            </h3>
            
            <p style="font-size: 14pt; line-height: 1.6; margin-bottom: 12px;">
                분석 과정에서 다음과 같은 뛰어난 강점들이 확인되었습니다. 이러한 강점들은 비즈니스 성공의 핵심 자산이 될 것입니다.
            </p>

            ${analysisResult.strengths.map((strength: string, index: number) => `
            <div style="font-size: 13pt; line-height: 1.5; margin-bottom: 8px; padding-left: 15px;">
                <strong style="color: #00a651;">${index + 1}. </strong>${strength}
            </div>
            `).join('')}

            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 12px; margin-top: 15px; text-align: center;">
                <p style="font-size: 13pt; color: #065f46; font-weight: bold; margin: 0;">
                    🎯 이런 강점들을 구체적인 수익으로 연결하는 방법이 궁금하세요? 
                    전문가와 함께 맞춤형 실행 계획을 세워보세요!
                </p>
            </div>
        </div>

        <!-- 위험 요소 -->
        <div style="margin-bottom: 20px;">
            <h3 style="font-size: 18pt; font-weight: bold; color: #1f2937; margin-bottom: 10px;">
                ⚠️ 고려해야 할 위험 요소
            </h3>
            
            <p style="font-size: 14pt; line-height: 1.6; margin-bottom: 12px;">
                성공적인 비즈니스를 위해 미리 대비해야 할 위험 요소들입니다. 전문 상담을 통해 이러한 위험들을 효과적으로 관리할 수 있습니다.
            </p>

            ${analysisResult.riskFactors.map((risk: string, index: number) => `
            <div style="font-size: 13pt; line-height: 1.5; margin-bottom: 8px; padding-left: 15px;">
                <strong style="color: #dc2626;">${index + 1}. </strong>${risk}
            </div>
            `).join('')}

            <div style="background-color: #fffbeb; border: 1px solid #fed7aa; border-radius: 6px; padding: 12px; margin-top: 15px; text-align: center;">
                <p style="font-size: 13pt; color: #92400e; font-weight: bold; margin: 0;">
                    🛡️ 위험 요소를 미리 해결한 고객들의 성공률이 평균 87% 더 높습니다. 
                    전문 상담으로 위험을 기회로 바꿔보세요!
                </p>
            </div>
        </div>

        <!-- 비즈니스 모델 추천 -->
        <div style="margin-bottom: 20px;">
            <h3 style="font-size: 18pt; font-weight: bold; color: #1f2937; margin-bottom: 10px;">
                🚀 추천 비즈니스 모델
            </h3>
            
            <p style="font-size: 14pt; line-height: 1.6; margin-bottom: 15px;">
                귀하의 전문성과 시장 상황을 종합적으로 분석한 결과, 다음 비즈니스 모델들이 높은 성공 가능성을 보입니다.
            </p>

            ${analysisResult.recommendations.map((rec: any, index: number) => `
            <div style="margin-bottom: 18px;">
                <h4 style="font-size: 16pt; font-weight: bold; color: #00a651; margin-bottom: 8px;">
                    ${index + 1}순위. ${rec.title} (성공률 ${rec.successRate}%)
                </h4>
                
                <p style="font-size: 13pt; line-height: 1.5; margin-bottom: 8px;">
                    ${rec.description}
                </p>
                
                <div style="font-size: 12pt; color: #4b5563; margin-bottom: 8px;">
                    <strong>💰 개발 비용:</strong> ${rec.developmentCost} | 
                    <strong> ⏰ 개발 기간:</strong> ${rec.timeline} | 
                    <strong> 📈 예상 매출:</strong> ${rec.targetRevenue}
                </div>
                
                <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; padding: 8px; font-size: 12pt; color: #059669;">
                    <strong>핵심 경쟁 우위:</strong> ${rec.competitiveAdvantage}
                </div>
            </div>
            `).join('')}

            <div style="background-color: #ecfccb; border: 2px solid #65a30d; border-radius: 8px; padding: 15px; text-align: center; margin-top: 15px;">
                <p style="font-size: 14pt; color: #365314; font-weight: bold; margin: 0 0 8px 0;">
                    🤔 어떤 모델이 당신에게 가장 적합할까요?
                </p>
                <p style="font-size: 13pt; color: #4d7c0f; margin: 0;">
                    각 모델의 성공 요인과 위험도를 정확히 분석해드립니다. 개인별 맞춤 분석으로 성공 확률을 극대화하세요!
                </p>
            </div>
        </div>

        <!-- 다음 단계 -->
        <div style="margin-bottom: 20px;">
            <h3 style="font-size: 18pt; font-weight: bold; color: #1f2937; margin-bottom: 10px;">
                🎯 권장 다음 단계
            </h3>
            
            <p style="font-size: 14pt; line-height: 1.6; margin-bottom: 12px;">
                성공적인 비즈니스 론칭을 위해 다음 단계들을 순서대로 진행하시기 바랍니다.
            </p>

            ${analysisResult.nextSteps.map((step: string, index: number) => `
            <div style="font-size: 13pt; line-height: 1.5; margin-bottom: 6px; padding-left: 15px;">
                <strong style="color: #0ea5e9;">${index + 1}. </strong>${step}
            </div>
            `).join('')}
        </div>

        <!-- 전문 상담 안내 -->
        <div style="margin-bottom: 20px;">
            <h3 style="font-size: 18pt; font-weight: bold; color: #1f2937; margin-bottom: 10px;">
                💡 전문 상담이 필요한 이유
            </h3>
            
            <p style="font-size: 14pt; line-height: 1.6; margin-bottom: 12px;">
                AI 분석은 시작일 뿐입니다. 실제 성공을 위해서는 개인의 상황과 목표에 맞는 구체적인 실행 계획이 필요합니다.
            </p>

            <div style="font-size: 13pt; line-height: 1.6; margin-bottom: 15px;">
                <p style="margin-bottom: 6px;"><strong style="color: #00a651;">📊 개인 맞춤 전략:</strong> 당신만의 상황과 목표에 맞는 구체적인 실행 계획 수립</p>
                <p style="margin-bottom: 6px;"><strong style="color: #00a651;">🚀 성공률 2배 증가:</strong> 전문 상담을 받은 고객의 비즈니스 성공률이 평균 2배 높음</p>
                <p style="margin-bottom: 6px;"><strong style="color: #00a651;">💡 위험 요소 해결:</strong> 발견된 위험 요소들을 구체적으로 해결하는 방법 제시</p>
                <p style="margin-bottom: 6px;"><strong style="color: #00a651;">💰 투자 실패 방지:</strong> 혼자 진행하다 실패하는 비용보다 전문 상담이 훨씬 경제적</p>
            </div>

            <div style="background-color: #fef3c7; border: 2px solid #ffc72c; border-radius: 8px; padding: 15px; text-align: center;">
                <p style="font-size: 16pt; color: #92400e; font-weight: bold; margin: 0 0 8px 0;">
                    "분석 리포트는 나침반, 전문 상담은 GPS입니다"
                </p>
                <p style="font-size: 13pt; color: #b45309; margin: 0;">
                    목적지는 알지만 어떤 길로 가야 하는지는 전문가와 함께 정해야 합니다.
                </p>
            </div>
        </div>

        <!-- 연락처 및 특별 혜택 -->
        <div style="background-color: #00a651; color: white; padding: 20px; border-radius: 10px; border: 4px solid #ffc72c; margin-bottom: 15px;">
            <h2 style="font-size: 20pt; font-weight: bold; margin: 0 0 12px 0; text-align: center; color: #ffc72c;">
                🎁 지금 바로 무료 상담 받으세요! 🎁
            </h2>
            
            <div style="font-size: 14pt; margin-bottom: 15px; text-align: center; font-weight: bold;">
                특별 혜택: ✅ 개인 맞춤 실행계획서 무료 제공 (30만원 상당)<br/>
                ✅ 1:1 전담 컨설턴트 배정 (3개월 무료 지원) ✅ 실패 위험 요소 체크리스트 증정
            </div>
            
            <div style="text-align: center; font-size: 14pt; margin-bottom: 12px;">
                <p style="margin: 4px 0;">🌐 <strong>홈페이지:</strong> www.experttech-studio.com</p>
                <p style="margin: 4px 0;">📧 <strong>이메일:</strong> contact@experttech.studio</p>
                <p style="margin: 4px 0;">📞 <strong>전화상담:</strong> 02-1234-5678</p>
                <p style="margin: 4px 0;">💬 <strong>카카오톡:</strong> @ExpertTech</p>
            </div>

            <div style="background-color: #ffc72c; color: #92400e; border-radius: 8px; padding: 12px; font-size: 13pt; font-weight: bold; text-align: center;">
                🚨 한정 혜택! 상담 신청 시 "분석리포트 보고 왔습니다"라고 말씀해주세요! 🚨
            </div>
        </div>

        <!-- 푸터 -->
        <div style="border-top: 2px solid #e5e7eb; padding-top: 12px; text-align: center; font-size: 11pt; color: #6b7280;">
            <div style="margin-bottom: 6px; font-weight: bold; font-size: 12pt; color: #00a651;">
                ExpertTech Studio - 당신의 전문성을 IT 비즈니스로 발전시켜보세요
            </div>
            <div>
                © 2024 ExpertTech Studio. 전문성 분석 및 비즈니스 컨설팅 전문
            </div>
        </div>
    </div>

    <div style="text-align: center; margin: 20px;">
        <button onclick="window.print()" style="padding: 15px 30px; background: #00a651; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; margin-right: 10px;">
            📄 PDF로 저장 / 인쇄
        </button>
        <button onclick="window.close()" style="padding: 15px 30px; background: #6b7280; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer;">
            창 닫기
        </button>
    </div>
</body>
</html>`;
};

// HTML 리포트를 새 창에서 열기
export const downloadAnalysisReport = (analysisResult: any) => {
  const htmlContent = generateReportHTML(analysisResult);
  
  // 새 창에 HTML 콘텐츠 작성
  const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes');
  if (newWindow) {
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    newWindow.focus();
  } else {
    alert('팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.');
  }
};

// 간단한 텍스트 리포트 다운로드 (백업 방법)
export const downloadTextReport = (analysisData: any) => {
  const reportContent = `
ExpertTech Studio - 전문성 분석 리포트
생성일: ${new Date().toLocaleDateString('ko-KR')}

=== 분석 결과 종합 ===
전문성 점수: ${analysisData.expertiseScore}점
시장 적합성: ${analysisData.marketFitScore}점
성공 확률: ${analysisData.successProbability}%

=== 발견된 강점 ===
${analysisData.strengths.map((strength: string, index: number) => `${index + 1}. ${strength}`).join('\n')}

=== 고려할 위험 요소 ===
${analysisData.riskFactors.map((risk: string, index: number) => `${index + 1}. ${risk}`).join('\n')}

=== 비즈니스 모델 추천 ===
${analysisData.recommendations.map((rec: any, index: number) => `
${index + 1}. ${rec.title}
   설명: ${rec.description}
   성공률: ${rec.successRate}%
   개발비용: ${rec.developmentCost}
   개발기간: ${rec.timeline}
   예상매출: ${rec.targetRevenue}
   경쟁우위: ${rec.competitiveAdvantage}
`).join('\n')}

=== 다음 단계 가이드 ===
${analysisData.nextSteps.map((step: string, index: number) => `${index + 1}. ${step}`).join('\n')}

---
ExpertTech Studio
당신의 전문성을 IT 비즈니스로 발전시켜보세요
  `;

  // 텍스트 파일 다운로드
  const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const fileName = `ExpertTech_분석리포트_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}.txt`;
  
  link.href = url;
  link.download = fileName;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  
  return fileName;
};