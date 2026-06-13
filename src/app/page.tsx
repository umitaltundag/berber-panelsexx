'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b' }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(226,232,240,0.8)' : 'none',
        transition: 'all 0.3s',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: scrolled ? '12px 32px' : '16px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'padding 0.3s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#4f46e5,#4338ca)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16,
              boxShadow: '0 4px 8px rgba(79,70,229,0.25)',
            }}><i className="fas fa-cut"></i></div>
            <span style={{ fontSize: 18, fontWeight: 700 }}>BerberPanel</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <a href="#services" style={{ textDecoration: 'none', color: '#64748b', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 8, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >Hizmetler</a>
            <a href="#staff" style={{ textDecoration: 'none', color: '#64748b', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 8, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >Personel</a>
            <a href="#contact" style={{ textDecoration: 'none', color: '#64748b', fontSize: 14, fontWeight: 500, padding: '6px 12px', borderRadius: 8, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >İletişim</a>
            <button onClick={() => router.push('/randevu-al')} style={{
              padding: '9px 20px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#4f46e5,#4338ca)',
              color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)'; }}
            ><i className="fas fa-calendar-check" style={{ marginRight: 6 }}></i>Randevu Al</button>
            <button onClick={() => router.push('/login')} style={{
              padding: '9px 20px', borderRadius: 10, border: '1px solid #e2e8f0',
              background: 'rgba(255,255,255,0.8)', color: '#475569', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            ><i className="fas fa-user-shield" style={{ marginRight: 6 }}></i>Giriş</button>
            <button onClick={() => router.push('/musteri-giris')} style={{
              padding: '9px 16px', borderRadius: 10, border: '1px solid #e2e8f0',
              background: 'rgba(255,255,255,0.8)', color: '#475569', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            ><i className="fas fa-user" style={{ marginRight: 6 }}></i>Müşteri</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'linear-gradient(135deg,#f8fafc 0%,#eef2ff 40%,#f0f4ff 70%,#f8fafc 100%)',
        padding: '120px 32px 80px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,70,229,0.06) 0%,transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', bottom: '-30%', left: '-10%', width: 600, height: 600,
          borderRadius: '50%', background: 'radial-gradient(circle,rgba(79,70,229,0.04) 0%,transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{
              display: 'inline-flex', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)', color: '#4f46e5', marginBottom: 20,
              border: '1px solid rgba(79,70,229,0.1)',
            }}>
              <i className="fas fa-sparkles" style={{ marginRight: 6 }}></i>Profesyonel Berber Yönetim Sistemi
            </div>
            <h1 style={{ fontSize: 50, fontWeight: 800, lineHeight: 1.1, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
              Berberinizi<br />
              <span style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dijitale Taşıyın</span>
            </h1>
            <p style={{ fontSize: 16, lineHeight: 1.7, color: '#64748b', margin: '0 0 36px', maxWidth: 480 }}>
              Randevu yönetimi, personel takibi, ödeme işlemleri ve müşteri ilişkileri
              için güçlü bir yönetim paneli. İşletmenizi büyütün, müşterilerinizi mutlu edin.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => router.push('/randevu-al')} style={{
                padding: '15px 32px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg,#4f46e5,#4338ca)',
                color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(79,70,229,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(79,70,229,0.35)'; }}
              ><i className="fas fa-calendar-check" style={{ marginRight: 8 }}></i>Randevu Al</button>
              <button onClick={() => router.push('/login')} style={{
                padding: '15px 32px', borderRadius: 12, border: '1px solid #e2e8f0',
                background: 'white', color: '#475569', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.color = '#4f46e5'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#475569'; e.currentTarget.style.boxShadow = 'none'; }}
              ><i className="fas fa-user-shield" style={{ marginRight: 8 }}></i>Personel Girişi</button>
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg,#4f46e5,#4338ca,#7c3aed)',
            borderRadius: 24, padding: 40, color: 'white', textAlign: 'center',
            boxShadow: '0 30px 80px rgba(79,70,229,0.35)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-30%', right: '-20%', width: 300, height: 300,
              borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 60%)',
            }}/>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <i className="fas fa-cut" style={{ fontSize: 48, marginBottom: 20, opacity: 0.2 }}></i>
              <div style={{ fontSize: 14, opacity: 0.8, fontWeight: 500 }}>Yönetim Paneli</div>
              <div style={{ fontSize: 40, fontWeight: 800, margin: '8px 0', letterSpacing: '-0.02em' }}>1.284</div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>Kayıtlı Müşteri</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 28 }}>
                {[
                  { value: '246', label: 'Aylık Randevu' },
                  { value: '6', label: 'Usta Personel' },
                  { value: '84.5K', label: 'Aylık Ciro (₺)' },
                  { value: '4.7', label: 'Müşteri Puanı' },
                ].map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '16px 8px',
                    backdropFilter: 'blur(4px)',
                  }}>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{item.value}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 32px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: '#eef2ff', color: '#4f46e5', marginBottom: 16,
            }}>ÖZELLİKLER</div>
            <h2 style={{ fontSize: 34, fontWeight: 700, margin: '0 0 12px', letterSpacing: '-0.02em' }}>Neler Sunuyoruz?</h2>
            <p style={{ color: '#64748b', fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
              Berber işletmenizi yönetmek için ihtiyacınız olan tüm araçlar tek bir panelde
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { icon: 'fa-calendar-check', title: 'Randevu Yönetimi', desc: 'Online randevu alma, onaylama ve takvim yönetimi. Müşterileriniz 7/24 randevu alabilir.' },
              { icon: 'fa-users', title: 'Personel Takibi', desc: 'Çalışma saatleri, performans ve izin yönetimi. Her personelin istatistiklerini görün.' },
              { icon: 'fa-credit-card', title: 'Ödeme İşlemleri', desc: 'Kredi kartı, nakit ve havale ödeme takibi. POS entegrasyonu ile kolay ödeme.' },
              { icon: 'fa-chart-bar', title: 'Detaylı Raporlar', desc: 'Gelir-gider analizi, personel performansı ve müşteri memnuniyeti raporları.' },
              { icon: 'fa-gift', title: 'Kampanyalar & Kuponlar', desc: 'İndirim kuponları ve sadakat programı. Müşterilerinize özel promosyonlar sunun.' },
              { icon: 'fa-bell', title: 'Akıllı Bildirimler', desc: 'SMS ve e-posta ile randevu hatırlatmaları. Kaçan randevuları azaltın.' },
            ].map((f, i) => (
              <div key={i} style={{
                padding: 32, borderRadius: 16, border: '1px solid #e2e8f0',
                transition: 'all 0.3s', position: 'relative', overflow: 'hidden',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(79,70,229,0.08)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}
              >
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: 'linear-gradient(135deg,#eef2ff,#e0e7ff)',
                  color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, marginBottom: 18,
                }}>
                  <i className={`fas ${f.icon}`}></i>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" style={{ padding: '100px 32px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: '#eef2ff', color: '#4f46e5', marginBottom: 16,
            }}>HİZMETLER</div>
            <h2 style={{ fontSize: 34, fontWeight: 700, margin: '0 0 12px', letterSpacing: '-0.02em' }}>Hizmetlerimiz</h2>
            <p style={{ color: '#64748b', fontSize: 16 }}>Profesyonel ekibimizle kaliteli hizmet</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { name: 'Erkek Saç Kesimi', price: '150 ₺', time: '30 dk', icon: 'fa-cut', c: '#4f46e5', bg: '#eef2ff' },
              { name: 'Sakal Kesimi', price: '80 ₺', time: '20 dk', icon: 'fa-hand-paper', c: '#d97706', bg: '#fffbeb' },
              { name: 'Saç Boyama', price: '350 ₺', time: '60 dk', icon: 'fa-palette', c: '#dc2626', bg: '#fef2f2' },
              { name: 'Fön Çekimi', price: '120 ₺', time: '25 dk', icon: 'fa-wind', c: '#db2777', bg: '#fce7f3' },
            ].map((s, i) => (
              <div key={i} style={{
                padding: 28, borderRadius: 16, background: 'white', border: '1px solid #e2e8f0',
                textAlign: 'center', transition: 'all 0.3s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                <div style={{
                  width: 54, height: 54, borderRadius: 14,
                  background: s.bg, color: s.c,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, margin: '0 auto 16px',
                }}>
                  <i className={`fas ${s.icon}`}></i>
                </div>
                <h4 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 6px' }}>{s.name}</h4>
                <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 10 }}>
                  <i className="far fa-clock" style={{ marginRight: 4 }}></i>{s.time}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#4f46e5' }}>{s.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STAFF */}
      <section id="staff" style={{ padding: '100px 32px', background: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              background: '#eef2ff', color: '#4f46e5', marginBottom: 16,
            }}>EKİP</div>
            <h2 style={{ fontSize: 34, fontWeight: 700, margin: '0 0 12px', letterSpacing: '-0.02em' }}>Ekibimiz</h2>
            <p style={{ color: '#64748b', fontSize: 16 }}>Deneyimli ve profesyonel ekibimizle hizmetinizdeyiz</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
            {[
              { name: 'Ahmet Demir', title: 'Usta Berber', initials: 'AD', color: '#4f46e5', exp: '12 yıl', stars: 5 },
              { name: 'Elif Korkmaz', title: 'Usta Kuaför', initials: 'EK', color: '#d97706', exp: '10 yıl', stars: 5 },
              { name: 'Mehmet Yıldız', title: 'Kıdemli Berber', initials: 'MY', color: '#059669', exp: '8 yıl', stars: 4 },
            ].map((s, i) => (
              <div key={i} style={{
                padding: 36, borderRadius: 16, border: '1px solid #e2e8f0', textAlign: 'center',
                transition: 'all 0.3s', position: 'relative',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: `linear-gradient(135deg,${s.color},${s.color}cc)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 30, fontWeight: 700, color: 'white', margin: '0 auto 20px',
                  boxShadow: `0 8px 24px ${s.color}40`,
                }}>{s.initials}</div>
                <h4 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 4px' }}>{s.name}</h4>
                <div style={{ fontSize: 14, color: '#64748b', marginBottom: 12 }}>{s.title}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                  {Array.from({ length: 5 }).map((_, si) => (
                    <i key={si} className="fas fa-star" style={{ fontSize: 12, color: si < s.stars ? '#f59e0b' : '#e2e8f0' }}></i>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8', background: '#f8fafc', borderRadius: 20, padding: '4px 16px', display: 'inline-block' }}>
                  <i className="fas fa-award" style={{ marginRight: 6 }}></i>{s.exp} deneyim
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '100px 32px',
        background: 'linear-gradient(135deg,#4f46e5 0%,#4338ca 50%,#7c3aed 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-50%', right: '-20%', width: 600, height: 600,
          borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,255,255,0.05) 0%,transparent 60%)',
        }}/>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto', textAlign: 'center', color: 'white' }}>
          <div style={{
            display: 'inline-flex', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            background: 'rgba(255,255,255,0.12)', marginBottom: 20,
          }}>HEMEN BAŞLAYIN</div>
          <h2 style={{ fontSize: 34, fontWeight: 700, margin: '0 0 16px', letterSpacing: '-0.02em' }}>Berberinizi Dijitale Taşıyın</h2>
          <p style={{ fontSize: 16, opacity: 0.9, marginBottom: 36, lineHeight: 1.7 }}>
            Berber işletmenizi dijital ortama taşıyın, randevularınızı kolayca yönetin,
            müşterilerinize profesyonel bir deneyim sunun.
          </p>
          <button onClick={() => router.push('/randevu-al')} style={{
            padding: '16px 44px', borderRadius: 12, border: 'none',
            background: 'white', color: '#4f46e5', fontSize: 16, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(0,0,0,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'; }}
          ><i className="fas fa-calendar-check" style={{ marginRight: 8 }}></i>Hemen Randevu Al</button>
        </div>
      </section>

      {/* CONTACT & FOOTER */}
      <section id="contact" style={{ padding: '80px 32px 40px', background: '#0f172a', color: 'white' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}><i className="fas fa-cut"></i></div>
                <span style={{ fontSize: 18, fontWeight: 700 }}>BerberPanel</span>
              </div>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, maxWidth: 320 }}>
                Profesyonel berber yönetim sistemi. Randevu, personel, ödeme ve müşteri yönetimi için güçlü bir çözüm.
              </p>
              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                {['facebook-f', 'instagram', 'twitter', 'whatsapp'].map(icon => (
                  <div key={icon} style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
                  ><i className={`fab fa-${icon}`}></i></div>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>Hızlı Linkler</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                {[
                  { label: 'Ana Sayfa', href: '#' },
                  { label: 'Hizmetler', href: '#services' },
                  { label: 'Personel', href: '#staff' },
                  { label: 'Randevu Al', href: '/randevu-al' },
                  { label: 'Giriş Yap', href: '/login' },
                ].map((link, i) => (
                  <a key={i} href={link.href} style={{
                    color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = 'white'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                  >{link.label}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>Hizmetler</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
                {['Saç Kesimi', 'Sakal Kesimi', 'Saç Boyama', 'Fön Çekimi', 'Cilt Bakımı'].map((item, i) => (
                  <span key={i} style={{ color: '#94a3b8' }}>{item}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748b' }}>İletişim</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14, color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <i className="fas fa-map-marker-alt" style={{ marginTop: 2, color: '#4f46e5' }}></i>
                  <span>İstanbul, Türkiye</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-envelope" style={{ color: '#4f46e5' }}></i>
                  <span>info@berberpanel.com</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <i className="fas fa-phone" style={{ color: '#4f46e5' }}></i>
                  <span>+90 212 555 00 00</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(148,163,184,0.15)', marginTop: 48, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: '#64748b' }}>
            <span>&copy; 2026 BerberPanel. Tüm hakları saklıdır.</span>
            <div style={{ display: 'flex', gap: 16 }}>
              <span style={{ cursor: 'pointer' }}>Gizlilik Politikası</span>
              <span style={{ cursor: 'pointer' }}>Kullanım Şartları</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
