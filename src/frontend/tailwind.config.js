/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // H&R Block Professional Color System
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#00a651',  // H&R Block 메인 그린
          700: '#006837',  // H&R Block 다크 그린
          800: '#15803d',
          900: '#14532d',
          950: '#052e16',
        },
        // H&R Block Gold Accent System
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#ffc72c',  // H&R Block 골드
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Success Colors (using H&R Block green)
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#00a651', // H&R Block green for success
          600: '#006837',
          700: '#047857',
          800: '#065f46',
          900: '#14532d',
        },
        // H&R Block Professional Gray System  
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#6c757d', // H&R Block 쿨 그레이
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        // Semantic Colors
        warning: {
          500: '#eab308',
          600: '#ca8a04',
        },
        error: {
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      // 40-50대 최적화 폰트 시스템
      fontSize: {
        'xs': ['14px', { lineHeight: '20px' }],
        'sm': ['16px', { lineHeight: '24px' }], // 최소 본문 크기
        'base': ['18px', { lineHeight: '28px' }], // 기본 본문 크기
        'lg': ['20px', { lineHeight: '32px' }],
        'xl': ['24px', { lineHeight: '36px' }],
        '2xl': ['30px', { lineHeight: '40px' }], // 헤드라인 크기
        '3xl': ['36px', { lineHeight: '44px' }],
        '4xl': ['42px', { lineHeight: '52px' }],
        '5xl': ['48px', { lineHeight: '56px' }],
        '6xl': ['60px', { lineHeight: '72px' }],
      },
      // 그림자 시스템
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'button': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'button-hover': '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
        'professional': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      // 둥근 모서리 시스템
      borderRadius: {
        'card': '8px',
        'button': '6px',
        'input': '6px',
      },
    },
  },
  plugins: [],
}