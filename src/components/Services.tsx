'use client';

import { useData, apiDelete } from '@/lib/use-data';

interface ServicesProps {
  onOpenModal: (modal: string) => void;
  refreshKey?: number;
}

interface ServiceData {
  id: number;
  name: string;
  category: string;
  price: number;
  duration: number;
  description: string | null;
}

const iconMap: Record<string, { icon: string; bg: string; c: string }> = {
  'Saç': { icon: 'fa-cut', bg: '#eef2ff', c: '#4f46e5' },
  'Sakal': { icon: 'fa-hand-paper', bg: '#fffbeb', c: '#d97706' },
  'Boya': { icon: 'fa-palette', bg: '#fef2f2', c: '#dc2626' },
  'Cilt Bakım': { icon: 'fa-spa', bg: '#e0f2fe', c: '#3b82f6' },
  'Paket': { icon: 'fa-gem', bg: '#e0f2fe', c: '#3b82f6' },
};

const defaultIcon = { icon: 'fa-tag', bg: '#f1f5f9', c: '#64748b' };

export default function Services({ onOpenModal, refreshKey }: ServicesProps) {
  const { data: services, loading } = useData<ServiceData[]>('/api/services');
  const categories = [...new Set(services?.map(s => s.category) ?? [])];

  const handleDelete = async (id: number) => {
    if (!confirm('Bu hizmeti silmek istediğinize emin misiniz?')) return;
    await apiDelete(`/api/services/${id}`);
    window.location.reload();
  };

  return (
    <section className="page-section active" id="services">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="tabs" style={{ margin: 0 }}>
          <button className="tab active">Tüm Hizmetler</button>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('serviceModal')}><i className="fas fa-plus"></i> Hizmet Ekle</button>
      </div>

      <div className="service-grid">
        {loading && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)' }}>Yükleniyor...</p>}
        {!loading && (!services || services.length === 0) && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)' }}>Henüz hizmet eklenmemiş</p>}
        {services?.map(s => {
          const icon = iconMap[s.category] || defaultIcon;
          return (
            <div key={s.id} className="service-card">
              <div className="service-icon" style={{ background: icon.bg, color: icon.c }}><i className={`fas ${icon.icon}`}></i></div>
              <h4>{s.name}</h4>
              <div className="service-meta"><span><i className="far fa-clock"></i> {s.duration} dk</span><span>Kategori: {s.category}</span></div>
              <div className="service-price">{s.price} ₺</div>
              <div style={{ marginTop: 12, display: 'flex', gap: 4, justifyContent: 'center' }}>
                <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(s.id)}><i className="fas fa-trash"></i></button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
