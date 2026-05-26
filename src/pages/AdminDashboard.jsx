import React, { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('Command center');
  const [subscriptionsData, setSubscriptionsData] = useState([]);
  const [quotasData, setQuotasData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [fetchingTab, setFetchingTab] = useState(false);
  
  const [searchSubEmail, setSearchSubEmail] = useState('');
  const [searchQuotaEmail, setSearchQuotaEmail] = useState('');

  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersLimit] = useState(20);

  const [subPage, setSubPage] = useState(1);
  const [subTotal, setSubTotal] = useState(0);
  const [subLimit] = useState(20);

  const [quotaPage, setQuotaPage] = useState(1);
  const [quotaTotal, setQuotaTotal] = useState(0);
  const [quotaLimit] = useState(20);

  const [postsPage, setPostsPage] = useState(1);
  const [postsTotal, setPostsTotal] = useState(0);
  const [postsLimit] = useState(20);

  const API_URL = process.env.REACT_APP_API_URL || 'https://studly-server-production.up.railway.app';
  const LUCID_API_URL = process.env.REACT_APP_LUCID_API_URL || '';
  const LUCID_API_KEY = process.env.REACT_APP_LUCID_API_KEY || '';

  const fetchUsers = async (page = 1, email = searchEmail) => {
    try {
      const res = await fetch(`${API_URL}/admin/users?page=${page}&limit=${usersLimit}&email=${encodeURIComponent(email)}`, {
        headers: { 'x-admin-password': password }
      });
      if (res.ok) {
        const uData = await res.json();
        setUsersData(uData.data || []);
        setUsersTotal(uData.total || 0);
        setUsersPage(uData.page || 1);
      }
    } catch (err) {
      console.error('Fetch users failed', err);
    }
  };

  const fetchSubscriptions = async (page = 1, email = searchSubEmail) => {
    setFetchingTab(true);
    try {
      const res = await fetch(`${API_URL}/admin/subscriptions?page=${page}&limit=${subLimit}&email=${encodeURIComponent(email)}`, {
        headers: { 'x-admin-password': password }
      });
      if (res.ok) {
        const sData = await res.json();
        setSubscriptionsData(sData.data || []);
        setSubTotal(sData.total || 0);
        setSubPage(sData.page || 1);
      }
    } catch (err) {
      console.error('Fetch subscriptions failed', err);
    } finally {
      setFetchingTab(false);
    }
  };

  const fetchQuotas = async (page = 1, email = searchQuotaEmail) => {
    setFetchingTab(true);
    try {
      const res = await fetch(`${API_URL}/admin/quotas?page=${page}&limit=${quotaLimit}&email=${encodeURIComponent(email)}`, {
        headers: { 'x-admin-password': password }
      });
      if (res.ok) {
        const qData = await res.json();
        setQuotasData(qData.data || []);
        setQuotaTotal(qData.total || 0);
        setQuotaPage(qData.page || 1);
      }
    } catch (err) {
      console.error('Fetch quotas failed', err);
    } finally {
      setFetchingTab(false);
    }
  };

  const fetchPosts = async (page = 1) => {
    setFetchingTab(true);
    try {
      const res = await fetch(`${API_URL}/admin/posts?page=${page}&limit=${postsLimit}`, {
        headers: { 'x-admin-password': password }
      });
      if (res.ok) {
        const pData = await res.json();
        setPostsData(pData.data || []);
        setPostsTotal(pData.total || 0);
        setPostsPage(pData.page || 1);
      }
    } catch (err) {
      console.error('Fetch posts failed', err);
    } finally {
      setFetchingTab(false);
    }
  };

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
      
      await fetchUsers(1, '');

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
    await fetchUsers(1, searchEmail);
  };

  const handleSubSearch = async (e) => {
    e.preventDefault();
    await fetchSubscriptions(1, searchSubEmail);
  };

  const handleQuotaSearch = async (e) => {
    e.preventDefault();
    await fetchQuotas(1, searchQuotaEmail);
  };

  const handleTabChange = async (tab) => {
    setActiveTab(tab);
    if (!isUnlocked) return;
    
    if (tab === 'Command center') {
      await fetchUsers(1, searchEmail);
    } else if (tab === 'Subscriptions') {
      await fetchSubscriptions(1, searchSubEmail);
    } else if (tab === 'Storage & Quotas') {
      await fetchQuotas(1, searchQuotaEmail);
    } else if (tab === 'Moderation Hub') {
      await fetchPosts(1);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to permanently delete this post?')) return;
    
    try {
      const res = await fetch(`${API_URL}/admin/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      });
      if (res.ok) {
        setPostsData(prev => prev.filter(post => post.post_id !== postId));
        alert('Post deleted successfully');
      } else {
        alert('Failed to delete post');
      }
    } catch (err) {
      console.error('Failed to delete post:', err);
      alert('An error occurred while deleting the post');
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

  const renderPagination = (currentPage, totalItems, limit, onPageChange) => {
    const totalPages = Math.ceil(totalItems / limit);
    if (totalPages <= 1) return null;

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-4)', padding: 'var(--space-3) var(--space-4)', backgroundColor: 'var(--input)', borderBottomLeftRadius: 'var(--radius)', borderBottomRightRadius: 'var(--radius)', borderTop: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', margin: 0 }}>
          Showing <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{((currentPage - 1) * limit) + 1}</span> to{' '}
          <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{Math.min(currentPage * limit, totalItems)}</span> of{' '}
          <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{totalItems}</span> records
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button 
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="btn-secondary"
            style={{ padding: '6px 12px', minHeight: 'auto', fontSize: 'var(--text-xs)', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            Previous
          </button>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="btn-secondary"
            style={{ padding: '6px 12px', minHeight: 'auto', fontSize: 'var(--text-xs)', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next
          </button>
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
          {['Command center', 'Subscriptions', 'Storage & Quotas', 'Moderation Hub'].map((item) => (
            <button 
              key={item} 
              onClick={() => handleTabChange(item)}
              style={{ 
                background: activeTab === item ? 'var(--input)' : 'transparent',
                color: activeTab === item ? 'var(--primary)' : 'var(--foreground)',
                border: 'none',
                textAlign: 'left',
                padding: 'var(--space-2) var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: 'var(--text-base)',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'background-color 150ms ease, color 150ms ease'
              }}
            >
              <span style={{ opacity: 0.7, color: activeTab === item ? 'var(--primary)' : 'var(--muted-foreground)' }}>❖</span> {item}
            </button>
          ))}
        </nav>

        <div style={{ padding: '0 var(--space-4)', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {['Audit logs', 'Developers'].map(item => (
            <button 
              key={item} 
              onClick={() => setActiveTab(item)}
              style={{ 
                background: activeTab === item ? 'var(--input)' : 'transparent', 
                color: activeTab === item ? 'var(--primary)' : 'var(--muted-foreground)', 
                border: 'none', 
                textAlign: 'left', 
                padding: 'var(--space-2) var(--space-3)', 
                borderRadius: 'var(--radius-sm)', 
                cursor: 'pointer', 
                fontSize: 'var(--text-sm)', 
                fontWeight: 500,
                transition: 'background-color 150ms ease, color 150ms ease'
              }}
            >
              {item}
            </button>
          ))}
          <button style={{ background: 'transparent', color: 'var(--foreground)', border: 'none', textAlign: 'left', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'var(--space-2)' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>D</div>
            David
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      {/* Main Content Pane */}
      <main style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--background)', padding: 'var(--space-8)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {activeTab === 'Command center' && (
            <>
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
                <h2 className="heading-lg" style={{ marginBottom: 'var(--space-6)' }}>Lucid companion app insights</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
                  <div className="admin-card">
                    <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Total notes</p>
                    <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--primary)' }}>{lucidData?.total_notes || 0}</div>
                  </div>
                  <div className="admin-card">
                    <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Total users</p>
                    <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{lucidData?.total_users || 0}</div>
                  </div>
                  <div className="admin-card">
                    <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Daily active (Lucid)</p>
                    <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--primary)' }}>{lucidData?.active_users_24h || 0}</div>
                  </div>
                  <div className="admin-card">
                    <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Weekly active (Lucid)</p>
                    <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{lucidData?.active_users_7d || 0}</div>
                  </div>
                  <div className="admin-card">
                    <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Note uploads (24h)</p>
                    <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{lucidData?.notes_24h || 0}</div>
                  </div>
                  <div className="admin-card">
                    <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Note uploads (7d)</p>
                    <div className="tabular-nums" style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>{lucidData?.notes_7d || 0}</div>
                  </div>
                  <div className="admin-card">
                    <p style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Lucid Status</p>
                    <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: lucidData?.status === 'ok' ? '#2ea043' : 'var(--destructive)' }}>
                      {lucidData?.status ? 'Online' : 'Offline'}
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
                  {renderPagination(usersPage, usersTotal, usersLimit, (p) => fetchUsers(p, searchEmail))}
                </div>
              </section>
            </>
          )}

          {activeTab === 'Subscriptions' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
                <div>
                  <h2 className="heading-lg">Active Subscriptions</h2>
                  <p style={{ color: 'var(--muted-foreground)' }}>Track all premium Pro subscriptions on the platform</p>
                </div>
                <form onSubmit={handleSubSearch} style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: '300px', width: '100%' }}>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="Search user email"
                    value={searchSubEmail}
                    onChange={(e) => setSearchSubEmail(e.target.value)}
                    style={{ minHeight: '40px' }}
                  />
                  <button type="submit" className="btn-secondary" style={{ minHeight: '40px', width: 'auto', padding: '0 var(--space-4)' }}>Search</button>
                </form>
              </div>
              {fetchingTab ? (
                <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--muted-foreground)' }}>Loading subscriptions...</div>
              ) : (
                <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                  <table style={{ minWidth: '800px', width: '100%' }}>
                    <thead style={{ backgroundColor: 'var(--input)' }}>
                      <tr>
                        <th>User details</th>
                        <th>Email address</th>
                        <th>Plan Type</th>
                        <th>Status</th>
                        <th>Paystack Code</th>
                        <th>Renewal Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscriptionsData.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 'var(--space-8)' }}>
                            No subscriptions found.
                          </td>
                        </tr>
                      ) : (
                        subscriptionsData.map((sub, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 500 }}>{sub.name}</td>
                            <td style={{ color: 'var(--muted-foreground)' }}>{sub.email}</td>
                            <td>
                              <span style={{ 
                                padding: '2px 8px', 
                                borderRadius: '4px', 
                                fontSize: '11px', 
                                fontWeight: 'bold', 
                                backgroundColor: sub.plan_type === 'pro' ? 'rgba(255, 69, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                                color: sub.plan_type === 'pro' ? 'var(--primary)' : 'var(--foreground)'
                              }}>
                                {sub.plan_type.toUpperCase()}
                              </span>
                            </td>
                            <td>
                              <span style={{ 
                                padding: '2px 8px', 
                                borderRadius: '4px', 
                                fontSize: '11px', 
                                fontWeight: 'bold', 
                                backgroundColor: sub.status === 'active' ? 'rgba(46, 160, 67, 0.15)' : 'rgba(248, 81, 73, 0.15)',
                                color: sub.status === 'active' ? '#2ea043' : '#f85149'
                              }}>
                                {sub.status.toUpperCase()}
                              </span>
                            </td>
                            <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{sub.paystack_subscription_code || 'N/A'}</td>
                            <td style={{ color: 'var(--muted-foreground)' }}>
                              {sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString() : 'N/A'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {renderPagination(subPage, subTotal, subLimit, (p) => fetchSubscriptions(p, searchSubEmail))}
                </div>
              )}
            </>
          )}

          {activeTab === 'Storage & Quotas' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
                <div>
                  <h2 className="heading-lg">Platform Quotas & Uploads</h2>
                  <p style={{ color: 'var(--muted-foreground)' }}>Monitor user note uploads and free tier quota consumption</p>
                </div>
                <form onSubmit={handleQuotaSearch} style={{ display: 'flex', gap: 'var(--space-2)', maxWidth: '300px', width: '100%' }}>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="Search user email"
                    value={searchQuotaEmail}
                    onChange={(e) => setSearchQuotaEmail(e.target.value)}
                    style={{ minHeight: '40px' }}
                  />
                  <button type="submit" className="btn-secondary" style={{ minHeight: '40px', width: 'auto', padding: '0 var(--space-4)' }}>Search</button>
                </form>
              </div>
              {fetchingTab ? (
                <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--muted-foreground)' }}>Loading quotas...</div>
              ) : (
                <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                  <table style={{ minWidth: '600px', width: '100%' }}>
                    <thead style={{ backgroundColor: 'var(--input)' }}>
                      <tr>
                        <th>User details</th>
                        <th>Email address</th>
                        <th>Lifetime Notes Uploaded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotasData.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', color: 'var(--muted-foreground)', padding: 'var(--space-8)' }}>
                            No quota records found.
                          </td>
                        </tr>
                      ) : (
                        quotasData.map((quota, idx) => (
                          <tr key={idx}>
                            <td style={{ fontWeight: 500 }}>{quota.name}</td>
                            <td style={{ color: 'var(--muted-foreground)' }}>{quota.email}</td>
                            <td className="tabular-nums" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                              {quota.lifetime_free_notes_uploaded}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                  {renderPagination(quotaPage, quotaTotal, quotaLimit, (p) => fetchQuotas(p, searchQuotaEmail))}
                </div>
              )}
            </>
          )}

          {activeTab === 'Moderation Hub' && (
            <>
              <header style={{ marginBottom: 'var(--space-8)' }}>
                <h2 className="heading-lg">Content Moderation Feed</h2>
                <p style={{ color: 'var(--muted-foreground)' }}>Review and manage feed posts to maintain community guidelines</p>
              </header>
              {fetchingTab ? (
                <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--muted-foreground)' }}>Loading posts...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {postsData.length === 0 ? (
                    <div style={{ padding: 'var(--space-8)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center', color: 'var(--muted-foreground)' }}>
                      No posts available for moderation.
                    </div>
                  ) : (
                    postsData.map((post) => (
                      <div key={post.post_id} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-6)' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{post.author_name}</span>
                            <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)' }}>({post.author_email})</span>
                            <span style={{ color: 'var(--border)' }}>•</span>
                            <span style={{ color: 'var(--muted-foreground)', fontSize: 'var(--text-xs)' }}>
                              {new Date(post.created_at).toLocaleString()}
                            </span>
                          </div>
                          <p style={{ color: 'var(--foreground)', fontSize: 'var(--text-md)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                            {post.content}
                          </p>
                          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', fontFamily: 'monospace' }}>
                            ID: {post.post_id}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleDeletePost(post.post_id)}
                          style={{ 
                            backgroundColor: 'rgba(248, 81, 73, 0.1)', 
                            color: '#ff585b', 
                            border: '1px solid rgba(248, 81, 73, 0.2)', 
                            padding: '6px 12px', 
                            borderRadius: 'var(--radius-sm)', 
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '12px',
                            transition: 'all 150ms ease',
                            flexShrink: 0
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 81, 73, 0.2)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'rgba(248, 81, 73, 0.1)'}
                        >
                          Delete Post
                        </button>
                      </div>
                    ))
                  )}
                  {renderPagination(postsPage, postsTotal, postsLimit, (p) => fetchPosts(p))}
                </div>
              )}
            </>
          )}

          {!['Command center', 'Subscriptions', 'Storage & Quotas', 'Moderation Hub'].includes(activeTab) && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              minHeight: '60vh', 
              textAlign: 'center',
              color: 'var(--muted-foreground)',
              padding: 'var(--space-8) 0'
            }}>
              <div style={{ fontSize: '48px', marginBottom: 'var(--space-4)' }}>🚧</div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--foreground)', marginBottom: 'var(--space-2)' }}>
                {activeTab} is under construction
              </h2>
              <p style={{ maxWidth: '400px', fontSize: 'var(--text-md)', lineHeight: 1.6 }}>
                This section is currently being integrated with your financial and analytics gateways. Check back soon for updates!
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
