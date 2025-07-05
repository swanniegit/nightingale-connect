import React from 'react';
import { useState } from 'react';

function NightingaleConnect() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [registrationStep, setRegistrationStep] = useState(1);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


// ADD THIS NEW QUESTIONS ARRAY:
const [questions, setQuestions] = useState([
  {
    id: 1,
    title: 'Hypertension management in rural settings',
    content: 'What are the best practices for managing hypertension in patients with limited access to specialists? I\'m working in a remote clinic in Limpopo.',
    author: 'Dr. Sarah Johnson',
    specialty: 'Rural Health',
    province: 'Limpopo',
    votes: 12,
    responses: 3,
    tags: ['hypertension', 'rural', 'chronic-care'],
    timestamp: '2 hours ago'
  },
  {
    id: 2,
    title: 'POPIA compliance for patient records',
    content: 'How do we ensure POPIA compliance when sharing patient information for consultations?',
    author: 'NP Maria Van Der Merwe',
    specialty: 'Primary Care',
    province: 'Western Cape',
    votes: 8,
    responses: 1,
    tags: ['popia', 'compliance', 'telemedicine'],
    timestamp: '5 hours ago'
  },
  {
    id: 3,
    title: 'Pediatric vaccination schedules post-COVID',
    content: 'Have there been any updates to childhood vaccination schedules following COVID-19?',
    author: 'Sister Jane Mthembu',
    specialty: 'Pediatric Care',
    province: 'KwaZulu-Natal',
    votes: 15,
    responses: 7,
    tags: ['pediatric', 'vaccination', 'covid-19'],
    timestamp: '1 day ago'
  },
  {
    id: 4,
    title: 'Mental health resources in townships',
    content: 'What mental health resources are available for patients in township areas?',
    author: 'NP Thabo Mokoena',
    specialty: 'Mental Health',
    province: 'Gauteng',
    votes: 20,
    responses: 12,
    tags: ['mental-health', 'township', 'depression'],
    timestamp: '2 days ago'
  },
  {
    id: 5,
    title: 'Diabetes management without glucometer strips',
    content: 'How can we effectively manage diabetic patients when glucometer strips are in short supply?',
    author: 'Dr. Nomsa Dlamini',
    specialty: 'Endocrinology',
    province: 'Mpumalanga',
    votes: 18,
    responses: 9,
    tags: ['diabetes', 'resource-constraints', 'monitoring'],
    timestamp: '3 days ago'
  }
]);

// Keep your existing state declarations:
 
  const [authForm, setAuthForm] = useState({
    email: '', 
    password: '', 
    firstName: '', 
    lastName: ''
  });

  const [credentialsForm, setCredentialsForm] = useState({
    professionalNumber: '', 
    qualifications: '', 
    institution: ''
  });

