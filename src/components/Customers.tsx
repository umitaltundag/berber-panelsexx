'use client';

import { useData, apiDelete } from '@/lib/use-data';

interface CustomersProps {
  onOpenModal: (modal: string) => void;
  refreshKey?: number;
}

interface CustomerData {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  segment: string;
  points: number;
  totalVisits: number;
  lastVisit: string | null;
}

export default function Customers({ onOpenModal, refreshKey }: CustomersProps) {
  const { data: customers, loading } = useData<CustomerData[]>('/api/customers');

  const bgColors = ['#4f46e5', '#059669', '#d97706', '#dc2626', '#7c3aed', '#06b6d4'];

  const handleDelete = async (id: number) => {
    if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;
    await apiDelete(`/api/customers/${id}`);
    window.location.reload();
  };

  return (
    <section className="page-section active" id="customers">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="tabs" style={{ margin: 0 }}>
          <button className="tab active">Tümü ({(customers?.length ?? 0).toLocaleString()})</button>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('customerModal')}><i className="fas fa-plus"></i> Müşteri Ekle</button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Müşteri</th><th>İletişim</th><th>Randevu Sayısı</th><th>Son Ziyaret</th><th>Puan</th><th>Segment</th><th>İşlem</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {customers?.map((c, i) => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="customer-avatar" style={{ background: bgColors[i % bgColors.length] }}>
                          {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <strong>{c.name}</strong>
                      </div>
                    </td>
                    <td>{c.phone}<br /><small style={{ color: 'var(--text-muted)' }}>{c.email}</small></td>
                    <td>{c.totalVisits}</td><td>{c.lastVisit || '-'}</td><td>{c.points}</td>
                    <td><span className={`badge badge-${c.segment === 'Sadık' ? 'success' : c.segment === 'Aktif' ? 'info' : c.segment === 'Yeni' ? 'warning' : 'gray'}`}>{c.segment}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(c.id)} title="Sil"><i className="fas fa-trash"></i></button>
                    </td>
                  </tr>
                ))}
                {!loading && (!customers || customers.length === 0) && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Müşteri bulunmuyor</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
