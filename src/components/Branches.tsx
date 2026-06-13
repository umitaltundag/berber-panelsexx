'use client';

import { useData, apiDelete } from '@/lib/use-data';

interface BranchesProps {
  onOpenModal: (modal: string) => void;
  refreshKey?: number;
}

interface BranchData {
  id: number;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  workingDays: string | null;
  startTime: string | null;
  endTime: string | null;
}

export default function Branches({ onOpenModal, refreshKey }: BranchesProps) {
  const { data: branches, loading, error } = useData<BranchData[]>('/api/branches');

  const handleDelete = async (id: number) => {
    if (!confirm('Bu şubeyi silmek istediğinize emin misiniz?')) return;
    await apiDelete(`/api/branches/${id}`);
    window.location.reload();
  };

  return (
    <section className="page-section active" id="branches">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="tabs" style={{ margin: 0 }}>
          <button className="tab active">Tüm Şubeler</button>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('branchModal')}><i className="fas fa-plus"></i> Şube Ekle</button>
      </div>

      <div className="staff-grid">
        {loading && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)' }}>Yükleniyor...</p>}
        {error && <p style={{ gridColumn: '1/-1', color: 'var(--danger)' }}>Hata: {error}</p>}
        {!loading && !error && (!branches || branches.length === 0) && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)' }}>Henüz şube eklenmemiş</p>}
        {branches?.map(b => (
          <div key={b.id} className="staff-card">
            <div className="staff-avatar" style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}><i className="fas fa-store"></i></div>
            <h4>{b.name}</h4>
            <div className="staff-title"><span className="badge badge-info">{b.workingDays || 'Belirtilmemiş'}: {b.startTime || '?'} - {b.endTime || '?'}</span></div>
            <div className="staff-info">
              <span><i className="fas fa-map-marker-alt"></i> {b.address}</span>
              <span><i className="fas fa-phone"></i> {b.phone || 'Telefon yok'}</span>
              <span><i className="fas fa-envelope"></i> {b.email || 'E-posta yok'}</span>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(b.id)}>
                <i className="fas fa-trash"></i> Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
