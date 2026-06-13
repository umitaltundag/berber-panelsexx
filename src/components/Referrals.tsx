'use client';

import { useData, apiPost, apiDelete } from '@/lib/use-data';
import { useState } from 'react';

interface ReferralData {
  id: number; code: string; discount: string; status: string;
  giver: { id: number; name: string };
  receiver: { id: number; name: string } | null;
}

export default function Referrals({ refreshKey }: { refreshKey?: number }) {
  const { data: items, loading } = useData<ReferralData[]>('/api/referrals');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', discount: '', giverId: '' });
  const [saving, setSaving] = useState(false);
  const { data: customers } = useData<any[]>('/api/customers');

  const handleCreate = async () => {
    if (!form.code || !form.discount || !form.giverId) return;
    setSaving(true);
    await apiPost('/api/referrals', { code: form.code, discount: form.discount, giverId: Number(form.giverId) });
    window.location.reload();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu referans kodunu silmek istediğinize emin misiniz?')) return;
    await apiDelete(`/api/referrals/${id}`);
    window.location.reload();
  };

  return (
    <section className="page-section active" id="referrals">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="tabs" style={{ margin: 0 }}><button className="tab active">Referans Kodları</button></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><i className="fas fa-plus"></i> Yeni Kod</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group"><label>Kod</label><input type="text" className="form-control" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} placeholder="DAVET-001" /></div>
              <div className="form-group"><label>İndirim</label><input type="text" className="form-control" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: e.target.value }))} placeholder="50 ₺ veya %10" /></div>
            </div>
            <div className="form-group"><label>Veren Müşteri</label>
              <select className="form-control" value={form.giverId} onChange={e => setForm(p => ({ ...p, giverId: e.target.value }))}>
                <option value="">Seçiniz</option>
                {customers?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>{saving ? 'Kaydediliyor...' : 'Oluştur'}</button>
              <button className="btn btn-outline" style={{ marginLeft: 8 }} onClick={() => setShowForm(false)}>İptal</button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Kod</th><th>İndirim</th><th>Veren</th><th>Kullanan</th><th>Durum</th><th>İşlem</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!loading && (!items || items.length === 0) && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Henüz referans kodu yok</td></tr>}
                {items?.map(r => (
                  <tr key={r.id}>
                    <td><strong>{r.code}</strong></td>
                    <td>{r.discount}</td>
                    <td>{r.giver?.name}</td>
                    <td>{r.receiver?.name || '-'}</td>
                    <td><span className={`badge ${r.status === 'Aktif' ? 'badge-success' : r.status === 'Kullanıldı' ? 'badge-warning' : ''}`}>{r.status}</span></td>
                    <td><button className="btn btn-sm btn-outline" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(r.id)}><i className="fas fa-trash"></i></button></td>
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
