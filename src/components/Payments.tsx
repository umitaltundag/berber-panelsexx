'use client';

import { useData } from '@/lib/use-data';

interface PaymentData {
  id: number;
  amount: number;
  method: string;
  status: string;
  date: string;
  customer: { name: string };
  staff: { name: string };
  appointmentId?: number;
}

export default function Payments() {
  const { data: payments, loading } = useData<PaymentData[]>('/api/payments');

  const total = payments?.reduce((s, p) => s + p.amount, 0) ?? 0;
  const pending = payments?.filter(p => p.status !== 'Ödendi').reduce((s, p) => s + p.amount, 0) ?? 0;

  return (
    <section className="page-section active" id="payments">
      <div className="stats-grid">
        {[
          { label: 'Toplam Hasılat', value: `${total.toLocaleString()} ₺`, icon: 'icon-green', fa: 'fa-turkish-lira-sign' },
          { label: 'Toplam Ödeme', value: `${payments?.length ?? 0} adet`, icon: 'icon-blue', fa: 'fa-receipt' },
          { label: 'Tahsilat Bekleyen', value: `${pending.toLocaleString()} ₺`, icon: 'icon-yellow', fa: 'fa-clock' },
          { label: 'Ortalama İşlem', value: `${payments?.length ? Math.round(total / payments.length).toLocaleString() : 0} ₺`, icon: 'icon-purple', fa: 'fa-calculator' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-header">
              <div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div></div>
              <div className={`stat-icon ${s.icon}`}><i className={`fas ${s.fa}`}></i></div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Ödeme Geçmişi</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Tarih</th><th>Müşteri</th><th>Personel</th><th>Tutar</th><th>Yöntem</th><th>Durum</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!loading && (!payments || payments.length === 0) && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Ödeme bulunmuyor</td></tr>}
                {payments?.map(p => (
                  <tr key={p.id}>
                    <td>{p.date}</td>
                    <td>{p.customer.name}</td>
                    <td>{p.staff.name}</td>
                    <td><strong>{p.amount.toLocaleString()} ₺</strong></td>
                    <td><i className={`fas fa-${p.method === 'Nakit' ? 'money-bill' : p.method === 'Kredi Kartı' ? 'credit-card' : 'university'}`}></i> {p.method}</td>
                    <td><span className={`badge badge-${p.status === 'Ödendi' ? 'success' : 'warning'}`}>{p.status}</span></td>
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
