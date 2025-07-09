import React from 'react';
import { AuthForm, CredentialsForm } from '../types';

interface AuthModalProps {
  showAuth: boolean;
  authMode: 'login' | 'register';
  registrationStep: number;
  authForm: AuthForm;
  credentialsForm: CredentialsForm;
  onClose: () => void;
  onLogin: () => void;
  onRegisterStep1: () => void;
  onCredentialsSubmit: () => void;
  onUpdateAuthForm: (field: keyof AuthForm, value: string) => void;
  onUpdateCredentialsForm: (field: keyof CredentialsForm, value: string) => void;
  onSwitchToRegister: () => void;
  onSwitchToLogin: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  showAuth,
  authMode,
  registrationStep,
  authForm,
  credentialsForm,
  onClose,
  onLogin,
  onRegisterStep1,
  onCredentialsSubmit,
  onUpdateAuthForm,
  onUpdateCredentialsForm,
  onSwitchToRegister,
  onSwitchToLogin,
}) => {
  if (!showAuth) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {authMode === 'login' ? 'Login' : registrationStep === 1 ? 'Register - Step 1' : 'Register - Credentials'}
            </h2>
            <button
              onClick={onClose}
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
                  onChange={(e) => onUpdateAuthForm('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => onUpdateAuthForm('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={onLogin}
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
                  onClick={onSwitchToRegister}
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
                  onChange={(e) => onUpdateAuthForm('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  value={authForm.lastName}
                  onChange={(e) => onUpdateAuthForm('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => onUpdateAuthForm('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => onUpdateAuthForm('password', e.target.value)}
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
                onClick={onRegisterStep1}
                className="w-full text-white px-4 py-3 rounded-lg hover:opacity-90 font-medium"
                style={{backgroundColor: '#12464d'}}
              >
                Continue to Credentials
              </button>
              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={onSwitchToLogin}
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
                    onChange={(e) => onUpdateCredentialsForm('professionalNumber', e.target.value)}
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
                    onChange={(e) => onUpdateCredentialsForm('qualifications', e.target.value)}
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
                    onChange={(e) => onUpdateCredentialsForm('institution', e.target.value)}
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
                    onClick={() => onSwitchToRegister()}
                    className="flex-1 text-gray-600 px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={onCredentialsSubmit}
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
  );
}; 