import React from 'react';

export const Network: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Professional Network</h2>
      <p className="text-gray-600 mb-6">Connect with verified nurse practitioners across South Africa.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{backgroundColor: '#12464d'}}>
              SJ
            </div>
            <div>
              <h3 className="font-semibold">Dr. Sarah Johnson</h3>
              <p className="text-sm text-gray-600">Rural Health</p>
            </div>
            <span className="text-green-500">✓</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">📍 Polokwane, Limpopo</p>
          <p className="text-sm text-gray-600 mb-3">⭐ 4.9 (15 years experience)</p>
          <button className="w-full text-white px-4 py-2 rounded-lg text-sm" style={{backgroundColor: '#12464d'}}>
            Connect
          </button>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold" style={{backgroundColor: '#12464d'}}>
              MV
            </div>
            <div>
              <h3 className="font-semibold">NP Maria Van Der Merwe</h3>
              <p className="text-sm text-gray-600">Primary Care</p>
            </div>
            <span className="text-green-500">✓</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">📍 Cape Town, Western Cape</p>
          <p className="text-sm text-gray-600 mb-3">⭐ 4.8 (12 years experience)</p>
          <button className="w-full text-white px-4 py-2 rounded-lg text-sm" style={{backgroundColor: '#12464d'}}>
            Connect
          </button>
        </div>
      </div>
    </div>
  );
}; 