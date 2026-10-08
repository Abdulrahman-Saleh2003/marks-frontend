import React, { useState } from 'react';
import { api, setAuthToken, setUser } from '../api';
import {
  Phone,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  ArrowRight,
  KeyRound,
  GraduationCap
} from 'lucide-react';

/**
 * Sanitizes phone input:
 * - Converts Arabic-Indic numerals (٠-٩) to standard digits (0-9)
 * - Strips any non-digit character (allows optional leading '+')
 * - Strips whitespace, hyphens, and weird symbols
 */
export const sanitizePhoneNumber = (raw) => {
  if (!raw) return '';
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let cleaned = '';
  for (let ch of String(raw)) {
    const idx = arabicDigits.indexOf(ch);
    if (idx !== -1) {
      cleaned += String(idx);
    } else if (/\d/.test(ch) || (ch === '+' && cleaned.length === 0)) {
      cleaned += ch;
    }
  }
  return cleaned;
};

/**
 * Validates phone number:
 * - Syrian mobile: 09xxxxxxxx (10 digits) or +9639xxxxxxxx or 009639xxxxxxxx
 * - Valid standard international mobile: 9 to 15 digits
 */
export const validatePhoneNumber = (phone) => {
  const cleaned = sanitizePhoneNumber(phone);
  if (!cleaned) return { isValid: false, message: 'يرجى إدخال رقم الهاتف.' };

  // Syrian mobile check
  const syrianMatch = /^(?:\+963|00963|963)?(0?9\d{8})$/.test(cleaned);
  if (syrianMatch) return { isValid: true, cleaned };

  // International format check
  const intlMatch = /^\+?[1-9]\d{8,14}$/.test(cleaned);
  if (intlMatch) return { isValid: true, cleaned };

  return {
    isValid: false,
    message: 'رقم الهاتف غير صالح. يرجى إدخال رقم محمول صحيح (مثال: 0938135338).'
  };
};

/**
 * Sanitizes name: only Arabic & Latin letters and spaces.
 */
export const sanitizeFullName = (raw) => {
  if (!raw) return '';
  return String(raw).replace(/[^\u0600-\u06FFa-zA-Z\s]/g, '');
};

/**
 * Validates name: at least 2 words and 4 characters.
 */
export const validateFullName = (name) => {
  const trimmed = name.trim();
  if (trimmed.length < 4) {
    return { isValid: false, message: 'يرجى إدخال الاسم كاملاً (الاسم والكنية على الأقل).' };
  }
  const words = trimmed.split(/\s+/).filter(w => w.length >= 2);
  if (words.length < 2) {
    return { isValid: false, message: 'يرجى إدخال الاسم والكنية على الأقل (مثال: أحمد المحمد).' };
  }
  return { isValid: true, cleaned: trimmed };
};

