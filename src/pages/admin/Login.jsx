import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'pazaroyun' && password === 'Pazaroyun123*') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/pazaroyunadmin');
    } else {
      setError('Kullanıcı adı veya şifre hatalı');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center px-4'>
      <div className='max-w-md w-full space-y-8 bg-teal-900 backdrop-blur-sm p-8 rounded-2xl border border-white/10'>
        <div className='text-center'>
          <img src='/logo.webp' alt='Logo' className='mx-auto h-24 w-auto' />
          <h2 className='mt-6 text-3xl font-bold text-white'>Admin Girişi</h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleLogin}>
          <div className='rounded-md shadow-sm space-y-4'>
            <div>
              <label htmlFor='username' className='sr-only'>
                Kullanıcı Adı
              </label>
              <input
                id='username'
                name='username'
                type='text'
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className='appearance-none relative block w-full px-3 py-2 border border-white/20 bg-white/5 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                placeholder='Kullanıcı Adı'
              />
            </div>
            <div>
              <label htmlFor='password' className='sr-only'>
                Şifre
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='appearance-none relative block w-full px-3 py-2 border border-white/20 bg-white/5 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                placeholder='Şifre'
              />
            </div>
          </div>

          {error && (
            <div className='text-red-500 text-sm text-center'>{error}</div>
          )}

          <div>
            <button
              type='submit'
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors'
            >
              Giriş Yap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 