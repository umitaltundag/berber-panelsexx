'use client';

import { useData } from '@/lib/use-data';

interface CampaignsProps {
  onOpenModal: (modal: string) => void;
  refreshKey?: number;
}

interface CampaignData {
  id: number;
  title: string;
  description: string;
  discount: string;
  startDate: string;
  endDate: string;
  audience: string;
  status: string;
  usedCount: number;
}

export default function Campaigns({ onOpenModal, refreshKey }: CampaignsProps) {
  const { data: campaigns, loading } = useData<CampaignData[]>('/api/campaigns');
  const { data: coupons, loading: couponsLoading } = useData<any[]>('/api/coupons');

  const colors = ['#059669', '#d97706', '#dc2626', '#7c3aed', '#2563eb'];

  return (
    <section className="page-section active" id="campaigns">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 18 }}>Aktif Kampanyalar ({campaigns?.length ?? 0})</h3>
        <button className="btn btn-primary" onClick={() => onOpenModal('campaignModal')}><i className="fas fa-plus"></i> Kampanya Oluştur</button>
      </div>

      <div className="campaign-grid">
        {loading && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)' }}>Yükleniyor...</p>}
        {!loading && (!campaigns || campaigns.length === 0) && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)' }}>Henüz kampanya yok</p>}
        {campaigns?.map((c, i) => (
          <div key={c.id} className="campaign-card" style={{ borderLeftColor: colors[i % colors.length] }}>
            <h4>{c.title}</h4>
            <div className="campaign-meta">
              <span><i className="fas fa-calendar"></i> {c.startDate} - {c.endDate}</span>
              <span><i className="fas fa-tag"></i> {c.discount} indirim - {c.description}</span>
              <span><i className="fas fa-users"></i> {c.audience}</span>
              <span style={{ marginTop: 8 }}>
                <span className={`badge badge-${c.status === 'Aktif' ? 'success' : c.status === 'Yakında' ? 'warning' : 'gray'}`}>{c.status}</span>
                {c.usedCount > 0 && <span className="badge badge-info" style={{ marginLeft: 4 }}>{c.usedCount} kullanıldı</span>}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header"><h3><i className="fas fa-ticket-alt" style={{ color: 'var(--warning)', marginRight: 8 }}></i>Promosyon Kuponları</h3></div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Kod</th><th>İndirim</th><th>Tür</th><th>Kullanım</th><th>Son Tarih</th><th>Durum</th></tr></thead>
              <tbody>
                {couponsLoading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!couponsLoading && (!coupons || coupons.length === 0) && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Kupon bulunmuyor</td></tr>}
                {coupons?.map((r: any, i: number) => (
                  <tr key={r.id || i}>
                    <td><strong>{r.code}</strong></td>
                    <td>{r.discount}</td>
                    <td>{r.type}</td>
                    <td>{r.usedCount}/{r.usageLimit}</td>
                    <td>{r.expiryDate}</td>
                    <td><span className={`badge badge-${r.status === 'Aktif' ? 'success' : r.status === 'Planlandı' ? 'info' : 'danger'}`}>{r.status}</span></td>
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
