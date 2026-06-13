'use client';

import { useData, apiDelete, apiPut } from '@/lib/use-data';
import { useState } from 'react';

interface AppointmentsProps {
  onNewAppointment: () => void;
  refreshKey?: number;
}

interface AppointmentData {
  id: number;
  date: string;
  time: string;
  status: string;
  customer: { name: string; phone: string | null };
  staff: { name: string };
  service: { name: string; price: number };
}

export default function Appointments({ onNewAppointment, refreshKey }: AppointmentsProps) {
  const { data: appointments, loading } = useData<AppointmentData[]>('/api/appointments');
  const [filterStatus, setFilterStatus] = useState('Tümü');

  const counts = {
    onayli: appointments?.filter(a => a.status === 'Onaylandı').length ?? 0,
    bekleyen: appointments?.filter(a => a.status === 'Beklemede').length ?? 0,
    iptal: appointments?.filter(a => a.status === 'İptal').length ?? 0,
  };

  const filtered = filterStatus === 'Tümü' ? appointments : appointments?.filter(a => a.status === filterStatus);

  const handleStatus = async (id: number, status: string) => {
    await apiPut(`/api/appointments/${id}`, { status });
    window.location.reload();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu randevuyu silmek istediğinize emin misiniz?')) return;
    await apiDelete(`/api/appointments/${id}`);
    window.location.reload();
  };

  return (
    <section className="page-section active" id="appointments">
      <div className="card">
        <div className="card-header">
          <h3><i className="fas fa-filter" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Filtreleme</h3>
          <button className="btn btn-primary btn-sm" onClick={onNewAppointment}><i className="fas fa-plus"></i> Yeni Randevu</button>
        </div>
        <div className="card-body">
          <div className="filters">
            <select className="form-control" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="Tümü">Tüm Durumlar</option>
              <option value="Beklemede">Beklemede</option>
              <option value="Onaylandı">Onaylandı</option>
              <option value="Devam Ediyor">Devam Ediyor</option>
              <option value="Tamamlandı">Tamamlandı</option>
              <option value="İptal">İptal</option>
            </select>
            <button className="btn btn-primary btn-sm" onClick={() => setFilterStatus('Tümü')}><i className="fas fa-sync"></i> Sıfırla</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Tüm Randevular</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge badge-success"><i className="fas fa-check"></i> Onaylı ({counts.onayli})</span>
            <span className="badge badge-warning"><i className="fas fa-clock"></i> Bekleyen ({counts.bekleyen})</span>
            <span className="badge badge-danger"><i className="fas fa-times"></i> İptal ({counts.iptal})</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Tarih / Saat</th><th>Müşteri</th><th>Hizmet</th><th>Personel</th><th>Durum</th><th>İşlem</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!loading && (!filtered || filtered.length === 0) && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Randevu bulunmuyor</td></tr>}
                {filtered?.map(r => (
                  <tr key={r.id}>
                    <td>{r.date} {r.time}</td>
                    <td><strong>{r.customer.name}</strong>{r.customer.phone && <br />}<small style={{ color: 'var(--text-muted)' }}>{r.customer.phone}</small></td>
                    <td>{r.service.name} - {r.service.price} ₺</td><td>{r.staff.name}</td>
                    <td><span className={`badge badge-${r.status === 'Onaylandı' ? 'success' : r.status === 'Beklemede' ? 'warning' : r.status === 'Devam Ediyor' ? 'info' : 'danger'}`}>{r.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {r.status === 'Beklemede' && (
                          <button className="btn btn-sm btn-success" onClick={() => handleStatus(r.id, 'Onaylandı')} title="Onayla"><i className="fas fa-check"></i></button>
                        )}
                        {r.status === 'Onaylandı' && (
                          <button className="btn btn-sm btn-info" onClick={() => handleStatus(r.id, 'Devam Ediyor')} title="Başlat"><i className="fas fa-play"></i></button>
                        )}
                        {r.status === 'Devam Ediyor' && (
                          <button className="btn btn-sm btn-success" onClick={() => handleStatus(r.id, 'Tamamlandı')} title="Tamamla"><i className="fas fa-check-double"></i></button>
                        )}
                        <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleStatus(r.id, 'İptal')} title="İptal"><i className="fas fa-ban"></i></button>
                        <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(r.id)} title="Sil"><i className="fas fa-trash"></i></button>
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
