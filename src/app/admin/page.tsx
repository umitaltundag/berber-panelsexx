'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Modal from '@/components/Modal';
import { ToastProvider } from '@/components/Toast';
import Dashboard from '@/components/Dashboard';
import Appointments from '@/components/Appointments';
import Staff from '@/components/Staff';
import Services from '@/components/Services';
import Customers from '@/components/Customers';
import Payments from '@/components/Payments';
import Notifications from '@/components/Notifications';
import Campaigns from '@/components/Campaigns';
import Reports from '@/components/Reports';
import Settings from '@/components/Settings';
import Products from '@/components/Products';
import Reviews from '@/components/Reviews';
import Branches from '@/components/Branches';
import GiftCards from '@/components/GiftCards';
import Loyalty from '@/components/Loyalty';
import WaitingList from '@/components/WaitingList';
import Commissions from '@/components/Commissions';
import Leaves from '@/components/Leaves';
import AuditLogs from '@/components/AuditLogs';
import ExportData from '@/components/ExportData';
import Referrals from '@/components/Referrals';
import RecurringAppointments from '@/components/RecurringAppointments';
import { useData, apiPost, apiPut, apiDelete } from '@/lib/use-data';

type PageKey = 'dashboard' | 'appointments' | 'staff' | 'services' | 'customers' | 'payments' | 'reports' | 'notifications' | 'campaigns' | 'settings' | 'products' | 'reviews' | 'branches' | 'gift-cards' | 'loyalty' | 'waiting-list' | 'commissions' | 'leaves' | 'audit-logs' | 'export' | 'referrals' | 'recurring';

const pageMeta: Record<PageKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Kontrol Paneli', subtitle: 'Berber dükkanı genel durum görünümü' },
  appointments: { title: 'Randevular', subtitle: 'Tüm randevuları yönetin' },
  staff: { title: 'Personel', subtitle: 'Personel yönetimi ve performans takibi' },
  services: { title: 'Hizmetler', subtitle: 'Hizmet ve fiyat listesi' },
  customers: { title: 'Müşteriler', subtitle: 'Müşteri yönetimi ve sadakat programı' },
  payments: { title: 'Ödemeler', subtitle: 'Finansal işlemler ve raporlar' },
  reports: { title: 'Raporlar', subtitle: 'Detaylı analiz ve istatistikler' },
  notifications: { title: 'Bildirimler', subtitle: 'Bildirim ve iletişim yönetimi' },
  campaigns: { title: 'Kampanyalar', subtitle: 'Kampanya ve promosyon yönetimi' },
  settings: { title: 'Ayarlar', subtitle: 'Sistem ayarları ve yapılandırma' },
  products: { title: 'Stok Yönetimi', subtitle: 'Ürün ve malzeme takibi' },
  reviews: { title: 'Yorumlar', subtitle: 'Müşteri değerlendirmeleri' },
  branches: { title: 'Şubeler', subtitle: 'Çoklu şube yönetimi' },
  'gift-cards': { title: 'Hediye Kartları', subtitle: 'Dijital hediye çeki yönetimi' },
  loyalty: { title: 'Sadakat Programı', subtitle: 'Müşteri sadakat ve puan yönetimi' },
  'waiting-list': { title: 'Bekleme Listesi', subtitle: 'Sıra ve bekleme yönetimi' },
  commissions: { title: 'Komisyonlar', subtitle: 'Personel komisyon takibi' },
  leaves: { title: 'İzin Yönetimi', subtitle: 'Personel izin ve müsaitlik' },
  'audit-logs': { title: 'Denetim Günlüğü', subtitle: 'Sistem hareket kayıtları' },
  export: { title: 'Dışa Aktar', subtitle: 'Verileri Excel/CSV olarak dışa aktar' },
  referrals: { title: 'Referans Kodları', subtitle: 'Müşteri referans ve davet yönetimi' },
  recurring: { title: 'Tekrarlanan Randevular', subtitle: 'Düzenli randevu takibi' },
};

