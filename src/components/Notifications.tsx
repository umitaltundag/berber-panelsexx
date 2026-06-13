'use client';

import { useData, apiPost } from '@/lib/use-data';
import { useState } from 'react';

export default function Notifications() {
  const { data: notifs, loading } = useData<any[]>('/api/notifications');
  const [template, setTemplate] = useState('Randevu Hatırlatma');
  const [message, setMessage] = useState('Sayın {musteri}, {tarih} günü saat {saat}\'deki randevunuzu hatırlatırız. Berberimizde görüşmek üzere!');
  const [saved, setSaved] = useState(false);

  const saveTemplate = async () => {
    await apiPost('/api/notifications', { title: `Şablon: ${template}`, message, type: 'template', icon: 'fa-save', iconBg: '#dbeafe', iconColor: '#2563eb' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="page-section active" id="notifications">
      {saved && (
        <div style={{ position: 'fixed', top: 80, right: 32, background: '#059669', color: 'white', padding: '12px 20px', borderRadius: 10, zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontSize: 14 }}>
          <i className="fas fa-check-circle" style={{ marginRight: 8 }}></i>Kaydedildi
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3>Bildirim Geçmişi ({notifs?.length ?? 0})</h3>
        </div>
        <div className="card-body">
          {loading && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Yükleniyor...</p>}
          {!loading && (!notifs || notifs.length === 0) && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Henüz bildirim yok</p>}
          {notifs?.slice(0, 10).map((n: any, i: number) => (
            <div key={n.id || i} className="notif-item">
              <div className="notif-icon" style={{ background: n.iconBg || '#dbeafe', color: n.iconColor || '#2563eb' }}>
                <i className={`fas ${n.icon || 'fa-bell'}`}></i>
              </div>
              <div className="notif-content">
                <p>{n.title}</p>
                <small>{n.time || new Date(n.createdAt).toLocaleString('tr-TR')}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><h3><i className="fas fa-pen" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Bildirim Şablonları</h3></div>
        <div className="card-body">
          <div className="form-group">
            <label>Şablon Seç</label>
            <select className="form-control" value={template} onChange={e => setTemplate(e.target.value)}>
              <option>Randevu Hatırlatma</option>
              <option>Randevu Onay</option>
              <option>Randevu İptal</option>
              <option>Doğum Günü Kutlaması</option>
            </select>
          </div>
          <div className="form-group">
            <label>Mesaj İçeriği</label>
            <textarea className="form-control" rows={4} value={message} onChange={e => setMessage(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={saveTemplate}><i className="fas fa-save"></i> Şablonu Kaydet</button>
        </div>
      </div>
    </section>
  );
}
