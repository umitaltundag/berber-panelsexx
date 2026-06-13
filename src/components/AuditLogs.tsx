'use client';

import { useData } from '@/lib/use-data';

interface AuditData {
  id: number;
  action: string;
  entity: string;
  entityId: number | null;
  details: string | null;
  ip: string;
  createdAt: string;
  user: { name: string };
}

export default function AuditLogs() {
  const { data: logs, loading } = useData<AuditData[]>('/api/audit-logs');

  return (
    <section className="page-section active" id="audit-logs">
      <div className="card">
        <div className="card-header">
          <h3><i className="fas fa-history" style={{ color: 'var(--primary)', marginRight: 8 }}></i>Denetim Kayıtları</h3>
          <span className="badge badge-info">{logs?.length ?? 0} kayıt</span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead><tr><th>Kullanıcı</th><th>İşlem</th><th>Detay</th><th>IP</th><th>Tarih</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Yükleniyor...</td></tr>}
                {!loading && (!logs || logs.length === 0) && <tr><td colSpan={5} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>Kayıt bulunmuyor</td></tr>}
                {logs?.map(l => (
                  <tr key={l.id}>
                    <td>{l.user.name}</td>
                    <td>
                      <span className={`badge badge-${l.action === 'CREATE' ? 'success' : l.action === 'UPDATE' ? 'warning' : 'danger'}`}>
                        {l.action === 'CREATE' ? 'Oluşturma' : l.action === 'UPDATE' ? 'Güncelleme' : l.action === 'DELETE' ? 'Silme' : l.action}
                      </span>
                    </td>
                    <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={l.details || ''}>
                      {l.details ? `${l.entity} #${l.entityId}: ${l.details}` : `${l.entity} #${l.entityId}`}
                    </td>
                    <td><code style={{ fontSize: 12 }}>{l.ip}</code></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{l.createdAt}</td>
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
