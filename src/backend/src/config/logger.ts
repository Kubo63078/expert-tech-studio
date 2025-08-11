import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Logs 디렉토리 생성
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Winston logger 설정
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'experttech-studio' },
  transports: [
    // 에러 로그 파일
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error' 
    }),
    // 모든 로그 파일
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log') 
    })
  ],
});

// 개발 환경에서는 콘솔 출력 추가
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;