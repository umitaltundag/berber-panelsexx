'use client';

import { useData, apiPost, apiPut, apiDelete } from '@/lib/use-data';
import { useState } from 'react';

interface RecurringData {
  id: number; frequency: string; dayOfWeek: number | null; dayOfMonth: number | null;
  time: string; startDate: string; endDate: string | null; isActive: boolean;
  customer: { id: number; name: string };
  staff: { id: number; name: string };
  service: { id: number; name: string };
}

export default function RecurringAppointments({ refreshKey }: { refreshKey?: number }) {
  const { data: items, loading } = useData<RecurringData[]>('/api/recurring-appointments');
  const { data: customers } = useData<any[]>('/api/customers');
  const { data: staff } = useData<any[]>('/api/staff');
  const { data: services } = useData<any[]>('/api/services');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerId: '', staffId: '', serviceId: '', frequency: 'Haftalık', dayOfWeek: '1', dayOfMonth: '15', time: '10:00', startDate: '', endDate: '' });
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!form.customerId || !form.staffId || !form.serviceId || !form.startDate || !form.time) return;
    setSaving(true);
    const body: any = {
      customerId: Number(form.customerId),
      staffId: Number(form.staffId),
      serviceId: Number(form.serviceId),
      frequency: form.frequency,
      time: form.time,
      startDate: form.startDate,
    };
    if (form.frequency === 'Haftalık') body.dayOfWeek = Number(form.dayOfWeek);
    else body.dayOfMonth = Number(form.dayOfMonth);
    if (form.endDate) body.endDate = form.endDate;
    await apiPost('/api/recurring-appointments', body);
    window.location.reload();
  };

  const toggleActive = async (item: RecurringData) => {
    await apiPut(`/api/recurring-appointments/${item.id}`, { isActive: !item.isActive });
    window.location.reload();
  };

  return (
    <section className="page-section active" id="recurring">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="tabs" style={{ margin: 0 }}><button className="tab active">Tekrarlanan Randevular</button></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}><i className="fas fa-plus"></i> Yeni Tekrarlı</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group"><label>Müşteri</label>
                <select className="form-control" value={form.customerId} onChange={e => setForm(p => ({ ...p, customerId: e.target.value }))}>
                  <option value="">Seçiniz</option>
                  {customers?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Personel</label>
                <select className="form-control" value={form.staffId} onChange={e => setForm(p => ({ ...p, staffId: e.target.value }))}>
                  <option value="">Seçiniz</option>
                  {staff?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Hizmet</label>
                <select className="form-control" value={form.serviceId} onChange={e => setForm(p => ({ ...p, serviceId: e.target.value }))}>
                  <option value="">Seçiniz</option>
                  {services?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Sıklık</label>
                <select className="form-control" value={form.frequency} onChange={e => setForm(p => ({ ...p, frequency: e.target.value }))}>
                  <option>Haftalık</option><option>Aylık</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              {form.frequency === 'Haftalık' ? (
                <div className="form-group"><label>Haftanın Günü</label>
                  <select className="form-control" value={form.dayOfWeek} onChange={e => setForm(p => ({ ...p, dayOfWeek: e.target.value }))}>
                    <option value="1">Pazartesi</option><option value="2">Salı</option><option value="3">Çarşamba</option>
                    <option value="4">Perşembe</option><option value="5">Cuma</option><option value="6">Cumartesi</option><option value="0">Pazar</option>
                  </select>
                </div>
              ) : (
                <div className="form-group"><label>Ayın Günü</label>
                  <input type="number" className="form-control" value={form.dayOfMonth} onChange={e => setForm(p => ({ ...p, dayOfMonth: e.target.value }))} min={1} max={31} />
                </div>
              )}
              <div className="form-group"><label>Saat</label><input type="time" className="form-control" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Başlangıç</label><input type="text" className="form-control" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))} placeholder="GG.AA.YYYY" /></div>
              <div className="form-group"><label>Bitiş (opsiyonel)</label><input type="text" className="form-control" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} placeholder="GG.AA.YYYY" /></div>
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
              <thead><tr><th>Müşteri</th><th>Personel</th><th>Hizmet</th><th>Sıklık</th><th>Gün</th><th>Saat</th><th>Başlangıç</th><th>Durum</th><th>İşlem</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!loading && (!items || items.length === 0) && <tr><td colSpan={9} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Henüz tekrarlanan randevu yok</td></tr>}
                {items?.map(r => (
                  <tr key={r.id}>
                    <td>{r.customer?.name}</td>
                    <td>{r.staff?.name}</td>
                    <td>{r.service?.name}</td>
                    <td>{r.frequency}</td>
                    <td>{r.frequency === 'Haftalık' ? ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'][r.dayOfWeek ?? 0] : r.dayOfMonth ? `Ayın ${r.dayOfMonth}'i` : '-'}</td>
                    <td>{r.time}</td>
                    <td>{r.startDate}</td>
                    <td><span className={`badge ${r.isActive ? 'badge-success' : 'badge-danger'}`}>{r.isActive ? 'Aktif' : 'Pasif'}</span></td>
                    <td><button className="btn btn-sm btn-outline" onClick={() => toggleActive(r)} title={r.isActive ? 'Pasifleştir' : 'Aktifleştir'}><i className={`fas ${r.isActive ? 'fa-pause' : 'fa-play'}`}></i></button></td>
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
