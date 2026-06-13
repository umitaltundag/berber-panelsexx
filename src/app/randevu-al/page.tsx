'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Step = 'service' | 'staff' | 'datetime' | 'info' | 'confirm';

interface ServiceData { id: number; name: string; category: string; price: number; duration: number }
interface StaffData { id: number; name: string; title: string; color: string }

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('service');
  const [services, setServices] = useState<ServiceData[]>([]);
  const [staff, setStaff] = useState<StaffData[]>([]);

  const [selectedService, setSelectedService] = useState<ServiceData | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<{ loading?: boolean; valid?: boolean; discount?: string; error?: string }>({});
  const [customerPassword, setCustomerPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Kredi Kartı');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/public/services').then(r => r.json()).then(d => { if (d.success) setServices(d.data); });
    fetch('/api/public/staff').then(r => r.json()).then(d => { if (d.success) setStaff(d.data); });
  }, []);

  const today = new Date().toISOString().split('T')[0];

  const timeSlots: string[] = [];
  for (let h = 9; h <= 18; h++) {
    timeSlots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 18) timeSlots.push(`${String(h).padStart(2, '0')}:30`);
  }

  const validateCoupon = async () => {
    if (!couponCode.trim()) { setCouponStatus({}); return; }
    setCouponStatus({ loading: true });
    try {
      const res = await fetch(`/api/public/coupons?code=${encodeURIComponent(couponCode)}`);
      const data = await res.json();
      if (data.success) {
        setCouponStatus({ valid: true, discount: data.data.discount });
      } else {
        setCouponStatus({ error: data.error || 'Geçersiz kod' });
      }
    } catch {
      setCouponStatus({ error: 'Doğrulama hatası' });
    }
  };

  const getDiscountAmount = () => {
    if (!couponStatus.valid || !selectedService || !couponStatus.discount) return 0;
    const numericDiscount = parseInt(couponStatus.discount.replace(/[^0-9]/g, ''));
    if (couponStatus.discount.includes('%')) {
      return Math.round(selectedService.price * numericDiscount / 100);
    }
    return numericDiscount;
  };

  const finalPrice = selectedService ? selectedService.price - getDiscountAmount() : 0;

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/public/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService!.id,
          staffId: selectedStaff!.id,
          date: selectedDate,
          time: selectedTime,
          customerName,
          customerPhone,
          notes,
          couponCode: couponStatus.valid ? couponCode : undefined,
          password: customerPassword || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || 'Randevu alınırken hata oluştu');
      } else {
        setSubmitted(true);
        setSubmittedData(data.data);
      }
    } catch {
      setError('Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  const categories = [...new Set(services.map(s => s.category))];
  const stepNames = ['service', 'staff', 'datetime', 'info'];
  const currentIdx = stepNames.indexOf(step);

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#f0f4ff,#eef2ff)' }}>
        <div style={{
          textAlign: 'center', background: 'white', borderRadius: 20, padding: 48, maxWidth: 440,
          boxShadow: '0 25px 80px rgba(79,70,229,0.15)', border: '1px solid #eef2ff',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', color: '#059669',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 36,
            boxShadow: '0 8px 24px rgba(5,150,105,0.2)',
          }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 8px', color: '#1e293b' }}>Randevunuz Alındı!</h2>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: '0 0 8px' }}>
            <strong>{selectedService?.name}</strong> hizmeti için <strong>{selectedDate}</strong> günü saat <strong>{selectedTime}</strong>'de {selectedStaff?.name} tarafından karşılanacaksınız.
          </p>
          {getDiscountAmount() > 0 && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
              background: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', borderRadius: 20,
              fontSize: 13, fontWeight: 600, color: '#059669', marginTop: 8,
            }}>
              <i className="fas fa-tag"></i> {getDiscountAmount()} ₺ indirim uygulandı!
            </div>
          )}
          {customerPassword && (
            <div style={{ marginTop: 16, fontSize: 13, color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <i className="fas fa-user"></i>
              <a href="/musteri-giris" style={{ color: '#4f46e5', fontWeight: 600 }}>Müşteri paneline giriş yapın</a> randevularınızı takip edin.
            </div>
          )}

          {!showPayment && !paymentDone && finalPrice > 0 && (
            <div style={{ marginTop: 16 }}>
              <button onClick={() => setShowPayment(true)} style={{
                padding: '12px 24px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg,#059669,#047857)', color: 'white',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(5,150,105,0.3)',
              }}>
                <i className="fas fa-credit-card" style={{ marginRight: 6 }}></i>{finalPrice} ₺ Ödeme Yap
              </button>
              <span style={{ marginLeft: 12, fontSize: 13, color: '#64748b' }}>veya berberde ödeyin</span>
            </div>
          )}

          {showPayment && !paymentDone && (
            <div style={{
              marginTop: 16, background: '#f8faff', borderRadius: 14,
              padding: 20, border: '1px solid #e0e7ff', textAlign: 'left',
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#1e293b' }}>
                <i className="fas fa-lock" style={{ marginRight: 8, color: '#4f46e5' }}></i>Online Ödeme
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#475569', display: 'block', marginBottom: 4 }}>Ödeme Yöntemi</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{
                  width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0',
                  fontSize: 14, outline: 'none', background: 'white',
                }}>
                  <option>Kredi Kartı</option>
                  <option>Havale</option>
                </select>
              </div>
              {paymentMethod === 'Kredi Kartı' && (
                <div>
                  <div style={{ marginBottom: 10 }}>
                    <input type="text" placeholder="Kart Üzerindeki İsim" style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <input type="text" placeholder="Kart Numarası" maxLength={19} style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14, boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="text" placeholder="AA/YY" maxLength={5} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14 }} />
                    <input type="text" placeholder="CVV" maxLength={3} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: '2px solid #e2e8f0', fontSize: 14 }} />
                  </div>
                </div>
              )}
              <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <button onClick={() => setShowPayment(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13 }}>İptal</button>
                <button onClick={async () => {
                  setPaymentLoading(true);
                  try {
                    const res = await fetch('/api/public/payments', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ appointmentId: submittedData?.id, amount: finalPrice, method: paymentMethod }),
                    });
                    const d = await res.json();
                    if (d.success) { setPaymentDone(true); setShowPayment(false); }
                    else { alert(d.error || 'Ödeme hatası'); }
                  } catch { alert('Ödeme hatası'); }
                  finally { setPaymentLoading(false); }
                }} disabled={paymentLoading} style={{
                  flex: 1, padding: '10px 20px', borderRadius: 10, border: 'none',
                  background: paymentLoading ? '#94a3b8' : '#059669', color: 'white',
                  cursor: paymentLoading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600,
                }}>
                  {paymentLoading ? 'İşleniyor...' : `${finalPrice} ₺ Öde`}
                </button>
              </div>
            </div>
          )}

          {paymentDone && (
            <div style={{ marginTop: 12, fontSize: 13, color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <i className="fas fa-check-circle"></i>Ödeme başarıyla alındı!
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
            <button onClick={() => router.push('/')}
              style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#475569' }}>
              <i className="fas fa-home" style={{ marginRight: 6 }}></i>Ana Sayfa
            </button>
            <button onClick={() => { setSubmitted(false); setStep('service'); setSelectedService(null); setSelectedStaff(null); setSelectedDate(''); setSelectedTime(''); setCustomerName(''); setCustomerPhone(''); setNotes(''); setCouponCode(''); setCouponStatus({}); setCustomerPassword(''); }}
              style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#4f46e5,#4338ca)', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 600, boxShadow: '0 4px 12px rgba(79,70,229,0.3)' }}>
              <i className="fas fa-plus-circle" style={{ marginRight: 6 }}></i>Yeni Randevu
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#f8fafc 0%,#f0f4ff 100%)' }}>
      {/* HEADER */}
      <nav style={{
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0', padding: '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => router.push('/')}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#4f46e5,#4338ca)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 16,
            boxShadow: '0 4px 8px rgba(79,70,229,0.25)',
          }}><i className="fas fa-cut"></i></div>
          <div>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>BerberPanel</span>
            <span style={{ fontSize: 11, color: '#94a3b8', display: 'block', marginTop: -2 }}>Online Randevu</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/musteri-giris" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 500 }}>
            <i className="fas fa-user" style={{ marginRight: 4 }}></i>Müşteri Girişi
          </a>
          <a href="/" style={{ fontSize: 14, color: '#4f46e5', textDecoration: 'none', fontWeight: 500 }}>
            <i className="fas fa-arrow-left" style={{ marginRight: 6 }}></i>Ana Sayfa
          </a>
        </div>
      </nav>

      {/* PROGRESS */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 0' }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 32, alignItems: 'center' }}>
          {stepNames.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: i <= currentIdx ? 'linear-gradient(135deg,#4f46e5,#4338ca)' : '#e2e8f0',
                color: i <= currentIdx ? 'white' : '#94a3b8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, flexShrink: 0,
                boxShadow: i <= currentIdx ? '0 2px 8px rgba(79,70,229,0.3)' : 'none',
                transition: 'all 0.3s',
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, height: 3, borderRadius: 2, background: i < currentIdx ? '#4f46e5' : i === currentIdx ? 'linear-gradient(90deg,#4f46e5,#c7d2fe)' : '#e2e8f0', transition: 'background 0.4s' }} />
            </div>
          ))}
        </div>

        <div style={{
          background: 'white', borderRadius: 20, padding: 32,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #eef2ff',
        }}>
          {/* STEP 1: SERVICE */}
          {step === 'service' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: '#1e293b' }}>Hizmet Seçin</h2>
                <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>İhtiyacınıza uygun hizmeti seçin</p>
              </div>
              {categories.map(cat => (
                <div key={cat} style={{ marginBottom: 20 }}>
                  <div style={{
                    fontSize: 12, fontWeight: 600, color: '#94a3b8',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    marginBottom: 10, paddingLeft: 2,
                  }}>{cat}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {services.filter(s => s.category === cat).map(s => (
                      <div key={s.id} onClick={() => { setSelectedService(s); setStep('staff'); }}
                        style={{
                          padding: '18px 20px', borderRadius: 14,
                          border: `2px solid ${selectedService?.id === s.id ? '#4f46e5' : '#e2e8f0'}`,
                          background: selectedService?.id === s.id ? 'linear-gradient(135deg,#eef2ff,#f8faff)' : 'white',
                          cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          transition: 'all 0.25s',
                          boxShadow: selectedService?.id === s.id ? '0 4px 12px rgba(79,70,229,0.1)' : 'none',
                        }}
                        onMouseEnter={e => { if (selectedService?.id !== s.id) { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.background = '#f8faff'; } }}
                        onMouseLeave={e => { if (selectedService?.id !== s.id) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; } }}
                      >
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>{s.name}</div>
                          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>
                            <i className="far fa-clock" style={{ marginRight: 4 }}></i>{s.duration} dk
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#4f46e5' }}>{s.price} ₺</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 2: STAFF */}
          {step === 'staff' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: '#1e293b' }}>Personel Seçin</h2>
                <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Hizmet almak istediğiniz personeli seçin</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {staff.map(s => (
                  <div key={s.id} onClick={() => { setSelectedStaff(s); setStep('datetime'); }}
                    style={{
                      padding: '16px 20px', borderRadius: 14,
                      border: `2px solid ${selectedStaff?.id === s.id ? '#4f46e5' : '#e2e8f0'}`,
                      background: selectedStaff?.id === s.id ? 'linear-gradient(135deg,#eef2ff,#f8faff)' : 'white',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 16,
                      transition: 'all 0.25s',
                      boxShadow: selectedStaff?.id === s.id ? '0 4px 12px rgba(79,70,229,0.1)' : 'none',
                    }}
                    onMouseEnter={e => { if (selectedStaff?.id !== s.id) { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.background = '#f8faff'; } }}
                    onMouseLeave={e => { if (selectedStaff?.id !== s.id) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'white'; } }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: `linear-gradient(135deg,${s.color},${s.color}dd)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0,
                      boxShadow: `0 4px 12px ${s.color}40`,
                    }}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>{s.name}</div>
                      <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{s.title}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setStep('service')}
                style={{ marginTop: 16, background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontSize: 14, fontWeight: 500, padding: '8px 0' }}>
                <i className="fas fa-arrow-left" style={{ marginRight: 6 }}></i>Geri
              </button>
            </div>
          )}

          {/* STEP 3: DATE & TIME */}
          {step === 'datetime' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: '#1e293b' }}>Tarih & Saat</h2>
                <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Size uygun gün ve saati seçin</p>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Tarih</label>
                <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={today}
                  style={{
                    width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, boxSizing: 'border-box', color: '#1e293b', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = '#4f46e5'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>Saat</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }} className="time-slot-grid">
                  {timeSlots.map(t => (
                    <div key={t} onClick={() => setSelectedTime(t)}
                      style={{
                        padding: '10px 8px', borderRadius: 10,
                        border: `2px solid ${selectedTime === t ? '#4f46e5' : '#e2e8f0'}`,
                        background: selectedTime === t ? '#eef2ff' : 'white',
                        cursor: 'pointer', textAlign: 'center', fontSize: 13,
                        fontWeight: selectedTime === t ? 600 : 400, color: selectedTime === t ? '#4f46e5' : '#1e293b',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { if (selectedTime !== t) e.currentTarget.style.borderColor = '#a5b4fc'; }}
                      onMouseLeave={e => { if (selectedTime !== t) e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >{t}</div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setStep('staff')}
                  style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#475569' }}>
                  <i className="fas fa-arrow-left" style={{ marginRight: 6 }}></i>Geri
                </button>
                <button onClick={() => { if (selectedDate && selectedTime) setStep('info'); }}
                  disabled={!selectedDate || !selectedTime}
                  style={{
                    flex: 1, padding: '12px', borderRadius: 10, border: 'none',
                    background: selectedDate && selectedTime ? 'linear-gradient(135deg,#4f46e5,#4338ca)' : '#94a3b8',
                    color: 'white', fontSize: 14, fontWeight: 600,
                    cursor: selectedDate && selectedTime ? 'pointer' : 'not-allowed',
                    boxShadow: selectedDate && selectedTime ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
                  }}>Devam Et</button>
              </div>
            </div>
          )}

          {/* STEP 4: INFO */}
          {step === 'info' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 4px', color: '#1e293b' }}>Bilgileriniz</h2>
                <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Size ulaşabilmemiz için iletişim bilgilerinizi girin</p>
              </div>

              {error && (
                <div style={{
                  padding: '12px 16px', background: '#fef2f2', color: '#dc2626',
                  borderRadius: 12, fontSize: 13, marginBottom: 20,
                  border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <i className="fas fa-exclamation-circle"></i>{error}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Ad Soyad *</label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s',
                  }}
                  placeholder="Adınız ve soyadınız" required
                  onFocus={e => e.currentTarget.style.borderColor = '#4f46e5'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Telefon *</label>
                <input type="tel" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s',
                  }}
                  placeholder="+90 5XX XXX XX XX" required
                  onFocus={e => e.currentTarget.style.borderColor = '#4f46e5'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  <i className="fas fa-lock" style={{ marginRight: 6, color: '#4f46e5' }}></i>Şifre (Müşteri paneline giriş için)
                </label>
                <input type="password" value={customerPassword} onChange={e => setCustomerPassword(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s',
                  }}
                  placeholder="En az 6 karakter" minLength={6}
                  onFocus={e => e.currentTarget.style.borderColor = '#4f46e5'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Not (İsteğe bağlı)</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: 12,
                    fontSize: 14, boxSizing: 'border-box', minHeight: 80, resize: 'vertical', outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  placeholder="Eklemek istediğiniz bir not var mı?"
                  onFocus={e => e.currentTarget.style.borderColor = '#4f46e5'}
                  onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} />
              </div>

              {/* PROMO CODE */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  <i className="fas fa-tag" style={{ marginRight: 6, color: '#4f46e5' }}></i>Promo Kodunuz var mı?
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    style={{
                      flex: 1, padding: '12px 16px', border: `2px solid ${couponStatus.valid ? '#059669' : couponStatus.error ? '#dc2626' : '#e2e8f0'}`,
                      borderRadius: 12, fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}
                    placeholder="KODUNUZU GİRİN"
                    onFocus={e => { if (!couponStatus.valid && !couponStatus.error) e.currentTarget.style.borderColor = '#4f46e5'; }}
                    onBlur={e => { if (!couponStatus.valid && !couponStatus.error) e.currentTarget.style.borderColor = '#e2e8f0'; }} />
                  <button onClick={validateCoupon} disabled={!couponCode.trim() || couponStatus.loading}
                    style={{
                      padding: '12px 20px', borderRadius: 12, border: 'none',
                      background: couponStatus.valid ? '#059669' : '#4f46e5',
                      color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                      opacity: !couponCode.trim() || couponStatus.loading ? 0.6 : 1,
                      transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }}>
                    {couponStatus.loading ? <i className="fas fa-spinner fa-spin"></i> : couponStatus.valid ? 'Uygulandı' : 'Kullan'}
                  </button>
                </div>
                {couponStatus.error && (
                  <div style={{ marginTop: 6, fontSize: 12, color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="fas fa-exclamation-circle"></i>{couponStatus.error}
                  </div>
                )}
                {couponStatus.valid && (
                  <div style={{ marginTop: 6, fontSize: 12, color: '#059669', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <i className="fas fa-check-circle"></i>{couponStatus.discount} indirim kazanıldı!
                  </div>
                )}
              </div>

              {/* SUMMARY */}
              <div style={{
                padding: 20, background: 'linear-gradient(135deg,#f8faff,#eef2ff)',
                borderRadius: 14, marginBottom: 20, border: '1px solid #e0e7ff',
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#4f46e5', marginBottom: 12 }}>
                  <i className="fas fa-receipt" style={{ marginRight: 6 }}></i>Randevu Özeti
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Hizmet</span>
                    <strong style={{ color: '#1e293b' }}>{selectedService?.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Personel</span>
                    <strong style={{ color: '#1e293b' }}>{selectedStaff?.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Tarih</span>
                    <strong style={{ color: '#1e293b' }}>{selectedDate}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Saat</span>
                    <strong style={{ color: '#1e293b' }}>{selectedTime}</strong>
                  </div>
                  <div style={{ borderTop: '1px solid #c7d2fe', margin: '8px 0', paddingTop: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Tutar</span>
                      <strong style={{ color: '#1e293b' }}>{selectedService?.price} ₺</strong>
                    </div>
                    {getDiscountAmount() > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ color: '#059669' }}><i className="fas fa-tag" style={{ marginRight: 4 }}></i>İndirim</span>
                        <strong style={{ color: '#059669' }}>-{getDiscountAmount()} ₺</strong>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>Ödenecek Tutar</span>
                      <strong style={{ color: '#4f46e5', fontSize: 18 }}>{finalPrice} ₺</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setStep('datetime')}
                  style={{ padding: '12px 24px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#475569' }}>
                  <i className="fas fa-arrow-left" style={{ marginRight: 6 }}></i>Geri
                </button>
                <button onClick={handleSubmit} disabled={loading || !customerName || !customerPhone}
                  style={{
                    flex: 1, padding: '14px', borderRadius: 12, border: 'none',
                    background: loading || !customerName || !customerPhone ? '#94a3b8' : 'linear-gradient(135deg,#059669,#047857)',
                    color: 'white', fontSize: 15, fontWeight: 600,
                    cursor: loading || !customerName || !customerPhone ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    boxShadow: loading || !customerName || !customerPhone ? 'none' : '0 4px 16px rgba(5,150,105,0.25)',
                  }}>
                  {loading ? <><i className="fas fa-spinner fa-spin"></i> Randevu alınıyor...</> : <><i className="fas fa-check-circle"></i> Randevuyu Onayla</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ maxWidth: 640, margin: '40px auto', padding: '24px', borderTop: '1px solid #e2e8f0', textAlign: 'center', fontSize: 13, color: '#94a3b8' }}>
        &copy; 2026 BerberPanel &mdash; Profesyonel Berber Yönetim Sistemi
      </div>
    </div>
  );
}
