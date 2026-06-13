'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MusteriGirisPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const update = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = tab === 'login'
        ? { action: 'login', email: form.email, phone: form.phone || undefined, password: form.password }
        : { ...form, action: 'register' };

      const res = await fetch('/api/public/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'İşlem başarısız');
      } else {
        localStorage.setItem('customer', JSON.stringify(data.data));
        router.push('/musteri/profil');
      }
    } catch {
      setError('Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div className="login-branding" style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 50%, #7c3aed 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        color: 'white', padding: 40, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-30%', right: '-20%', width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-30%', left: '-20%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            width: 80, height: 80, borderRadius: 20,
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', fontSize: 36,
          }}>
            <i className="fas fa-user"></i>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.02em' }}>Müşteri Paneli</h1>
          <p style={{ fontSize: 16, opacity: 0.85, lineHeight: 1.6, marginBottom: 40 }}>
            Randevularınızı görüntüleyin, yorum yapın ve puanlarınızı takip edin.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, textAlign: 'left', background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 24, backdropFilter: 'blur(4px)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.6, marginBottom: 4 }}>Size Özel</div>
            {[
              { icon: 'fa-calendar-check', label: 'Randevu Geçmişi' },
              { icon: 'fa-star', label: 'Yorum Yapma' },
              { icon: 'fa-crown', label: 'Sadakat Puanları' },
              { icon: 'fa-gift', label: 'Hediye Kartları' },
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
              <i className={`fas ${tab === 'login' ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>
              {tab === 'login' ? 'Hoş Geldiniz' : 'Hesap Oluşturun'}
            </h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
              {tab === 'login' ? 'Giriş yaparak randevularınıza ulaşın' : 'Kayıt olup ayrıcalıklardan yararlanın'}
            </p>
          </div>

          <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 24 }}>
            <button onClick={() => setTab('login')} style={{
              flex: 1, padding: '8px 16px', borderRadius: 10, border: 'none',
              background: tab === 'login' ? 'white' : 'transparent',
              color: tab === 'login' ? '#1e293b' : '#64748b',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              boxShadow: tab === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}>Giriş Yap</button>
            <button onClick={() => setTab('register')} style={{
              flex: 1, padding: '8px 16px', borderRadius: 10, border: 'none',
              background: tab === 'register' ? 'white' : 'transparent',
              color: tab === 'register' ? '#1e293b' : '#64748b',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              boxShadow: tab === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
            }}>Kayıt Ol</button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '12px 16px', background: '#fef2f2', color: '#dc2626',
                borderRadius: 12, fontSize: 13, marginBottom: 20,
                border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <i className="fas fa-exclamation-circle"></i>{error}
              </div>
            )}

            {tab === 'register' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Ad Soyad</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-user" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}></i>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)} style={{
                    width: '100%', padding: '12px 16px 12px 40px', border: '2px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#f8fafc',
                  }} placeholder="Adınız Soyadınız" required
                  onFocus={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.08)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }} />
                </div>
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>E-posta</label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-envelope" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}></i>
                <input type="email" value={form.email} onChange={e => update('email', e.target.value)} style={{
                  width: '100%', padding: '12px 16px 12px 40px', border: '2px solid #e2e8f0', borderRadius: 12,
                  fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#f8fafc',
                }} placeholder="ornek@email.com" required
                onFocus={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.08)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }} />
              </div>
            </div>

            {tab === 'register' && (
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Telefon</label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-phone" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}></i>
                  <input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} style={{
                    width: '100%', padding: '12px 16px 12px 40px', border: '2px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#f8fafc',
                  }} placeholder="+90 5XX XXX XX XX" required
                  onFocus={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.08)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }} />
                </div>
              </div>
            )}

            <div style={{ marginBottom: tab === 'login' ? 28 : 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Şifre</label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-lock" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}></i>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)} style={{
                  width: '100%', padding: '12px 16px 12px 40px', border: '2px solid #e2e8f0', borderRadius: 12,
                  fontSize: 14, boxSizing: 'border-box', outline: 'none', background: '#f8fafc',
                }} placeholder="••••••••" required minLength={6}
                onFocus={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79,70,229,0.08)'; }}
                onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'; }} />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: loading ? '#94a3b8' : 'linear-gradient(135deg, #4f46e5, #4338ca)',
              color: 'white', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: loading ? 'none' : '0 4px 16px rgba(79,70,229,0.3)',
            }}>
              {loading ? <><i className="fas fa-spinner fa-spin"></i> İşleniyor...</> : tab === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center' }}>
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
          </div>
        </div>
      </div>
    </div>
  );
}
