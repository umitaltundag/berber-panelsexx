'use client';

import { useData, apiDelete } from '@/lib/use-data';

interface StaffProps {
  onOpenModal: (modal: string) => void;
  refreshKey?: number;
}

interface StaffData {
  id: number;
  name: string;
  title: string;
  phone: string | null;
  email: string | null;
  color: string;
  workingDays: string | null;
  startTime: string | null;
  endTime: string | null;
}

export default function Staff({ onOpenModal, refreshKey }: StaffProps) {
  const { data: staff, loading, error } = useData<StaffData[]>('/api/staff');

  const handleDelete = async (id: number) => {
    if (!confirm('Bu personeli silmek istediğinize emin misiniz?')) return;
    await apiDelete(`/api/staff/${id}`);
    window.location.reload();
  };

  return (
    <section className="page-section active" id="staff">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="tabs" style={{ margin: 0 }}>
          <button className="tab active">Tüm Personel</button>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('staffModal')}><i className="fas fa-plus"></i> Personel Ekle</button>
      </div>

      <div className="staff-grid">
        {loading && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)' }}>Yükleniyor...</p>}
        {error && <p style={{ gridColumn: '1/-1', color: 'var(--danger)' }}>Hata: {error}</p>}
        {!loading && !error && (!staff || staff.length === 0) && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)' }}>Henüz personel eklenmemiş</p>}
        {staff?.map(s => (
          <div key={s.id} className="staff-card" style={{ position: 'relative' }}>
            <div className="staff-avatar" style={{ background: `linear-gradient(135deg,${s.color},${s.color}dd)` }}>{s.name.charAt(0)}</div>
            <h4>{s.name}</h4>
            <div className="staff-title"><span className="badge badge-success">{s.title}</span></div>
            <div className="staff-info">
              <span><i className="fas fa-calendar"></i> {s.workingDays || 'Belirtilmemiş'}: {s.startTime || '?'} - {s.endTime || '?'}</span>
              <span><i className="fas fa-phone"></i> {s.phone || 'Telefon yok'}</span>
              <span><i className="fas fa-envelope"></i> {s.email || 'E-posta yok'}</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(s.id)}>
                <i className="fas fa-trash"></i> Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
