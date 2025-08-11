/**
 * PWA 아이콘 생성 스크립트
 * SVG를 다양한 크기의 PNG로 변환
 * 
 * 실행 방법:
 * 1. sharp 패키지 설치: npm install sharp
 * 2. 스크립트 실행: node public/icons/generate-icons.js
 * 
 * 또는 온라인 도구 사용:
 * - https://realfavicongenerator.net/
 * - https://maskable.app/editor
 * - https://pwa-asset-generator.vavacoda.com/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 필요한 아이콘 크기들
const iconSizes = [
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 72, name: 'badge-72x72.png' }
];

console.log('PWA 아이콘 생성 안내');
console.log('===================');
console.log();
console.log('이 스크립트는 SVG 아이콘을 PNG 형식으로 변환합니다.');
console.log();
console.log('자동 생성 방법:');
console.log('1. npm install sharp 명령으로 sharp 패키지를 설치하세요.');
console.log('2. node public/icons/generate-icons.js 명령을 실행하세요.');
console.log();
console.log('수동 생성 방법:');
console.log('1. icon.svg 파일을 온라인 도구에 업로드하세요:');
console.log('   - https://realfavicongenerator.net/');
console.log('   - https://maskable.app/editor');
console.log('   - https://pwa-asset-generator.vavacoda.com/');
console.log();
console.log('필요한 아이콘 크기:');
iconSizes.forEach(({ size, name }) => {
  console.log(`   ${size}x${size} → ${name}`);
});
console.log();

// Sharp를 사용한 자동 변환 (선택적)
try {
  const sharp = (await import('sharp')).default;
  const svgBuffer = fs.readFileSync(path.join(__dirname, 'icon.svg'));

  async function generateIcons() {
    console.log('아이콘 생성 시작...');
    
    for (const { size, name } of iconSizes) {
      try {
        await sharp(svgBuffer)
          .resize(size, size)
          .png({
            quality: 90,
            compressionLevel: 9
          })
          .toFile(path.join(__dirname, name));
        
        console.log(`✅ ${name} 생성 완료`);
      } catch (error) {
        console.log(`❌ ${name} 생성 실패:`, error.message);
      }
    }
    
    // favicon.ico 생성
    try {
      await sharp(svgBuffer)
        .resize(32, 32)
        .png()
        .toFile(path.join(__dirname, '../favicon.png'));
      
      console.log('✅ favicon.png 생성 완료 (favicon.ico로 변경 필요)');
    } catch (error) {
      console.log('❌ favicon 생성 실패:', error.message);
    }
    
    console.log();
    console.log('🎉 아이콘 생성이 완료되었습니다!');
    console.log('📝 다음 단계:');
    console.log('   1. 생성된 PNG 파일들을 확인하세요.');
    console.log('   2. favicon.png를 favicon.ico로 변환하세요.');
    console.log('   3. 브라우저에서 PWA 설치를 테스트하세요.');
  }

  generateIcons().catch(console.error);

} catch (error) {
  console.log('Sharp 패키지가 설치되지 않았습니다.');
  console.log('자동 변환을 원하시면 "npm install sharp" 명령을 실행하세요.');
  console.log('또는 위의 온라인 도구를 사용하여 수동으로 변환하세요.');
}