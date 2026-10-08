import React, { useState } from 'react';
import { api, setAuthToken, setUser } from '../api';
import {
  X,
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  KeyRound,
  GraduationCap
} from 'lucide-react';
import {
  sanitizePhoneNumber,
  validatePhoneNumber,
  sanitizeFullName,
  validateFullName
} from './AuthGate';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot_step1' | 'forgot_step2'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (!isOpen) return null;

  const resetMessages = () => {
    setError('');
    setSuccessMsg('');
  };

  const handlePhoneChange = (e) => {
    const sanitized = sanitizePhoneNumber(e.target.value);
    setPhone(sanitized);
    if (error) setError('');
  };

  const handleNameChange = (e) => {
    const sanitized = sanitizeFullName(e.target.value);
    setFullName(sanitized);
    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetMessages();

    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.message);
      return;
    }

    if (!password) {
      setError('يرجى إدخال كلمة المرور.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.login(phoneValidation.cleaned, password);
      const token = res.access || res.access_token;
      const u = res.user || {
        id: res.user_id || res.id,
        full_name: res.full_name,
        phone_number: res.phone_number || phoneValidation.cleaned,
        email: res.email,
        linked_student_id: res.linked_student_id || null
      };

      setAuthToken(token);
      setUser(u);
      onAuthSuccess(u);
      onClose();
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول. يرجى التأكد من رقم الهاتف وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    resetMessages();

    const nameValidation = validateFullName(fullName);
    if (!nameValidation.isValid) {
      setError(nameValidation.message);
      return;
    }

    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.message);
      return;
    }

    if (!password || password.length < 6) {
      setError('يجب ألا تقل كلمة المرور عن 6 محارف.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.register(
        phoneValidation.cleaned,
        nameValidation.cleaned,
        password,
        null
      );
      const token = res.access || res.access_token;
      const u = res.user || {
        id: res.user_id || res.id,
        full_name: res.full_name || nameValidation.cleaned,
        phone_number: res.phone_number || phoneValidation.cleaned,
        email: res.email || null,
        linked_student_id: res.linked_student_id || null
      };

      setAuthToken(token);
      setUser(u);
      onAuthSuccess(u);
      onClose();
    } catch (err) {
      setError(err.message || 'فشل إنشاء الحساب. تأكد من أن رقم الهاتف غير مسجل مسبقاً.');
    } finally {
      setLoading(false);
    }
  };

  const isSyrianPhoneValid = phone.startsWith('09') && phone.length === 10;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '430px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '32px 28px',
        position: 'relative'
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
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748b',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={17} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#eef2ff',
            color: '#4338ca',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: 800,
            marginBottom: '6px'
          }}>
            <GraduationCap size={14} />
            <span>جامعة دمشق • كلية الهندسة المعلوماتية</span>
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>
            {mode === 'register' ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </h3>
          <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
            {mode === 'register' ? 'أدخل اسمك ورقم هاتفك لإنشاء الحساب' : 'أدخل رقم هاتفك وكلمة المرور'}
          </p>
        </div>

        {/* Tabs */}
        {(mode === 'login' || mode === 'register') && (
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => { setMode('login'); resetMessages(); }}
              style={{
                flex: 1,
                padding: '9px',
                border: 'none',
                borderRadius: '9px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                background: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? '#4338ca' : '#64748b',
                boxShadow: mode === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              تسجيل الدخول
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); resetMessages(); }}
              style={{
                flex: 1,
                padding: '9px',
                border: 'none',
                borderRadius: '9px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                background: mode === 'register' ? '#ffffff' : 'transparent',
                color: mode === 'register' ? '#4338ca' : '#64748b',
                boxShadow: mode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              حساب جديد
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '10px 12px',
            borderRadius: '10px',
            fontSize: '12.5px',
            fontWeight: 700,
            marginBottom: '16px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
                رقم الهاتف المحمول *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={17} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="0938135338"
                  maxLength={15}
                  dir="ltr"
                  style={{
                    width: '100%',
                    padding: '11px 38px 11px 12px',
                    borderRadius: '10px',
                    border: `1.5px solid ${isSyrianPhoneValid ? '#10b981' : '#cbd5e1'}`,
                    fontSize: '14px',
                    fontWeight: 700,
                    textAlign: 'right',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
                كلمة المرور *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={17} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '11px 38px 11px 38px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '4px',
                background: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={15} />}
              <span>{loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}</span>
            </button>
          </form>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
                الاسم الكامل (الاسم والكنية) *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={17} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={handleNameChange}
                  placeholder="مثال: أحمد المحمد"
                  style={{
                    width: '100%',
                    padding: '11px 38px 11px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
                رقم الهاتف المحمول *
              </label>
              <div style={{ position: 'relative' }}>
                <Phone size={17} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="0938135338"
                  maxLength={15}
                  dir="ltr"
                  style={{
                    width: '100%',
                    padding: '11px 38px 11px 12px',
                    borderRadius: '10px',
                    border: `1.5px solid ${isSyrianPhoneValid ? '#10b981' : '#cbd5e1'}`,
                    fontSize: '14px',
                    fontWeight: 700,
                    textAlign: 'right',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
                  كلمة المرور *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 800, color: '#334155', marginBottom: '5px' }}>
                  تأكيد الكلمة *
                </label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: `1.5px solid ${confirmPassword && confirmPassword === password ? '#10b981' : '#cbd5e1'}`,
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '4px',
                background: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 800,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={15} />}
              <span>{loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب والدخول'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
