import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { Landing } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { Questions } from './components/Questions';
import { Network } from './components/Network';
import { Knowledge } from './components/Knowledge';
import { Footer } from './components/Footer';
import { useAuth } from './hooks/useAuth';
import { useNavigation } from './hooks/useNavigation';
import { mockQuestions } from './utils/mockData';
import { APP_NAME } from './utils/constants';

function App() {
  const {
    authState,
    authForm,
    credentialsForm,
    handleLogin,
    handleRegisterStep1,
    handleCredentialsSubmit,
    openRegister,
    openLogin,
    closeAuth,
    logout,
    updateAuthForm,
    updateCredentialsForm,
  } = useAuth();

  const {
    navigationState,
    setActiveTab,
    toggleMobileMenu,
  } = useNavigation();

  const { isLoggedIn, showAuth, authMode, registrationStep } = authState;
  const { activeTab } = navigationState;

  if (!isLoggedIn) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50">
          <Header
            navigationState={navigationState}
            onSetActiveTab={setActiveTab}
            onToggleMobileMenu={toggleMobileMenu}
            onLogout={logout}
            isLoggedIn={isLoggedIn}
            onOpenLogin={openLogin}
            onOpenRegister={openRegister}
          />
          
          <Landing
            questions={mockQuestions}
            onOpenRegister={openRegister}
          />

          <Footer />

          <AuthModal
            showAuth={showAuth}
            authMode={authMode}
            registrationStep={registrationStep}
            authForm={authForm}
            credentialsForm={credentialsForm}
            onClose={closeAuth}
            onLogin={handleLogin}
            onRegisterStep1={handleRegisterStep1}
            onCredentialsSubmit={handleCredentialsSubmit}
            onUpdateAuthForm={updateAuthForm}
            onUpdateCredentialsForm={updateCredentialsForm}
            onSwitchToRegister={openRegister}
            onSwitchToLogin={openLogin}
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Header
          navigationState={navigationState}
          onSetActiveTab={setActiveTab}
          onToggleMobileMenu={toggleMobileMenu}
          onLogout={logout}
          isLoggedIn={isLoggedIn}
          onOpenLogin={openLogin}
          onOpenRegister={openRegister}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {activeTab === 'dashboard' && (
            <Dashboard
              questions={mockQuestions}
              onSetActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'questions' && (
            <Questions questions={mockQuestions} />
          )}

          {activeTab === 'network' && (
            <Network />
          )}

          {activeTab === 'knowledge' && (
            <Knowledge />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App; 