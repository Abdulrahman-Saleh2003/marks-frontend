import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../api';
import {
  Sparkles,
  Search,
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Check,
  UserCheck,
  GraduationCap,
  Trophy,
  RefreshCw,
  BarChart3,
  ShieldCheck,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function HomeView({
  user,
  onOpenAuth,
  setActiveTab,
  onSelectStudent,
  onUserUpdate,
  showToast
}) {
  const [matches, setMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [claiming, setClaiming] = useState(null);

  useEffect(() => {
    if (user && !user.linked_student_id) {
      loadMatches();
    }
  }, [user]);

  const loadMatches = async () => {
    setLoadingMatches(true);
    try {
      const res = await api.students.smartMatch();
      const list = res.candidates || res.matches || [];
      setMatches(list);
    } catch (err) {
      console.error('Failed to load smart matches:', err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleClaim = async (studentId, studentName) => {
    setClaiming(studentId);
    try {
      const res = await api.students.claimIdentity(studentId);
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast('🎉 تهانينا! تم ربط حسابك الرسمي بنجاح وتوثيق هويتك الجامعية', 'success');
      const updatedUser = { ...user, linked_student_id: studentId };
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }
      if (onSelectStudent) {
        onSelectStudent({ id: studentId, name: studentName });
      }
    } catch (err) {
      showToast(err.message || 'تعذر ربط السجل الجامعي', 'error');
    } finally {
      setClaiming(null);
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
      
      {/* Hero Banner */}
      <section style={{
        position: 'relative',
        borderRadius: '28px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        color: '#ffffff',
        padding: '52px 40px',
        boxShadow: '0 20px 35px -10px rgba(67, 56, 202, 0.35)',
      }}>
        {/* Glow circles */}
        <div style={{
          position: 'absolute',
          top: '-40%',
          right: '-10%',
          width: '450px',
          height: '450px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '840px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            padding: '6px 16px',
            borderRadius: '100px',
            fontSize: '13px',
            fontWeight: 700,
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <Sparkles size={16} color="#fbbf24" />
            <span>المنظومة الأكاديمية الذكية الموحدة | كلية الهندسة المعلوماتية</span>
          </div>

          <h1 style={{
            fontSize: '36px',
            fontWeight: 800,
            lineHeight: 1.3,
            marginBottom: '16px',
            letterSpacing: '-0.5px'
          }}>
            استكشف علاماتك الجامعية، مسيرتك الأكاديمية، وفرص الترفع بمساعدة النظام الذكي
          </h1>

          <p style={{
            fontSize: '16px',
            color: '#c7d2fe',
            lineHeight: 1.7,
            marginBottom: '32px',
            maxWidth: '680px'
          }}>
            أكثر من 470,000 سجل امتحاني موثق ومفهرس بدقة من أول دورة امتحانية. ابحث عن أي طالب أو مادة، واكتشف حسابات المعدل التراكمي وتطبيق قانون علامات المساعدة الجامعية السورية تلقائياً.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('search')}
              className="btn"
              style={{
                background: '#ffffff',
                color: '#312e81',
                padding: '12px 24px',
                fontSize: '14.5px',
                fontWeight: 800,
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
              }}
            >
              <Search size={18} />
              <span>البحث في العلامات والمواد</span>
            </button>

            <button
              onClick={() => setActiveTab('leaderboards')}
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '12px 22px',
                fontSize: '14.5px',
                fontWeight: 700,
                backdropFilter: 'blur(8px)'
              }}
            >
              <Trophy size={18} color="#fbbf24" />
              <span>لوحة الشرف والأوائل</span>
            </button>

            {!user && (
              <button
                onClick={onOpenAuth}
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  padding: '12px 22px',
                  fontSize: '14.5px',
                  fontWeight: 700,
                  boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'
                }}
              >
                <UserCheck size={18} />
                <span>سجّل حسابك واربط هويتك</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Live University Metrics Counters */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px'
      }}>
        <div className="card stat-card">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: '#e0e7ff',
            color: '#4338ca',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Award size={24} />
          </div>
          <div>
            <div className="stat-value">470,094+</div>
            <div className="stat-label">علامة امتحانية موثقة</div>
          </div>
        </div>

        <div className="card stat-card">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: '#dcfce7',
            color: '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div className="stat-value">73+ مادة</div>
            <div className="stat-label">تخصصية لكافة السنوات</div>
          </div>
        </div>

        <div className="card stat-card">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: '#fef3c7',
            color: '#b45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <div className="stat-value">1,821+ دورة</div>
            <div className="stat-label">فصل أول، ثانٍ وتكميلي</div>
          </div>
        </div>

        <div className="card stat-card">
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: '#f3e8ff',
            color: '#7e22ce',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={24} />
          </div>
          <div>
            <div className="stat-value">100% تلقائي</div>
            <div className="stat-label">مطابقة ذكية للأسماء</div>
          </div>
        </div>
      </section>

      {/* Smart Match Identity Claim Section */}
      {user && (
        <section className="card" style={{ padding: '28px', border: '2px solid #e0e7ff', background: '#faf5ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e1b4b' }}>
                  {user.linked_student_id ? 'هويتك الجامعية الموثقة' : 'نظام المطابقة الذكية للهوية الجامعية'}
                </h3>
                <p style={{ fontSize: '12.5px', color: '#6b7280' }}>
                  {user.linked_student_id
                    ? `حسابك مربوط رسمياً بالسجل الجامعي رقم (${user.linked_student_id})`
                    : `بحث ذكي مطابق لاسمك المسجل (${user.full_name}) عبر خوارزميات التشابه العربي`}
                </p>
              </div>
            </div>

            {user.linked_student_id && (
              <button
                onClick={() => {
                  onSelectStudent({ id: user.linked_student_id, name: user.full_name });
                  setActiveTab('analytics');
                }}
                className="btn btn-primary"
                style={{ padding: '9px 18px', fontSize: '13px' }}
              >
                <BarChart3 size={16} />
                <span>عرض تحليلات مسيرتي الأكاديمية</span>
              </button>
            )}
          </div>

          {!user.linked_student_id && (
            <div>
              {loadingMatches ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#6366f1' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>جارٍ البحث عن السجلات الجامعية المطابقة لاسمك...</div>
                </div>
              ) : matches.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                  {matches.map((m) => (
                    <div
                      key={m.student_university_id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '16px',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span className="badge badge-purple" style={{ fontSize: '11px' }}>
                            نسبة التطابق {m.similarity_score || m.similarity || 100}%
                          </span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
                            الرقم الجامعي: {m.student_university_id}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                          {m.student_name}
                        </h4>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          {m.all_student_ids && m.all_student_ids.length > 1
                            ? `الأرقام الجامعية: ${m.all_student_ids.join(' | ')}`
                            : `الرقم الامتحاني: ${m.student_university_id}`}
                        </div>
                        <div style={{ fontSize: '12px', color: '#4338ca', fontWeight: 700, marginTop: '2px' }}>
                          إجمالي الدورات المسجلة: {m.records_count || m.marks_count || 0} دورة
                        </div>
                      </div>

                      <button
                        onClick={() => handleClaim(m.student_university_id, m.student_name)}
                        disabled={claiming === m.student_university_id}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '9px', fontSize: '13px' }}
                      >
                        {claiming === m.student_university_id ? (
                          'جارٍ التوثيق...'
                        ) : (
                          <>
                            <Check size={16} />
                            <span>تأكيد هذا السجل كحسابي الرسمي</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  background: '#ffffff',
                  padding: '28px 20px',
                  borderRadius: '16px',
                  textAlign: 'center',
                  border: '1px dashed #cbd5e1'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#f1f5f9',
                    color: '#64748b',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '10px'
                  }}>
                    <UserCheck size={22} />
                  </div>
                  <h4 style={{ fontSize: '15.5px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                    أهلاً بك يا {user.full_name} في البوابة!
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '580px', margin: '0 auto 14px', lineHeight: 1.6 }}>
                    لم يتم العثور على سجل امتحاني مطابق لاسمك في السجلات الجامعية المتوفرة حالياً. يمكنك استخدام كافة ميزات البوابة واستكشاف المواد والدفعات، وسيتم ربط سجلك تلقائياً فور رفع درجاتك الجديدة عبر المزامنة.
                  </p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="btn btn-primary"
                    style={{ padding: '8px 18px', fontSize: '12.5px' }}
                  >
                    <Search size={15} />
                    <span>البحث والاستكشاف اليدوي</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Quick Navigation Cards */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        <div
          onClick={() => setActiveTab('search')}
          className="card"
          style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.25s', display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#e0e7ff',
            color: '#4338ca',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Search size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              محرك البحث والاستكشاف
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              تصفح نتائج الطلاب، وقارن درجات النظري والعملي، وقم بتنزيل إشعارات العلامات بصيغة PDF معتمدة.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4f46e5', fontWeight: 700, fontSize: '13px', marginTop: 'auto' }}>
            <span>استكشف النتائج الآن</span>
            <ArrowLeft size={16} />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('analytics')}
          className="card"
          style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.25s', display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#fef3c7',
            color: '#b45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart3 size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              المعدل وعلامات المساعدة
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              حساب المعدل التراكمي العام ومحاكاة تطبيق قانون علامات المساعدة الجامعية (درجتي الـ 58 والـ 59).
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: 700, fontSize: '13px', marginTop: 'auto' }}>
            <span>حساب درجات المساعدة</span>
            <ArrowLeft size={16} />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('leaderboards')}
          className="card"
          style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.25s', display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#fdf2f8',
            color: '#db2777',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Trophy size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              لوحة الشرف وتصنيف الدفعات
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              قوائم الـ 30 الأوائل على مستوى الدفعة والاختصاصات (برمجيات، شبكات، ذكاء) وأعلى الدرجات في المواد.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#db2777', fontWeight: 700, fontSize: '13px', marginTop: 'auto' }}>
            <span>عرض المتصدرين</span>
            <ArrowLeft size={16} />
          </div>
        </div>

        <div
          onClick={() => setActiveTab('sync')}
          className="card"
          style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.25s', display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: '#e0f2fe',
            color: '#0284c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <RefreshCw size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              المزامنة المباشرة مع درايف
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>
              مزامنة دورية وتحديث فوري للمواد الجديدة المرفوعة على مجلد Google Drive الرسمي لكلية الهندسة.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', fontWeight: 700, fontSize: '13px', marginTop: 'auto' }}>
            <span>مراقبة المزامنة</span>
            <ArrowLeft size={16} />
          </div>
        </div>
      </section>

    </div>
  );
}
