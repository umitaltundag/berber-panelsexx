'use client';

import { useData, apiPut, apiDelete } from '@/lib/use-data';

interface ReviewsProps {
  refreshKey?: number;
}

interface ReviewData {
  id: number;
  rating: number;
  comment: string;
  status: string;
  customer: { name: string };
  staff: { name: string };
}

export default function Reviews({ refreshKey }: ReviewsProps) {
  const { data: reviews, loading } = useData<ReviewData[]>('/api/reviews');

  const handleApprove = async (id: number) => {
    await apiPut(`/api/reviews/${id}`, { status: 'Onaylandı' });
    window.location.reload();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    await apiDelete(`/api/reviews/${id}`);
    window.location.reload();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i key={i} className={`fas fa-star${i < rating ? '' : ' far'}`} style={{ color: i < rating ? '#f59e0b' : '#d1d5db', fontSize: 12 }}></i>
    ));
  };

  return (
    <section className="page-section active" id="reviews">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="tabs" style={{ margin: 0 }}>
          <button className="tab active">Tüm Yorumlar ({(reviews?.length ?? 0).toLocaleString()})</button>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Müşteri</th><th>Personel</th><th>Puan</th><th>Yorum</th><th>Durum</th><th>İşlem</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!loading && (!reviews || reviews.length === 0) && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Henüz yorum yok</td></tr>}
                {reviews?.map(r => (
                  <tr key={r.id}>
                    <td>{r.customer.name}</td>
                    <td>{r.staff.name}</td>
                    <td><div style={{ display: 'flex', gap: 2 }}>{renderStars(r.rating)}</div></td>
                    <td style={{ maxWidth: 250, whiteSpace: 'normal', wordBreak: 'break-word' }}>{r.comment}</td>
                    <td><span className={`badge badge-${r.status === 'Onaylandı' ? 'success' : r.status === 'Beklemede' ? 'warning' : 'gray'}`}>{r.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {r.status !== 'Onaylandı' && (
                          <button className="btn btn-sm btn-outline" style={{ color: 'var(--success)' }} onClick={() => handleApprove(r.id)} title="Onayla"><i className="fas fa-check"></i></button>
                        )}
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
