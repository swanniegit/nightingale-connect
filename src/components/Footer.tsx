import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 rounded flex items-center justify-center" style={{backgroundColor: '#12464d'}}>
              <span className="text-white font-bold text-xs">NC</span>
            </div>
            <span className="font-semibold" style={{color: '#12464d'}}>Nightingale Connect</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">Professional network for South African Nurse Practitioners</p>
          <p className="text-xs text-gray-500">&copy; 2024 Nightingale Connect. Built for SA NPs.</p>
        </div>
      </div>
    </footer>
  );
}; 