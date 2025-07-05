import React from 'react';
import { useState } from 'react';

function NightingaleConnect() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [registrationStep, setRegistrationStep] = useState(1);

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
    setIsLoggedIn(true);
    setShowAuth(false);
  }

  function handleRegisterStep1() {
    setRegistrationStep(2);
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
              <h
