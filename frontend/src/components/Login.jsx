import { useState } from 'react';
import api from '../api';

export default function Login({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('stockmaster_token', response.data.token);
      onLoginSuccess();
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-azure">StockMaster</h1>
          <p className="text-gray-500 mt-2">Please sign in to access your inventory</p>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg border border-red-200">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <input 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure outline-none transition"
              onChange={e => setCredentials({...credentials, username: e.target.value})}
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input 
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-azure outline-none transition"
              onChange={e => setCredentials({...credentials, password: e.target.value})}
              placeholder="••••••••"
              required
            />
          </div>
          <button className="w-full bg-azure hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all active:scale-95">
            Sign In
          </button>
        </form>

        {/* Seção de Teste Adicionada */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">For Test</p>
          <div className="inline-block bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">
            <span className="font-medium text-gray-800">User:</span> Admin <br />
            <span className="font-medium text-gray-800">Password:</span> Admin
          </div>
        </div>
      </div>
    </div>
  );
}