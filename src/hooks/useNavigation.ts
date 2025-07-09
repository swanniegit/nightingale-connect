import { useState, useCallback } from 'react';
import { NavigationState } from '../types';

const initialNavigationState: NavigationState = {
  activeTab: 'dashboard',
  mobileMenuOpen: false,
};

export const useNavigation = () => {
  const [navigationState, setNavigationState] = useState<NavigationState>(initialNavigationState);

  const setActiveTab = useCallback((tab: NavigationState['activeTab']) => {
    setNavigationState(prev => ({ ...prev, activeTab: tab, mobileMenuOpen: false }));
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setNavigationState(prev => ({ ...prev, mobileMenuOpen: !prev.mobileMenuOpen }));
  }, []);

  const closeMobileMenu = useCallback(() => {
    setNavigationState(prev => ({ ...prev, mobileMenuOpen: false }));
  }, []);

  return {
    navigationState,
    setActiveTab,
    toggleMobileMenu,
    closeMobileMenu,
  };
}; 