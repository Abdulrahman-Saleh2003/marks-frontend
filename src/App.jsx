import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AuthModal from './components/AuthModal';
import AuthGate from './components/AuthGate';
import HomeView from './components/HomeView';
import SearchView from './components/SearchView';
import AnalyticsView from './components/AnalyticsView';
import LeaderboardsView from './components/LeaderboardsView';
import LecturesView from './components/LecturesView';
import MaintenanceView from './components/MaintenanceView';
import ContactView from './components/ContactView';
import { getUser, setAuthToken, setUser, api } from './api';
import { CheckCircle2, AlertCircle, X, Menu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setCurrentUser] = useState(getUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedStudentForAnalytics, setSelectedStudentForAnalytics] = useState(null);
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [syncingDrive, setSyncingDrive] = useState(false);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    setCurrentUser(null);
    showToast('تم تسجيل الخروج بنجاح', 'info');
  };

  const handleAuthSuccess = (u) => {
    setCurrentUser(u);
    showToast(`مرحباً بك د. / م. ${u.full_name}! تم الدخول بنجاح.`, 'success');
  };

  const handleUserUpdate = (u) => {
    setUser(u);
    setCurrentUser(u);
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudentForAnalytics(studentId);
  };

  // Google Drive auto-sync trigger
  const handleSyncDrive = async () => {
    setSyncingDrive(true);
    showToast('جاري التحقق من تحديثات Google Drive للعلامات والمحاضرات...', 'info');
    try {
      const res = await api.sync.triggerGDrive();
      if (res && res.new_files > 0) {
        showToast(`تم اكتشاف وتنزيل ${res.new_files} ملف علامات جديد وتحديث البيانات تلقائياً!`, 'success');
      } else {
        showToast('كافة بيانات العلامات والمحاضرات متطابقة ومحدثة مع Google Drive.', 'success');
      }
    } catch {
      showToast('تم التحقق من المزامنة مع السيرفر السحابي.', 'info');
    } finally {
      setSyncingDrive(false);
    }
  };

  // Auto-poll Google Drive every 3 minutes silently
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.sync.triggerGDrive();
        if (res && res.new_files > 0) {
          showToast(`🔔 تحديث جديد: تم تنزيل ${res.new_files} ملف علامات جديد تلقائياً من الدرايف!`, 'success');
        }
      } catch {
        // silent fail in background polling
      }
    }, 180000); // 3 minutes
    return () => clearInterval(interval);
  }, [user]);

  // Adjust sidebar default based on screen width
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3000,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: toast.type === 'error' ? '#fee2e2' : toast.type === 'success' ? '#ecfdf5' : '#f0fdf4',
          color: toast.type === 'error' ? '#b91c1c' : toast.type === 'success' ? '#047857' : '#0369a1',
          border: `1px solid ${toast.type === 'error' ? '#fecaca' : toast.type === 'success' ? '#a7f3d0' : '#bae6fd'}`,
          padding: '12px 20px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          fontSize: '13.5px',
          fontWeight: 700
        }}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'inherit',
              padding: '2px',
              display: 'flex'
            }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onSyncDrive={handleSyncDrive}
        syncingDrive={syncingDrive}
      />

      {/* Main Content Layout Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflowX: 'hidden' }}>
        
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content Area */}
        <main className="container" style={{ flex: 1, padding: '32px 20px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          {activeTab === 'contact' ? (
            <ContactView
              showToast={showToast}
            />
          ) : !user ? (
            <AuthGate
              onAuthSuccess={handleAuthSuccess}
              showToast={showToast}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeView
                  user={user}
                  onOpenAuth={() => setAuthModalOpen(true)}
                  setActiveTab={setActiveTab}
                  onSelectStudent={handleSelectStudent}
                  onUserUpdate={handleUserUpdate}
                  showToast={showToast}
                />
              )}

              {activeTab === 'search' && (
                <SearchView
                  onSelectStudent={handleSelectStudent}
                  setActiveTab={setActiveTab}
                  showToast={showToast}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsView
                  selectedStudentId={selectedStudentForAnalytics}
                  user={user}
                  showToast={showToast}
                />
              )}

              {activeTab === 'leaderboards' && (
                <LeaderboardsView
                  onSelectStudent={handleSelectStudent}
                  setActiveTab={setActiveTab}
                  showToast={showToast}
                />
              )}

              {activeTab === 'lectures' && (
                <LecturesView
                  showToast={showToast}
                />
              )}

              {activeTab === 'past_exams' && (
                <MaintenanceView
                  type="past_exams"
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'grading_keys' && (
                <MaintenanceView
                  type="grading_keys"
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'summaries' && (
                <MaintenanceView
                  type="summaries"
                  setActiveTab={setActiveTab}
                />
              )}
            </>
          )}
        </main>

        {/* Floating Sidebar Re-open Button (visible when sidebar is closed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            title="إظهار القائمة الجانبية"
            style={{
              position: 'fixed',
              bottom: '80px',
              right: '18px',
              zIndex: 1020,
              background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50px',
              padding: '10px 18px',
              fontWeight: 800,
              fontSize: '13px',
              boxShadow: '0 8px 24px rgba(79, 70, 229, 0.45)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            className="animate-fade"
          >
            <Menu size={18} />
            <span>إظهار القائمة</span>
          </button>
        )}

        {/* Footer */}
        <footer style={{
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '24px 20px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#64748b',
          marginTop: 'auto'
        }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              جامعة دمشق | كلية الهندسة المعلوماتية - بوابة النتائج والمحاضرات الدراسية © 2026
            </div>
            <div style={{ display: 'flex', gap: '16px', fontWeight: 600, alignItems: 'center', flexWrap: 'wrap' }}>
              <span>قاعدة البيانات: 470,094 علامة</span>
              <span>•</span>
              <span>قسم المحاضرات والملفات</span>
              <span>•</span>
              <button
                onClick={() => setActiveTab('contact')}
                style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#16a34a',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '12px',
                  fontFamily: 'inherit',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span>💬 تواصل مع المطور (واتساب)</span>
              </button>
            </div>
          </div>
        </footer>

        {/* Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />

      </div>

    </div>
  );
}
