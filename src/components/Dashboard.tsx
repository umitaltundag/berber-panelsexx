'use client';

import { useData, apiDelete } from '@/lib/use-data';
import { useState } from 'react';

interface DashboardProps {
  onNewAppointment: () => void;
  onOpenModal: (modal: string) => void;
  refreshKey?: number;
}

interface Stats {
  todayAppointments: number;
  weeklyAppointments: number;
  monthlyRevenue: number;
  totalCustomers: number;
  totalStaff: number;
}

interface AppointmentData {
  id: number;
  date: string;
  time: string;
  status: string;
  customer: { name: string; phone: string | null };
  staff: { name: string };
  service: { name: string };
}

export default function Dashboard({ onNewAppointment, onOpenModal, refreshKey }: DashboardProps) {
  const { data: stats, loading: statsLoading } = useData<Stats>('/api/stats');
  const { data: appointments, loading: apptLoading } = useData<AppointmentData[]>('/api/appointments');
  const { data: notifications } = useData<any[]>('/api/notifications');

  const todayStr = new Date().toLocaleDateString('tr-TR');
  const todayAppts = appointments?.filter(a => a.date === todayStr) ?? [];
  const recentNotifs = notifications?.slice(0, 4) ?? [];

  const handleDelete = async (id: number) => {
    if (!confirm('Randevuyu iptal etmek istediğinize emin misiniz?')) return;
    await apiDelete(`/api/appointments/${id}`);
    window.location.reload();
  };

  return (
    <section className="page-section active" id="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Bugünkü Randevu</div><div className="stat-value">{statsLoading ? '...' : stats?.todayAppointments ?? 0}</div></div>
            <div className="stat-icon icon-blue"><i className="fas fa-calendar-day"></i></div>
          </div>
          <div className="stat-change up"><i className="fas fa-arrow-up"></i> Güncel</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Haftalık Randevu</div><div className="stat-value">{statsLoading ? '...' : stats?.weeklyAppointments ?? 0}</div></div>
            <div className="stat-icon icon-green"><i className="fas fa-calendar-week"></i></div>
          </div>
          <div className="stat-change up"><i className="fas fa-arrow-up"></i> Bu hafta</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Aylık Gelir</div><div className="stat-value">{statsLoading ? '...' : `${(stats?.monthlyRevenue ?? 0).toLocaleString()} ₺`}</div></div>
            <div className="stat-icon icon-yellow"><i className="fas fa-turkish-lira-sign"></i></div>
          </div>
          <div className="stat-change up"><i className="fas fa-arrow-up"></i> Bu ay</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Toplam Müşteri</div><div className="stat-value">{statsLoading ? '...' : (stats?.totalCustomers ?? 0).toLocaleString()}</div></div>
            <div className="stat-icon icon-purple"><i className="fas fa-users"></i></div>
          </div>
          <div className="stat-change up"><i className="fas fa-arrow-up"></i> Kayıtlı</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div><div className="stat-label">Aktif Personel</div><div className="stat-value">{statsLoading ? '...' : stats?.totalStaff ?? 0}</div></div>
            <div className="stat-icon icon-red"><i className="fas fa-user-check"></i></div>
          </div>
          <div className="stat-change down"><i className="fas fa-arrow-down"></i> Çalışıyor</div>
        </div>
      </div>

      <div className="quick-actions">
        <div className="quick-action-btn" onClick={onNewAppointment}>
          <i className="fas fa-plus-circle"></i><span>Yeni Randevu</span>
        </div>
        <div className="quick-action-btn" onClick={() => onOpenModal('customerModal')}>
          <i className="fas fa-user-plus"></i><span>Müşteri Ekle</span>
        </div>
        <div className="quick-action-btn" onClick={() => onOpenModal('staffModal')}>
          <i className="fas fa-user-tie"></i><span>Personel Ekle</span>
        </div>
        <div className="quick-action-btn" onClick={() => onOpenModal('serviceModal')}>
          <i className="fas fa-tag"></i><span>Hizmet Ekle</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-chart-line" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Haftalık Randevu Grafiği</h3>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Bu Hafta</span>
          </div>
          <div className="card-body">
            <div className="chart-placeholder">
              <div className="chart-bars">
                {[{ day: 'Pzt', h: 60 }, { day: 'Sal', h: 80 }, { day: 'Çar', h: 55 }, { day: 'Per', h: 90 }, { day: 'Cum', h: 70 }, { day: 'Cmt', h: 45 }, { day: 'Paz', h: 20 }].map(b => (
                  <div key={b.day} className="chart-bar" style={{ height: `${b.h}%`, background: '#4f46e5' }}><span className="chart-bar-label">{b.day}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3><i className="fas fa-bell" style={{ color: 'var(--warning)', marginRight: 8 }}></i>Son Bildirimler</h3>
          </div>
          <div className="card-body" style={{ padding: '12px 24px' }}>
            {recentNotifs.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Henüz bildirim yok</p>}
            {recentNotifs.map((n: any, i: number) => (
              <div key={i} className="notif-item">
                <div className="notif-icon" style={{ background: n.iconBg || '#dbeafe', color: n.iconColor || '#2563eb' }}><i className={`fas ${n.icon || 'fa-bell'}`}></i></div>
                <div className="notif-content"><p>{n.title}</p><small>{n.time}</small></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <h3><i className="fas fa-calendar-day" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Bugünün Randevuları</h3>
           <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Saat</th><th>Müşteri</th><th>Hizmet</th><th>Personel</th><th>Durum</th><th>İşlem</th></tr></thead>
              <tbody>
                {apptLoading && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!apptLoading && todayAppts.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Bugün randevu bulunmuyor</td></tr>
                )}
                {todayAppts.map(r => (
                  <tr key={r.id}>
                    <td>{r.time}</td>
                    <td><strong>{r.customer.name}</strong>{r.customer.phone && <br />}<small style={{ color: 'var(--text-muted)' }}>{r.customer.phone}</small></td>
                    <td>{r.service.name}</td><td>{r.staff.name}</td>
                    <td><span className={`badge badge-${r.status === 'Onaylandı' ? 'success' : r.status === 'Beklemede' ? 'warning' : r.status === 'Devam Ediyor' ? 'info' : 'danger'}`}>{r.status}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline" title="İptal Et" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(r.id)}><i className="fas fa-times"></i></button>
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
