import React from 'react';
import { NavigationState } from '../types';

interface HeaderProps {
  navigationState: NavigationState;
  onSetActiveTab: (tab: NavigationState['activeTab']) => void;
  onToggleMobileMenu: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  navigationState,
  onSetActiveTab,
  onToggleMobileMenu,
  onLogout,
  isLoggedIn,
  onOpenLogin,
  onOpenRegister,
}) => {
  const { activeTab, mobileMenuOpen } = navigationState;

  if (!isLoggedIn) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#12464d'}}>
                <span className="text-white font-bold text-sm">NC</span>
              </div>
              <h1 className="text-xl font-semibold" style={{color: '#12464d'}}>
                Nightingale Connect
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenLogin}
                className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium"
              >
                Login
              </button>
              <button
                onClick={onOpenRegister}
                className="text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-medium"
                style={{backgroundColor: '#12464d'}}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{backgroundColor: '#12464d'}}>
              <span className="text-white font-bold text-sm">NC</span>
            </div>
            <h1 className="text-lg sm:text-xl font-semibold" style={{color: '#12464d'}}>
              <span className="hidden sm:inline">Nightingale Connect</span>
              <span className="sm:hidden">Nightingale</span>
            </h1>
          </div>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => onSetActiveTab('dashboard')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'dashboard' ? 'border-b-2' : 'text-gray-600 hover:text-gray-900'
              }`}
              style={activeTab === 'dashboard' ? {color: '#12464d', borderBottomColor: '#12464d'} : {}}
            >
              Dashboard
            </button>
            <button
              onClick={() => onSetActiveTab('questions')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'questions' ? 'border-b-2' : 'text-gray-600 hover:text-gray-900'
              }`}
              style={activeTab === 'questions' ? {color: '#12464d', borderBottomColor: '#12464d'} : {}}
            >
              Questions
            </button>
            <button
              onClick={() => onSetActiveTab('network')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'network' ? 'border-b-2' : 'text-gray-600 hover:text-gray-900'
              }`}
              style={activeTab === 'network' ? {color: '#12464d', borderBottomColor: '#12464d'} : {}}
            >
              Network
            </button>
            <button
              onClick={() => onSetActiveTab('knowledge')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'knowledge' ? 'border-b-2' : 'text-gray-600 hover:text-gray-900'
              }`}
              style={activeTab === 'knowledge' ? {color: '#12464d', borderBottomColor: '#12464d'} : {}}
            >
              Knowledge Base
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-gray-900 relative">
              <span className="text-lg">🔔</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
            </button>
            <div className="hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{backgroundColor: '#f0f9ff'}}>
                <span className="text-sm">👤</span>
              </div>
              <span className="hidden lg:block text-sm font-medium text-gray-700">Dr. Sarah Johnson</span>
              <span className="text-green-500">✓</span>
            </div>
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm"
            >
              Logout
            </button>
            
            {/* Mobile hamburger menu */}
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 bg-white">
            <nav className="flex flex-col space-y-1 pt-4">
              <button
                onClick={() => onSetActiveTab('dashboard')}
                className={`mx-3 px-4 py-3 text-left text-sm font-medium transition-colors rounded-lg ${
                  activeTab === 'dashboard' ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeTab === 'dashboard' ? {backgroundColor: '#12464d'} : {}}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => onSetActiveTab('questions')}
                className={`mx-3 px-4 py-3 text-left text-sm font-medium transition-colors rounded-lg ${
                  activeTab === 'questions' ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeTab === 'questions' ? {backgroundColor: '#12464d'} : {}}
              >
                ❓ Questions
              </button>
              <button
                onClick={() => onSetActiveTab('network')}
                className={`mx-3 px-4 py-3 text-left text-sm font-medium transition-colors rounded-lg ${
                  activeTab === 'network' ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeTab === 'network' ? {backgroundColor: '#12464d'} : {}}
              >
                🏥 Network
              </button>
              <button
                onClick={() => onSetActiveTab('knowledge')}
                className={`mx-3 px-4 py-3 text-left text-sm font-medium transition-colors rounded-lg ${
                  activeTab === 'knowledge' ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeTab === 'knowledge' ? {backgroundColor: '#12464d'} : {}}
              >
                📚 Knowledge Base
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}; 