'use client';

import { useData } from '@/lib/use-data';

interface Stats {
  todayAppointments: number;
  weeklyAppointments: number;
  monthlyRevenue: number;
  totalCustomers: number;
  totalStaff: number;
  completedCount: number;
  cancelledCount: number;
  pendingCount: number;
  totalAppointments: number;
  monthlyAppointments: number;
}

interface PaymentData {
  id: number; amount: number; method: string; status: string; date: string;
  customer: { name: string }; staff: { name: string };
}

interface CommissionData {
  id: number; amount: number; rate: number; date: string;
  staff: { name: string }; service: { name: string };
}

export default function Reports() {
  const { data: stats, loading } = useData<Stats>('/api/stats');
  const { data: payments } = useData<PaymentData[]>('/api/payments');
  const { data: commissions } = useData<CommissionData[]>('/api/commissions');

  const totalRevenue = payments?.reduce((s, p) => p.status === 'Ödendi' ? s + p.amount : s, 0) ?? 0;
  const totalCommission = commissions?.reduce((s, c) => s + c.amount, 0) ?? 0;

  return (
    <section className="page-section active" id="reports">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Toplam Ciro</div><div className="stat-value">{totalRevenue.toLocaleString()} ₺</div></div>
            <div className="stat-icon icon-green"><i className="fas fa-turkish-lira-sign"></i></div>
          </div>
          <div className="stat-change up"><i className="fas fa-arrow-up"></i> Tüm zamanlar</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Aylık Gelir</div><div className="stat-value">{loading ? '...' : (stats?.monthlyRevenue ?? 0).toLocaleString()} ₺</div></div>
            <div className="stat-icon icon-blue"><i className="fas fa-calendar-alt"></i></div>
          </div>
          <div className="stat-change up"><i className="fas fa-arrow-up"></i> Bu ay</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Komisyon Gideri</div><div className="stat-value">{totalCommission.toLocaleString()} ₺</div></div>
            <div className="stat-icon icon-yellow"><i className="fas fa-percentage"></i></div>
          </div>
          <div className="stat-change down"><i className="fas fa-arrow-down"></i> Personel payı</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Net Kar</div><div className="stat-value">{(totalRevenue - totalCommission).toLocaleString()} ₺</div></div>
            <div className="stat-icon icon-purple"><i className="fas fa-chart-line"></i></div>
          </div>
          <div className="stat-change up"><i className="fas fa-arrow-up"></i> Net kazanç</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><h3><i className="fas fa-calendar-alt" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Randevu İstatistikleri</h3></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Toplam Randevu', value: stats?.totalAppointments ?? 0, cls: '' },
                { label: 'Bu Ay', value: stats?.monthlyAppointments ?? 0, cls: '' },
                { label: 'Tamamlanan', value: `${stats?.completedCount ?? 0} (%${stats?.totalAppointments ? Math.round((stats.completedCount / stats.totalAppointments) * 100) : 0})`, cls: 'var(--success)' },
                { label: 'İptal Edilen', value: `${stats?.cancelledCount ?? 0} (%${stats?.totalAppointments ? Math.round((stats.cancelledCount / stats.totalAppointments) * 100) : 0})`, cls: 'var(--danger)' },
                { label: 'Bekleyen/Onaylı', value: `${stats?.pendingCount ?? 0}`, cls: 'var(--warning)' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                  <strong style={r.cls ? { color: r.cls } : {}}>{r.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3><i className="fas fa-money-bill" style={{ color: 'var(--success)', marginRight: 8 }}></i>Gelir-Gider Özeti</h3></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Toplam Hasılat', value: `${totalRevenue.toLocaleString()} ₺`, cls: 'var(--success)' },
                { label: 'Personel Komisyon', value: `${totalCommission.toLocaleString()} ₺`, cls: 'var(--danger)' },
                { label: 'Net Kazanç', value: `${(totalRevenue - totalCommission).toLocaleString()} ₺`, cls: 'var(--primary)' },
                { label: 'Ödeme Sayısı', value: `${payments?.length ?? 0} adet`, cls: '' },
                { label: 'Komisyon Sayısı', value: `${commissions?.length ?? 0} adet`, cls: '' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                  <strong style={r.cls ? { color: r.cls } : {}}>{r.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3><i className="fas fa-credit-card" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Ödeme Yöntemleri Dağılımı</h3></div>
        <div className="card-body">
          {payments && payments.length > 0 ? (
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {['Kredi Kartı', 'Nakit', 'Havale'].map(method => {
                const total = payments.filter(p => p.method === method).reduce((s, p) => s + p.amount, 0);
                const count = payments.filter(p => p.method === method).length;
                const pct = totalRevenue ? Math.round((total / totalRevenue) * 100) : 0;
                return (
                  <div key={method} style={{
                    flex: 1, minWidth: 150, background: 'var(--gray-50)', borderRadius: 12, padding: 16, textAlign: 'center',
                  }}>
                    <i className={`fas ${method === 'Nakit' ? 'fa-money-bill' : method === 'Kredi Kartı' ? 'fa-credit-card' : 'fa-university'}`} style={{ fontSize: 24, color: 'var(--primary)', marginBottom: 8 }}></i>
                    <div style={{ fontSize: 18, fontWeight: 700 }}>{method}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{total.toLocaleString()} ₺ ({pct}%)</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{count} işlem</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)' }}>Henüz ödeme verisi yok</p>
          )}
        </div>
      </div>
    </section>
  );
}
