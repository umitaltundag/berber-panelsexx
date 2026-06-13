'use client';

import { useData } from '@/lib/use-data';

interface LoyaltyProps {
  refreshKey?: number;
}

interface LoyaltyTierData {
  id: number;
  name: string;
  minPoints: number;
  discount: number;
  color: string;
}

interface CustomerData {
  id: number;
  name: string;
  points: number;
}

function getTierName(tiers: LoyaltyTierData[] | undefined, points: number): string {
  if (!tiers || tiers.length === 0) return '-';
  const sorted = [...tiers].sort((a, b) => b.minPoints - a.minPoints);
  const tier = sorted.find(t => points >= t.minPoints);
  return tier?.name ?? 'Seviyesiz';
}

function getTierColor(tiers: LoyaltyTierData[] | undefined, points: number): string {
  if (!tiers || tiers.length === 0) return '#64748b';
  const sorted = [...tiers].sort((a, b) => b.minPoints - a.minPoints);
  const tier = sorted.find(t => points >= t.minPoints);
  return tier?.color ?? '#64748b';
}

export default function Loyalty({ refreshKey }: LoyaltyProps) {
  const { data: tiers, loading } = useData<LoyaltyTierData[]>('/api/loyalty-tiers');
  const { data: customers } = useData<CustomerData[]>('/api/customers');

  return (
    <section className="page-section active" id="loyalty">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="tabs" style={{ margin: 0 }}>
          <button className="tab active">Sadakat Programı</button>
        </div>
      </div>

      {loading && <p style={{ color: 'var(--text-muted)' }}>Yükleniyor...</p>}

      <div className="service-grid" style={{ marginBottom: 24 }}>
        {tiers?.map(t => (
          <div key={t.id} className="service-card" style={{ borderTop: `4px solid ${t.color}` }}>
            <div className="service-icon" style={{ background: `${t.color}22`, color: t.color }}><i className="fas fa-crown"></i></div>
            <h4>{t.name}</h4>
            <div className="service-meta">
              <span><i className="fas fa-star"></i> Min. {t.minPoints} Puan</span>
              <span><i className="fas fa-percent"></i> %{t.discount} İndirim</span>
            </div>
            <div style={{ marginTop: 8 }}>
              <span className="badge" style={{ background: t.color, color: '#fff' }}>{t.name}</span>
            </div>
          </div>
        ))}
        {!loading && (!tiers || tiers.length === 0) && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)' }}>Henüz seviye tanımlanmamış</p>}
      </div>

      <div className="card">
        <div className="card-header"><h3><i className="fas fa-users" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Müşteri Puan Durumu</h3></div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Müşteri</th><th>Puan</th><th>Seviye</th></tr></thead>
              <tbody>
                {customers?.map(c => {
                  const tierName = getTierName(tiers ?? undefined, c.points);
                  const tierColor = getTierColor(tiers ?? undefined, c.points);
                  return (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.points}</td>
                      <td><span className="badge" style={{ background: tierColor, color: '#fff' }}>{tierName}</span></td>
                    </tr>
                  );
                })}
                {(!customers || customers.length === 0) && <tr><td colSpan={3} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Müşteri bulunmuyor</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
