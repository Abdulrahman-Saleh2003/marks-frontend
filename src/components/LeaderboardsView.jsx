import React, { useState, useEffect } from 'react';
import { api } from '../api';
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Flame,
  Star,
  Users,
  Loader2,
  Sparkles,
  GraduationCap,
  CheckCircle2,
  Layers,
  Filter
} from 'lucide-react';

const YEARS = [
  { id: '1', name: 'السنة الأولى', desc: 'العلوم الأساسية والبرمجة' },
  { id: '2', name: 'السنة الثانية', desc: 'البنيان والخوارزميات وقواعد البيانات' },
  { id: '3', name: 'السنة الثالثة', desc: 'الشبكات وهندسة البرمجيات' },
  { id: '4', name: 'السنة الرابعة', desc: 'التخصص الدقيق والمشاريع' },
  { id: '5', name: 'السنة الخامسة', desc: 'مشاريع التخرج والأنظمة المتقدمة' },
];

const DEPARTMENTS = [
  { id: '2', name: 'هندسة البرمجيات ونظم المعلومات' },
  { id: '3', name: 'الذكاء الصنعي' },
  { id: '1', name: 'شبكات الحاسوب' },
];

export default function LeaderboardsView({ onSelectStudent, setActiveTab, showToast }) {
  const [selectedYear, setSelectedYear] = useState('1');
  const [specialization, setSpecialization] = useState('2');
  const [topStudents, setTopStudents] = useState([]);
  const [courseToppers, setCourseToppers] = useState([]);
  const [loading, setLoading] = useState(false);

  // If switching between years
  const handleYearChange = (yearId) => {
    setSelectedYear(yearId);
    if (yearId === '4' || yearId === '5') {
      if (!specialization) setSpecialization('2');
    }
  };

  useEffect(() => {
    loadLeaderboard(selectedYear, specialization);
  }, [selectedYear, specialization]);

  const loadLeaderboard = async (yearId, deptId) => {
    setLoading(true);
    try {
      const params = { year_id: yearId };
      if (yearId === '4' || yearId === '5') {
        params.department_id = deptId || '2';
      }

      const [resTop, resCourses] = await Promise.all([
        api.leaderboards.getTop30(params),
        api.leaderboards.getCourseToppers(params)
      ]);

      const topList = Array.isArray(resTop)
        ? resTop
        : (resTop.years_top20 ? resTop.years_top20[parseInt(yearId)] || [] : resTop.top_students || []);

      setTopStudents(topList.slice(0, 50));
      if (Array.isArray(resCourses)) {
        setCourseToppers(resCourses);
      } else if (resCourses && resCourses.course_toppers) {
        setCourseToppers(resCourses.course_toppers);
      } else {
        setCourseToppers([]);
      }
    } catch (err) {
      showToast(err.message || 'تعذر جلب لوحة الشرف', 'error');
    } finally {
      setLoading(false);
    }
  };

  const top1 = topStudents[0];
  const top2 = topStudents[1];
  const top3 = topStudents[2];
  const currentYearObj = YEARS.find(y => y.id === selectedYear) || YEARS[0];
  const currentDeptObj = DEPARTMENTS.find(d => d.id === specialization) || DEPARTMENTS[0];
  const isSpecializedYear = selectedYear === '4' || selectedYear === '5';

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>
            لوحة الشرف وتصنيف أوائل الكلية (Top 50 لكل سنة)
          </h2>
          <span className="badge badge-amber" style={{ fontSize: '12px', fontWeight: 800 }}>
            <Crown size={14} style={{ marginLeft: '4px' }} />
            المرفّعون بدون أي مواد محمولة
          </span>
        </div>
        <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '4px' }}>
          استعراض أول 50 طالباً متفوقاً لكل سنة دراسية وفق المعيار الأكاديمي الصارم: استكمال كافة مقررات السنة بالكامل والترفع دون أي رسوب
        </p>
      </div>

      {/* 5 Academic Years Tab Selector */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
        gap: '12px'
      }}>
        {YEARS.map((yr) => {
          const isSelected = selectedYear === yr.id;
          return (
            <button
              key={yr.id}
              onClick={() => handleYearChange(yr.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 18px',
                borderRadius: '16px',
                border: isSelected ? '2px solid #4338ca' : '1px solid #e2e8f0',
                background: isSelected ? 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'right',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 6px 16px rgba(67, 56, 202, 0.15)' : 'none',
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: isSelected ? '#4338ca' : '#f1f5f9',
                color: isSelected ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: 900,
                flexShrink: 0
              }}>
                {yr.id}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '14.5px',
                  fontWeight: 800,
                  color: isSelected ? '#312e81' : '#1e293b'
                }}>
                  {yr.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: isSelected ? '#4338ca' : '#94a3b8',
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  أفضل 50 طالباً مرفعاً
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Specialization Filter (Shown only when Year 4 or Year 5 is selected) */}
      {isSpecializedYear && (
        <div className="card animate-fade" style={{ padding: '16px 20px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} color="#4338ca" />
              <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1e293b' }}>
                تصفية حسب الاختصاص الأكاديمي ({currentYearObj.name}):
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {DEPARTMENTS.map((dept) => {
                const isDeptSelected = specialization === dept.id;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setSpecialization(dept.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      border: isDeptSelected ? '2px solid #4338ca' : '1px solid #cbd5e1',
                      background: isDeptSelected ? '#4338ca' : '#ffffff',
                      color: isDeptSelected ? '#ffffff' : '#475569',
                      transition: 'all 0.2s ease',
                      boxShadow: isDeptSelected ? '0 4px 10px rgba(67, 56, 202, 0.2)' : 'none'
                    }}
                  >
                    {dept.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Notification Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 20px',
        background: '#ecfdf5',
        borderRadius: '14px',
        border: '1px solid #a7f3d0',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} color="#059669" />
          <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#065f46' }}>
            أوائل {currentYearObj.name} {isSpecializedYear && specialization ? `- قسم ${currentDeptObj.name}` : ''} ({topStudents.length} طالباً مستكملين لكافة المقررات والترفع التام)
          </span>
        </div>
        <span className="badge badge-green" style={{ fontSize: '11.5px', fontWeight: 800 }}>
          شرط استكمال السنة والترفع: محقق 100% ✓
        </span>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: '#4f46e5' }}>
          <Loader2 size={32} className="spin" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontSize: '14.5px', fontWeight: 700 }}>
            جارٍ فحص واحتساب أوائل {currentYearObj.name} وتطبيق شروط الترفع الصارمة...
          </div>
        </div>
      ) : (
        <>
          {/* 🏆 TOP 3 PODIUM */}
          {top1 && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '20px',
              padding: '30px 10px 10px',
              flexWrap: 'wrap'
            }}>
              
              {/* 2nd Place (Silver) */}
              {top2 && (
                <div
                  onClick={() => {
                    onSelectStudent({ id: top2.student_university_id, name: top2.student_name });
                    setActiveTab('analytics');
                  }}
                  className="card"
                  style={{
                    flex: '1 1 240px',
                    maxWidth: '280px',
                    padding: '24px',
                    textAlign: 'center',
                    background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
                    border: '2px solid #cbd5e1',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-md)',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: '#94a3b8',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    fontWeight: 900,
                    fontSize: '18px',
                    boxShadow: '0 4px 10px rgba(148, 163, 184, 0.4)'
                  }}>
                    2
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>
                    {top2.student_name}
                  </h4>
                  <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: '2px' }}>
                    رقم الجلوس: {top2.student_university_id}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#334155', margin: '8px 0' }}>
                    {top2.average_mark || top2.gpa}%
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '11px', fontWeight: 700 }}>
                    مرفع ({top2.passed_courses_count} مواد ناجحة)
                  </span>
                </div>
              )}

              {/* 1st Place (Gold) - Elevated */}
              <div
                onClick={() => {
                  onSelectStudent({ id: top1.student_university_id, name: top1.student_name });
                  setActiveTab('analytics');
                }}
                className="card"
                style={{
                  flex: '1 1 280px',
                  maxWidth: '320px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  background: 'linear-gradient(180deg, #fefce8 0%, #fef08a 100%)',
                  border: '2px solid #eab308',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  boxShadow: '0 12px 30px rgba(234, 179, 8, 0.25)',
                  transform: 'translateY(-12px)',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)' }}>
                  <Crown size={38} color="#ca8a04" fill="#eab308" />
                </div>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '10px auto 12px',
                  fontWeight: 900,
                  fontSize: '22px',
                  boxShadow: '0 6px 14px rgba(202, 138, 4, 0.4)'
                }}>
                  1
                </div>
                <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#713f12' }}>
                  {top1.student_name}
                </h4>
                <div style={{ fontSize: '12px', color: '#854d0e', marginTop: '2px' }}>
                  رقم الجلوس: {top1.student_university_id}
                </div>
                <div style={{ fontSize: '34px', fontWeight: 900, color: '#854d0e', margin: '8px 0' }}>
                  {top1.average_mark || top1.gpa}%
                </div>
                <span className="badge badge-amber" style={{ fontSize: '12px', fontWeight: 800 }}>
                  الأول على {currentYearObj.name} 🥇
                </span>
                <div style={{ fontSize: '11.5px', color: '#713f12', marginTop: '6px', fontWeight: 700 }}>
                  مرفع بنجاح تام ({top1.passed_courses_count} مادة كاملة)
                </div>
              </div>

              {/* 3rd Place (Bronze) */}
              {top3 && (
                <div
                  onClick={() => {
                    onSelectStudent({ id: top3.student_university_id, name: top3.student_name });
                    setActiveTab('analytics');
                  }}
                  className="card"
                  style={{
                    flex: '1 1 240px',
                    maxWidth: '280px',
                    padding: '24px',
                    textAlign: 'center',
                    background: 'linear-gradient(180deg, #fff7ed 0%, #ffedd5 100%)',
                    border: '2px solid #fdba74',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-md)',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: '#c2410c',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    fontWeight: 900,
                    fontSize: '18px',
                    boxShadow: '0 4px 10px rgba(194, 65, 12, 0.4)'
                  }}>
                    3
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#7c2d12' }}>
                    {top3.student_name}
                  </h4>
                  <div style={{ fontSize: '11.5px', color: '#9a3412', marginTop: '2px' }}>
                    رقم الجلوس: {top3.student_university_id}
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 900, color: '#9a3412', margin: '8px 0' }}>
                    {top3.average_mark || top3.gpa}%
                  </div>
                  <span className="badge badge-amber" style={{ fontSize: '11px', fontWeight: 700 }}>
                    مرفع ({top3.passed_courses_count} مواد ناجحة)
                  </span>
                </div>
              )}

            </div>
          )}

          {/* Full Top 50 Ranking Table for the Year */}
          <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
                  قائمة الـ 50 الأوائل - {currentYearObj.name} {isSpecializedYear && specialization ? `(${currentDeptObj.name})` : ''}
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                  مرتبون تنازلياً حسب معدل السنة مع التحقق الصارم من استكمال كافة المقررات والترفع دون رسوب
                </p>
              </div>
              <span className="badge badge-green" style={{ fontSize: '12px', fontWeight: 800 }}>
                عرض {topStudents.length} طالباً مرفعاً
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%', textAlign: 'right' }}>
                <thead>
                  <tr>
                    <th style={{ width: '70px' }}>الترتيب</th>
                    <th>اسم الطالب المتفوق</th>
                    <th>رقم الجلوس</th>
                    <th>المقررات المنجزة بنجاح</th>
                    <th>معدل السنة الدراسية</th>
                    <th>الاختصاص</th>
                    <th>الحالة الأكاديمية</th>
                    <th>تفاصيل المسيرة</th>
                  </tr>
                </thead>
                <tbody>
                  {topStudents.map((st, idx) => (
                    <tr key={st.student_university_id || idx}>
                      <td>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          background: idx === 0 ? '#fef08a' : idx === 1 ? '#e2e8f0' : idx === 2 ? '#ffedd5' : '#f1f5f9',
                          color: idx === 0 ? '#854d0e' : idx === 1 ? '#334155' : idx === 2 ? '#9a3412' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900,
                          fontSize: '14px',
                          border: idx < 3 ? '1px solid currentColor' : 'none'
                        }}>
                          {idx + 1}
                        </div>
                      </td>
                      <td style={{ fontWeight: 800, color: '#0f172a', fontSize: '14.5px' }}>
                        {st.student_name}
                      </td>
                      <td style={{ color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
                        {st.student_university_id || '-'}
                      </td>
                      <td>
                        <span style={{ fontWeight: 800, color: '#059669', fontSize: '13px' }}>
                          {st.passed_courses_count} مقرراً كاملاً
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '17px', fontWeight: 900, color: '#4338ca' }}>
                          {st.average_mark || st.gpa}%
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-purple" style={{ fontSize: '11px', fontWeight: 700 }}>
                          {st.department || 'كلية الهندسة المعلوماتية'}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-green" style={{ fontSize: '11.5px', fontWeight: 800 }}>
                          مرفع وناجح في كافة المقررات
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            onSelectStudent({ id: st.student_university_id, name: st.student_name });
                            setActiveTab('analytics');
                          }}
                          className="btn"
                          style={{
                            padding: '6px 14px',
                            background: '#e0e7ff',
                            color: '#4338ca',
                            fontSize: '12px',
                            fontWeight: 700,
                            borderRadius: '8px'
                          }}
                        >
                          عرض المسيرة
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Course Toppers Grid */}
          {courseToppers && courseToppers.length > 0 && (
            <div style={{ marginTop: '28px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Flame size={24} color="#dc2626" />
                  <h3 style={{ fontSize: '21px', fontWeight: 800, color: '#0f172a' }}>
                    فرسان المقررات الدراسية (أعلى 5 طلاب لكل مادة - الدورة الرسمية الأحدث)
                  </h3>
                </div>
                <span className="badge badge-amber" style={{ fontSize: '12px', fontWeight: 800 }}>
                  المراكز الخمسة الأولى (🥇 🥈 🥉 4️⃣ 5️⃣) في كل مقرر
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '16px'
              }}>
                {courseToppers.map((ct, i) => {
                  const studentList = ct.top_students && ct.top_students.length > 0
                    ? ct.top_students
                    : [{ rank: 1, student_name: ct.top_student_name || ct.student_name, student_id: ct.top_student_id, mark: ct.highest_mark || ct.top_score }];

                  return (
                    <div
                      key={ct.course_id || i}
                      className="card hover-lift"
                      style={{
                        padding: '18px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        background: '#ffffff',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}
                    >
                      {/* Course Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                        <div>
                          <div style={{
                            fontWeight: 900,
                            fontSize: '16px',
                            color: '#1e1b4b',
                            lineHeight: '1.4'
                          }}>
                            {ct.course_name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                            {ct.academic_year || '2024-2025'}
                          </div>
                        </div>
                        <span className="badge badge-purple" style={{ fontSize: '11px', fontWeight: 800, flexShrink: 0 }}>
                          فرسان المادة 🏆
                        </span>
                      </div>

                      {/* Top 5 List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {studentList.map((st, idx) => {
                          const rank = st.rank || (idx + 1);
                          const isGold = rank === 1;
                          const isSilver = rank === 2;
                          const isBronze = rank === 3;
                          const isFourth = rank === 4;
                          const isFifth = rank === 5;

                          const bg = isGold ? '#fefce8' : (isSilver ? '#f8fafc' : (isBronze ? '#fff7ed' : (isFourth ? '#f0fdf4' : '#f5f3ff')));
                          const border = isGold ? '#fde047' : (isSilver ? '#cbd5e1' : (isBronze ? '#fed7aa' : (isFourth ? '#bbf7d0' : '#ddd6fe')));
                          const medalEmoji = isGold ? '🥇' : (isSilver ? '🥈' : (isBronze ? '🥉' : (isFourth ? '4️⃣' : (isFifth ? '5️⃣' : `#${rank}`))));
                          const scoreColor = isGold ? '#059669' : (isSilver ? '#4338ca' : (isBronze ? '#d97706' : (isFourth ? '#15803d' : '#7c3aed')));

                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                if (st.student_id || st.student_name) {
                                  onSelectStudent({ id: st.student_id, name: st.student_name });
                                  setActiveTab('analytics');
                                }
                              }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                background: bg,
                                border: `1px solid ${border}`,
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                              }}
                              title="انقر لعرض المسيرة الأكاديمية لهذا الطالب"
                              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.01)'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                                <span style={{ fontSize: '16px', flexShrink: 0 }}>{medalEmoji}</span>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div style={{
                                    fontSize: '13px',
                                    fontWeight: 800,
                                    color: '#0f172a',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}>
                                    {st.student_name}
                                  </div>
                                  {st.student_id && (
                                    <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                                      رقم الجلوس: {st.student_id}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <span style={{
                                fontSize: '15px',
                                fontWeight: 900,
                                color: scoreColor,
                                padding: '2px 8px',
                                borderRadius: '8px',
                                background: '#ffffff',
                                border: `1px solid ${border}`,
                                flexShrink: 0
                              }}>
                                {st.mark}%
                              </span>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </>
      )}

    </div>
  );
}
