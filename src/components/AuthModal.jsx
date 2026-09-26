import React, { useState } from 'react';
import { api, setAuthToken, setUser } from '../api';
import {
  X,
  Phone,
  Lock,
  User,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot_step1' | 'forgot_step2'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setError('');
    setSuccessMsg('');
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.login(phone, password);
      const token = res.access || res.access_token;
      const u = res.user || {
        id: res.user_id || res.id,
        full_name: res.full_name,
        phone_number: res.phone_number || phone,
        email: res.email,
        linked_student_id: res.linked_student_id || null
      };
      setAuthToken(token);
      setUser(u);
      onAuthSuccess(u);
      onClose();
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول. يرجى التحقق من رقم الهاتف وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.register(phone, fullName, password, email);
      const token = res.access || res.access_token;
      const u = res.user || {
        id: res.user_id || res.id,
        full_name: res.full_name || fullName,
        phone_number: res.phone_number || phone,
        email: res.email || email,
        linked_student_id: res.linked_student_id || null
      };
      setAuthToken(token);
      setUser(u);
      onAuthSuccess(u);
      onClose();
    } catch (err) {
      setError(err.message || 'فشل إنشاء الحساب. تأكد من إدخال البيانات بشكل صحيح.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotStep1 = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.forgotPassword(phone || email);
      setSuccessMsg(res.message || 'تم إرسال رمز التحقق (OTP) إلى بريدك الإلكتروني بنجاح!');
      setMode('forgot_step2');
    } catch (err) {
      setError(err.message || 'لم يتم العثور على حساب مرتبط بهذا الرقم أو البريد.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.resetPassword(phone, otpCode, newPassword);
      setSuccessMsg(res.message || 'تم تعيين كلمة المرور الجديدة بنجاح! يمكنك الآن تسجيل الدخول.');
      setTimeout(() => {
        setMode('login');
        resetForm();
      }, 2000);
    } catch (err) {
      setError(err.message || 'رمز التحقق غير صحيح أو انتهت صلاحيته.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="card animate-fade" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        borderRadius: '24px',
        background: '#ffffff',
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '12px',
            boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)'
          }}>
            <Sparkles size={28} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
            {mode === 'login' && 'تسجيل الدخول'}
            {mode === 'register' && 'إنشاء حساب جديد'}
            {(mode === 'forgot_step1' || mode === 'forgot_step2') && 'استعادة كلمة المرور'}
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
            {mode === 'login' && 'مرحباً بك مجدداً في بوابة نتائج كلية الهندسة المعلوماتية'}
            {mode === 'register' && 'سجّل الآن لتصل إلى مسيرتك الأكاديمية والمطابقة الذكية'}
            {mode === 'forgot_step1' && 'أدخل رقم هاتفك أو بريدك المسجل لإرسال رمز OTP'}
            {mode === 'forgot_step2' && 'أدخل رمز التحقق المكون من 6 أرقام مع كلمة المرور الجديدة'}
          </p>
        </div>

        {/* Switch Mode Tabs (Only for login / register) */}
        {(mode === 'login' || mode === 'register') && (
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => { setMode('login'); resetForm(); }}
              style={{
                flex: 1,
                padding: '9px',
                border: 'none',
                borderRadius: '9px',
                fontWeight: 700,
                fontSize: '13.5px',
                fontFamily: 'var(--font-arabic)',
                cursor: 'pointer',
                background: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? '#4f46e5' : '#64748b',
                boxShadow: mode === 'login' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => { setMode('register'); resetForm(); }}
              style={{
                flex: 1,
                padding: '9px',
                border: 'none',
                borderRadius: '9px',
                fontWeight: 700,
                fontSize: '13.5px',
                fontFamily: 'var(--font-arabic)',
                cursor: 'pointer',
                background: mode === 'register' ? '#ffffff' : 'transparent',
                color: mode === 'register' ? '#4f46e5' : '#64748b',
                boxShadow: mode === 'register' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              حساب جديد
            </button>
          </div>
        )}

        {/* Notifications */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '12.5px',
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#047857',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '12.5px',
            marginBottom: '16px'
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                رقم الهاتف (مثل: 0912345678)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="09xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: '40px' }}
                />
                <Phone size={17} style={{ position: 'absolute', top: '13px', right: '14px', color: '#94a3b8' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                كلمة المرور
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: '40px' }}
                />
                <Lock size={17} style={{ position: 'absolute', top: '13px', right: '14px', color: '#94a3b8' }} />
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <button
                type="button"
                onClick={() => { setMode('forgot_step1'); resetForm(); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4f46e5',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-arabic)'
                }}
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '6px', padding: '12px' }}
            >
              {loading ? <Loader2 size={18} className="spin" /> : 'دخول إلى البوابة'}
            </button>
          </form>
        )}

        {/* 2. Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                الاسم الثلاثي للطالب (كما في السجلات الجامعية)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="محمد أحمد علي"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: '40px' }}
                />
                <User size={17} style={{ position: 'absolute', top: '13px', right: '14px', color: '#94a3b8' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                رقم الهاتف
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="09xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: '40px' }}
                />
                <Phone size={17} style={{ position: 'absolute', top: '13px', right: '14px', color: '#94a3b8' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                البريد الإلكتروني (لتلقي إشعارات واستعادة الحساب)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: '40px' }}
                />
                <Mail size={17} style={{ position: 'absolute', top: '13px', right: '14px', color: '#94a3b8' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                كلمة المرور
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: '40px' }}
                />
                <Lock size={17} style={{ position: 'absolute', top: '13px', right: '14px', color: '#94a3b8' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '8px', padding: '12px' }}
            >
              {loading ? <Loader2 size={18} className="spin" /> : 'إنشاء الحساب والمطابقة الذكية'}
            </button>
          </form>
        )}

        {/* 3. Forgot Password Step 1 */}
        {mode === 'forgot_step1' && (
          <form onSubmit={handleForgotStep1} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                رقم الهاتف أو البريد الإلكتروني
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="09xxxxxxxx أو your@gmail.com"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: '40px' }}
                />
                <Phone size={17} style={{ position: 'absolute', top: '13px', right: '14px', color: '#94a3b8' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              {loading ? <Loader2 size={18} className="spin" /> : 'إرسال رمز التحقق OTP'}
            </button>

            <button
              type="button"
              onClick={() => { setMode('login'); resetForm(); }}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-arabic)'
              }}
            >
              العودة لتسجيل الدخول
            </button>
          </form>
        )}

        {/* 4. Forgot Password Step 2 (Enter OTP + New Password) */}
        {mode === 'forgot_step2' && (
          <form onSubmit={handleForgotStep2} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                رمز التحقق (OTP) المرسل إلى بريدك (6 أرقام)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: '40px', letterSpacing: '4px', textAlign: 'center', fontSize: '18px', fontWeight: 800 }}
                />
                <KeyRound size={17} style={{ position: 'absolute', top: '13px', right: '14px', color: '#94a3b8' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                كلمة المرور الجديدة
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: '40px' }}
                />
                <Lock size={17} style={{ position: 'absolute', top: '13px', right: '14px', color: '#94a3b8' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              {loading ? <Loader2 size={18} className="spin" /> : 'تحديث كلمة المرور والدخول'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
