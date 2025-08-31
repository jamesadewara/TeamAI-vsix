import React, { createContext, useContext, useState } from 'react';

type View = 'dashboard' | 'project' | 'ai-sessions' | 'chat' | 'settings' | 'github' | 'audit' | 'advanced-ai' | 'user-settings';

interface NavigationContextType {
  currentView: View;
  setCurrentView: (view: View) => void;
  currentProject: any | null;
  setCurrentProject: (project: any | null) => void;
}

const NavigationContext = createContext<NavigationContextType>(null!);

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [currentProject, setCurrentProject] = useState<any | null>(null);

  const value = {
    currentView,
    setCurrentView,
    currentProject,
    setCurrentProject
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};