import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { User } from '@supabase/supabase-js';
import { Key, TrendingUp, Clock, DollarSign, Activity, LogOut, Plus, Copy, Check } from 'lucide-react';

interface UsageStats {
  summary: {
    totalRequests: number;
    totalDuration: number;
    totalCost: string;
    totalTokens: number;
    avgLatency: number;
  };
  apiKeys: Array<{
    id: string;
    key: string;
    quota: number;
    usage: number;
    active: boolean;
    created_at: string;
  }>;
  dailyStats: Record<string, {
    requests: number;
    duration: number;
    cost: number;
  }>;
  recentLogs: Array<any>;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
      if (session?.user) {
        loadStats();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadStats();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('usage-stats');
      
      if (error) throw error;
      
      setStats(data.data || data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSignup = async () => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert('Check your email for confirmation link');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const generateApiKey = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('api-key-generate', {
        body: { quota: 36000 } // 10 hours default
      });
      
      if (error) throw error;
      
      alert('API Key generated successfully!');
      loadStats();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const copyToClipboard = (text: string, keyId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">ODIADEV AI</h1>
            <p className="mt-2 text-sm text-gray-600">Admin Dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
              <button
                type="button"
                onClick={handleSignup}
                className="flex-1 border border-blue-500 text-blue-500 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ODIADEV AI Dashboard</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* CEO Message */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">AE</span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Message from Austin Eguale, CEO</h2>
              <div className="space-y-3 text-sm leading-relaxed opacity-95">
                <p>
                  When I founded ODIADEV AI, I envisioned a future where every African business could access world-class voice technology regardless of network limitations. Today, we're not just building AI – we're democratizing voice intelligence for an entire continent.
                </p>
                <p>
                  This platform represents our unwavering commitment to innovation with integrity. Every line of code, every optimization, every feature is designed to give African businesses the voice they deserve in the global AI conversation.
                </p>
                <p className="font-semibold">
                  Our mission is simple but profound: To ensure that no matter where you are in Africa – whether on 3G in Lagos or fiber in Cape Town – you have access to the same voice AI capabilities as anywhere else in the world.
                </p>
                <p>
                  This is more than technology. This is empowerment. This is the future of African business communication, built by Africans, for Africans, with global standards.
                </p>
                <p className="font-bold text-lg mt-4">
                  Together, we're not just participating in the AI revolution – we're leading it.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.summary.totalRequests}</p>
                </div>
                <Activity className="w-10 h-10 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Duration (seconds)</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.summary.totalDuration}</p>
                </div>
                <Clock className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.summary.totalCost}</p>
                </div>
                <DollarSign className="w-10 h-10 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg Latency (ms)</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.summary.avgLatency}</p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* API Keys Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">API Keys</h2>
            <button
              onClick={generateApiKey}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Generate New Key
            </button>
          </div>

          <div className="space-y-4">
            {stats?.apiKeys && stats.apiKeys.length > 0 ? (
              stats.apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4 flex-1">
                    <Key className="w-5 h-5 text-gray-400" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-gray-700">{apiKey.key}</code>
                        <button
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {copiedKey === apiKey.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>Usage: {apiKey.usage}/{apiKey.quota}s</span>
                        <span>Status: {apiKey.active ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-32">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${Math.min(100, (apiKey.usage / apiKey.quota) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No API keys yet. Generate your first key to get started.</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {stats?.recentLogs && stats.recentLogs.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Text</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Voice</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900 max-w-xs truncate">
                        {log.text}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{log.voice}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{log.duration.toFixed(2)}s</td>
                      <td className="py-3 px-4 text-sm text-gray-600">${parseFloat(log.cost).toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
