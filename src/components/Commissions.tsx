'use client';

import { useData } from '@/lib/use-data';

interface CommissionData {
  id: number;
  amount: number;
  rate: string;
  date: string;
  staff: { name: string };
  service: { name: string };
}

interface StaffData {
  id: number;
  name: string;
}

export default function Commissions() {
  const { data: commissions, loading } = useData<CommissionData[]>('/api/commissions');
  const { data: staff } = useData<StaffData[]>('/api/staff');

  const total = commissions?.reduce((s, c) => s + c.amount, 0) ?? 0;

  const perStaff = commissions?.reduce<Record<string, number>>((acc, c) => {
    acc[c.staff.name] = (acc[c.staff.name] ?? 0) + c.amount;
    return acc;
  }, {});

  return (
    <section className="page-section active" id="commissions">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Toplam Komisyon</div><div className="stat-value">{total.toLocaleString()} ₺</div></div>
            <div className="stat-icon icon-green"><i className="fas fa-coins"></i></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Komisyon Sayısı</div><div className="stat-value">{commissions?.length ?? 0}</div></div>
            <div className="stat-icon icon-blue"><i className="fas fa-receipt"></i></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Personel Sayısı</div><div className="stat-value">{staff?.length ?? 0}</div></div>
            <div className="stat-icon icon-purple"><i className="fas fa-users"></i></div>
          </div>
        </div>
      </div>

      {perStaff && Object.keys(perStaff).length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-header"><h3><i className="fas fa-chart-pie" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Personel Başı Komisyon</h3></div>
          <div className="card-body">
            <div className="table-container">
              <table>
                <thead><tr><th>Personel</th><th>Toplam Komisyon</th></tr></thead>
                <tbody>
                  {Object.entries(perStaff).map(([name, amount]) => (
                    <tr key={name}>
                      <td><strong>{name}</strong></td>
                      <td><strong>{amount.toLocaleString()} ₺</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Komisyon Geçmişi</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Personel</th><th>Hizmet</th><th>Oran</th><th>Tutar</th><th>Tarih</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!loading && (!commissions || commissions.length === 0) && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Komisyon bulunmuyor</td></tr>}
                {commissions?.map(c => (
                  <tr key={c.id}>
                    <td>{c.staff.name}</td>
                    <td>{c.service.name}</td>
                    <td>{c.rate}</td>
                    <td><strong>{c.amount.toLocaleString()} ₺</strong></td>
                    <td>{c.date}</td>
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
