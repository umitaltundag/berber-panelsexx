'use client';

import { useData, apiDelete, apiPut } from '@/lib/use-data';

interface WaitingData {
  id: number;
  date: string;
  time: string;
  status: string;
  note: string | null;
  customer: { name: string; phone: string | null };
  service: { name: string };
}

export default function WaitingList() {
  const { data: queue, loading } = useData<WaitingData[]>('/api/waiting-list');

  const handleStatus = async (id: number, status: string) => {
    await apiPut(`/api/waiting-list/${id}`, { status });
    window.location.reload();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kaydı silmek istediğinize emin misiniz?')) return;
    await apiDelete(`/api/waiting-list/${id}`);
    window.location.reload();
  };

  const counts = {
    bekleyen: queue?.filter(q => q.status === 'Beklemede').length ?? 0,
    cagrilan: queue?.filter(q => q.status === 'Çağrıldı').length ?? 0,
    iptal: queue?.filter(q => q.status === 'İptal').length ?? 0,
  };

  return (
    <section className="page-section active" id="waiting-list">
      <div className="card">
        <div className="card-header">
          <h3><i className="fas fa-list" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Bekleme Listesi</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-warning"><i className="fas fa-clock"></i> Bekleyen ({counts.bekleyen})</span>
            <span className="badge badge-success"><i className="fas fa-check"></i> Çağrılan ({counts.cagrilan})</span>
            <span className="badge badge-danger"><i className="fas fa-times"></i> İptal ({counts.iptal})</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Müşteri</th><th>Hizmet</th><th>Tarih</th><th>Saat</th><th>Durum</th><th>İşlem</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!loading && (!queue || queue.length === 0) && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Bekleme listesi boş</td></tr>}
                {queue?.map(q => (
                  <tr key={q.id}>
                    <td><strong>{q.customer.name}</strong>{q.customer.phone && <br />}<small style={{ color: 'var(--text-muted)' }}>{q.customer.phone}</small></td>
                    <td>{q.service.name}</td>
                    <td>{q.date}</td>
                    <td>{q.time}</td>
                    <td><span className={`badge badge-${q.status === 'Beklemede' ? 'warning' : q.status === 'Çağrıldı' ? 'success' : 'danger'}`}>{q.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {q.status === 'Beklemede' && (
                          <button className="btn btn-sm btn-success" onClick={() => handleStatus(q.id, 'Çağrıldı')} title="Çağrıldı"><i className="fas fa-phone"></i></button>
                        )}
                        <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleStatus(q.id, 'İptal')} title="İptal"><i className="fas fa-ban"></i></button>
                        <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(q.id)} title="Sil"><i className="fas fa-trash"></i></button>
                      </div>
                    </td>
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
