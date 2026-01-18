import React, { useState, useEffect } from 'react';
import type { AdminUser } from '../services/api';
import { adminLogin, fetchAdminMe } from '../services/api';

interface Props {
  onLoginSuccess: (user: AdminUser) => void;
}

const AdminLoginPage: React.FC<Props> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const check = async () => {
      const me = await fetchAdminMe();
      if (me) {
        onLoginSuccess(me);
      }
    };
    check();
  }, [onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('请输入账号和密码');
      return;
    }

    setLoading(true);
    const user = await adminLogin(username, password);
    setLoading(false);

    if (!user) {
      setError('账号或密码错误');
      return;
    }

    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-2">管理后台登录</h1>
          <p className="text-xs text-slate-500">请输入管理员账号和密码进入后台</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              账号
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入密码"
            />
          </div>

          {error && (
            <div className="text-xs text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 px-4 py-2.5 rounded-full bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;

