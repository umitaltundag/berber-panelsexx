'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CustomerData {
  id: number; name: string; phone: string | null; email: string | null;
  points: number; segment: string; totalVisits: number; lastVisit: string | null;
  appointments: any[]; reviews: any[]; loyaltyTier: any | null;
  giftCardsSent: any[]; giftCardsUsed: any[]; referralsGiven: any[];
  referralsUsed: any[]; payments: any[]; waitingList: any[];
}

export default function MusteriProfilPage() {
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('customer');
    if (!stored) { router.push('/musteri-giris'); return; }
    const parsed = JSON.parse(stored);
    if (!parsed.id) { router.push('/musteri-giris'); return; }

    fetch(`/api/public/customers/${parsed.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setCustomer(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('customer');
    router.push('/musteri-giris');
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, color: '#4f46e5' }}></i>
    </div>
  );

  if (!customer) return null;

  const tabs = [
    { key: 'appointments', icon: 'fa-calendar-check', label: 'Randevularım' },
    { key: 'reviews', icon: 'fa-star', label: 'Yorumlarım' },
    { key: 'loyalty', icon: 'fa-crown', label: 'Puanlarım' },
    { key: 'giftcards', icon: 'fa-gift', label: 'Hediye Kartları' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 50%, #7c3aed 100%)',
        color: 'white', padding: '24px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
          }}>
            <i className="fas fa-user"></i>
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{customer.name}</h2>
            <small style={{ opacity: 0.8 }}>{customer.email || customer.phone}</small>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            background: 'rgba(255,255,255,0.12)', padding: '6px 14px', borderRadius: 20,
            fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <i className="fas fa-crown"></i>{customer.points} Puan
          </span>
          <span style={{
            background: 'rgba(255,255,255,0.12)', padding: '6px 14px', borderRadius: 20,
            fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <i className="fas fa-tag"></i>{customer.segment}
          </span>
          <button onClick={handleLogout} style={{
            background: 'rgba(255,255,255,0.12)', border: 'none', color: 'white',
            padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <i className="fas fa-sign-out-alt"></i>Çıkış
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: '0 40px', marginTop: -1, background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '14px 20px', border: 'none', background: 'transparent',
            color: activeTab === t.key ? '#4f46e5' : '#64748b',
            fontWeight: activeTab === t.key ? 600 : 400, fontSize: 14,
            cursor: 'pointer', borderBottom: activeTab === t.key ? '2px solid #4f46e5' : '2px solid transparent',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all 0.2s',
          }}>
            <i className={`fas ${t.icon}`}></i>{t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: 24, maxWidth: 960, margin: '0 auto' }}>
        {/* Stats summary */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24,
        }}>
          {[
            { icon: 'fa-calendar-check', label: 'Toplam Randevu', value: customer.appointments.length, color: '#4f46e5' },
            { icon: 'fa-star', label: 'Yorumlar', value: customer.reviews.length, color: '#f59e0b' },
            { icon: 'fa-coins', label: 'Sadakat Puanı', value: customer.points, color: '#10b981' },
            { icon: 'fa-gift', label: 'Hediye Kartı', value: customer.giftCardsUsed.length + customer.giftCardsSent.length, color: '#ec4899' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 16, padding: 20,
              border: '1px solid #eef2ff', display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
              }}>
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#1e293b' }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Appointments */}
        {activeTab === 'appointments' && (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #eef2ff', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, fontSize: 15 }}>
              <i className="fas fa-calendar-check" style={{ color: '#4f46e5', marginRight: 8 }}></i>Randevu Geçmişi
            </div>
            {customer.appointments.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                <i className="fas fa-calendar" style={{ fontSize: 32, marginBottom: 12, display: 'block' }}></i>
                Henüz randevunuz bulunmuyor
              </div>
            ) : (
              <div style={{ padding: 0 }}>
                {customer.appointments.map((apt: any, i: number) => (
                  <div key={i} style={{
                    padding: '14px 20px', borderBottom: '1px solid #f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{apt.service?.name}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>
                        {apt.date} {apt.time} - {apt.staff?.name}
                      </div>
                    </div>
                    <span className="badge" style={{
                      background: apt.status === 'Tamamlandı' ? '#d1fae5' : apt.status === 'Onaylandı' ? '#dbeafe' : apt.status === 'İptal' ? '#fef2f2' : '#fef3c7',
                      color: apt.status === 'Tamamlandı' ? '#065f46' : apt.status === 'Onaylandı' ? '#1e40af' : apt.status === 'İptal' ? '#dc2626' : '#92400e',
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                    }}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ padding: 16, textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
              <a href="/randevu-al" style={{
                color: '#4f46e5', textDecoration: 'none', fontWeight: 500, fontSize: 14,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <i className="fas fa-plus"></i>Yeni Randevu Al
              </a>
            </div>
          </div>
        )}

        {/* Reviews */}
        {activeTab === 'reviews' && (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #eef2ff', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, fontSize: 15 }}>
              <i className="fas fa-star" style={{ color: '#f59e0b', marginRight: 8 }}></i>Yorumlarım
            </div>
            {customer.reviews.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                <i className="fas fa-star" style={{ fontSize: 32, marginBottom: 12, display: 'block' }}></i>
                Henüz yorum yapmadınız
              </div>
            ) : (
              customer.reviews.map((r: any, i: number) => (
                <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <strong style={{ fontSize: 14 }}>{r.staff?.name}</strong>
                      <div style={{ color: '#f59e0b', fontSize: 12 }}>
                        {Array.from({ length: r.rating }).map((_, j) => <i key={j} className="fas fa-star"></i>)}
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{r.status}</span>
                  </div>
                  {r.comment && <div style={{ fontSize: 13, color: '#475569' }}>{r.comment}</div>}
                </div>
              ))
            )}
          </div>
        )}

        {/* Loyalty */}
        {activeTab === 'loyalty' && (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #eef2ff', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, fontSize: 15 }}>
              <i className="fas fa-crown" style={{ color: '#10b981', marginRight: 8 }}></i>Sadakat Puanlarım
            </div>
            <div style={{ padding: 24, textAlign: 'center' }}>
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <span style={{ fontSize: 32, fontWeight: 800, color: '#065f46' }}>{customer.points}</span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>Sadakat Puanı</div>
              <div style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
                {customer.loyaltyTier
                  ? `Seviyeniz: ${customer.loyaltyTier.name} (${customer.loyaltyTier.discount}% indirim)`
                  : 'Henüz bir seviyeye ulaşmadınız'}
              </div>
              <div style={{ marginTop: 16, fontSize: 13, color: '#94a3b8' }}>
                Toplam {customer.totalVisits} ziyaret
              </div>
            </div>
          </div>
        )}

        {/* Gift Cards */}
        {activeTab === 'giftcards' && (
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #eef2ff', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', fontWeight: 600, fontSize: 15 }}>
              <i className="fas fa-gift" style={{ color: '#ec4899', marginRight: 8 }}></i>Hediye Kartları
            </div>
            {customer.giftCardsUsed.length === 0 && customer.giftCardsSent.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>
                <i className="fas fa-gift" style={{ fontSize: 32, marginBottom: 12, display: 'block' }}></i>
                Henüz hediye kartınız bulunmuyor
              </div>
            ) : (
              <div>
                {customer.giftCardsUsed.map((g: any, i: number) => (
                  <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <strong style={{ fontSize: 14 }}>{g.code}</strong>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{g.amount} ₺ - {g.status}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
