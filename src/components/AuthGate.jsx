import React, { useState } from 'react';
import { api, setAuthToken, setUser } from '../api';
import {
  User,
  Phone,
  Lock,
  Mail,
  KeyRound,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Award,
  FileText,
  BarChart2,
  GraduationCap
} from 'lucide-react';

export default function AuthGate({ onAuthSuccess, showToast }) {
  const [mode, setMode] = useState('register'); // 'register' | 'login' | 'forgot_step1' | 'forgot_step2'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const resetMessages = () => {
    setError('');
    setSuccessMsg('');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!fullName.trim()) {
      setError('يرجى إدخال اسمك الكامل (الثلاثي أو الرباعي المعتمد).');
      return;
    }
    if (!phone.trim()) {
      setError('يرجى إدخال رقم هاتفك.');
      return;
    }
    if (!password) {
      setError('يرجى تعيين كلمة مرور للحساب.');
      return;
    }
    if (password.length < 6) {
      setError('يجب ألا تقل كلمة المرور عن 6 محارف.');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.register(phone.trim(), fullName.trim(), password, email.trim());
      const token = res.access || res.access_token;
      const u = res.user || {
        id: res.user_id || res.id,
        full_name: res.full_name || fullName.trim(),
        phone_number: res.phone_number || phone.trim(),
        email: res.email || email.trim(),
        linked_student_id: res.linked_student_id || null
      };

      setAuthToken(token);
      setUser(u);
      if (showToast) {
        showToast(`أهلاً بك يا ${u.full_name}! تم إنشاء حسابك بنجاح.`, 'success');
      }
      onAuthSuccess(u);
    } catch (err) {
      setError(err.message || 'فشل إنشاء الحساب. تأكد من أن رقم الهاتف غير مسجل مسبقاً.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!phone.trim() || !password) {
      setError('يرجى إدخال رقم الهاتف وكلمة المرور.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.login(phone.trim(), password);
      const token = res.access || res.access_token;
      const u = res.user || {
        id: res.user_id || res.id,
        full_name: res.full_name,
        phone_number: res.phone_number || phone.trim(),
        email: res.email,
        linked_student_id: res.linked_student_id || null
      };

      setAuthToken(token);
      setUser(u);
      if (showToast) {
        showToast(`مرحباً بعودتك يا ${u.full_name}!`, 'success');
      }
      onAuthSuccess(u);
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول. يرجى التحقق من صحة رقم الهاتف وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotStep1 = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!phone.trim()) {
      setError('يرجى إدخال رقم الهاتف المسجل لاستعادة كلمة المرور.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.forgotPassword(phone.trim());
      setSuccessMsg(res.message || 'تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح!');
      setMode('forgot_step2');
    } catch (err) {
      setError(err.message || 'لم نتمكن من العثور على حساب مرتبط بهذا الرقم.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!otpCode.trim() || !newPassword) {
      setError('يرجى إدخال رمز التحقق وكلمة المرور الجديدة.');
      return;
    }
    if (newPassword.length < 6) {
      setError('كلمة المرور الجديدة يجب ألا تقل عن 6 محارف.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.resetPassword(phone.trim(), otpCode.trim(), newPassword);
      setSuccessMsg(res.message || 'تمت إعادة تعيين كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.');
      setPassword('');
      setOtpCode('');
      setMode('login');
    } catch (err) {
      setError(err.message || 'فشل التحقق من الرمز أو انتهت صلاحيته.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1060px',
      margin: '20px auto 40px auto',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      {/* Top Banner Notice */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%)',
        color: '#ffffff',
        borderRadius: '24px',
        padding: '36px 32px',
        boxShadow: '0 20px 40px -15px rgba(30, 27, 75, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '22px', flex: 1, minWidth: '300px' }}>
          <div style={{
            width: '84px',
            height: '84px',
            borderRadius: '20px',
            background: '#ffffff',
            padding: '8px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <img
              src="/damascus_univ_logo.png"
              alt="شعار جامعة دمشق"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.18)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.3px'
              }}>
                جامعة دمشق • كلية الهندسة المعلوماتية
              </span>
              <span style={{
                background: '#f59e0b',
                color: '#78350f',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 900
              }}>
                التسجيل إلزامي
              </span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, lineHeight: 1.3, margin: '0 0 6px 0' }}>
              بوابة العلامات والنتائج الأكاديمية الرسمية
            </h1>
            <p style={{ fontSize: '13.5px', color: '#c7d2fe', margin: 0, lineHeight: 1.5, maxWidth: '640px' }}>
              يرجى تسجيل حساب جديد برقم هاتفك واسمك الكامل للمتابعة واستعراض كافة النتائج، البحث، ومسيرتك الجامعية.
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '8px',
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '14px 20px',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '11.5px', color: '#e0e7ff', fontWeight: 600 }}>إحصائيات المنظومة</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#facc15' }}>470,094 علامة مؤرشفة</div>
          <div style={{ fontSize: '11.5px', color: '#cbd5e1' }}>5 سنوات دراسية • 3 اختصاصات</div>
        </div>
      </div>

      {/* Main Grid: Form Card & Features */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Form Card */}
        <div style={{
          background: '#ffffff',
          borderRadius: '22px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 12px 30px -10px rgba(0, 0, 0, 0.08)',
          padding: '32px',
          position: 'relative'
        }}>
          {/* Tabs Switcher */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '5px',
            borderRadius: '14px',
            marginBottom: '26px'
          }}>
            <button
              type="button"
              onClick={() => { setMode('register'); resetMessages(); }}
              style={{
                flex: 1,
                padding: '11px',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '14px',
                fontFamily: 'var(--font-arabic)',
                cursor: 'pointer',
                background: mode === 'register' ? '#ffffff' : 'transparent',
                color: mode === 'register' ? '#4338ca' : '#64748b',
                boxShadow: mode === 'register' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <User size={16} />
              <span>إنشاء حساب جديد</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode('login'); resetMessages(); }}
              style={{
                flex: 1,
                padding: '11px',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '14px',
                fontFamily: 'var(--font-arabic)',
                cursor: 'pointer',
                background: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? '#4338ca' : '#64748b',
                boxShadow: mode === 'login' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Lock size={16} />
              <span>تسجيل الدخول</span>
            </button>
          </div>

          {/* Feedback messages */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '20px'
            }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* MODE: REGISTER */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  الاسم الكامل (الثلاثي أو الرباعي المعتمد) *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: محمد أحمد علي"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      fontFamily: 'var(--font-arabic)',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  رقم الهاتف (سيكون هو اسم المستخدم للدخول لاحقاً) *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0938135338"
                    dir="ltr"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      fontFamily: 'var(--font-latin)',
                      fontWeight: 600,
                      textAlign: 'right',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    كلمة المرور *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="******"
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                      onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    تأكيد كلمة المرور *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="******"
                      style={{
                        width: '100%',
                        padding: '12px 42px 12px 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                      onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  البريد الإلكتروني (اختياري - لاستعادة الحساب)
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@damasuniv.edu"
                    dir="ltr"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '10px',
                  background: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
                  color: '#ffffff',
                  padding: '14px 24px',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontWeight: 900,
                  fontFamily: 'var(--font-arabic)',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 20px rgba(67, 56, 202, 0.35)',
                  transition: 'all 0.2s'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>جارٍ إنشاء الحساب وتجهيز البوابة...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>إنشاء الحساب ومتابعة الاستخدام</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  رقم الهاتف المسجل *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0938135338"
                    dir="ltr"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      fontFamily: 'var(--font-latin)',
                      fontWeight: 600,
                      textAlign: 'right',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>
                    كلمة المرور *
                  </label>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot_step1'); resetMessages(); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4f46e5',
                      fontSize: '12px',
                      fontWeight: 700,
                      fontFamily: 'var(--font-arabic)',
                      cursor: 'pointer'
                    }}
                  >
                    نسيت كلمة المرور؟
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="******"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '10px',
                  background: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
                  color: '#ffffff',
                  padding: '14px 24px',
                  borderRadius: '14px',
                  fontSize: '15px',
                  fontWeight: 900,
                  fontFamily: 'var(--font-arabic)',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 20px rgba(67, 56, 202, 0.35)',
                  transition: 'all 0.2s'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>جارٍ تسجيل الدخول...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    <span>تسجيل الدخول للمنظومة</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODE: FORGOT STEP 1 */}
          {mode === 'forgot_step1' && (
            <form onSubmit={handleForgotStep1} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '13.5px', color: '#64748b' }}>
                أدخل رقم هاتفك المسجل وسنقوم بإرسال رمز تحقق OTP إلى بريدك الإلكتروني لإعادة تعيين كلمة المرور.
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  رقم الهاتف المسجل *
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0938135338"
                    dir="ltr"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      textAlign: 'right',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#4338ca',
                  color: '#ffffff',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'جارٍ الإرسال...' : 'إرسال رمز التحقق OTP'}
              </button>
              <button
                type="button"
                onClick={() => { setMode('login'); resetMessages(); }}
                style={{
                  background: 'transparent',
                  color: '#64748b',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                العودة لتسجيل الدخول
              </button>
            </form>
          )}

          {/* MODE: FORGOT STEP 2 */}
          {mode === 'forgot_step2' && (
            <form onSubmit={handleForgotStep2} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  رمز التحقق (OTP) المكون من 6 أرقام *
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '16px',
                      letterSpacing: '4px',
                      fontWeight: 800,
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  كلمة المرور الجديدة *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="******"
                    style={{
                      width: '100%',
                      padding: '12px 42px 12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {loading ? 'جارٍ الحفظ...' : 'تأكيد وحفظ كلمة المرور'}
              </button>
            </form>
          )}
        </div>

        {/* Features / Benefits Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '22px',
            border: '1px solid #e2e8f0',
            padding: '24px',
            boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={20} color="#4338ca" />
              <span>لماذا يُشترط تسجيل الحساب؟</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4338ca', flexShrink: 0 }}>
                  <GraduationCap size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>مسيرتك الجامعية ومطابقة رقمك</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>حفظ هويتك واستعراض سجلك الأكاديمي الشامل بدقة فورية.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d', flexShrink: 0 }}>
                  <BarChart2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>محرك علامات المساعدة الوزارية</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>حساب استحقاق علامات المساعدة الجامعية وقواعد الترفيع بدقة متطورة.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309', flexShrink: 0 }}>
                  <Award size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>لوحة الشرف وفرسان المواد</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>ترتيب أوائل الكلية للسنوات الخمس والاختصاصات الثلاثة للعام الجديد.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', flexShrink: 0 }}>
                  <FileText size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>كشف علامات رسمي PDF موثق</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>تصدير كشف العلامات الكامل بشعار جامعة دمشق المعتمد والمخططات البيانية.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Designer Card */}
          <div style={{
            background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
            border: '1px solid #e9d5ff',
            borderRadius: '20px',
            padding: '18px 20px',
            textAlign: 'center',
            fontSize: '12.5px',
            color: '#6b21a8'
          }}>
            <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '4px' }}>
              بوابة كلية الهندسة المعلوماتية - جامعة دمشق
            </div>
            <div style={{ color: '#581c87', fontWeight: 800 }}>
              تم تصميم وتطوير المنظومة بواسطة المهندس عبدالرحمن قاسم صالح 0938135338
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