export default function AdminPage() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const router = useRouter();

  const { data: notifs } = useData<any[]>('/api/notifications');

  const [modals, setModals] = useState<Record<string, boolean>>({
    appointmentModal: false,
    customerModal: false,
    staffModal: false,
    serviceModal: false,
    campaignModal: false,
    productModal: false,
    branchModal: false,
  });

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const update = (key: string, val: any) => setFormData(p => ({ ...p, [key]: val }));

  useEffect(() => {
    if (darkMode) {
      document.documentElement.style.setProperty('--bg-main', '#0f172a');
      document.documentElement.style.setProperty('--gray-800', '#f1f5f9');
      document.documentElement.style.setProperty('--border', '#334155');
      document.documentElement.style.setProperty('--gray-50', '#1e293b');
      document.documentElement.style.setProperty('--gray-100', '#1e293b');
      document.documentElement.style.setProperty('--gray-600', '#94a3b8');
      document.documentElement.style.setProperty('--gray-700', '#cbd5e1');
      document.documentElement.style.setProperty('--text-muted', '#64748b');
      document.querySelector('.sidebar')?.setAttribute('style', 'background:#1e293b');
    } else {
      document.documentElement.style.setProperty('--bg-main', '#f8fafc');
      document.documentElement.style.setProperty('--gray-800', '#1e293b');
      document.documentElement.style.setProperty('--border', '#e2e8f0');
      document.documentElement.style.setProperty('--gray-50', '#f8fafc');
      document.documentElement.style.setProperty('--gray-100', '#f1f5f9');
      document.documentElement.style.setProperty('--gray-600', '#475569');
      document.documentElement.style.setProperty('--gray-700', '#334155');
      document.documentElement.style.setProperty('--text-muted', '#94a3b8');
      document.querySelector('.sidebar')?.setAttribute('style', 'background:white');
    }
  }, [darkMode]);

  const openModal = (id: string) => { setFormData({}); setModals(p => ({ ...p, [id]: true })); };
  const closeModal = (id: string) => setModals(p => ({ ...p, [id]: false }));

  const handleSave = async (endpoint: string, method: 'POST' | 'PUT' = 'POST') => {
    setSaving(true);
    try {
      if (method === 'POST') await apiPost(endpoint, formData);
      else await apiPut(endpoint, formData);
      setRefreshKey(k => k + 1);
      Object.keys(modals).filter(k => modals[k]).forEach(closeModal);
    } catch { } finally { setSaving(false); }
  };

  const handleNavigate = (page: PageKey) => { setActivePage(page); setSidebarOpen(false); };
  const handleLogout = async () => { await fetch('/api/auth', { method: 'DELETE' }); router.push('/login'); };

  const meta = pageMeta[activePage];
  const filteredNotifs = notifs?.filter(n => n.title?.toLowerCase().includes(searchQuery.toLowerCase())) ?? [];

  return (
    <ToastProvider>
      <Sidebar activePage={activePage} onNavigate={handleNavigate} onOpenModal={openModal} isOpen={sidebarOpen} />

      <div className="main">
        <header className="header">
          <div className="header-left">
            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}><i className="fas fa-bars"></i></button>
            <div className="header-title"><h1>{meta.title}</h1><p>{meta.subtitle}</p></div>
          </div>
          <div className="header-right">
            <div style={{ position: 'relative' }}>
              <button className="header-btn" onClick={() => setSearchOpen(!searchOpen)}><i className="fas fa-search"></i></button>
              {searchOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'white', borderRadius: 10, border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', width: 300, padding: 12, zIndex: 200 }}>
                  <input type="text" className="form-control" placeholder="Ara..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} autoFocus />
                  {searchQuery && <div style={{ marginTop: 8, maxHeight: 200, overflowY: 'auto' }}>
                    {filteredNotifs.slice(0, 5).map((n: any, i: number) => <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>{n.title}</div>)}
                    {filteredNotifs.length === 0 && <div style={{ padding: 8, fontSize: 13, color: 'var(--text-muted)' }}>Sonuç bulunamadı</div>}
                  </div>}
                </div>
              )}
            </div>
            <button className="header-btn" onClick={() => setDarkMode(!darkMode)}><i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i></button>
            <div style={{ position: 'relative' }}>
              <button className="header-btn" onClick={() => setNotifOpen(!notifOpen)}><i className="fas fa-bell"></i>{notifs && notifs.length > 0 && <span className="dot"></span>}</button>
              {notifOpen && (
                <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'white', borderRadius: 10, border: '1px solid var(--border)', boxShadow: '0 10px 40px rgba(0,0,0,0.12)', width: 340, zIndex: 200 }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 14, fontWeight: 600 }}>Bildirimler</div>
                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {notifs?.slice(0, 5).map((n: any, i: number) => (
                      <div key={i} className="notif-item" style={{ padding: '10px 16px' }}>
                        <div className="notif-icon" style={{ background: n.iconBg || '#dbeafe', color: n.iconColor || '#2563eb', width: 32, height: 32, fontSize: 12 }}><i className={`fas ${n.icon || 'fa-bell'}`}></i></div>
                        <div className="notif-content"><p style={{ fontSize: 12 }}>{n.title}</p><small>{n.time}</small></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => openModal('appointmentModal')}><i className="fas fa-plus"></i> Yeni Randevu</button>
            <button className="btn btn-outline btn-sm" onClick={handleLogout} title="Çıkış Yap"><i className="fas fa-sign-out-alt"></i></button>
          </div>
        </header>

        <div className="content">
          {activePage === 'dashboard' && <Dashboard onNewAppointment={() => openModal('appointmentModal')} onOpenModal={openModal} refreshKey={refreshKey} />}
          {activePage === 'appointments' && <Appointments onNewAppointment={() => openModal('appointmentModal')} refreshKey={refreshKey} />}
          {activePage === 'staff' && <Staff onOpenModal={openModal} refreshKey={refreshKey} />}
          {activePage === 'services' && <Services onOpenModal={openModal} refreshKey={refreshKey} />}
          {activePage === 'customers' && <Customers onOpenModal={openModal} refreshKey={refreshKey} />}
          {activePage === 'payments' && <Payments />}
          {activePage === 'notifications' && <Notifications />}
          {activePage === 'campaigns' && <Campaigns onOpenModal={openModal} refreshKey={refreshKey} />}
          {activePage === 'reports' && <Reports />}
          {activePage === 'settings' && <Settings refreshKey={refreshKey} />}
          {activePage === 'products' && <Products onOpenModal={openModal} refreshKey={refreshKey} />}
          {activePage === 'reviews' && <Reviews refreshKey={refreshKey} />}
          {activePage === 'branches' && <Branches onOpenModal={openModal} refreshKey={refreshKey} />}
          {activePage === 'gift-cards' && <GiftCards refreshKey={refreshKey} />}
          {activePage === 'loyalty' && <Loyalty refreshKey={refreshKey} />}
          {activePage === 'waiting-list' && <WaitingList />}
          {activePage === 'commissions' && <Commissions />}
          {activePage === 'leaves' && <Leaves />}
          {activePage === 'audit-logs' && <AuditLogs />}
          {activePage === 'export' && <ExportData />}
          {activePage === 'referrals' && <Referrals refreshKey={refreshKey} />}
          {activePage === 'recurring' && <RecurringAppointments refreshKey={refreshKey} />}
        </div>
      </div>

      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 99 }} onClick={() => setSidebarOpen(false)} />}

      {/* Modals */}
      <Modal id="appointmentModal" title="Yeni Randevu" isOpen={modals.appointmentModal} onClose={() => closeModal('appointmentModal')} submitLabel={saving ? 'Kaydediliyor...' : 'Randevu Oluştur'} onSubmit={() => handleSave('/api/appointments')} saving={saving}>
        <div className="form-row">
          <div className="form-group"><label>Müşteri ID</label><input type="number" className="form-control" value={formData.customerId || ''} onChange={e => update('customerId', Number(e.target.value))} placeholder="Müşteri ID" /></div>
          <div className="form-group"><label>Personel ID</label><input type="number" className="form-control" value={formData.staffId || ''} onChange={e => update('staffId', Number(e.target.value))} placeholder="Personel ID" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Tarih</label><input type="text" className="form-control" value={formData.date || ''} onChange={e => update('date', e.target.value)} placeholder="GG.AA.YYYY" /></div>
          <div className="form-group"><label>Saat</label><input type="text" className="form-control" value={formData.time || ''} onChange={e => update('time', e.target.value)} placeholder="HH:MM" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Hizmet ID</label><input type="number" className="form-control" value={formData.serviceId || ''} onChange={e => update('serviceId', Number(e.target.value))} placeholder="Hizmet ID" /></div>
          <div className="form-group"><label>Durum</label><select className="form-control" value={formData.status || 'Beklemede'} onChange={e => update('status', e.target.value)}><option>Beklemede</option><option>Onaylandı</option><option>Devam Ediyor</option><option>Tamamlandı</option><option>İptal</option></select></div>
        </div>
        <div className="form-group"><label>Not</label><textarea className="form-control" value={formData.note || ''} onChange={e => update('note', e.target.value)} placeholder="Not ekleyin..."></textarea></div>
      </Modal>

      <Modal id="customerModal" title="Yeni Müşteri" isOpen={modals.customerModal} onClose={() => closeModal('customerModal')} submitLabel={saving ? 'Kaydediliyor...' : 'Müşteri Ekle'} onSubmit={() => handleSave('/api/customers')} saving={saving}>
        <div className="form-row">
          <div className="form-group"><label>Ad Soyad</label><input type="text" className="form-control" value={formData.name || ''} onChange={e => update('name', e.target.value)} placeholder="Ad Soyad" required /></div>
          <div className="form-group"><label>Telefon</label><input type="tel" className="form-control" value={formData.phone || ''} onChange={e => update('phone', e.target.value)} placeholder="+90 5XX XXX XX XX" /></div>
        </div>
        <div className="form-group"><label>E-posta</label><input type="email" className="form-control" value={formData.email || ''} onChange={e => update('email', e.target.value)} placeholder="ornek@email.com" /></div>
        <div className="form-row">
          <div className="form-group"><label>Doğum Tarihi</label><input type="text" className="form-control" value={formData.birthDate || ''} onChange={e => update('birthDate', e.target.value)} placeholder="GG.AA.YYYY" /></div>
          <div className="form-group"><label>Segment</label><select className="form-control" value={formData.segment || 'Standart'} onChange={e => update('segment', e.target.value)}><option>Standart</option><option>Yeni</option><option>Aktif</option><option>Sadık</option></select></div>
        </div>
        <div className="form-group"><label>Notlar</label><textarea className="form-control" value={formData.notes || ''} onChange={e => update('notes', e.target.value)} placeholder="Müşteri hakkında notlar..."></textarea></div>
      </Modal>

      <Modal id="staffModal" title="Yeni Personel" isOpen={modals.staffModal} onClose={() => closeModal('staffModal')} submitLabel={saving ? 'Kaydediliyor...' : 'Personel Ekle'} onSubmit={() => handleSave('/api/staff')} saving={saving}>
        <div className="form-row">
          <div className="form-group"><label>Ad Soyad</label><input type="text" className="form-control" value={formData.name || ''} onChange={e => update('name', e.target.value)} placeholder="Ad Soyad" required /></div>
          <div className="form-group"><label>Unvan</label><input type="text" className="form-control" value={formData.title || ''} onChange={e => update('title', e.target.value)} placeholder="Usta Berber" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Telefon</label><input type="tel" className="form-control" value={formData.phone || ''} onChange={e => update('phone', e.target.value)} /></div>
          <div className="form-group"><label>E-posta</label><input type="email" className="form-control" value={formData.email || ''} onChange={e => update('email', e.target.value)} /></div>
        </div>
        <div className="form-group"><label>Çalışma Günleri</label><input type="text" className="form-control" value={formData.workingDays || ''} onChange={e => update('workingDays', e.target.value)} placeholder="Pzt-Cum" /></div>
        <div className="form-row">
          <div className="form-group"><label>Başlangıç</label><input type="time" className="form-control" value={formData.startTime || '09:00'} onChange={e => update('startTime', e.target.value)} /></div>
          <div className="form-group"><label>Bitiş</label><input type="time" className="form-control" value={formData.endTime || '19:00'} onChange={e => update('endTime', e.target.value)} /></div>
        </div>
        <div className="form-group"><label>Renk</label><input type="color" className="form-control" value={formData.color || '#4f46e5'} onChange={e => update('color', e.target.value)} style={{ padding: 4, height: 44 }} /></div>
      </Modal>

      <Modal id="serviceModal" title="Yeni Hizmet" isOpen={modals.serviceModal} onClose={() => closeModal('serviceModal')} submitLabel={saving ? 'Kaydediliyor...' : 'Hizmet Ekle'} onSubmit={() => handleSave('/api/services')} saving={saving}>
        <div className="form-row">
          <div className="form-group"><label>Hizmet Adı</label><input type="text" className="form-control" value={formData.name || ''} onChange={e => update('name', e.target.value)} placeholder="Hizmet adı" required /></div>
          <div className="form-group"><label>Kategori</label><input type="text" className="form-control" value={formData.category || ''} onChange={e => update('category', e.target.value)} placeholder="Saç, Sakal, Boya..." /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Fiyat (₺)</label><input type="number" className="form-control" value={formData.price || ''} onChange={e => update('price', Number(e.target.value))} placeholder="0" /></div>
          <div className="form-group"><label>Süre (dk)</label><input type="number" className="form-control" value={formData.duration || 30} onChange={e => update('duration', Number(e.target.value))} placeholder="30" /></div>
        </div>
        <div className="form-group"><label>Açıklama</label><textarea className="form-control" value={formData.description || ''} onChange={e => update('description', e.target.value)} placeholder="Hizmet açıklaması..."></textarea></div>
      </Modal>

      <Modal id="campaignModal" title="Yeni Kampanya" isOpen={modals.campaignModal} onClose={() => closeModal('campaignModal')} submitLabel={saving ? 'Kaydediliyor...' : 'Kampanya Oluştur'} onSubmit={() => handleSave('/api/campaigns')} saving={saving}>
        <div className="form-row">
          <div className="form-group"><label>Başlık</label><input type="text" className="form-control" value={formData.title || ''} onChange={e => update('title', e.target.value)} placeholder="Kampanya adı" required /></div>
          <div className="form-group"><label>İndirim</label><input type="text" className="form-control" value={formData.discount || ''} onChange={e => update('discount', e.target.value)} placeholder="%15 veya 50 ₺" /></div>
        </div>
        <div className="form-group"><label>Açıklama</label><textarea className="form-control" value={formData.description || ''} onChange={e => update('description', e.target.value)} placeholder="Kampanya açıklaması..." /></div>
        <div className="form-row">
          <div className="form-group"><label>Başlangıç</label><input type="text" className="form-control" value={formData.startDate || ''} onChange={e => update('startDate', e.target.value)} placeholder="GG.AA.YYYY" /></div>
          <div className="form-group"><label>Bitiş</label><input type="text" className="form-control" value={formData.endDate || ''} onChange={e => update('endDate', e.target.value)} placeholder="GG.AA.YYYY" /></div>
        </div>
        <div className="form-group"><label>Hedef Kitle</label><input type="text" className="form-control" value={formData.audience || ''} onChange={e => update('audience', e.target.value)} placeholder="Tüm müşteriler, Sadık..." /></div>
      </Modal>

      <Modal id="productModal" title="Yeni Ürün" isOpen={modals.productModal} onClose={() => closeModal('productModal')} submitLabel={saving ? 'Kaydediliyor...' : 'Ürün Ekle'} onSubmit={() => handleSave('/api/products')} saving={saving}>
        <div className="form-row">
          <div className="form-group"><label>Ürün Adı</label><input type="text" className="form-control" value={formData.name || ''} onChange={e => update('name', e.target.value)} placeholder="Ürün adı" required /></div>
          <div className="form-group"><label>Kategori</label><input type="text" className="form-control" value={formData.category || ''} onChange={e => update('category', e.target.value)} placeholder="Şekillendirici, Bakım..." /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Stok Miktarı</label><input type="number" className="form-control" value={formData.stock || 0} onChange={e => update('stock', Number(e.target.value))} placeholder="0" /></div>
          <div className="form-group"><label>Minimum Stok</label><input type="number" className="form-control" value={formData.minStock || 5} onChange={e => update('minStock', Number(e.target.value))} placeholder="5" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Fiyat (₺)</label><input type="number" className="form-control" value={formData.price || ''} onChange={e => update('price', Number(e.target.value))} placeholder="0" /></div>
          <div className="form-group"><label>Birim</label><input type="text" className="form-control" value={formData.unit || 'adet'} onChange={e => update('unit', e.target.value)} placeholder="adet, paket, lt..." /></div>
        </div>
        <div className="form-group"><label>Açıklama</label><textarea className="form-control" value={formData.description || ''} onChange={e => update('description', e.target.value)} placeholder="Ürün açıklaması..."></textarea></div>
      </Modal>

      <Modal id="branchModal" title="Yeni Şube" isOpen={modals.branchModal} onClose={() => closeModal('branchModal')} submitLabel={saving ? 'Kaydediliyor...' : 'Şube Ekle'} onSubmit={() => handleSave('/api/branches')} saving={saving}>
        <div className="form-row">
          <div className="form-group"><label>Şube Adı</label><input type="text" className="form-control" value={formData.name || ''} onChange={e => update('name', e.target.value)} placeholder="Şube adı" required /></div>
          <div className="form-group"><label>Telefon</label><input type="tel" className="form-control" value={formData.phone || ''} onChange={e => update('phone', e.target.value)} placeholder="+90 212 XXX XX XX" /></div>
        </div>
        <div className="form-group"><label>Adres</label><input type="text" className="form-control" value={formData.address || ''} onChange={e => update('address', e.target.value)} placeholder="Şube adresi" /></div>
        <div className="form-row">
          <div className="form-group"><label>Çalışma Günleri</label><input type="text" className="form-control" value={formData.workingDays || ''} onChange={e => update('workingDays', e.target.value)} placeholder="Pzt-Cmt" /></div>
          <div className="form-group"><label>E-posta</label><input type="email" className="form-control" value={formData.email || ''} onChange={e => update('email', e.target.value)} placeholder="ornek@berber.com" /></div>
        </div>
        <div className="form-row">
          <div className="form-group"><label>Açılış</label><input type="time" className="form-control" value={formData.startTime || '09:00'} onChange={e => update('startTime', e.target.value)} /></div>
          <div className="form-group"><label>Kapanış</label><input type="time" className="form-control" value={formData.endTime || '19:00'} onChange={e => update('endTime', e.target.value)} /></div>
        </div>
      </Modal>
    </ToastProvider>
  );
}
