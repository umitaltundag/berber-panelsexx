'use client';

import { useState } from 'react';

export default function ExportData() {
  const [loading, setLoading] = useState<string | null>(null);

  const exports = [
    { type: 'customers', label: 'Müşteriler', icon: 'fa-users' },
    { type: 'appointments', label: 'Randevular', icon: 'fa-calendar-check' },
    { type: 'payments', label: 'Ödemeler', icon: 'fa-turkish-lira-sign' },
    { type: 'staff', label: 'Personel', icon: 'fa-user-tie' },
    { type: 'services', label: 'Hizmetler', icon: 'fa-scissors' },
    { type: 'products', label: 'Ürünler', icon: 'fa-box' },
    { type: 'branches', label: 'Şubeler', icon: 'fa-store' },
    { type: 'coupons', label: 'Kuponlar', icon: 'fa-tag' },
    { type: 'campaigns', label: 'Kampanyalar', icon: 'fa-bullhorn' },
    { type: 'commissions', label: 'Komisyonlar', icon: 'fa-percentage' },
  ];

  const handleDownload = async (type: string, label: string) => {
    setLoading(type);
    try {
      const res = await fetch(`/api/export?type=${type}`);
      if (!res.ok) { alert('İndirme hatası'); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch { alert('İndirme başarısız'); }
    finally { setLoading(null); }
  };

  return (
    <section className="page-section active" id="export-data">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Dışa Aktarma</div><div className="stat-value">CSV</div></div>
            <div className="stat-icon icon-blue"><i className="fas fa-file-csv"></i></div>
          </div>
          <div className="stat-change up"><i className="fas fa-check-circle"></i> Tüm veriler UTF-8</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Toplam Tablo</div><div className="stat-value">{exports.length}</div></div>
            <div className="stat-icon icon-green"><i className="fas fa-table"></i></div>
          </div>
          <div className="stat-change up"><i className="fas fa-database"></i> Anlık veri</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3><i className="fas fa-download" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Veri Dışa Aktar</h3>
        </div>
        <div className="card-body">
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
            Aşağıdaki butonlardan istediğiniz veriyi CSV olarak indirin.
          </p>
          <div className="campaign-grid">
            {exports.map(e => (
              <div key={e.type} onClick={() => handleDownload(e.type, e.label)}
                className="campaign-card" style={{
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, padding: 16,
                  borderLeftColor: 'var(--primary)', opacity: loading === e.type ? 0.6 : 1,
                }}>
                <i className={`fas ${e.icon}`} style={{ fontSize: 24, color: 'var(--primary)' }}></i>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--gray-800)' }}>{loading === e.type ? 'İndiriliyor...' : e.label}</h4>
                  <small style={{ color: 'var(--text-muted)' }}>CSV olarak indir</small>
                </div>
                <i className={`fas ${loading === e.type ? 'fa-spinner fa-spin' : 'fa-download'}`} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}></i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
