import React, { createContext, useContext, useState } from 'react';
type View = 'dashboard' | 'project' | 'ai-sessions' | 'chat' | 'settings' | 'github' | 'audit' | 'advanced-ai' | 'user-settings';

interface NavigationContextType {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavigationContext = createContext<NavigationContextType>(null!);

export const useNavigation = () => useContext(NavigationContext);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const value = {
    currentView,
    setCurrentView
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};