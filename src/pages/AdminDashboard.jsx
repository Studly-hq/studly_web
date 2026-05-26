import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './admin-theme.css'; 

const COLORS = ['var(--primary)', 'var(--input)']; // Gold and faint background for the empty part of the gauge

const AdminDashboard = () => {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [overviewData, setOverviewData] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [lucidData, setLucidData] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://studly-server-production.up.railway.app';
  const LUCID_API_URL = process.env.REACT_APP_LUCID_API_URL || '';
  const LUCID_API_KEY = process.env.REACT_APP_LUCID_API_KEY || '';

  const handleUnlock = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}/admin/analytics`, {
        headers: { 'x-admin-password': password }
      });
      if (!res.ok) throw new Error('Invalid password or unauthorized');
      const data = await res.json();
      setOverviewData(data);
      
      const usersRes = await fetch(`${API_URL}/admin/users`, {
        headers: { 'x-admin-password': password }
      });
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsersData(uData);
      }

      // Fetch from Lucid (only if env vars are configured)
      if (LUCID_API_URL && LUCID_API_KEY) {
        try {
          const lucidRes = await fetch(`${LUCID_API_URL}/api/admin/analytics`, {
            headers: { 'x-api-key': LUCID_API_KEY }
          });
          if (lucidRes.ok) {
            const lData = await lucidRes.json();
            setLucidData(lData);
          }
        } catch (lucidErr) {
          console.warn('Could not fetch Lucid data:', lucidErr);
        }
      }

      setIsUnlocked(true);
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const usersRes = await fetch(`${API_URL}/admin/users?email=${encodeURIComponent(searchEmail)}`, {
        headers: { 'x-admin-password': password }
      });
      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsersData(uData);
      }
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="admin-theme" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div className="admin-card" style={{ maxWidth: '400px', width: '100%' }}>
          <h1 className="heading-xl" style={{ marginBottom: 'var(--space-2)' }}>System access</h1>
          <p style={{ color: 'var(--muted-foreground)', marginBottom: 'var(--space-6)' }}>
            Enter your credentials to continue.
          </p>
          <form onSubmit={handleUnlock}>
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p style={{ color: 'var(--destructive)', marginBottom: 'var(--space-4)' }}>{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Authenticating…' : 'Unlock dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Helper for gauge charts
  const renderGauge = (value, total, label) => {
    const data = [
      { name: 'Value', value: value },
      { name: 'Remaining', value: total - value }
    ];
    return (
      <div style={{ flex: 1, borderRight: '1px solid var(--border)', padding: '0 var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h3 style={{ alignSelf: 'flex-start', color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: 500, marginBottom: 'var(--space-4)' }}>{label}</h3>
        <div style={{ width: '100%', height: '120px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="100%"
                startAngle={180}
                endAngle={0}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-theme" style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      
      {/* Left Sidebar */}
      <aside style={{ width: '250px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)', padding: 'var(--space-6) 0' }}>
        <div style={{ padding: '0 var(--space-6)', marginBottom: 'var(--space-10)' }}>
          <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: 'var(--primary)', color: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>S</div>
            Studly
          </h1>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', padding: '0 var(--space-4)' }}>
          {['Command center', 'Transactions', 'Customers', 'Refunds', 'Disputes', 'Payouts'].map((item, idx) => (
            <button key={item} style={{ 
              background: idx === 0 ? 'var(--input)' : 'transparent',
              color: idx === 0 ? 'var(--primary)' : 'var(--foreground)',
              border: 'none',
              textAlign: 'left',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: 'var(--text-base)',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ opacity: 0.7 }}>❖</span> {item}
            </button>
          ))}
        </nav>

        <div style={{ padding: '0 var(--space-4)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {['Audit logs', 'Developers'].map(item => (
            <button key={item} style={{ background: 'transparent', color: 'var(--muted-foreground)', border: 'none', textAlign: 'left', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500 }}>
              {item}
            </button>
          ))}
          <button style={{ background: 'transparent', color: 'var(--foreground)', border: 'none', textAlign: 'left', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'var(--space-2)' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--destructive)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>D</div>
            David
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--background)', padding: 'var(--space-8)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
            <h2 className="heading-lg">Insights</h2>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <button className="btn-secondary" style={{ padding: '6px 16px', minHeight: 'auto', fontSize: '13px' }}>Filter by date: Last 30 days</button>
              <button className="btn-secondary" style={{ padding: '6px 16px', minHeight: 'auto', fontSize: '13px' }}>NGN</button>
            </div>
          </header>

          {/* Top 4 Stat Cards */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
            <div style={{ padding: 'var(--space-4) 0', borderBottom: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Total signups</p>
              <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{overviewData?.total_signups || 0}</div>
            </div>
            <div style={{ padding: 'var(--space-4) 0', borderBottom: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Daily active users</p>
              <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{overviewData?.dau || 0}</div>
            </div>
            <div style={{ padding: 'var(--space-4) 0', borderBottom: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Monthly active users</p>
              <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{overviewData?.mau || 0}</div>
            </div>
            <div style={{ padding: 'var(--space-4) 0', borderBottom: '1px solid var(--border)' }}>
              <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', fontWeight: 500 }}>Aura points distributed</p>
              <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--primary)' }}>{overviewData?.total_aura_points || 0}</div>
            </div>
          </section>

          {/* Main Chart: User Stats */}
          <section style={{ marginBottom: 'var(--space-10)', backgroundColor: 'transparent', borderRadius: 'var(--radius)', border: '1px solid var(--border)', padding: 'var(--space-6)' }}>
            <h3 style={{ color: 'var(--foreground)', fontSize: 'var(--text-md)', fontWeight: 500, marginBottom: 'var(--space-8)' }}>User signups breakdown</h3>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={overviewData?.chart_data || []} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', color: 'var(--foreground)' }}
                    itemStyle={{ color: 'var(--primary)' }}
                  />
                  <Line type="linear" dataKey="users" stroke="var(--primary)" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: 'var(--primary)' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Gauge Charts Row */}
          <section style={{ display: 'flex', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: 'var(--space-6) 0', marginBottom: 'var(--space-12)' }}>
            {renderGauge(85, 100, 'Success rate')}
            {renderGauge(15, 100, 'Payment issues')}
            {renderGauge(30, 100, 'Abandonment rate')}
          </section>

          {/* Platform Engagement Row */}
          <section style={{ marginBottom: 'var(--space-10)' }}>
            <h2 className="heading-lg" style={{ marginBottom: 'var(--space-6)' }}>Platform engagement</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
              <div className="admin-card">
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Total posts</p>
                <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{overviewData?.total_posts || 0}</div>
              </div>
              <div className="admin-card">
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Total comments</p>
                <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{overviewData?.total_comments || 0}</div>
              </div>
              <div className="admin-card">
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Total likes</p>
                <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{overviewData?.total_likes || 0}</div>
              </div>
              <div className="admin-card">
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Total bookmarks</p>
                <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{overviewData?.total_bookmarks || 0}</div>
              </div>
              <div className="admin-card">
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Hashtags</p>
                <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{overviewData?.total_hashtags || 0}</div>
              </div>
              <div className="admin-card">
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Celebrations</p>
                <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{overviewData?.total_celebrations || 0}</div>
              </div>
            </div>
          </section>

          {/* Lucid Systems Row */}
          <section style={{ marginBottom: 'var(--space-10)' }}>
            <h2 className="heading-lg" style={{ marginBottom: 'var(--space-6)' }}>Lucid systems</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
              <div className="admin-card">
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Total notes saved</p>
                <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--primary)' }}>{lucidData?.total_notes || 0}</div>
              </div>
              <div className="admin-card">
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Total lucid users</p>
                <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{lucidData?.total_users || 0}</div>
              </div>
              <div className="admin-card">
                <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>System status</p>
                <div style={{ fontSize: 'var(--text-md)', fontWeight: 500, color: lucidData?.status === 'ok' ? 'var(--foreground)' : 'var(--destructive)' }}>
                  {lucidData?.status || 'Offline'}
                </div>
              </div>
            </div>
          </section>

          {/* User Directory Table */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <h2 className="heading-lg">User directory</h2>
              <form onSubmit={handleSearch} style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: '300px', width: '100%' }}>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Search by email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  style={{ minHeight: '40px' }}
                />
                <button type="submit" className="btn-secondary" style={{ minHeight: '40px', width: 'auto', padding: '0 var(--space-4)' }}>Search</button>
              </form>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <table style={{ minWidth: '800px', width: '100%' }}>
                <thead style={{ backgroundColor: 'var(--input)' }}>
                  <tr>
                    <th>User details</th>
                    <th>Email address</th>
                    <th>Aura points</th>
                    <th>Current streak</th>
                    <th>Last active</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 'var(--space-8)' }}>
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    usersData.map((user, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 500 }}>{user.name || user.username || 'Unknown user'}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>{user.email}</td>
                        <td className="tabular-nums" style={{ color: 'var(--primary)' }}>{user.aura_points || 0}</td>
                        <td className="tabular-nums">{user.current_streak || 0}</td>
                        <td style={{ color: 'var(--muted-foreground)' }}>
                          {user.last_active ? new Date(user.last_active).toLocaleDateString() : 'Never'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
