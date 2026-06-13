'use client';

type PageKey = 'dashboard' | 'appointments' | 'staff' | 'services' | 'customers' | 'payments' | 'reports' | 'notifications' | 'campaigns' | 'settings' | 'products' | 'reviews' | 'branches' | 'gift-cards' | 'loyalty' | 'waiting-list' | 'commissions' | 'leaves' | 'audit-logs' | 'export' | 'referrals' | 'recurring';

interface SidebarProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  onOpenModal?: (modal: string) => void;
  isOpen?: boolean;
}

const menuGroups = [
  {
    label: 'Ana Menü',
    items: [
      { key: 'dashboard' as PageKey, icon: 'fa-th-large', label: 'Dashboard' },
      { key: 'appointments' as PageKey, icon: 'fa-calendar-check', label: 'Randevular' },
      { key: 'staff' as PageKey, icon: 'fa-users', label: 'Personel' },
      { key: 'services' as PageKey, icon: 'fa-scissors', label: 'Hizmetler' },
      { key: 'customers' as PageKey, icon: 'fa-user-friends', label: 'Müşteriler' },
    ],
  },
  {
    label: 'Finans & Rapor',
    items: [
      { key: 'payments' as PageKey, icon: 'fa-credit-card', label: 'Ödemeler' },
      { key: 'commissions' as PageKey, icon: 'fa-percentage', label: 'Komisyonlar' },
      { key: 'reports' as PageKey, icon: 'fa-chart-bar', label: 'Raporlar' },
      { key: 'export' as PageKey, icon: 'fa-download', label: 'Dışa Aktar' },
    ],
  },
  {
    label: 'Yönetim',
    items: [
      { key: 'products' as PageKey, icon: 'fa-box', label: 'Stok' },
      { key: 'reviews' as PageKey, icon: 'fa-star', label: 'Yorumlar' },
      { key: 'recurring' as PageKey, icon: 'fa-sync', label: 'Tekrarlı Randevu' },
      { key: 'referrals' as PageKey, icon: 'fa-share-alt', label: 'Referans Kodları' },
      { key: 'branches' as PageKey, icon: 'fa-store', label: 'Şubeler' },
      { key: 'gift-cards' as PageKey, icon: 'fa-gift', label: 'Hediye Kartı' },
      { key: 'leaves' as PageKey, icon: 'fa-calendar-alt', label: 'İzinler' },
      { key: 'waiting-list' as PageKey, icon: 'fa-list-ol', label: 'Sıra' },
    ],
  },
  {
    label: 'Diğer',
    items: [
      { key: 'loyalty' as PageKey, icon: 'fa-crown', label: 'Sadakat' },
      { key: 'notifications' as PageKey, icon: 'fa-bell', label: 'Bildirimler' },
      { key: 'campaigns' as PageKey, icon: 'fa-gift', label: 'Kampanyalar' },
      { key: 'audit-logs' as PageKey, icon: 'fa-history', label: 'Denetim' },
      { key: 'settings' as PageKey, icon: 'fa-cog', label: 'Ayarlar' },
    ],
  },
];

export default function Sidebar({ activePage, onNavigate, isOpen }: SidebarProps) {
  return (
    <nav className={`sidebar${isOpen ? ' open' : ''}`} id="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon"><i className="fas fa-cut"></i></div>
        <div>
          <h2>BerberPanel</h2>
          <small>Yönetim Sistemi v2</small>
        </div>
      </div>
      <div className="sidebar-menu">
        {menuGroups.map(group => (
          <div key={group.label}>
            <div className="menu-label">{group.label}</div>
            {group.items.map(item => (
              <a key={item.key} className={`menu-item${activePage === item.key ? ' active' : ''}`}
                onClick={e => { e.preventDefault(); onNavigate(item.key); }} href="#">
                <i className={`fas ${item.icon}`}></i> {item.label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className="avatar">AD</div>
        <div className="user-info">
          <strong>Ahmet Demir</strong>
          <small>admin@berber.com</small>
        </div>
        <i className="fas fa-sign-out-alt" style={{ opacity: 0.4, cursor: 'pointer' }}></i>
      </div>
    </nav>
  );
}