export default function AuthGate({ onAuthSuccess, showToast }) {
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

  // Login handler
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
      if (showToast) {
        showToast(`مرحباً بعودتك د./م. ${u.full_name}!`, 'success');
      }
      onAuthSuccess(u);
    } catch (err) {
      setError(err.message || 'فشل تسجيل الدخول. يرجى التأكد من رقم الهاتف وكلمة المرور.');
    } finally {
      setLoading(false);
    }
  };

  // Register handler
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

  // Forgot password step 1 (request OTP)
  const handleForgotStep1 = async (e) => {
    e.preventDefault();
    resetMessages();

    const phoneValidation = validatePhoneNumber(phone);
    if (!phoneValidation.isValid) {
      setError(phoneValidation.message);
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.forgotPassword(phoneValidation.cleaned);
      setSuccessMsg(res.message || 'تم إرسال رمز التحقق OTP بنجاح!');
      setMode('forgot_step2');
    } catch (err) {
      setError(err.message || 'لم نتمكن من العثور على حساب مرتبط بهذا الرقم.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot password step 2 (verify OTP & reset)
  const handleForgotStep2 = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('يرجى إدخال رمز التحقق (OTP) المكون من 6 أرقام.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('يجب ألا تقل كلمة المرور الجديدة عن 6 محارف.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.auth.resetPassword(phone.trim(), otpCode.trim(), newPassword);
      setSuccessMsg(res.message || 'تم تحديث كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.');
      setPassword(newPassword);
      setMode('login');
    } catch (err) {
      setError(err.message || 'رمز التحقق غير صحيح أو منتهي الصلاحية.');
    } finally {
      setLoading(false);
    }
  };

  const isSyrianPhoneValid = phone.startsWith('09') && phone.length === 10;

  return (
    <div style={{
      minHeight: '75vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.02)',
        padding: '36px 32px',
        position: 'relative'
      }}>

        {/* University Crest & Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '74px',
            height: '74px',
            margin: '0 auto 16px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 25px -5px rgba(49, 46, 129, 0.35)',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}>
            <img
              src="/damascus_univ_logo.png"
              alt="شعار جامعة دمشق"
              style={{ width: '56px', height: '56px', objectFit: 'contain' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#eef2ff',
            color: '#4338ca',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            <GraduationCap size={15} />
            <span>جامعة دمشق • كلية الهندسة المعلوماتية</span>
          </div>

          <h2 style={{
            fontSize: '22px',
            fontWeight: 900,
            color: '#0f172a',
            margin: '0 0 6px 0',
            letterSpacing: '-0.3px'
          }}>
            بوابة النتائج والمحاضرات
          </h2>
          <p style={{
            fontSize: '13px',
            color: '#64748b',
            margin: 0,
            lineHeight: 1.5
          }}>
            {mode === 'register'
              ? 'أنشئ حسابك برقم الهاتف للاطلاع على كافة كشوفاتك'
              : mode === 'login'
              ? 'سجّل دخولك برقم هاتفك المعتمد للمتابعة'
              : 'استعادة كلمة مرور الحساب عبر رمز التحقق'}
          </p>
        </div>

        {/* Tab Switcher (Only in login or register mode) */}
        {(mode === 'login' || mode === 'register') && (
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '14px',
            marginBottom: '24px'
          }}>
            <button
              type="button"
              onClick={() => { setMode('login'); resetMessages(); }}
              style={{
                flex: 1,
                padding: '10px 14px',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '13.5px',
                fontFamily: 'var(--font-arabic)',
                cursor: 'pointer',
                background: mode === 'login' ? '#ffffff' : 'transparent',
                color: mode === 'login' ? '#4338ca' : '#64748b',
                boxShadow: mode === 'login' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Lock size={15} />
              <span>تسجيل الدخول</span>
            </button>

            <button
              type="button"
              onClick={() => { setMode('register'); resetMessages(); }}
              style={{
                flex: 1,
                padding: '10px 14px',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '13.5px',
                fontFamily: 'var(--font-arabic)',
                cursor: 'pointer',
                background: mode === 'register' ? '#ffffff' : 'transparent',
                color: mode === 'register' ? '#4338ca' : '#64748b',
                boxShadow: mode === 'register' ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <User size={15} />
              <span>حساب جديد</span>
            </button>
          </div>
        )}

        {/* Alerts / Error Messages */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '18px',
            lineHeight: 1.4
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
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '18px',
            lineHeight: 1.4
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ================= MODE: LOGIN ================= */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Phone Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>
                  رقم الهاتف المحمول *
                </label>
                <span style={{ fontSize: '11px', color: '#64748b', direction: 'ltr' }}>
                  {phone.length}/10 {isSyrianPhoneValid && '✓'}
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
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
                    padding: '12px 42px 12px 14px',
                    borderRadius: '12px',
                    border: `1.5px solid ${isSyrianPhoneValid ? '#10b981' : '#cbd5e1'}`,
                    fontSize: '15px',
                    fontWeight: 700,
                    textAlign: 'right',
                    outline: 'none',
                    letterSpacing: '0.5px',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                  onBlur={(e) => e.target.style.borderColor = isSyrianPhoneValid ? '#10b981' : '#cbd5e1'}
                />
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                أدخل أرقام الهاتف فقط (مثال: 0938135338)
              </span>
            </div>

            {/* Password Field */}
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
                    fontWeight: 800,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  نسيت كلمة المرور؟
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '6px',
                background: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
                color: '#ffffff',
                padding: '13px 20px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 900,
                fontFamily: 'var(--font-arabic)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(67, 56, 202, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>جارٍ تسجيل الدخول...</span>
                </>
              ) : (
                <>
                  <Lock size={17} />
                  <span>تسجيل الدخول للمنظومة</span>
                </>
              )}
            </button>

            {/* Switch to Register */}
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', color: '#64748b' }}>
              ليس لديك حساب بعد؟{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); resetMessages(); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4338ca',
                  fontWeight: 900,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '13px'
                }}
              >
                إنشاء حساب جديد
              </button>
            </div>
          </form>
        )}

        {/* ================= MODE: REGISTER ================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Full Name Field */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                الاسم الكامل (الاسم والكنية أو الثلاثي) *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={handleNameChange}
                  placeholder="مثال: أحمد المحمد"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    fontFamily: 'var(--font-arabic)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                  onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                />
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                أحرف فقط بدون أرقام أو رموز
              </span>
            </div>

            {/* Phone Field */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>
                  رقم الهاتف المحمول (معرّف الدخول) *
                </label>
                <span style={{ fontSize: '11px', color: '#64748b', direction: 'ltr' }}>
                  {phone.length}/10 {isSyrianPhoneValid && '✓'}
                </span>
              </div>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
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
                    padding: '12px 42px 12px 14px',
                    borderRadius: '12px',
                    border: `1.5px solid ${isSyrianPhoneValid ? '#10b981' : '#cbd5e1'}`,
                    fontSize: '15px',
                    fontWeight: 700,
                    textAlign: 'right',
                    outline: 'none',
                    letterSpacing: '0.5px',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                  onBlur={(e) => e.target.style.borderColor = isSyrianPhoneValid ? '#10b981' : '#cbd5e1'}
                />
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block', marginTop: '4px' }}>
                10 أرقام تبدأ بـ 09 (سيكون هو اسم المستخدم لدخولك)
              </span>
            </div>

            {/* Passwords in 2 columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  كلمة المرور *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 36px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      left: '8px',
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

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                  تأكيد الكلمة *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••"
                    style={{
                      width: '100%',
                      padding: '11px 12px 11px 36px',
                      borderRadius: '12px',
                      border: `1.5px solid ${confirmPassword && confirmPassword === password ? '#10b981' : '#cbd5e1'}`,
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4338ca'}
                    onBlur={(e) => e.target.style.borderColor = confirmPassword && confirmPassword === password ? '#10b981' : '#cbd5e1'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      left: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: '8px',
                background: 'linear-gradient(135deg, #4338ca 0%, #3730a3 100%)',
                color: '#ffffff',
                padding: '13px 20px',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 900,
                fontFamily: 'var(--font-arabic)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(67, 56, 202, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>جارٍ إنشاء الحساب والدخول...</span>
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  <span>إنشاء الحساب والدخول</span>
                </>
              )}
            </button>

            {/* Switch to Login */}
            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '13px', color: '#64748b' }}>
              لديك حساب بالفعل؟{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); resetMessages(); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4338ca',
                  fontWeight: 900,
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '13px'
                }}
              >
                تسجيل الدخول
              </button>
            </div>
          </form>
        )}

        {/* ================= MODE: FORGOT STEP 1 ================= */}
        {mode === 'forgot_step1' && (
          <form onSubmit={handleForgotStep1} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              أدخل رقم هاتفك المسجل وسنرسل رمز تحقق (OTP) لاستعادة حسابك وتعيين كلمة مرور جديدة.
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
                  onChange={handlePhoneChange}
                  placeholder="0938135338"
                  maxLength={15}
                  dir="ltr"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    fontWeight: 700,
                    textAlign: 'right',
                    outline: 'none',
                    boxSizing: 'border-box'
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
                background: '#4338ca',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '14px',
                fontFamily: 'var(--font-arabic)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>جارٍ إرسال الرمز...</span>
                </>
              ) : (
                <>
                  <KeyRound size={16} />
                  <span>إرسال رمز التحقق OTP</span>
                </>
              )}
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

        {/* ================= MODE: FORGOT STEP 2 ================= */}
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
                  onChange={(e) => setOtpCode(sanitizePhoneNumber(e.target.value))}
                  placeholder="123456"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '17px',
                    letterSpacing: '4px',
                    fontWeight: 900,
                    textAlign: 'center',
                    outline: 'none',
                    boxSizing: 'border-box'
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
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 42px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
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
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'جارٍ الحفظ...' : 'تأكيد وحفظ كلمة المرور'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
