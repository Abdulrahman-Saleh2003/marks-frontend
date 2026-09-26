import React from 'react';
import {
  GraduationCap,
  Home,
  Search,
  BarChart3,
  Trophy,
  RefreshCw,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
}) {
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'search', label: 'البحث والاستكشاف', icon: Search },
    { id: 'analytics', label: 'مسيرتي والتحليلات', icon: BarChart3 },
    { id: 'leaderboards', label: 'لوحة الشرف', icon: Trophy },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '74px',
        padding: '0 20px'
      }}>
        {/* Brand */}
        <div
          onClick={() => setActiveTab('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #4338ca 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 16px rgba(67, 56, 202, 0.3)'
          }}>
            <GraduationCap size={26} />
          </div>
          <div>
            <div style={{
              fontWeight: 800,
              fontSize: '17px',
              color: '#0f172a',
              letterSpacing: '-0.2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>جامعة دمشق</span>
              <span className="badge badge-purple" style={{ fontSize: '10.5px', padding: '2px 8px' }}>
                ITE Portal
              </span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 600 }}>
              كلية الهندسة المعلوماتية | بوابة العلامات الذكية
            </div>
          </div>
        </div>

        {/* Center Nav Tabs or Locked state */}
        {user ? (
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#f1f5f9',
            padding: '5px',
            borderRadius: '14px'
          }}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'var(--font-arabic)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isActive ? '#ffffff' : 'transparent',
                    color: isActive ? '#4338ca' : '#64748b',
                    boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none'
                  }}
                >
                  <Icon size={16} color={isActive ? '#4338ca' : '#64748b'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fef3c7',
            color: '#92400e',
            border: '1px solid #fde68a',
            padding: '8px 18px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 800
          }}>
            <span>🔒 يُشترط تسجيل الحساب للوصول إلى كافة النتائج والأقسام</span>
          </div>
        )}

        {/* User Auth Profile State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: '#ffffff',
              padding: '6px 12px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #e0e7ff, #c7d2fe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4338ca',
                fontWeight: 800,
                fontSize: '14px'
              }}>
                {user.full_name ? user.full_name[0] : 'U'}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>
                  {user.full_name}
                </div>
                <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700 }}>
                  {user.linked_student_id ? `سجل جامعي: ${user.linked_student_id}` : 'حساب نشط'}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="تسجيل الخروج"
                style={{
                  background: '#fee2e2',
                  border: 'none',
                  color: '#b91c1c',
                  padding: '7px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '6px'
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
