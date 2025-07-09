import { useState, useCallback } from 'react';
import { AuthState, AuthForm, CredentialsForm } from '../types';

const initialAuthState: AuthState = {
  isLoggedIn: false,
  showAuth: false,
  authMode: 'login',
  registrationStep: 1,
};

const initialAuthForm: AuthForm = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
};

const initialCredentialsForm: CredentialsForm = {
  professionalNumber: '',
  qualifications: '',
  institution: '',
};

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [authForm, setAuthForm] = useState<AuthForm>(initialAuthForm);
  const [credentialsForm, setCredentialsForm] = useState<CredentialsForm>(initialCredentialsForm);

  const handleLogin = useCallback(() => {
    // Test user credentials
    if (authForm.email === 'test@nightingale.co.za' && authForm.password === 'demo123') {
      setAuthState(prev => ({ ...prev, isLoggedIn: true, showAuth: false }));
    } else if (authForm.email === 'sarah@nightingale.co.za' && authForm.password === 'rural123') {
      setAuthState(prev => ({ ...prev, isLoggedIn: true, showAuth: false }));
    } else {
      alert('Invalid credentials. Try:\ntest@nightingale.co.za / demo123\nor\nsarah@nightingale.co.za / rural123');
    }
  }, [authForm]);

  const handleRegisterStep1 = useCallback(() => {
    setAuthState(prev => ({ ...prev, registrationStep: 2 }));
  }, []);

  const handleCredentialsSubmit = useCallback(() => {
    alert('Registration submitted for verification!');
    setAuthState(prev => ({ ...prev, showAuth: false, registrationStep: 1 }));
  }, []);

  const openRegister = useCallback(() => {
    setAuthState(prev => ({ ...prev, showAuth: true, authMode: 'register', registrationStep: 1 }));
  }, []);

  const openLogin = useCallback(() => {
    setAuthState(prev => ({ ...prev, showAuth: true, authMode: 'login' }));
  }, []);

  const closeAuth = useCallback(() => {
    setAuthState(prev => ({ ...prev, showAuth: false, registrationStep: 1 }));
  }, []);

  const logout = useCallback(() => {
    setAuthState(initialAuthState);
    setAuthForm(initialAuthForm);
    setCredentialsForm(initialCredentialsForm);
  }, []);

  const updateAuthForm = useCallback((field: keyof AuthForm, value: string) => {
    setAuthForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateCredentialsForm = useCallback((field: keyof CredentialsForm, value: string) => {
    setCredentialsForm(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    authState,
    authForm,
    credentialsForm,
    handleLogin,
    handleRegisterStep1,
    handleCredentialsSubmit,
    openRegister,
    openLogin,
    closeAuth,
    logout,
    updateAuthForm,
    updateCredentialsForm,
  };
}; 