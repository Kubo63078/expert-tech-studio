'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoginForm } from '@/components/auth/LoginForm'

function AuthTestPage() {
  const { user, loading, signOut } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">
            🎉 Supabase 연동 성공!
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">사용자 정보:</h3>
              <p className="text-green-700">
                <strong>ID:</strong> {user.id}
              </p>
              <p className="text-green-700">
                <strong>이메일:</strong> {user.email}
              </p>
              <p className="text-green-700">
                <strong>생성일:</strong> {new Date(user.created_at).toLocaleString()}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800">테스트 결과:</h3>
              <ul className="text-blue-700 space-y-1">
                <li>✅ Supabase Auth 연동 완료</li>
                <li>✅ 사용자 인증 성공</li>
                <li>✅ JWT 토큰 발급됨</li>
                <li>✅ 프론트엔드 연동 완료</li>
              </ul>
            </div>

            <button
              onClick={signOut}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">🚀 Supabase 연동 테스트</h1>
          <p className="text-gray-600">
            Expert Tech Studio가 Supabase로 성공적으로 마이그레이션되었습니다!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">✅ 완료된 작업들</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Supabase 프로젝트 생성
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                PostgreSQL 데이터베이스 스키마 생성
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                RLS (Row Level Security) 정책 설정
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Next.js Supabase 클라이언트 연동
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                인증 시스템 구현 (AuthProvider)
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                로그인/회원가입 폼 생성
              </li>
            </ul>
          </div>

          <LoginForm 
            onToggleMode={() => setIsSignUp(!isSignUp)} 
            isSignUp={isSignUp} 
          />
        </div>
      </div>
    </div>
  )
}

export default AuthTestPage