function handleLogin() {
  // Test user credentials
  if (authForm.email === 'test@nightingale.co.za' && authForm.password === 'demo123') {
    setIsLoggedIn(true);
    setShowAuth(false);
  } else if (authForm.email === 'sarah@nightingale.co.za' && authForm.password === 'rural123') {
    setIsLoggedIn(true);
    setShowAuth(false);
  } else {
    alert('Invalid credentials. Try:\ntest@nightingale.co.za / demo123\nor\nsarah@nightingale.co.za / rural123');
  }
}

  function handleRegisterStep1() {
    setRegistrationStep(2) ;
  }

  function handleCredentialsSubmit() {
    alert('Registration submitted for verification!');
    setShowAuth(false);
    setRegistrationStep(1);
  }

  function openRegister() {
    setShowAuth(true);
    setAuthMode('register');
    setRegistrationStep(1);
  }

  function openLogin() {
    setShowAuth(true);
    setAuthMode('login');
  }

  function closeAuth() {
    setShowAuth(false);
    setRegistrationStep(1);
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
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
                  onClick={openLogin}
                  className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={openRegister}
                  className="text-white px-4 py-2 rounded-lg hover:opacity-90 text-sm font-medium"
                  style={{backgroundColor: '#12464d'}}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6" style={{color: '#12464d'}}>
              Stop Searching, Start Finding
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Professional network for South African Nurse Practitioners
            </p>
            <p className="text-lg text-gray-500 mb-12">
              Following in Florence's footsteps - connecting SA healthcare professionals
            </p>
            <button
              onClick={openRegister}
              className="text-white px-8 py-4 rounded-lg hover:opacity-90 text-lg font-semibold"
              style={{backgroundColor: '#12464d'}}
            >
              Join Our Network
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold mb-3">Connect with Peers</h3>
              <p className="text-gray-600">Network with verified nurse practitioners across South Africa</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-3">Ask & Answer</h3>
              <p className="text-gray-600">Get expert advice on clinical questions and share your knowledge</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3">Learn Together</h3>
              <p className="text-gray-600">Access clinical guidelines and stay updated with best practices</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">Recent Community Questions</h2>
            <div className="space-y-4">
              <div className="border-l-4 pl-4 py-3" style={{borderLeftColor: '#12464d'}}>
                <h3 className="font-medium text-gray-900">Hypertension management in rural settings</h3>
                <p className="text-gray-600 mt-1">What are the best practices for managing hypertension in patients with limited access to specialists?</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Dr. Sarah Johnson</span>
                  <span>Rural Health</span>
                  <span>👍 12</span>
                </div>
              </div>
              <div className="border-l-4 pl-4 py-3" style={{borderLeftColor: '#12464d'}}>
                <h3 className="font-medium text-gray-900">POPIA compliance for patient records</h3>
                <p className="text-gray-600 mt-1">How do we ensure POPIA compliance when sharing patient information for consultations?</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>NP Maria Van Der Merwe</span>
                  <span>Primary Care</span>
                  <span>👍 8</span>
                </div>
              </div>
              <div className="border-l-4 pl-4 py-3" style={{borderLeftColor: '#12464d'}}>
                <h3 className="font-medium text-gray-900">Pediatric vaccination schedules post-COVID</h3>
                <p className="text-gray-600 mt-1">Have there been any updates to childhood vaccination schedules following COVID-19?</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Sister Jane Mthembu</span>
                  <span>Pediatric Care</span>
                  <span>👍 15</span>
                </div>
              </div>
            </div>
            <div className="text-center mt-6">
              <button
                onClick={openRegister}
                className="text-sm font-medium hover:underline"
                style={{color: '#12464d'}}
              >
                Join to see more questions and participate →
              </button>
            </div>
          </div>
        </main>

        {showAuth && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {authMode === 'login' ? 'Login' : registrationStep === 1 ? 'Register - Step 1' : 'Register - Credentials'}
                  </h2>
                  <button
                    onClick={closeAuth}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {authMode === 'login' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={authForm.email}
                        onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={authForm.password}
                        onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <button
                      onClick={handleLogin}
                      className="w-full text-white px-4 py-3 rounded-lg hover:opacity-90 font-medium"
                      style={{backgroundColor: '#12464d'}}
                    >
                      Login
                    </button>
                    <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-600 font-medium mb-2">Test Accounts:</p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>📧 test@nightingale.co.za</div>
                        <div>🔐 demo123</div>
                        <div className="pt-1">📧 sarah@nightingale.co.za</div>
                        <div>🔐 rural123</div>
                      </div>
                    </div>
                    <p className="text-center text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        onClick={() => {setAuthMode('register'); setRegistrationStep(1);}}
                        className="font-medium hover:underline"
                        style={{color: '#12464d'}}
                      >
                        Register here
                      </button>
                    </p>
                  </div>
                ) : registrationStep === 1 ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                      <input
                        type="text"
                        value={authForm.firstName}
                        onChange={(e) => setAuthForm({...authForm, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        value={authForm.lastName}
                        onChange={(e) => setAuthForm({...authForm, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={authForm.email}
                        onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={authForm.password}
                        onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Specialty</option>
                        <option value="Primary Care">Primary Care</option>
                        <option value="Rural Health">Rural Health</option>
                        <option value="Pediatric Care">Pediatric Care</option>
                        <option value="Emergency Care">Emergency Care</option>
                        <option value="Mental Health">Mental Health</option>
                        <option value="Endocrinology">Endocrinology</option>
                        <option value="Cardiology">Cardiology</option>
                        <option value="Oncology">Oncology</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                        <option value="">Select Province</option>
                        <option value="Eastern Cape">Eastern Cape</option>
                        <option value="Free State">Free State</option>
                        <option value="Gauteng">Gauteng</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="Limpopo">Limpopo</option>
                        <option value="Mpumalanga">Mpumalanga</option>
                        <option value="Northern Cape">Northern Cape</option>
                        <option value="North West">North West</option>
                        <option value="Western Cape">Western Cape</option>
                      </select>
                    </div>
                    <button
                      onClick={handleRegisterStep1}
                      className="w-full text-white px-4 py-3 rounded-lg hover:opacity-90 font-medium"
                      style={{backgroundColor: '#12464d'}}
                    >
                      Continue to Credentials
                    </button>
                    <p className="text-center text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        onClick={() => setAuthMode('login')}
                        className="font-medium hover:underline"
                        style={{color: '#12464d'}}
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Professional Verification Required:</strong> Please provide your professional credentials for verification.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Professional Registration Number *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., SANC Registration Number"
                          value={credentialsForm.professionalNumber}
                          onChange={(e) => setCredentialsForm({...credentialsForm, professionalNumber: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Primary Qualification *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Bachelor of Nursing Science"
                          value={credentialsForm.qualifications}
                          onChange={(e) => setCredentialsForm({...credentialsForm, qualifications: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Institution *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., University of Cape Town"
                          value={credentialsForm.institution}
                          onChange={(e) => setCredentialsForm({...credentialsForm, institution: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Graduation Year *
                        </label>
                        <input
                          type="number"
                          min="1980"
                          max="2024"
                          placeholder="e.g., 2018"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Current Employer *
                        </label>
                        <input
                          type="text"
                          placeholder="e.g., Groote Schuur Hospital"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Professional Reference Contact *
                        </label>
                        <input
                          type="text"
                          placeholder="Name and contact details of a professional reference"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setRegistrationStep(1)}
                          className="flex-1 text-gray-600 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium"
                        >
                          Back
                        </button>
                        <button
                          onClick={handleCredentialsSubmit}
                          className="flex-1 text-white px-4 py-3 rounded-lg hover:opacity-90 font-medium"
                          style={{backgroundColor: '#12464d'}}
                        >
                          Submit for Verification
                        </button>
                      </div>
                      <div className="text-xs text-gray-500 mt-4">
                        * Required fields. Your information will be kept confidential and used only for verification purposes.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
      </div>
    );
  }

return (
  <div className="min-h-screen bg-gray-50">
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
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'dashboard' ? 'border-b-2' : 'text-gray-600 hover:text-gray-900'
              }`}
              style={activeTab === 'dashboard' ? {color: '#12464d', borderBottomColor: '#12464d'} : {}}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'questions' ? 'border-b-2' : 'text-gray-600 hover:text-gray-900'
              }`}
              style={activeTab === 'questions' ? {color: '#12464d', borderBottomColor: '#12464d'} : {}}
            >
              Questions
            </button>
            <button
              onClick={() => setActiveTab('network')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'network' ? 'border-b-2' : 'text-gray-600 hover:text-gray-900'
              }`}
              style={activeTab === 'network' ? {color: '#12464d', borderBottomColor: '#12464d'} : {}}
            >
              Network
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
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
              onClick={() => setIsLoggedIn(false)}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm"
            >
              Logout
            </button>
            
            {/* Mobile hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`mx-3 px-4 py-3 text-left text-sm font-medium transition-colors rounded-lg ${
                  activeTab === 'dashboard' ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeTab === 'dashboard' ? {backgroundColor: '#12464d'} : {}}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab('questions');
                  setMobileMenuOpen(false);
                }}
                className={`mx-3 px-4 py-3 text-left text-sm font-medium transition-colors rounded-lg ${
                  activeTab === 'questions' ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeTab === 'questions' ? {backgroundColor: '#12464d'} : {}}
              >
                ❓ Questions
              </button>
              <button
                onClick={() => {
                  setActiveTab('network');
                  setMobileMenuOpen(false);
                }}
                className={`mx-3 px-4 py-3 text-left text-sm font-medium transition-colors rounded-lg ${
                  activeTab === 'network' ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={activeTab === 'network' ? {backgroundColor: '#12464d'} : {}}
              >
                🏥 Network
              </button>
              <button
                onClick={() => {
                  setActiveTab('knowledge');
                  setMobileMenuOpen(false);
                }}
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

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r text-white rounded-lg p-4 sm:p-6" style={{background: 'linear-gradient(to right, #12464d, #0f3a40)'}}>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome to Nightingale Connect</h1>
            <p className="text-gray-100 text-sm sm:text-base">Stop Searching, Start Finding. Your trusted professional network.</p>
            <p className="text-gray-200 text-xs sm:text-sm mt-2">Following in Florence's footsteps - connecting SA nurse practitioners.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Active Questions</p>
                    <p className="text-lg sm:text-2xl font-bold" style={{color: '#12464d'}}>{questions.length}</p>
                  </div>
                  <span className="text-2xl">💬</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Responses</p>
                    <p className="text-lg sm:text-2xl font-bold" style={{color: '#0f7c3a'}}>{questions.reduce((total, q) => total + q.responses, 0)}</p>
                  </div>
                  <span className="text-2xl">💬</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Votes</p>
                    <p className="text-lg sm:text-2xl font-bold" style={{color: '#7c2d12'}}>{questions.reduce((total, q) => total + q.votes, 0)}</p>
                  </div>
                  <span className="text-2xl">👍</span>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Specialties</p>
                    <p className="text-lg sm:text-2xl font-bold" style={{color: '#c2410c'}}>8</p>
                  </div>
                  <span className="text-2xl">🏥</span>
                </div>
              </div>
            <div className="bg-white rounded-lg shadow p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Verified NPs</p>
                  <p className="text-lg sm:text-2xl font-bold" style={{color: '#0f7c3a'}}>234</p>
                </div>
                <span className="text-2xl">👥</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Knowledge Base</p>
                  <p className="text-lg sm:text-2xl font-bold" style={{color: '#7c2d12'}}>156</p>
                </div>
                <span className="text-2xl">📚</span>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Rural Connections</p>
                  <p className="text-lg sm:text-2xl font-bold" style={{color: '#c2410c'}}>23</p>
                </div>
                <span className="text-2xl">📍</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Questions</h2>
            <div className="space-y-4">
              <div className="border-l-4 pl-4 py-2" style={{borderLeftColor: '#12464d'}}>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">Hypertension management in rural settings</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">What are the best practices for managing hypertension in patients with limited access to specialists?</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                  <span>By Dr. Sarah Johnson</span>
                  <span>2 hours ago</span>
                  <span>3 responses</span>
                  <span className="flex items-center gap-1">
                    👍 12
                  </span>
                </div>
              </div>
              <div className="border-l-4 pl-4 py-2" style={{borderLeftColor: '#12464d'}}>
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">POPIA compliance for patient records</h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">How do we ensure POPIA compliance when sharing patient information for consultations?</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                  <span>By NP Maria Van Der Merwe</span>
                  <span>5 hours ago</span>
                  <span>1 responses</span>
                  <span className="flex items-center gap-1">
                    👍 8
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={() => setActiveTab('questions')}
                className="text-sm font-medium hover:underline transition-colors"
                style={{color: '#12464d'}}
              >
                View all questions →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">Questions & Answers</h2>
          <p className="text-gray-600 mb-4">Ask questions, share knowledge, and connect with fellow NPs.</p>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">How do you handle difficult family dynamics in pediatric care?</h3>
              <p className="text-gray-600 text-sm mb-3">When families disagree on treatment plans, what strategies work best?</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Sister Mary Ndaba</span>
                <span>Pediatric Care</span>
                <span>👍 5</span>
                <span>💬 3 responses</span>
              </div>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Best practices for wound care in diabetic patients?</h3>
              <p className="text-gray-600 text-sm mb-3">Looking for evidence-based approaches to diabetic foot ulcer management.</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>NP John Molefe</span>
                <span>Primary Care</span>
                <span>👍 8</span>
                <span>💬 6 responses</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Network Tab */}
      {activeTab === 'network' && (
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
      )}

      {/* Knowledge Base Tab */}
      {activeTab === 'knowledge' && (
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
      )}

    </main>
  </div>
);
}

export default NightingaleConnect;
