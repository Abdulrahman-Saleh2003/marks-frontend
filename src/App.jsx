import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import AuthGate from './components/AuthGate';
import HomeView from './components/HomeView';
import SearchView from './components/SearchView';
import AnalyticsView from './components/AnalyticsView';
import LeaderboardsView from './components/LeaderboardsView';
import { getUser, setAuthToken, setUser } from './api';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setCurrentUser] = useState(getUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedStudentForAnalytics, setSelectedStudentForAnalytics] = useState(null);
  const [toast, setToast] = useState(null);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2000,
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

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, padding: '32px 20px', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {!user ? (
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
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        background: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        padding: '24px 20px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#64748b'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            جامعة دمشق | كلية الهندسة المعلوماتية - بوابة النتائج والعلامات الأكاديمية © 2026
          </div>
          <div style={{ display: 'flex', gap: '16px', fontWeight: 600 }}>
            <span>قاعدة البيانات: 470,094 علامة</span>
            <span>•</span>
            <span>محرك علامات المساعدة الجامعية</span>
            <span>•</span>
            <span>مطابقة ذكية للأسماء</span>
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
  );
}
