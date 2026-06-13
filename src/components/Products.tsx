'use client';

import { useData, apiDelete } from '@/lib/use-data';

interface ProductsProps {
  onOpenModal: (modal: string) => void;
  refreshKey?: number;
}

interface ProductData {
  id: number;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  unit: string;
  description: string | null;
}

export default function Products({ onOpenModal, refreshKey }: ProductsProps) {
  const { data: products, loading } = useData<ProductData[]>('/api/products');

  const total = products?.length ?? 0;
  const critical = products?.filter(p => p.stock < p.minStock).length ?? 0;

  const handleDelete = async (id: number) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    await apiDelete(`/api/products/${id}`);
    window.location.reload();
  };

  return (
    <section className="page-section active" id="products">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="tabs" style={{ margin: 0 }}>
          <button className="tab active">Tüm Ürünler</button>
        </div>
        <button className="btn btn-primary" onClick={() => onOpenModal('productModal')}><i className="fas fa-plus"></i> Ürün Ekle</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Toplam Ürün</div><div className="stat-value">{total.toLocaleString()}</div></div>
            <div className="stat-icon icon-blue"><i className="fas fa-box"></i></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Kritik Stok</div><div className="stat-value" style={{ color: 'var(--danger)' }}>{critical}</div></div>
            <div className="stat-icon icon-red"><i className="fas fa-exclamation-triangle"></i></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Ürün</th><th>Kategori</th><th>Stok</th><th>Min Stok</th><th>Fiyat</th><th>Durum</th><th>İşlem</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!loading && (!products || products.length === 0) && <tr><td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Henüz ürün eklenmemiş</td></tr>}
                {products?.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td>{p.category}</td>
                    <td>{p.stock} {p.unit}</td>
                    <td>{p.minStock} {p.unit}</td>
                    <td><strong>{p.price.toLocaleString()} ₺</strong></td>
                    <td>{p.stock < p.minStock ? <span className="badge badge-danger">Kritik</span> : <span className="badge badge-success">Yeterli</span>}</td>
                    <td>
                      <button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(p.id)} title="Sil"><i className="fas fa-trash"></i></button>
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
