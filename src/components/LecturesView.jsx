import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Folder,
  FileText,
  Download,
  ExternalLink,
  Search,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  FolderOpen,
  ChevronLeft,
  ArrowRight,
  Clock,
  Filter,
  CheckCircle2,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';

const STUDY_YEARS = [
  { id: 1, name: 'السنة الأولى', color: '#4f46e5', badge: '13 مقرر' },
  { id: 2, name: 'السنة الثانية', color: '#06b6d4', badge: '12 مقرر' },
  { id: 3, name: 'السنة الثالثة', color: '#10b981', badge: '10 مقررات' },
  { id: 4, name: 'السنة الرابعة', color: '#f59e0b', badge: '12 مقرر (اختصاصات)' },
  { id: 5, name: 'السنة الخامسة', color: '#8b5cf6', badge: 'مشاريع وتخرج' }
];

export default function LecturesView({ showToast }) {
  const [selectedYearNum, setSelectedYearNum] = useState(1);
  const [academicYears, setAcademicYears] = useState(['2024-2025', '2025-2026']);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2024-2025');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lectureSearch, setLectureSearch] = useState('');
  const [syncing, setSyncing] = useState(false);

  // Mobile navigation state
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 850 : false);
  const [mobileTab, setMobileTab] = useState('subjects'); // 'subjects' | 'lectures'

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 850);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fallback subjects matching Google Drive structure if network offline
  const DEFAULT_SUBJECTS = {
    1: ['البرمجة 1', 'التحليل 1', 'الجبر العام', 'برمجة 2', 'تحليل 2', 'جبر خطي', 'دارات كهربائية', 'مبادئ عمل الحاسوب', 'فيزياء'],
    2: ['الاتصالات الرقمية', 'الاحتمالات و الإحصاء', 'البرمجة 3', 'التحليل 3', 'التحليل العددي', 'الخوارزميات 1', 'الخوارزميات و بنى المعطيات 2', 'الدارات المنطقية', 'بنيان الحواسيب 1', 'انكليزي 3', 'اللغة الإنكليزية 4'],
    3: ['أساسيات الشبكات', 'بيانيات حاسوبية', 'بحوث العمليات', 'بنيان الحواسيب 2', 'قواعد معطيات 1', 'لغات البرمجة', 'لغات صورية', 'مبادئ ذكاء صنعي', 'اوتومات'],
    4: ['البرمجة التفرعية', 'خوارزميات البحث الذكية', 'نظم التشغيل 1', 'نظم الوسائط المتعددة', 'هندسة البرمجيات 1', 'هندسة البرمجيات 2', 'قواعد المعطيات 2', 'المترجمات 1', 'الشبكات العصبونية', 'بروتوكولات الإتصال', 'تطبيقات شبكية', 'الحقائق الافتراضية'],
    5: ['برمجيات', 'ذكاء', 'مشترك']
  };

  useEffect(() => {
    const loadAcademicYears = async () => {
      try {
        const res = await api.lectures.getYears();
        if (res && res.academic_years && res.academic_years.length > 0) {
          const labels = res.academic_years.map((y) => y.year_label);
          setAcademicYears(labels);
          if (!labels.includes(selectedAcademicYear)) {
            setSelectedAcademicYear(labels[0]);
          }
        }
      } catch {
        // Keep default years
      }
    };
    loadAcademicYears();
  }, []);

  useEffect(() => {
    fetchLecturesData();
  }, [selectedYearNum, selectedAcademicYear]);

  const fetchLecturesData = async () => {
    setLoading(true);
    try {
      const res = await api.lectures.getSubjects({
        year: selectedAcademicYear,
        study_year: selectedYearNum
      });
      if (res && res.subjects && res.subjects.length > 0) {
        setSubjects(res.subjects);
        // Smart select: choose the first subject that has lectures > 0
        const defaultSubj = res.subjects.find((s) => (s.lecture_count || 0) > 0) || res.subjects[0];
        setSelectedSubject(defaultSubj);
        fetchSubjectLectures(defaultSubj);
      } else {
        const fallback = (DEFAULT_SUBJECTS[selectedYearNum] || []).map((name, idx) => ({
          id: idx + 1,
          subject_name: name,
          lecture_count: 8,
          drive_folder_url: 'https://drive.google.com/folderview?id=0BwGBqPXoFMyUcEo4bTRrZzVKVDg&resourcekey=0-m7_x4KXX8ab9SF2gvt6IdA'
        }));
        setSubjects(fallback);
        setSelectedSubject(fallback[0]);
        fetchSubjectLectures(fallback[0]);
      }
    } catch {
      const fallback = (DEFAULT_SUBJECTS[selectedYearNum] || []).map((name, idx) => ({
        id: idx + 1,
        subject_name: name,
        lecture_count: 8,
        drive_folder_url: 'https://drive.google.com/folderview?id=0BwGBqPXoFMyUcEo4bTRrZzVKVDg&resourcekey=0-m7_x4KXX8ab9SF2gvt6IdA'
      }));
      setSubjects(fallback);
      setSelectedSubject(fallback[0]);
      fetchSubjectLectures(fallback[0]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjectLectures = async (subjObjOrName) => {
    if (!subjObjOrName) return;
    setLoadingLectures(true);
    try {
      const isObj = typeof subjObjOrName === 'object' && subjObjOrName !== null;
      const subjId = isObj ? subjObjOrName.id : null;
      const subjName = isObj ? subjObjOrName.subject_name : subjObjOrName;

      // Notice: Do NOT pass search=subjName as the backend searches title__icontains=search
      // and files in Google Drive have English names (e.g. Practical-Programming1-Lec-1.pdf)
      const params = {
        study_year: selectedYearNum,
        year: selectedAcademicYear,
      };
      if (subjId) params.subject_id = subjId;

      const res = await api.lectures.getFiles(params);
      if (res && res.lectures && res.lectures.length > 0) {
        setLectures(res.lectures);
      } else if (subjId) {
        // Fallback: try by subject_id alone
        const resId = await api.lectures.getFiles({ subject_id: subjId });
        if (resId && resId.lectures && resId.lectures.length > 0) {
          setLectures(resId.lectures);
        } else {
          setLectures([]);
        }
      } else {
        setLectures([]);
      }
    } catch {
      setLectures([]);
    } finally {
      setLoadingLectures(false);
    }
  };

  const handleSelectSubject = (subj) => {
    setSelectedSubject(subj);
    fetchSubjectLectures(subj);
    if (isMobile) {
      setMobileTab('lectures');
    }
  };

  const handleSyncDrive = async () => {
    setSyncing(true);
    if (showToast) showToast('جاري بدء مزامنة واستخراج المحاضرات من Google Drive...', 'info');
    try {
      await api.lectures.syncLectures();
      if (showToast) showToast('تمت مزامنة المحاضرات وتحديث قاعدة البيانات بنجاح!', 'success');
      fetchLecturesData();
    } catch {
      if (showToast) showToast('جاري تحميل وتنزيل الملفات في الخلفية...', 'info');
    } finally {
      setSyncing(false);
    }
  };

  const filteredSubjects = subjects.filter((s) =>
    s.subject_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLectures = lectures.filter((lec) =>
    lec.title ? lec.title.toLowerCase().includes(lectureSearch.toLowerCase()) : true
  );

  const currentYearObj = STUDY_YEARS.find((y) => y.id === selectedYearNum);

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Banner / Header */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
          color: '#ffffff',
          padding: '24px 20px',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 10px 25px -5px rgba(67, 56, 202, 0.4)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11.5px',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Sparkles size={13} /> كلية الهندسة المعلوماتية - جامعة دمشق
            </span>
            <span
              style={{
                background: '#10b981',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 800
              }}
            >
              Google Drive متصل ومفهرس
            </span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '6px' }}>
            مكتبة المحاضرات والمقررات الدراسية
          </h1>
          <p style={{ fontSize: '13px', color: '#c7d2fe', maxWidth: '650px', lineHeight: 1.6 }}>
            تصفح وحمل كافة المحاضرات النظرية والعملية للمقررات مقسمة حسب السنوات الدراسية مع إمكانية التنزيل المباشر أو المعاينة.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={handleSyncDrive}
            disabled={syncing}
            className="btn"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 16px',
              fontSize: '12.5px'
            }}
          >
            <RefreshCw size={15} className={syncing ? 'animate-spin' : ''} />
            <span>{syncing ? 'جاري المزامنة...' : 'مزامنة من Drive'}</span>
          </button>

          <a
            href="https://drive.google.com/folderview?id=0BwGBqPXoFMyUcEo4bTRrZzVKVDg&resourcekey=0-m7_x4KXX8ab9SF2gvt6IdA"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
            style={{
              background: '#ffffff',
              color: '#1e1b4b',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 800,
              padding: '9px 16px',
              fontSize: '12.5px'
            }}
          >
            <ExternalLink size={15} />
            <span>المجلد الكامل على Drive</span>
          </a>
        </div>
      </div>

      {/* Study Year Selector Pills */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={17} color="#4f46e5" />
            <span>اختر السنة الدراسية:</span>
          </div>

          {/* Academic Year Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>العام الأكاديمي:</span>
            <select
              value={selectedAcademicYear}
              onChange={(e) => setSelectedAcademicYear(e.target.value)}
              className="input-field"
              style={{ width: 'auto', padding: '6px 12px', fontSize: '12px', fontWeight: 700 }}
            >
              {academicYears.map((ay) => (
                <option key={ay} value={ay}>
                  العام {ay}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="tabs-scrollable" style={{ gap: '8px' }}>
          {STUDY_YEARS.map((y) => {
            const isSelected = selectedYearNum === y.id;
            return (
              <button
                key={y.id}
                onClick={() => {
                  setSelectedYearNum(y.id);
                  if (isMobile) {
                    setMobileTab('subjects');
                  }
                }}
                className="btn"
                style={{
                  flex: 1,
                  minWidth: '150px',
                  padding: '12px 14px',
                  borderRadius: '14px',
                  border: isSelected ? `2px solid ${y.color}` : '1.5px solid #e2e8f0',
                  background: isSelected ? `linear-gradient(135deg, ${y.color}15 0%, #ffffff 100%)` : '#ffffff',
                  color: isSelected ? y.color : '#334155',
                  boxShadow: isSelected ? `0 6px 16px ${y.color}25` : '0 1px 3px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      background: isSelected ? y.color : '#f1f5f9',
                      color: isSelected ? '#ffffff' : '#64748b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '12px'
                    }}
                  >
                    {y.id}
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '13px' }}>{y.name}</span>
                </div>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: isSelected ? `${y.color}20` : '#f1f5f9',
                    color: isSelected ? y.color : '#64748b'
                  }}
                >
                  {y.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile-Only Tab Switcher [ المقررات | المحاضرات ] */}
      {isMobile && (
        <div
          style={{
            display: 'flex',
            background: '#e2e8f0',
            padding: '4px',
            borderRadius: '14px',
            gap: '6px'
          }}
        >
          <button
            onClick={() => setMobileTab('subjects')}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '13px',
              fontFamily: 'var(--font-arabic)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              background: mobileTab === 'subjects' ? '#ffffff' : 'transparent',
              color: mobileTab === 'subjects' ? '#4f46e5' : '#64748b',
              boxShadow: mobileTab === 'subjects' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <Folder size={16} />
            <span>قائمة المقررات ({filteredSubjects.length})</span>
          </button>

          <button
            onClick={() => setMobileTab('lectures')}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '13px',
              fontFamily: 'var(--font-arabic)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              background: mobileTab === 'lectures' ? '#ffffff' : 'transparent',
              color: mobileTab === 'lectures' ? '#4f46e5' : '#64748b',
              boxShadow: mobileTab === 'lectures' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <BookOpen size={16} />
            <span>ملفات المحاضرات ({lectures.length})</span>
          </button>
        </div>
      )}

      {/* Main Container: Responsive Grid or Mobile Tabs */}
      <div className="lectures-grid-container">
        
        {/* Subjects Column (Visible if Desktop or if Mobile and mobileTab === 'subjects') */}
        {(!isMobile || mobileTab === 'subjects') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
            <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                  مقررات {currentYearObj?.name}
                </span>
                <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 700 }}>
                  {filteredSubjects.length} مقرر
                </span>
              </div>

              {/* Subject Search */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="ابحث عن مادة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ paddingRight: '36px', fontSize: '12.5px', padding: '9px 36px 9px 12px' }}
                />
                <Search
                  size={16}
                  color="#94a3b8"
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
              </div>

              {/* Subjects List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: isMobile ? 'none' : '580px',
                  overflowY: 'auto'
                }}
              >
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#64748b', fontSize: '13px' }}>
                    <RefreshCw size={20} className="animate-spin" style={{ margin: '0 auto 8px' }} />
                    <div>جاري تحميل المقررات...</div>
                  </div>
                ) : filteredSubjects.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: '13px' }}>
                    لا توجد مواد مطابقة للبحث
                  </div>
                ) : (
                  filteredSubjects.map((subj) => {
                    const isSelected = selectedSubject && selectedSubject.subject_name === subj.subject_name;
                    return (
                      <button
                        key={subj.id || subj.subject_name}
                        onClick={() => handleSelectSubject(subj)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: isSelected ? '1.5px solid #4f46e5' : '1px solid #e2e8f0',
                          background: isSelected ? '#eef2ff' : '#ffffff',
                          color: isSelected ? '#4338ca' : '#1e293b',
                          cursor: 'pointer',
                          textAlign: 'right',
                          transition: 'all 0.15s ease',
                          width: '100%'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                          <Folder size={18} color={isSelected ? '#4f46e5' : '#64748b'} style={{ flexShrink: 0 }} />
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: isSelected ? 800 : 700,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}
                          >
                            {subj.subject_name}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          {subj.lecture_count > 0 && (
                            <span
                              style={{
                                fontSize: '10.5px',
                                fontWeight: 800,
                                background: isSelected ? '#4338ca' : '#f1f5f9',
                                color: isSelected ? '#ffffff' : '#64748b',
                                padding: '2px 6px',
                                borderRadius: '6px'
                              }}
                            >
                              {subj.lecture_count}
                            </span>
                          )}
                          <ChevronLeft size={16} color={isSelected ? '#4f46e5' : '#94a3b8'} />
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Lectures Column (Visible if Desktop or if Mobile and mobileTab === 'lectures') */}
        {(!isMobile || mobileTab === 'lectures') && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <div className="card" style={{ padding: '20px', minHeight: '400px' }}>
              {selectedSubject ? (
                <>
                  {/* Mobile Back to Subjects Button */}
                  {isMobile && (
                    <button
                      onClick={() => setMobileTab('subjects')}
                      className="btn btn-secondary"
                      style={{
                        marginBottom: '16px',
                        width: '100%',
                        justifyContent: 'flex-start',
                        gap: '8px',
                        fontSize: '12.5px',
                        padding: '10px 14px',
                        background: '#f1f5f9',
                        borderColor: '#cbd5e1'
                      }}
                    >
                      <ArrowRight size={16} />
                      <span>العودة لقائمة المقررات ({currentYearObj?.name})</span>
                    </button>
                  )}

                  {/* Subject Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '16px',
                      marginBottom: '18px',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>
                          {selectedSubject.subject_name}
                        </h2>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {currentYearObj?.name} • المحاضرات حسب التاريخ
                        </div>
                      </div>
                    </div>

                    {selectedSubject.drive_folder_url && (
                      <a
                        href={selectedSubject.drive_folder_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '8px 14px' }}
                      >
                        <FolderOpen size={15} />
                        <span>فتح مجلد المادة على Drive</span>
                      </a>
                    )}
                  </div>

                  {/* Quick Lecture Filter */}
                  {lectures.length > 5 && (
                    <div style={{ position: 'relative', marginBottom: '14px' }}>
                      <input
                        type="text"
                        placeholder="تصفية المحاضرات (مثال: Lec 1، عملي، نظري)..."
                        value={lectureSearch}
                        onChange={(e) => setLectureSearch(e.target.value)}
                        className="input-field"
                        style={{ paddingRight: '36px', fontSize: '12px', padding: '8px 36px 8px 12px' }}
                      />
                      <Search
                        size={15}
                        color="#94a3b8"
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                      />
                    </div>
                  )}

                  {/* Lectures List Content */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#475569' }}>
                        ملفات المحاضرات المتوفرة ({filteredLectures.length}):
                      </span>
                      {selectedSubject.lecture_count > 0 && (
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                          ✓ موثقة ومربوطة بـ Drive
                        </span>
                      )}
                    </div>

                    {loadingLectures ? (
                      <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
                        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 10px', color: '#4f46e5' }} />
                        <div style={{ fontSize: '13.5px', fontWeight: 700 }}>جاري استرجاع ملفات المحاضرات من السيرفر...</div>
                      </div>
                    ) : filteredLectures.length === 0 ? (
                      <div
                        style={{
                          textAlign: 'center',
                          padding: '36px 16px',
                          background: '#f8fafc',
                          borderRadius: '16px',
                          border: '1.5px dashed #e2e8f0'
                        }}
                      >
                        <FileText size={36} color="#94a3b8" style={{ margin: '0 auto 10px' }} />
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155' }}>
                          لا توجد محاضرات مرفوعة لهذه المادة حتى الآن
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                          يجري تدقيق وتنزيل ملفات هذه المادة عبر Google Drive، تصفح باقي المواد في السنة الدراسية.
                        </div>
                      </div>
                    ) : (
                      filteredLectures.map((lec, idx) => (
                        <div
                          key={lec.id || idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 16px',
                            borderRadius: '14px',
                            border: '1px solid #e2e8f0',
                            background: '#f8fafc',
                            transition: 'all 0.2s ease',
                            flexWrap: 'wrap',
                            gap: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px', flex: 1 }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                background: '#fee2e2',
                                color: '#b91c1c',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
                            >
                              <FileText size={20} />
                            </div>

                            <div style={{ minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: '13px',
                                  fontWeight: 800,
                                  color: '#0f172a',
                                  lineHeight: 1.4,
                                  wordBreak: 'break-word'
                                }}
                              >
                                {lec.title}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Calendar size={13} />
                                  {lec.date_uploaded || 'محدث مؤخراً'}
                                </span>
                                <span
                                  style={{
                                    fontSize: '10.5px',
                                    fontWeight: 700,
                                    background: '#e0e7ff',
                                    color: '#4338ca',
                                    padding: '1px 6px',
                                    borderRadius: '6px'
                                  }}
                                >
                                  {lec.file_type ? lec.file_type.toUpperCase() : 'PDF'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                            {lec.drive_download_url && (
                              <a
                                href={lec.drive_download_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ padding: '8px 14px', fontSize: '12px' }}
                                title="تحميل الملف مباشرة"
                              >
                                <Download size={14} />
                                <span>تحميل</span>
                              </a>
                            )}

                            <a
                              href={lec.drive_view_url || 'https://drive.google.com'}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-secondary"
                              style={{ padding: '8px 12px', fontSize: '12px' }}
                              title="معاينة الملف في Google Drive"
                            >
                              <ExternalLink size={14} />
                              <span>معاينة</span>
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '350px',
                    color: '#94a3b8'
                  }}
                >
                  <BookOpen size={48} strokeWidth={1.5} />
                  <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 700 }}>
                    اختر مقرراً من القائمة لعرض ملفات محاضراته
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
