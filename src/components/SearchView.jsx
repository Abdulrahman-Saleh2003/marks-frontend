import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  Search,
  Filter,
  FileDown,
  ChevronDown,
  ChevronUp,
  User,
  BookOpen,
  Calendar,
  CheckCircle2,
  XCircle,
  BarChart3,
  Loader2,
  GraduationCap,
  Sparkles,
  Award,
  Layers,
  Clock,
  TrendingUp,
  ArrowRight,
  Check,
  Flame,
  AlertCircle
} from 'lucide-react';

export default function SearchView({ onSelectStudent, setActiveTab, showToast }) {
  const [query, setQuery] = useState('');
  const [courseQuery, setCourseQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Keep search bar clean and ready for user query
  }, []);

  const handleSearch = async (e, forcedQuery = null) => {
    if (e) e.preventDefault();
    const q = forcedQuery !== null ? forcedQuery : query;
    setLoading(true);
    setHasSearched(true);
    try {
      const params = {};
      if (q.trim()) params.query = q.trim();
      if (courseQuery.trim()) params.course = courseQuery.trim();
      if (yearFilter) params.year = yearFilter;

      const res = await api.search.searchStudents(params);
      const list = Array.isArray(res) ? res : (res.results || []);
      setStudents(list);

      if (list.length > 0) {
        setSelectedStudent(list[0]);
      } else {
        setSelectedStudent(null);
      }
    } catch (err) {
      showToast(err.message || 'حدث خطأ أثناء البحث', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openPdf = (studentId, studentName) => {
    const url = api.reports.getCareerPdfUrl(studentId, studentName);
    window.open(url, '_blank');
  };

  const currentStudent = selectedStudent;
  const yearsSummary = currentStudent ? (currentStudent.years_summary || []) : [];
  const progressChart = currentStudent ? (currentStudent.progress_chart || []) : [];

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Search Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
          البحث الأكاديمي الشامل واستعراض الملف الدراسي
        </h2>
        <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
          ابحث بالاسم الثنائي أو الثلاثي أو رقم الجلوس، واختر الطالب لعرض سجله الأكاديمي، معدلات السنوات، أعلى وأدنى المقررات، والمخطط البياني
        </p>
      </div>

      {/* Search Filter Form */}
      <form onSubmit={(e) => handleSearch(e)} className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              اسم الطالب (ثنائي أو ثلاثي) أو رقم الجلوس
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="ابحث بالاسم الكامل أو رقم الجلوس الجامعي..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-field"
                style={{ paddingRight: '38px' }}
              />
              <Search size={16} style={{ position: 'absolute', top: '13px', right: '12px', color: '#94a3b8' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              المادة الدراسية (اختياري)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="مثال: مشروع، الذكاء الصنعي، البرمجة..."
                value={courseQuery}
                onChange={(e) => setCourseQuery(e.target.value)}
                className="input-field"
                style={{ paddingRight: '38px' }}
              />
              <BookOpen size={16} style={{ position: 'absolute', top: '13px', right: '12px', color: '#94a3b8' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              السنة الدراسية
            </label>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="input-field"
              style={{ cursor: 'pointer' }}
            >
              <option value="">كافة السنوات</option>
              <option value="السنة الأولى">السنة الأولى</option>
              <option value="السنة الثانية">السنة الثانية</option>
              <option value="السنة الثالثة">السنة الثالثة</option>
              <option value="السنة الرابعة">السنة الرابعة</option>
              <option value="السنة الخامسة">السنة الخامسة</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '11px 20px', height: '46px' }}
            >
              {loading ? <Loader2 size={18} className="spin" /> : <Search size={18} />}
              <span>بحث في السجلات</span>
            </button>
          </div>

        </div>
      </form>

      {/* Matching Students Bar (Selector) */}
      {students.length > 1 && (
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>
            نتائج البحث المطابقة ({students.length} أشخاص): انقر على اسم الطالب لعرض ملفه الأكاديمي
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px'
          }}>
            {students.map((st) => {
              const isSelected = selectedStudent && (
                selectedStudent.student_university_id === st.student_university_id ||
                selectedStudent.student_name === st.student_name
              );
              return (
                <div
                  key={st.student_university_id}
                  onClick={() => setSelectedStudent(st)}
                  className="card"
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    border: isSelected ? '2px solid #4338ca' : '1px solid #e2e8f0',
                    background: isSelected ? '#eef2ff' : '#ffffff',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(67, 56, 202, 0.12)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: isSelected ? '#4338ca' : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800
                    }}>
                      {st.student_name ? st.student_name[0] : 'S'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>
                        {st.student_name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                        رقم: {st.student_university_id} | {st.total_courses_taken} مادة
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#4338ca' }}>
                      {st.cumulative_gpa}%
                    </div>
                    {isSelected && (
                      <span className="badge badge-purple" style={{ fontSize: '10px' }}>محدد حالياً</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {loading ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: '#4f46e5' }}>
          <Loader2 size={32} className="spin" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '14.5px', fontWeight: 700 }}>جارٍ البحث والفرز في قاعدة البيانات...</div>
        </div>
      ) : currentStudent ? (
        <>
          {/* 🌟 1. COMPREHENSIVE STUDENT PROFILE HEADER CARD */}
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
                fontWeight: 900,
                boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)'
              }}>
                {currentStudent.student_name ? currentStudent.student_name[0] : 'S'}
              </div>
              <div>
                <h3 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>
                  {currentStudent.student_name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span className="badge badge-purple" style={{ fontSize: '11.5px', fontWeight: 700 }}>
                    {currentStudent.all_student_ids && currentStudent.all_student_ids.length > 1
                      ? `أرقام الجلوس لجميع السنوات: ${currentStudent.all_student_ids.join(' | ')}`
                      : `رقم الجلوس: ${currentStudent.student_university_id}`}
                  </span>
                  <span className="badge badge-blue" style={{ fontSize: '11.5px', fontWeight: 700 }}>
                    إجمالي المواد: {currentStudent.total_courses_taken} مادة
                  </span>
                  <span className="badge badge-green" style={{ fontSize: '11.5px', fontWeight: 700 }}>
                    ناجح في {currentStudent.passed_courses_count} مادة
                  </span>
                  {currentStudent.carried_courses_count > 0 ? (
                    <span className="badge badge-amber" style={{ fontSize: '11.5px', fontWeight: 800 }}>
                      متبقي {currentStudent.carried_courses_count} مواد
                    </span>
                  ) : (
                    <span className="badge badge-green" style={{ fontSize: '11.5px', fontWeight: 800 }}>
                      سجل خالٍ من الرسوب
                    </span>
                  )}
                  {currentStudent.unattempted_courses_count > 0 && (
                    <span className="badge" style={{ fontSize: '11.5px', fontWeight: 700, background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
                      لم يقدم {currentStudent.unattempted_courses_count} مواد
                    </span>
                  )}
                </div>
                <div style={{ marginTop: '8px', fontSize: '13px', fontWeight: 700, color: '#4338ca' }}>
                  الحالة الأكاديمية: {currentStudent.academic_status}
                </div>
              </div>
            </div>

            {/* GPA Meter & Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{
                background: '#ffffff',
                padding: '16px 24px',
                borderRadius: '18px',
                border: '1px solid #e2e8f0',
                boxShadow: 'var(--shadow-sm)',
                textAlign: 'center',
                minWidth: '170px'
              }}>
                <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 700 }}>المعدل التراكمي العام (GPA)</div>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: currentStudent.cumulative_gpa >= 60 ? '#4338ca' : '#dc2626',
                  margin: '2px 0'
                }}>
                  {currentStudent.cumulative_gpa}%
                </div>
                <div style={{ fontSize: '11.5px', color: currentStudent.cumulative_gpa >= 60 ? '#059669' : '#dc2626', fontWeight: 800 }}>
                  {currentStudent.cumulative_gpa >= 80 ? 'ممتاز مع مرتبة الشرف' : currentStudent.cumulative_gpa >= 70 ? 'جيد جداً' : currentStudent.cumulative_gpa >= 60 ? 'جيد' : 'بحاجة لتحسين'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => openPdf(currentStudent.student_university_id, currentStudent.student_name)}
                  className="btn btn-primary"
                  style={{
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(67, 56, 202, 0.25)'
                  }}
                >
                  <FileDown size={17} />
                  <span>تحميل كشف المسيرة الأكاديمية PDF</span>
                </button>

                <button
                  onClick={() => {
                    onSelectStudent({ id: currentStudent.student_university_id, name: currentStudent.student_name });
                    setActiveTab('analytics');
                  }}
                  className="btn"
                  style={{
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: '#fef3c7',
                    color: '#b45309'
                  }}
                >
                  <BarChart3 size={17} />
                  <span>محرك علامات المساعدة والتحليلات</span>
                </button>
              </div>
            </div>
          </div>

          {/* 🌟 2. METRICS OVERVIEW CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>عدد المواد المقدمة</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>
                {currentStudent.total_courses_taken}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>إجمالي المقررات بالخطة</div>
            </div>

            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>المواد المنجزة بنجاح</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: '#059669', margin: '4px 0' }}>
                {currentStudent.passed_courses_count}
              </div>
              <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>اجتياز رسمي كامل</div>
            </div>

            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>المواد المحمولة / المتبقية</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: currentStudent.carried_courses_count > 0 ? '#b91c1c' : '#059669', margin: '4px 0' }}>
                {currentStudent.carried_courses_count}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {currentStudent.carried_courses_count > 0 ? 'مؤهلة للمساعدة الجامعية' : 'لا توجد مواد محمولة'}
              </div>
            </div>

            {currentStudent.unattempted_courses_count > 0 && (
              <div className="card" style={{ padding: '18px', background: '#f8fafc' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>مواد لم يتقدم لها</div>
                <div style={{ fontSize: '26px', fontWeight: 900, color: '#475569', margin: '4px 0' }}>
                  {currentStudent.unattempted_courses_count}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>مقررات بالخطة لم تُقدم بعد</div>
              </div>
            )}

            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>أعلى مادة في المسيرة</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#059669', margin: '4px 0' }}>
                {currentStudent.highest_mark_overall ? `${currentStudent.highest_mark_overall}%` : '-'}
              </div>
              <div style={{ fontSize: '12px', color: '#334155', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentStudent.highest_mark_course || 'غير محدد'}
              </div>
            </div>

            <div className="card" style={{ padding: '18px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>أدنى مادة في المسيرة</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#dc2626', margin: '4px 0' }}>
                {currentStudent.lowest_mark_overall ? `${currentStudent.lowest_mark_overall}%` : '-'}
              </div>
              <div style={{ fontSize: '12px', color: '#334155', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentStudent.lowest_mark_course || 'غير محدد'}
              </div>
            </div>
          </div>

          {/* 🌟 3. VISUAL PROGRESS CHART (مخطط بياني يعرض التقدم والحالة للطالب) */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={22} color="#4338ca" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  مخطط التطور الأكاديمي ومعدل كل سنة دراسية (Progress Chart)
                </h3>
              </div>
              <span className="badge badge-purple" style={{ fontSize: '12px', fontWeight: 800 }}>
                المعدل التراكمي العام: {currentStudent.cumulative_gpa}%
              </span>
            </div>

            {/* Custom SVG/CSS Bar Chart across the Academic Years */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${yearsSummary.length || 5}, 1fr)`,
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
                    {/* Score on top of bar */}
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

                    {/* The Bar */}
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

                    {/* Year Label */}
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', textAlign: 'center' }}>
                      {yr.year_name}
                    </div>

                    {/* Year Stats Badge */}
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                      {yr.passed_count} ناجح {yr.carried_count > 0 ? `| ${yr.carried_count} حمل` : '✓'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🌟 4. YEAR-BY-YEAR CARDS WITH HIGHEST/LOWEST MARKS & ACCURATE ATTEMPTS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a' }}>
                كشف المقررات المفصل سنة بسنة (مع أعلى وأدنى مادة وعدد المحاولات الدقيق)
              </h3>
            </div>

            {yearsSummary.map((yr) => (
              <div
                key={yr.year_id}
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Year Header */}
                <div style={{
                  padding: '16px 22px',
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
                        {' • '}إجمالي المقررات: {yr.total_courses} مادة
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span className="badge badge-green" style={{ fontSize: '12px', fontWeight: 800 }}>
                      ناجح في {yr.passed_count} مواد
                    </span>
                    {yr.carried_count > 0 && (
                      <span className="badge badge-red" style={{ fontSize: '12px', fontWeight: 800 }}>
                        متبقي {yr.carried_count} مواد
                      </span>
                    )}
                    {yr.unattempted_count > 0 && (
                      <span className="badge" style={{ fontSize: '12px', fontWeight: 800, background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
                        لم يقدم {yr.unattempted_count} مواد
                      </span>
                    )}
                    <div style={{
                      background: '#ffffff',
                      padding: '6px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14.5px',
                      fontWeight: 900,
                      color: yr.annual_gpa >= 60 ? '#4338ca' : '#dc2626'
                    }}>
                      معدل السنة: {yr.annual_gpa}%
                    </div>
                  </div>
                </div>

                {/* 🌟 Year High/Low Highlights Bar */}
                <div style={{
                  padding: '12px 22px',
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

                {/* Passed Courses Table */}
                {yr.passed_courses && yr.passed_courses.length > 0 && (
                  <div style={{ padding: '16px 22px' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#059669', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} />
                      <span>المواد المنجزة بنجاح في {yr.year_name} ({yr.passed_courses.length})</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="table" style={{ width: '100%', textAlign: 'right' }}>
                        <thead>
                          <tr>
                            <th>المادة الدراسية</th>
                            <th>المحصلة النهائية</th>
                            <th>عدد مرات التقديم (المحاولات)</th>
                            <th>الدورة الامتحانية والسنة</th>
                            <th>الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yr.passed_courses.map((p, idx) => {
                            const attempts = p.attempts_count || 1;
                            return (
                              <tr key={idx}>
                                <td style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                                  {p.course_name}
                                </td>
                                <td>
                                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#059669' }}>
                                    {p.final_score}%
                                  </span>
                                </td>
                                <td>
                                  {attempts === 1 ? (
                                    <span className="badge badge-green" style={{ fontSize: '11.5px', fontWeight: 800 }}>
                                      من المحاولة الأولى ✓
                                    </span>
                                  ) : (
                                    <span className="badge badge-purple" style={{ fontSize: '11.5px', fontWeight: 700 }}>
                                      {attempts} محاولات
                                    </span>
                                  )}
                                </td>
                                <td style={{ color: '#64748b', fontSize: '12px' }}>
                                  <div>{p.session_title || '-'}</div>
                                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{p.academic_year || ''}</div>
                                </td>
                                <td>
                                  <span className="badge badge-green" style={{ fontWeight: 800 }}>ناجح</span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Carried Courses Table */}
                {yr.carried_courses && yr.carried_courses.length > 0 && (
                  <div style={{ padding: '16px 22px', background: '#fef2f2', borderTop: '1px solid #fee2e2' }}>
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
                            <th>حالة المادة ومساعدة الترفع الجامعية</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yr.carried_courses.map((c, idx) => (
                            <tr key={idx}>
                              <td style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                                {c.course_name}
                              </td>
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
                              <td style={{ color: '#64748b', fontSize: '12px' }}>
                                <div>{c.session_title || '-'}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.academic_year || ''}</div>
                              </td>
                              <td>
                                {c.is_grace_eligible ? (
                                  <span className="badge badge-amber" style={{ fontWeight: 800 }}>
                                    [مرفعة مساعدة] تحتاج +{c.required_grace_marks} للترفع بنجاح
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

                {/* Unattempted Courses Table */}
                {yr.unattempted_courses && yr.unattempted_courses.length > 0 && (
                  <div style={{ padding: '16px 22px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#475569', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={16} color="#64748b" />
                      <span>المواد غير المتقدم لها بالخطة الدراسية في {yr.year_name} ({yr.unattempted_courses.length})</span>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="table" style={{ width: '100%', textAlign: 'right' }}>
                        <thead>
                          <tr>
                            <th>المادة الدراسية</th>
                            <th>المحصلة</th>
                            <th>عدد المحاولات</th>
                            <th>الدورة الامتحانية</th>
                            <th>الحالة</th>
                          </tr>
                        </thead>
                        <tbody>
                          {yr.unattempted_courses.map((u, idx) => (
                            <tr key={idx}>
                              <td style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>
                                {u.course_name}
                              </td>
                              <td>
                                <span style={{ fontSize: '16px', fontWeight: 900, color: '#64748b' }}>
                                  0%
                                </span>
                              </td>
                              <td>
                                <span className="badge" style={{ fontSize: '11px', background: '#e2e8f0', color: '#475569' }}>
                                  0 محاولات (لم يُسجل)
                                </span>
                              </td>
                              <td style={{ color: '#94a3b8', fontSize: '12px' }}>
                                -
                              </td>
                              <td>
                                <span className="badge" style={{ fontWeight: 800, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}>
                                  مش مقدم المادة
                                </span>
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

        </>
      ) : hasSearched ? (
        <div className="card" style={{ padding: '50px', textAlign: 'center', color: '#64748b' }}>
          <AlertCircle size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '15px', fontWeight: 700 }}>لم يتم العثور على أي نتائج مطابقة للبحث.</div>
          <p style={{ fontSize: '13px', marginTop: '6px' }}>يرجى التأكد من كتابة الاسم أو رقم الجلوس بصورة صحيحة.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
          <Search size={42} color="#94a3b8" style={{ margin: '0 auto 14px' }} />
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
            ابحث عن أي طالب في كلية الهندسة المعلوماتية
          </div>
          <p style={{ fontSize: '13.5px', marginTop: '6px', maxWidth: '520px', margin: '6px auto 0 auto', color: '#64748b' }}>
            اكتب اسم الطالب (الثنائي أو الثلاثي) أو رقم الجلوس الجامعي في شريط البحث أعلاه، ثم اضغط على زر "بحث واستكشاف" لعرض مسيرته وسجله الأكاديمي الشامل.
          </p>
        </div>
      )}

    </div>
  );
}
