import React from 'react';
import {
  Home,
  Search,
  BarChart3,
  Award,
  BookOpen,
  RefreshCw,
  LogOut,
  LogIn,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  Sparkles,
  CloudCheck,
  CheckCircle2,
  FileCheck2,
  X
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  user,
  onOpenAuth,
  onLogout,
  onSyncDrive,
  syncingDrive
}) {
  const navItems = [
    {
      id: 'home',
      label: 'الرئيسية',
      description: 'لوحة التحكم والنتائج الفورية',
      icon: Home,
      color: '#4f46e5'
    },
    {
      id: 'search',
      label: 'البحث عن العلامات',
      description: 'بحث بالاسم أو الرقم الجامعي',
      icon: Search,
      color: '#06b6d4'
    },
    {
      id: 'analytics',
      label: 'التحليلات والمساعدة',
      description: 'كشف العلامات ومحرك تنظيم الجامعات',
      icon: BarChart3,
      color: '#10b981'
    },
    {
      id: 'leaderboards',
      label: 'لوحة الشرف والأوائل',
      description: 'أوائل الدفعات والمقررات 2026',
      icon: Award,
      color: '#f59e0b'
    },
    {
      id: 'lectures',
      label: 'قسم المحاضرات',
      description: 'المحاضرات والمقررات للسنوات الخمس',
      icon: BookOpen,
      color: '#8b5cf6',
      badge: 'جديد'
    },
    {
      id: 'past_exams',
      label: 'قسم الدورات',
      description: 'أسئلة الدورات والامتحانات السابقة',
      icon: FileCheck2,
      color: '#ef4444',
      badge: 'صيانة 🛠️'
    },
    {
      id: 'grading_keys',
      label: 'سلالم التصحيح',
      description: 'سلالم التصحيح الرسمية والحلول النموذجية',
      icon: CheckCircle2,
      color: '#0284c7',
      badge: 'صيانة 🛠️'
    },
    {
      id: 'summaries',
      label: 'ملخص فهم المحاضرات',
      description: 'ملخصات وشروحات مكثفة لفهم المنهاج',
      icon: Sparkles,
      color: '#10b981',
      badge: 'صيانة 🛠️'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1040,
            transition: 'opacity 0.3s ease'
          }}
          className="hide-on-desktop"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        style={{
          width: isOpen ? '280px' : '82px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          borderLeft: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1050,
          transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: isOpen ? '-4px 0 24px rgba(0,0,0,0.06)' : 'none',
          overflow: 'hidden',
          flexShrink: 0
        }}
        className={`portal-sidebar ${isOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
      >
        {/* Header / Brand */}
        <div
          style={{
            padding: isOpen ? '20px 18px' : '20px 14px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            minHeight: '74px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              <GraduationCap size={24} />
            </div>

            {isOpen && (
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
                  بوابة النتائج والمحاضرات
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
                  هندسة المعلوماتية - دمشق
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Mobile Close Button */}
            {isOpen && (
              <button
                onClick={() => setIsOpen(false)}
                className="hide-on-desktop"
                title="إغلاق القائمة"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  border: '1px solid #fee2e2',
                  background: '#fef2f2',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  flexShrink: 0
                }}
              >
                <X size={18} />
              </button>
            )}

            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              title={isOpen ? 'إخفاء / طي القائمة الجانبية' : 'إظهار / توسيع القائمة الجانبية'}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '9px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
                flexShrink: 0,
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <div
          style={{
            flex: 1,
            padding: '16px 12px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 850) {
                    setIsOpen(false);
                  }
                }}
                title={!isOpen ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  width: '100%',
                  padding: isOpen ? '12px 14px' : '12px',
                  borderRadius: '14px',
                  border: isActive ? `1.5px solid ${item.color}30` : '1.5px solid transparent',
                  background: isActive
                    ? `linear-gradient(135deg, ${item.color}15 0%, ${item.color}08 100%)`
                    : 'transparent',
                  color: isActive ? item.color : '#475569',
                  cursor: 'pointer',
                  textAlign: 'right',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.color = '#0f172a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#475569';
                  }
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isActive ? item.color : '#f1f5f9',
                    color: isActive ? '#ffffff' : '#64748b',
                    flexShrink: 0,
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? `0 4px 10px ${item.color}40` : 'none'
                  }}
                >
                  <Icon size={19} />
                </div>

                {isOpen && (
                  <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: isActive ? 800 : 700 }}>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 7px',
                            borderRadius: '20px',
                            background: item.color,
                            color: '#ffffff'
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: isActive ? `${item.color}cc` : '#94a3b8',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '1px'
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Drive Sync Status Widget */}
        <div
          style={{
            padding: '14px',
            margin: '0 10px 10px',
            borderRadius: '16px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 8px #10b981',
                  display: 'inline-block'
                }}
              />
              {isOpen && (
                <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#334155' }}>
                  مزامنة Google Drive
                </span>
              )}
            </div>

            <button
              onClick={onSyncDrive}
              disabled={syncingDrive}
              title="مزامنة فورية للعلامات والمحاضرات"
              style={{
                background: 'none',
                border: 'none',
                cursor: syncingDrive ? 'not-allowed' : 'pointer',
                color: syncingDrive ? '#94a3b8' : '#4f46e5',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
                borderRadius: '6px'
              }}
            >
              <RefreshCw size={14} className={syncingDrive ? 'animate-spin' : ''} />
            </button>
          </div>

          {isOpen && (
            <div style={{ fontSize: '10.5px', color: '#64748b', lineHeight: 1.4 }}>
              المراقبة اللحظية مفعلة. أي ملف علامات ينزل على الدرايف يتم دمجه تلقائياً.
            </div>
          )}
        </div>

        {/* User / Authentication Footer */}
        <div
          style={{
            padding: '14px',
            borderTop: '1px solid #f1f5f9',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}
        >
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '13px',
                  flexShrink: 0
                }}
              >
                {user.full_name ? user.full_name.charAt(0) : 'م'}
              </div>

              {isOpen && (
                <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.full_name}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                    {user.role === 'ADMIN' ? 'مدير النظام' : 'طالب موثق'}
                  </div>
                </div>
              )}

              <button
                onClick={onLogout}
                title="تسجيل الخروج"
                style={{
                  background: '#fee2e2',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '7px',
                  cursor: 'pointer',
                  color: '#b91c1c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '9px 12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '12.5px',
                cursor: 'pointer'
              }}
            >
              <LogIn size={16} />
              {isOpen && <span>تسجيل الدخول</span>}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
