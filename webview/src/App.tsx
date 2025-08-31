import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { Dashboard } from './pages/Dashboard';
import { ProjectDetails } from './pages/ProjectDetails';
import { AISessions } from './pages/AISessions';
import { Chat } from './pages/Chat';
import { GitHubIntegrations } from './pages/GitHubIntegrations';
import { AuditLogs } from './pages/AuditLogs';
import { UserSettings } from './pages/UserSettings';
import { AdvancedAI } from './pages/AdvancedAI';
import { LoadingSpinner } from './components/LoadingSpinner';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { currentView } = useNavigation();
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#signup') {
        setAuthView('signup');
      } else {
        setAuthView('login');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return authView === 'login' ? (
      <LoginPage />
    ) : (
      <SignUpPage />
    );
  }

  switch (currentView) {
    case 'project':
      return <ProjectDetails />;
    case 'ai-sessions':
      return <AISessions />;
    case 'chat':
      return <Chat />;
    case 'github':
      return <GitHubIntegrations />;
    case 'audit':
      return <AuditLogs />;
    case 'user-settings':
      return <UserSettings />;
    case 'advanced-ai':
      return <AdvancedAI />;
    case 'dashboard':
    default:
      return <Dashboard />;
  }
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProjectProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </ProjectProvider>
    </AuthProvider>
  );
};