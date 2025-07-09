import React from 'react';

export const Knowledge: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Knowledge Base</h2>
      <p className="text-gray-600 mb-6">Access clinical guidelines, protocols, and educational resources.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-3xl mb-3">🏥</div>
          <h3 className="font-semibold mb-2">Clinical Guidelines</h3>
          <p className="text-sm text-gray-600 mb-4">Evidence-based protocols for SA healthcare</p>
          <button className="text-sm font-medium hover:underline" style={{color: '#12464d'}}>
            Browse Guidelines →
          </button>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="text-3xl mb-3">📋</div>
          <h3 className="font-semibold mb-2">Case Studies</h3>
          <p className="text-sm text-gray-600 mb-4">Real-world cases from SA practitioners</p>
          <button className="text-sm font-medium hover:underline" style={{color: '#12464d'}}>
            View Cases →
          </button>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="text-3xl mb-3">🔒</div>
          <h3 className="font-semibold mb-2">POPIA Compliance</h3>
          <p className="text-sm text-gray-600 mb-4">Data protection guidelines</p>
          <button className="text-sm font-medium hover:underline" style={{color: '#12464d'}}>
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}; 