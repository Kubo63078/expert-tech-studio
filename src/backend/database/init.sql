-- ExpertTech Studio Database Initialization
-- 개발 환경용 초기 설정

-- 데이터베이스가 존재하지 않으면 생성
-- (Docker entrypoint가 자동으로 생성하므로 여기서는 주석 처리)
-- CREATE DATABASE IF NOT EXISTS experttech_studio;

-- 확장 설치
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 사용자 정의 타입들 (Enum types)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('client', 'pm', 'developer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status AS ENUM ('planning', 'in_development', 'review', 'deployed', 'maintenance', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 인덱스 생성을 위한 함수 (존재하지 않을 때만 생성)
CREATE OR REPLACE FUNCTION create_index_if_not_exists(index_name text, table_name text, column_spec text) 
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = index_name) THEN
        EXECUTE format('CREATE INDEX %I ON %I %s', index_name, table_name, column_spec);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 테이블 생성 시 자동으로 updated_at을 업데이트하는 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 개발용 설정
SET timezone = 'Asia/Seoul';

-- 성능 최적화를 위한 설정
-- (이미 설정되어 있을 수 있으므로 에러 무시)
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';

-- 개발용 데이터베이스 초기화 완료 로그
SELECT 'ExpertTech Studio Database Initialized for Development' as status;