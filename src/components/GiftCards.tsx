'use client';

import { useData } from '@/lib/use-data';

interface GiftCardsProps {
  refreshKey?: number;
}

interface GiftCardData {
  id: number;
  code: string;
  amount: number;
  balance: number;
  message: string | null;
  status: string;
  expiresAt: string;
  sender: { name: string };
  receiver: { name: string };
}

export default function GiftCards({ refreshKey }: GiftCardsProps) {
  const { data: giftCards, loading } = useData<GiftCardData[]>('/api/gift-cards');

  const totalSales = giftCards?.reduce((s, g) => s + g.amount, 0) ?? 0;
  const activeCards = giftCards?.filter(g => g.status === 'Aktif').length ?? 0;

  return (
    <section className="page-section active" id="gift-cards">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="tabs" style={{ margin: 0 }}>
          <button className="tab active">Hediye Kartları ({(giftCards?.length ?? 0).toLocaleString()})</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Toplam Satış</div><div className="stat-value">{totalSales.toLocaleString()} ₺</div></div>
            <div className="stat-icon icon-green"><i className="fas fa-turkish-lira-sign"></i></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Aktif Kartlar</div><div className="stat-value">{activeCards.toLocaleString()}</div></div>
            <div className="stat-icon icon-blue"><i className="fas fa-gift"></i></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Kod</th><th>Tutar</th><th>Kalan Bakiye</th><th>Gönderen</th><th>Alan</th><th>Durum</th><th>Son Tarih</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!loading && (!giftCards || giftCards.length === 0) && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Hediye kartı bulunmuyor</td></tr>}
                {giftCards?.map(g => (
                  <tr key={g.id}>
                    <td><strong>{g.code}</strong></td>
                    <td>{g.amount.toLocaleString()} ₺</td>
                    <td>{g.balance.toLocaleString()} ₺</td>
                    <td>{g.sender.name}</td>
                    <td>{g.receiver.name}</td>
                    <td><span className={`badge badge-${g.status === 'Aktif' ? 'success' : g.status === 'Kısmen Kullanıldı' ? 'info' : 'danger'}`}>{g.status}</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{g.expiresAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
