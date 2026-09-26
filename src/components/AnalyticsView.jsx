import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertTriangle,
  CheckCircle,
  FileDown,
  Search,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  Info,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export default function AnalyticsView({
  selectedStudentId,
  user,
  showToast
}) {
  const initialId = typeof selectedStudentId === 'object'
    ? (selectedStudentId?.id || selectedStudentId?.name || '')
    : (selectedStudentId || (user && (user.linked_student_id || user.full_name)) || '');

  const initialName = typeof selectedStudentId === 'object'
    ? (selectedStudentId?.name || '')
    : (user?.full_name || '');

  const [studentInput, setStudentInput] = useState(initialId);
  const [studentNameFilter, setStudentNameFilter] = useState(initialName);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('years'); // 'years' | 'passed' | 'carried' | 'annual'

  useEffect(() => {
    let targetId = '';
    let targetName = '';

    if (typeof selectedStudentId === 'object' && selectedStudentId) {
      targetId = selectedStudentId.id || selectedStudentId.name || '';
      targetName = selectedStudentId.name || '';
    } else if (selectedStudentId) {
      targetId = selectedStudentId;
    } else if (user) {
      targetId = user.linked_student_id || user.full_name || '';
      targetName = user.full_name || '';
    } else {
      targetId = '';
    }

    setStudentInput(targetId);
    setStudentNameFilter(targetName);
    loadAnalytics(targetId, targetName);
  }, [selectedStudentId, user]);

  const loadAnalytics = async (id, name = '') => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await api.analytics.getStudentSummary(id, name);
      setData(res);
    } catch (err) {
      showToast(err.message || 'تعذر جلب تحليلات الطالب', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (studentInput.trim()) {
      loadAnalytics(studentInput.trim(), studentInput.trim());
    }
  };

  const openCareerPdf = () => {
    if (data && data.student_university_id) {
      window.open(api.reports.getCareerPdfUrl(data.student_university_id, data.student_name), '_blank');
    }
  };

  const openMarkPdf = (markId) => {
    if (markId) {
      window.open(api.reports.getMarkPdfUrl(markId), '_blank');
    }
  };

  const passedList = data ? (data.passed_courses || []) : [];
  const carriedList = data ? (data.carried_courses || []) : [];
  const graceList = data ? (data.grace_marks_eligible || []) : [];
  const linkedIds = data ? (data.all_student_ids || [data.student_university_id]) : [];
  const yearsSummary = data ? (data.years_summary || []) : [];

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header & Student Switcher */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
            مسيرتي الأكاديمية والتحليلات المتقدمة
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
            كشف العلامات المفصل حسب السنوات، المعدل التراكمي العام، ومحرك قانون علامات المساعدة الجامعية السورية
          </p>
        </div>

        {/* Student Lookup Input */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', width: '100%', maxWidth: '520px' }}>
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
            <input
              type="text"
              placeholder="اسم الطالب (ثنائي/ثلاثي) أو رقم الجلوس..."
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              className="input-field"
              style={{ width: '100%', paddingRight: '36px', height: '42px' }}
            />
            <Search size={16} style={{ position: 'absolute', top: '13px', right: '12px', color: '#94a3b8' }} />
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px', height: '42px', flexShrink: 0 }}>
            تحليل
          </button>
          {data && (
            <button
              type="button"
              onClick={openCareerPdf}
              className="btn"
              style={{
                background: '#e0e7ff',
                color: '#4338ca',
                padding: '10px 18px',
                height: '42px',
                fontWeight: 700,
                flexShrink: 0
              }}
            >
              <FileDown size={16} />
              <span>كشف PDF</span>
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: '#4f46e5' }}>
          <Loader2 size={32} className="spin" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '14.5px', fontWeight: 700 }}>جارٍ احتساب المعدلات وسنوات الدراسة وتطبيق قوانين الترفع...</div>
        </div>
      ) : data ? (
        <>
          {/* Student Profile Card */}
          <div className="card" style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: 800,
                boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)'
              }}>
                {data.student_name ? data.student_name[0] : 'S'}
              </div>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a' }}>
                  {data.student_name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-purple" style={{ fontSize: '11.5px', fontWeight: 700 }}>
                    {linkedIds.length > 1
                      ? `أرقام الجلوس لجميع السنوات: ${linkedIds.join(' | ')}`
                      : `الرقم الجامعي: ${data.student_university_id}`}
                  </span>
                  <span className="badge badge-blue" style={{ fontSize: '11.5px', fontWeight: 700 }}>
                    إجمالي المواد: {data.total_courses_count} مادة دراسية
                  </span>
                  <span className="badge badge-green" style={{ fontSize: '11.5px', fontWeight: 700 }}>
                    ناجح في {data.passed_courses_count} مادة
                  </span>
                  {data.carried_courses_count > 0 ? (
                    <span className="badge badge-red" style={{ fontSize: '11.5px', fontWeight: 700 }}>
                      متبقي {data.carried_courses_count} مواد ({graceList.length} مشمولة بالمساعدة)
                    </span>
                  ) : (
                    <span className="badge badge-green" style={{ fontSize: '11.5px', fontWeight: 700 }}>
                      ناجح في جميع المواد
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* GPA Large Meter */}
            <div style={{
              background: '#ffffff',
              padding: '16px 28px',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
              minWidth: '190px'
            }}>
              <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 700 }}>المعدل التراكمي العام (GPA)</div>
              <div style={{
                fontSize: '36px',
                fontWeight: 900,
                color: data.cumulative_gpa >= 60 ? '#4338ca' : '#dc2626',
                letterSpacing: '-1px',
                margin: '2px 0'
              }}>
                {data.cumulative_gpa}%
              </div>
              <div style={{ fontSize: '12px', color: data.cumulative_gpa >= 60 ? '#059669' : '#dc2626', fontWeight: 800 }}>
                {data.cumulative_gpa >= 80 ? 'ممتاز مع مرتبة الشرف' : data.cumulative_gpa >= 70 ? 'جيد جداً مرتفع' : data.cumulative_gpa >= 60 ? 'جيد' : 'بحاجة لتحسين'}
              </div>
            </div>
          </div>

          {/* SYRIAN UNIVERSITY GRACE MARKS ENGINE CARD */}
          <div className="card" style={{
            padding: '24px 26px',
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #fef9c3 100%)',
            border: '2px solid #fde68a',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', maxWidth: '800px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: '#d97706',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 6px 14px rgba(217, 119, 6, 0.3)'
                }}>
                  <Sparkles size={24} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#78350f' }}>
                      محرك تقييم علامات المساعدة الجامعية السورية (قانون الترفع)
                    </h3>
                    <span className="badge badge-amber" style={{ fontSize: '11px', fontWeight: 800 }}>مرسوم تنظيم الجامعات السورية</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#92400e', lineHeight: 1.6 }}>
                    وفقاً للائحة التنفيذية لقانون تنظيم الجامعات في الجمهورية العربية السورية: يُمنح الطالب في نهاية الفصل الدراسي الثاني علامات مساعدة بحد أقصى درجتين (علامتان لمادة واحدة حاصل فيها على 58 أو 59 لنقلها إلى 60 وتعتبر ناجحة، أو علامة واحدة لكل مادة إذا كان حاملاً لمادتين حاصل في كل منهما على 59) بشرط أن تؤدي المساعدة إلى نقله للسنة التالية أو تخرجه.
                  </p>
                </div>
              </div>

              <div style={{
                background: '#ffffff',
                padding: '14px 22px',
                borderRadius: '16px',
                border: '1px solid #fde68a',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ fontSize: '11.5px', color: '#78350f', fontWeight: 700 }}>حالة المساعدة التقديرية</div>
                <div style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  marginTop: '4px',
                  color: graceList.length > 0 ? '#b45309' : '#059669'
                }}>
                  {graceList.length > 0 ? `مؤهل لـ ${graceList.length} مواد مساعدة للترفع` : 'لا يحتاج مساعدة حالياً'}
                </div>
              </div>
            </div>

            {/* Grace eligible courses list */}
            {graceList.length > 0 && (
              <div style={{ marginTop: '20px', background: '#ffffff', borderRadius: '16px', padding: '16px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#78350f', marginBottom: '10px' }}>
                  المواد المشمولة بمساعدة الترفع المحتملة:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {graceList.map((ec, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: '#fefce8',
                        borderRadius: '12px',
                        border: '1px solid #fef08a',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="badge badge-amber" style={{ fontWeight: 800 }}>
                          [مرفعة مساعدة]
                        </span>
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{ec.course_name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '13.5px', color: '#b91c1c', fontWeight: 800 }}>
                          العلامة الحالية: {ec.current_mark}
                        </span>
                        <span style={{ fontSize: '13.5px', color: '#059669', fontWeight: 800, background: '#dcfce7', padding: '4px 10px', borderRadius: '8px' }}>
                          تحتاج: +{ec.required_grace_marks} لتصبح 60 (ناجح)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>أعلى علامة محققة</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#059669', margin: '6px 0' }}>
                {data.highest_mark_overall !== undefined ? `${data.highest_mark_overall}%` : '-'}
              </div>
              <div style={{ fontSize: '13px', color: '#334155', fontWeight: 800 }}>
                {data.highest_mark_course || 'غير متوفر'}
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>أدنى علامة</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#dc2626', margin: '6px 0' }}>
                {data.lowest_mark_overall !== undefined ? `${data.lowest_mark_overall}%` : '-'}
              </div>
              <div style={{ fontSize: '13px', color: '#334155', fontWeight: 800 }}>
                {data.lowest_mark_course || 'غير متوفر'}
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>المواد المنجزة بنجاح</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#059669', margin: '6px 0' }}>
                {data.passed_courses_count}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                مادة ناجحة من أصل {data.total_courses_count}
              </div>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>المواد المتبقية (الحمل)</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: data.carried_courses_count > 0 ? '#b91c1c' : '#059669', margin: '6px 0' }}>
                {data.carried_courses_count}
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                {graceList.length > 0 ? `${graceList.length} منها مؤهلة للمساعدة` : 'لا توجد مواد متبقية'}
              </div>
            </div>
          </div>

          
          {/* Progress Chart Across Years */}
          {yearsSummary.length > 0 && (
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <TrendingUp size={22} color="#4338ca" />
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                    مخطط التطور الأكاديمي ومعدل كل سنة دراسية (Progress Chart)
                  </h3>
                </div>
                <span className="badge badge-purple" style={{ fontSize: '12px', fontWeight: 800 }}>
                  المعدل التراكمي العام: {data.cumulative_gpa}%
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${yearsSummary.length}, 1fr)`,
                gap: '16px',
                alignItems: 'flex-end',
                height: '240px',
                padding: '20px 10px 10px',
                background: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                marginTop: '10px'
              }}>
                {yearsSummary.map((yr, idx) => {
                  const heightPercent = Math.max(15, Math.min(100, yr.annual_gpa || 0));
                  const isPassing = yr.annual_gpa >= 60;
                  return (
                    <div key={idx} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-end',
                      gap: '8px'
                    }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: 900,
                        color: isPassing ? '#312e81' : '#b91c1c',
                        background: '#ffffff',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        boxShadow: 'var(--shadow-sm)',
                        border: '1px solid #cbd5e1'
                      }}>
                        {yr.annual_gpa}%
                      </div>

                      <div style={{
                        width: '60%',
                        maxWidth: '54px',
                        height: `${heightPercent * 1.5}px`,
                        background: isPassing
                          ? 'linear-gradient(180deg, #4f46e5 0%, #3730a3 100%)'
                          : 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)',
                        borderRadius: '10px 10px 4px 4px',
                        boxShadow: '0 4px 10px rgba(79, 70, 229, 0.2)',
                        transition: 'height 0.4s ease'
                      }} />

                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>
                        {yr.year_name}
                      </div>

                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                        {yr.passed_count} ناجح {yr.carried_count > 0 ? `| ${yr.carried_count} حمل` : '✓'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section Navigation Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveSubTab('years')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 16px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                borderRadius: '10px',
                color: activeSubTab === 'years' ? '#4338ca' : '#64748b',
                borderBottom: activeSubTab === 'years' ? '3px solid #4338ca' : 'none'
              }}
            >
              كشف السنوات الأكاديمية (سنة بسنة)
            </button>
            <button
              onClick={() => setActiveSubTab('passed')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 16px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                borderRadius: '10px',
                color: activeSubTab === 'passed' ? '#059669' : '#64748b',
                borderBottom: activeSubTab === 'passed' ? '3px solid #059669' : 'none'
              }}
            >
              المواد الناجحة ({passedList.length})
            </button>
            <button
              onClick={() => setActiveSubTab('carried')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 16px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                borderRadius: '10px',
                color: activeSubTab === 'carried' ? '#b91c1c' : '#64748b',
                borderBottom: activeSubTab === 'carried' ? '3px solid #b91c1c' : 'none'
              }}
            >
              المواد المتبقية ومساعدات الترفع ({carriedList.length})
            </button>
            <button
              onClick={() => setActiveSubTab('annual')}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 16px',
                fontSize: '15px',
                fontWeight: 800,
                cursor: 'pointer',
                borderRadius: '10px',
                color: activeSubTab === 'annual' ? '#0891b2' : '#64748b',
                borderBottom: activeSubTab === 'annual' ? '3px solid #0891b2' : 'none'
              }}
            >
              معدلات السنوات الدراسية
            </button>
          </div>

          {/* TAB 0: YEAR-BY-YEAR TRANSCRIPT CARDS */}
          {activeSubTab === 'years' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {yearsSummary.map((yr) => (
                <div
                  key={yr.year_id}
                  className="card"
                  style={{ padding: '0', overflow: 'hidden' }}
                >
                  {/* Year Header */}
                  <div style={{
                    padding: '16px 24px',
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderBottom: '1px solid #cbd5e1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: '#4338ca',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                          {yr.year_name}
                        </h4>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          رقم الجلوس: <strong style={{ color: '#4338ca' }}>{yr.seat_numbers && yr.seat_numbers.length > 0 ? yr.seat_numbers.join(' | ') : yr.seat_number}</strong>
                          {' • '}إجمالي المواد: {yr.total_courses} مادة
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge badge-green" style={{ fontSize: '12px', fontWeight: 800 }}>
                        ناجح في {yr.passed_count} مواد
                      </span>
                      {yr.carried_count > 0 && (
                        <span className="badge badge-red" style={{ fontSize: '12px', fontWeight: 800 }}>
                          متبقي {yr.carried_count} مواد
                        </span>
                      )}
                      <div style={{
                        background: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        fontSize: '14px',
                        fontWeight: 900,
                        color: yr.annual_gpa >= 60 ? '#4338ca' : '#dc2626'
                      }}>
                        معدل السنة: {yr.annual_gpa}%
                      </div>
                    </div>
                  </div>

                  
                  {/* Year High/Low Highlights Bar */}
                  <div style={{
                    padding: '12px 24px',
                    background: '#f8fafc',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-green" style={{ fontSize: '11px', fontWeight: 800 }}>
                        🏆 أعلى مادة بالسنة:
                      </span>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#065f46' }}>
                        {yr.highest_course || 'غير متوفر'} ({yr.highest_mark}%)
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-amber" style={{ fontSize: '11px', fontWeight: 800 }}>
                        📉 أدنى مادة بالسنة:
                      </span>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#991b1b' }}>
                        {yr.lowest_course || 'غير متوفر'} ({yr.lowest_mark}%)
                      </span>
                    </div>
                  </div>

                  {/* Passed Courses in this Year */}
                  {yr.passed_courses && yr.passed_courses.length > 0 && (
                    <div style={{ padding: '16px 24px' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#059669', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={16} />
                        <span>المواد الناجحة في {yr.year_name} ({yr.passed_courses.length})</span>
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table className="table" style={{ width: '100%', textAlign: 'right' }}>
                          <thead>
                            <tr>
                              <th>المادة الدراسية</th>
                              <th>العلامة النهائية</th>
                              <th>عدد المحاولات</th>
                              <th>الدورة الامتحانية</th>
                              <th>الحالة</th>
                              <th>كشف العلامة</th>
                            </tr>
                          </thead>
                          <tbody>
                            {yr.passed_courses.map((p, idx) => (
                              <tr key={idx}>
                                <td style={{ fontWeight: 800, color: '#0f172a' }}>{p.course_name}</td>
                                <td>
                                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#059669' }}>
                                    {p.final_score}%
                                  </span>
                                </td>
                                <td>
                                  <span className="badge badge-green" style={{ fontSize: '11px', fontWeight: 700 }}>
                                    {p.attempts_count === 1 ? 'من المحاولة الأولى' : `${p.attempts_count} محاولات`}
                                  </span>
                                </td>
                                <td style={{ color: '#64748b', fontSize: '12px' }}>{p.session_title || '-'}</td>
                                <td>
                                  <span className="badge badge-green" style={{ fontWeight: 800 }}>ناجح</span>
                                </td>
                                <td>
                                  {p.mark_id ? (
                                    <button
                                      onClick={() => openMarkPdf(p.mark_id)}
                                      className="btn"
                                      style={{ padding: '4px 8px', fontSize: '11px', background: '#f1f5f9', color: '#334155' }}
                                    >
                                      PDF
                                    </button>
                                  ) : '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Carried Courses in this Year */}
                  {yr.carried_courses && yr.carried_courses.length > 0 && (
                    <div style={{ padding: '16px 24px', background: '#fef2f2', borderTop: '1px solid #fee2e2' }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#b91c1c', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <XCircle size={16} />
                        <span>المواد الراسبة والمتبقية في {yr.year_name} ({yr.carried_courses.length})</span>
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table className="table" style={{ width: '100%', textAlign: 'right' }}>
                          <thead>
                            <tr>
                              <th>المادة الدراسية</th>
                              <th>آخر علامة</th>
                              <th>عدد المحاولات</th>
                              <th>الدورة الامتحانية</th>
                              <th>حالة المادة ومساعدة الترفع</th>
                            </tr>
                          </thead>
                          <tbody>
                            {yr.carried_courses.map((c, idx) => (
                              <tr key={idx}>
                                <td style={{ fontWeight: 800, color: '#0f172a' }}>{c.course_name}</td>
                                <td>
                                  <span style={{ fontSize: '16px', fontWeight: 900, color: c.is_grace_eligible ? '#b45309' : '#dc2626' }}>
                                    {c.last_score}%
                                  </span>
                                </td>
                                <td>
                                  <span className="badge badge-purple" style={{ fontSize: '11px' }}>
                                    {c.attempts_count} محاولات
                                  </span>
                                </td>
                                <td style={{ color: '#64748b', fontSize: '12px' }}>{c.session_title || '-'}</td>
                                <td>
                                  {c.is_grace_eligible ? (
                                    <span className="badge badge-amber" style={{ fontWeight: 800 }}>
                                      [مرفعة مساعدة] تحتاج +{c.required_grace_marks} للترفع
                                    </span>
                                  ) : (
                                    <span className="badge badge-red" style={{ fontWeight: 800 }}>
                                      مادة متبقية (تحتاج إعادة تقديم)
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          )}

          {/* TAB 1: PASSED COURSES TABLE WITH ATTEMPT COUNTS */}
          {activeSubTab === 'passed' && (
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                    سجل المواد الناجحة وعدد مرات التقديم
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                    جميع المواد التي اجتازها الطالب بنجاح عبر مسيرته الجامعية مع توثيق عدد المحاولات والعلامة النهائية
                  </p>
                </div>
                <span className="badge badge-green" style={{ fontSize: '12px', fontWeight: 800 }}>
                  {passedList.length} مادة ناجحة
                </span>
              </div>

              <div style={{ overflowX: 'auto', padding: '12px 24px 24px' }}>
                <table className="table" style={{ width: '100%', textAlign: 'right' }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>المادة الدراسية</th>
                      <th>العلامة النهائية</th>
                      <th>عدد مرات التقديم (المحاولات)</th>
                      <th>الدورة والسنة الأكاديمية</th>
                      <th>الحالة</th>
                      <th>كشف العلامة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passedList.map((pc, idx) => {
                      const attempts = pc.attempts_count || 1;
                      return (
                        <tr key={idx}>
                          <td style={{ color: '#94a3b8', fontSize: '13px' }}>{idx + 1}</td>
                          <td style={{ fontWeight: 800, color: '#0f172a', fontSize: '14.5px' }}>
                            {pc.course_name}
                          </td>
                          <td>
                            <span style={{
                              fontSize: '16px',
                              fontWeight: 900,
                              color: pc.final_score >= 80 ? '#059669' : pc.final_score >= 70 ? '#2563eb' : '#4338ca'
                            }}>
                              {pc.final_score}%
                            </span>
                          </td>
                          <td>
                            {attempts === 1 ? (
                              <span className="badge badge-green" style={{ fontWeight: 800, fontSize: '11.5px' }}>
                                من المحاولة الأولى
                              </span>
                            ) : attempts === 2 ? (
                              <span className="badge badge-blue" style={{ fontWeight: 800, fontSize: '11.5px' }}>
                                محاولتان (2)
                              </span>
                            ) : (
                              <span className="badge badge-amber" style={{ fontWeight: 800, fontSize: '11.5px' }}>
                                {attempts} محاولات
                              </span>
                            )}
                          </td>
                          <td style={{ fontSize: '12.5px', color: '#475569' }}>
                            <div>{pc.session_title || '-'}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{pc.academic_year || ''}</div>
                          </td>
                          <td>
                            <span className="badge badge-green" style={{ fontWeight: 800 }}>
                              ناجح
                            </span>
                          </td>
                          <td>
                            {pc.mark_id ? (
                              <button
                                onClick={() => openMarkPdf(pc.mark_id)}
                                className="btn"
                                style={{
                                  padding: '5px 10px',
                                  fontSize: '11.5px',
                                  background: '#f1f5f9',
                                  color: '#334155',
                                  fontWeight: 700
                                }}
                              >
                                <FileDown size={13} />
                                <span>PDF</span>
                              </button>
                            ) : '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: CARRIED COURSES & GRACE ELIGIBILITY */}
          {activeSubTab === 'carried' && (
            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', background: '#fef2f2', borderBottom: '1px solid #fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#991b1b' }}>
                    المواد المتبقية ومواد مساعدة الترفع المحتملة
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#b91c1c', marginTop: '2px' }}>
                    المواد التي تتطلب إعادة تقديم أو المشمولة بمساعدة الترفع الجامعية السورية
                  </p>
                </div>
                <span className="badge badge-red" style={{ fontSize: '12px', fontWeight: 800 }}>
                  {carriedList.length} مواد متبقية
                </span>
              </div>

              {carriedList.length > 0 ? (
                <div style={{ overflowX: 'auto', padding: '12px 24px 24px' }}>
                  <table className="table" style={{ width: '100%', textAlign: 'right' }}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>المادة الدراسية</th>
                        <th>آخر علامة محققة</th>
                        <th>عدد المحاولات</th>
                        <th>الدورة الأكاديمية</th>
                        <th>حالة المادة ومساعدة الترفع</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carriedList.map((cc, idx) => {
                        const isGrace = cc.is_grace_eligible;
                        return (
                          <tr key={idx} style={{ background: isGrace ? '#fffbeb' : 'transparent' }}>
                            <td style={{ color: '#94a3b8', fontSize: '13px' }}>{idx + 1}</td>
                            <td style={{ fontWeight: 800, color: '#0f172a', fontSize: '14.5px' }}>
                              {cc.course_name}
                            </td>
                            <td>
                              <span style={{
                                fontSize: '16px',
                                fontWeight: 900,
                                color: isGrace ? '#b45309' : '#dc2626'
                              }}>
                                {cc.last_score}%
                              </span>
                            </td>
                            <td>
                              <span className="badge badge-purple" style={{ fontSize: '11.5px', fontWeight: 700 }}>
                                {cc.attempts_count} {cc.attempts_count === 1 ? 'محاولة واحدة' : 'محاولات'}
                              </span>
                            </td>
                            <td style={{ fontSize: '12.5px', color: '#475569' }}>
                              <div>{cc.session_title || '-'}</div>
                              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{cc.academic_year || ''}</div>
                            </td>
                            <td>
                              {isGrace ? (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                  <span className="badge badge-amber" style={{ fontWeight: 800 }}>
                                    [مرفعة مساعدة]
                                  </span>
                                  <span style={{ fontSize: '12px', color: '#059669', fontWeight: 800 }}>
                                    تحتاج +{cc.required_grace_marks} علامة للترفع
                                  </span>
                                </div>
                              ) : (
                                <span className="badge badge-red" style={{ fontWeight: 800 }}>
                                  مادة متبقية (تحتاج إعادة تقديم)
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#059669', fontWeight: 800 }}>
                  🎉 مبروك! لا توجد أي مواد متبقية للطالب. جميع المواد مجتازة بنجاح.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ANNUAL GPAs */}
          {activeSubTab === 'annual' && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                المعدل السنوي ومعدل كل سنة دراسية
              </h3>
              {data.annual_gpas && Object.keys(data.annual_gpas).length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {Object.entries(data.annual_gpas).map(([yearName, avgScore]) => (
                    <div
                      key={yearName}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '18px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#64748b' }}>{yearName}</div>
                      <div style={{
                        fontSize: '28px',
                        fontWeight: 900,
                        color: avgScore >= 60 ? '#4338ca' : '#dc2626',
                        margin: '8px 0'
                      }}>
                        {avgScore}%
                      </div>
                      <div style={{ fontSize: '12px', color: avgScore >= 60 ? '#059669' : '#dc2626', fontWeight: 800 }}>
                        {avgScore >= 60 ? 'ناجح' : 'حمل مواد'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#64748b' }}>لا تتوفر تفاصيل سنوية كافية</div>
              )}
            </div>
          )}

        </>
      ) : (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          أدخل اسم الطالب أو رقمه الجامعي للبدء في تحليل النتائج ومحاكاة قوانين الترفع
        </div>
      )}

    </div>
  );
}
