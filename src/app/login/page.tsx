'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Giriş başarısız');
      } else {
        router.push('/admin');
      }
    } catch {
      setError('Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
    }}>
      {/* LEFT - Branding */}
      <div className="login-branding" style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 50%, #7c3aed 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: 'white', padding: 40, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-30%', right: '-20%', width: 500, height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30%', left: '-20%', width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 36,
          }}>
            <i className="fas fa-cut"></i>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>BerberPanel</h1>
          <p style={{ fontSize: 16, opacity: 0.85, lineHeight: 1.6, marginBottom: 40 }}>
            Profesyonel berber yönetim sistemi ile işletmenizi bir adım öne taşıyın.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left', background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6, marginBottom: 4 }}>Yönetim Paneli</div>
            {[
              { icon: 'fa-calendar-check', label: 'Randevu Yönetimi' },
              { icon: 'fa-users', label: 'Personel Takibi' },
              { icon: 'fa-credit-card', label: 'Ödeme İşlemleri' },
              { icon: 'fa-chart-bar', label: 'Detaylı Raporlar' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, opacity: 0.9 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`fas ${item.icon}`} style={{ fontSize: 14 }}></i>
                </div>
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT - Login form */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc, #f0f4ff)', padding: 40,
      }}>
        <div style={{
          background: 'white', borderRadius: 20, padding: 48, width: 400,
          boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          border: '1px solid #eef2ff',
        }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)',
              color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, marginBottom: 20,
            }}>
              <i className="fas fa-user-shield"></i>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>Hoş Geldiniz</h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Yönetim paneline erişmek için giriş yapın</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '12px 16px', background: '#fef2f2', color: '#dc2626',
                borderRadius: 12, fontSize: 13, marginBottom: 20,
                border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                Kullanıcı Adı
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-user" style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: '#94a3b8', fontSize: 14,
                }}></i>
                <input
                  type="text" value={username} onChange={e => setUsername(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px 12px 40px', border: '2px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s',
                    background: '#f8fafc',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.08)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
                  placeholder="Kullanıcı adınızı girin" required
                />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                Şifre
              </label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-lock" style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: '#94a3b8', fontSize: 14,
                }}></i>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px 12px 40px', border: '2px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, boxSizing: 'border-box', outline: 'none', transition: 'all 0.2s',
                    background: '#f8fafc',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.08)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }}
                  placeholder="Şifrenizi girin" required
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #4338ca)',
                color: 'white', fontSize: 15, fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: loading ? 'none' : '0 4px 16px rgba(79,70,229,0.3)',
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.4)'; } }}
              onMouseLeave={e => { if (!loading) { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(79,70,229,0.3)'; } }}
            >
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Giriş yapılıyor...</> : 'Giriş Yap'}
            </button>
          </form>

          <div style={{
            marginTop: 28, padding: '14px 16px',
            background: 'linear-gradient(135deg,#f1f5f9,#f8faff)',
            borderRadius: 12, fontSize: 13, color: '#64748b',
            textAlign: 'center', border: '1px solid #eef2ff',
          }}>
            <i className="fas fa-info-circle" style={{ marginRight: 6, color: '#4f46e5' }}></i>
            Demo hesabı: <strong style={{ color: '#1e293b' }}>admin</strong> / <strong style={{ color: '#1e293b' }}>admin123</strong>
          </div>

          <div style={{ marginTop: 20, textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 8 }}>
            <a href="/" style={{
              fontSize: 13, color: '#4f46e5', textDecoration: 'none', fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#eef2ff'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <i className="fas fa-arrow-left"></i>Ana Sayfaya Dön
            </a>
            <a href="/musteri-giris" style={{
              fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8,
              transition: 'background 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.color = '#4f46e5'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#64748b'; }}
            >
              <i className="fas fa-user"></i>Müşteri Girişi
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
