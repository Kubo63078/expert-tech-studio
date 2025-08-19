import { useState } from 'react'
import { supabase } from '@/lib/supabase'

function SimpleAuthTest() {
  const [email, setEmail] = useState('user@gmail.com')
  const [password, setPassword] = useState('password123')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setMessage('연결 테스트 중...')
    
    try {
      // 단순 연결 테스트
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setMessage(`연결 실패: ${error.message}`)
      } else {
        setMessage('✅ Supabase 연결 성공!')
        console.log('Connection data:', data)
      }
    } catch (err) {
      setMessage(`에러: ${err}`)
      console.error('Connection error:', err)
    } finally {
      setLoading(false)
    }
  }

  const testSignUp = async () => {
    setLoading(true)
    setMessage('회원가입 테스트 중...')
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: window.location.origin
        }
      })
      
      if (error) {
        setMessage(`회원가입 실패: ${error.message}`)
        console.error('Signup error:', error)
      } else {
        setMessage('✅ 회원가입 성공! (이메일 확인 불필요)')
        console.log('Signup data:', data)
      }
    } catch (err) {
      setMessage(`에러: ${err}`)
      console.error('Signup error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          🔧 Supabase 연결 테스트
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              테스트 이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              테스트 비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            onClick={testConnection}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 mb-2"
          >
            {loading ? '테스트 중...' : '1. 연결 테스트'}
          </button>

          <button
            onClick={testSignUp}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? '테스트 중...' : '2. 회원가입 테스트'}
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-md text-sm ${
            message.includes('성공') || message.includes('✅') 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold text-gray-800 mb-2">디버그 정보:</h3>
          <p className="text-xs text-gray-600">
            URL: {import.meta.env.VITE_SUPABASE_URL}
          </p>
          <p className="text-xs text-gray-600">
            Key: {import.meta.env.VITE_SUPABASE_ANON_KEY?.substring(0, 20)}...
          </p>
        </div>
      </div>
    </div>
  )
}

export default SimpleAuthTest