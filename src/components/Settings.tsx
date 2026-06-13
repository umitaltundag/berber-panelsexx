'use client';

import { useState, useEffect } from 'react';
import { useData } from '@/lib/use-data';

interface SettingsProps {
  refreshKey?: number;
}

export default function Settings({ refreshKey }: SettingsProps) {
  const { data, loading } = useData<Record<string, string>>('/api/settings');
  const [local, setLocal] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setLocal(data);
  }, [data]);

  const update = (key: string, value: string) => setLocal(p => ({ ...p, [key]: value }));

  const save = async (key: string, value: string) => {
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="page-section active" id="settings">
      {saved && (
        <div style={{ position: 'fixed', top: 80, right: 32, background: '#059669', color: 'white', padding: '12px 20px', borderRadius: 10, zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', fontSize: 14 }}>
          <i className="fas fa-check-circle" style={{ marginRight: 8 }}></i>Ayarlar kaydedildi
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div>
          <div className="card">
            <div className="card-header"><h3><i className="fas fa-clock" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Çalışma Saatleri</h3></div>
            <div className="card-body">
              <div className="settings-group">
                {['Pazartesi - Cuma', 'Cumartesi'].map((d, i) => (
                  <div key={i} className="setting-row">
                    <div className="setting-label"><strong>{d}</strong></div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="time" className="form-control" style={{ width: 100 }}
                        value={local[`start_${i}`] || '09:00'} onChange={e => update(`start_${i}`, e.target.value)} />
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                      <input type="time" className="form-control" style={{ width: 100 }}
                        value={local[`end_${i}`] || '19:00'} onChange={e => update(`end_${i}`, e.target.value)} />
                      <button className="btn btn-sm btn-primary" onClick={() => { save(`start_${i}`, local[`start_${i}`] || '09:00'); save(`end_${i}`, local[`end_${i}`] || '19:00'); }}>
                        <i className="fas fa-save"></i>
                      </button>
                    </div>
                  </div>
                ))}
                <div className="setting-row">
                  <div className="setting-label"><strong>Pazar</strong></div>
                  <span className="badge badge-danger">Kapalı</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3><i className="fas fa-shield-alt" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Güvenlik</h3></div>
            <div className="card-body">
              {[
                { key: 'two_factor', label: 'İki Faktörlü Doğrulama', desc: 'Hesap girişinde ek güvenlik' },
                { key: 'ip_restrict', label: 'IP Sınırlandırma', desc: 'Sadece belirli IP\'lerden giriş' },
                { key: 'auto_logout', label: 'Otomatik Çıkış', desc: '30 dakika hareketsizlikte' },
              ].map(s => (
                <div key={s.key} className="setting-row">
                  <div className="setting-label"><strong>{s.label}</strong><small>{s.desc}</small></div>
                  <label className="toggle">
                    <input type="checkbox" checked={local[s.key] === 'true'} onChange={e => { update(s.key, e.target.checked ? 'true' : 'false'); save(s.key, e.target.checked ? 'true' : 'false'); }} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-header"><h3><i className="fas fa-globe" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Dil & Bölge</h3></div>
            <div className="card-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Dil</label>
                  <select className="form-control" value={local.lang || 'tr'} onChange={e => { update('lang', e.target.value); save('lang', e.target.value); }}>
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Zaman Dilimi</label>
                  <select className="form-control" value={local.timezone || 'Europe/Istanbul'} onChange={e => { update('timezone', e.target.value); save('timezone', e.target.value); }}>
                    <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3><i className="fas fa-database" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Veri Yedekleme</h3></div>
            <div className="card-body">
              <div className="setting-row">
                <div className="setting-label"><strong>Otomatik Yedekleme</strong><small>Her gece 03:00'da</small></div>
                <label className="toggle">
                  <input type="checkbox" checked={local.auto_backup === 'true'} onChange={e => { update('auto_backup', e.target.checked ? 'true' : 'false'); save('auto_backup', e.target.checked ? 'true' : 'false'); }} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-row">
                <div className="setting-label"><strong>Son Yedekleme</strong></div>
                <span style={{ fontSize: 13 }}>{local.last_backup || 'Henüz yedeklenmedi'}</span>
              </div>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-primary btn-sm" onClick={() => { save('last_backup', new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR').slice(0, 5)); }}>
                  <i className="fas fa-download"></i> Şimdi Yedekle
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3><i className="fas fa-info-circle" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Sistem Bilgisi</h3></div>
            <div className="card-body">
              <div className="setting-row"><div className="setting-label"><strong>Sürüm</strong></div><span style={{ fontSize: 13 }}>v1.0.0</span></div>
              <div className="setting-row"><div className="setting-label"><strong>Veritabanı</strong></div><span style={{ fontSize: 13 }}>SQLite</span></div>
              <div className="setting-row"><div className="setting-label"><strong>Son Güncelleme</strong></div><span style={{ fontSize: 13 }}>Haziran 2026</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
