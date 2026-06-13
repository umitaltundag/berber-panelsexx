'use client';

import { useData, apiDelete, apiPut } from '@/lib/use-data';

interface LeaveData {
  id: number;
  startDate: string;
  endDate: string;
  reason: string | null;
  status: string;
  staff: { name: string };
}

export default function Leaves() {
  const { data: leaves, loading } = useData<LeaveData[]>('/api/leaves');

  const handleStatus = async (id: number, status: string) => {
    await apiPut(`/api/leaves/${id}`, { status });
    window.location.reload();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu izni silmek istediğinize emin misiniz?')) return;
    await apiDelete(`/api/leaves/${id}`);
    window.location.reload();
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case 'Beklemede': return 'warning';
      case 'Onaylandı': return 'success';
      case 'Reddedildi': return 'danger';
      default: return 'gray';
    }
  };

  return (
    <section className="page-section active" id="leaves">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 18 }}>İzin Talepleri ({leaves?.length ?? 0})</h3>
      </div>

      <div className="campaign-grid">
        {loading && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)' }}>Yükleniyor...</p>}
        {!loading && (!leaves || leaves.length === 0) && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)' }}>İzin talebi bulunmuyor</p>}
        {leaves?.map(l => (
          <div key={l.id} className="campaign-card" style={{ borderLeftColor: l.status === 'Beklemede' ? '#d97706' : l.status === 'Onaylandı' ? '#059669' : '#dc2626' }}>
            <h4><i className="fas fa-user"></i> {l.staff.name}</h4>
            <div className="campaign-meta">
              <span><i className="fas fa-calendar-alt"></i> {l.startDate} - {l.endDate}</span>
              <span><i className="fas fa-comment"></i> {l.reason || 'Belirtilmedi'}</span>
              <span><span className={`badge badge-${statusStyle(l.status)}`}>{l.status}</span></span>
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header"><h3><i className="fas fa-list" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Tüm İzinler</h3></div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Personel</th><th>Başlangıç</th><th>Bitiş</th><th>Sebep</th><th>Durum</th><th>İşlem</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!loading && (!leaves || leaves.length === 0) && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>İzin talebi bulunmuyor</td></tr>}
                {leaves?.map(l => (
                  <tr key={l.id}>
                    <td><strong>{l.staff.name}</strong></td>
                    <td>{l.startDate}</td>
                    <td>{l.endDate}</td>
                    <td>{l.reason || '-'}</td>
                    <td><span className={`badge badge-${statusStyle(l.status)}`}>{l.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {l.status === 'Beklemede' && (
                          <>
                            <button className="btn btn-sm btn-success" onClick={() => handleStatus(l.id, 'Onaylandı')} title="Onayla"><i className="fas fa-check"></i></button>
                            <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleStatus(l.id, 'Reddedildi')} title="Reddet"><i className="fas fa-times"></i></button>
                          </>
                        )}
                        <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(l.id)} title="Sil"><i className="fas fa-trash"></i></button>
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
