import React from 'react';
import { Question } from '../types';

interface LandingProps {
  questions: Question[];
  onOpenRegister: () => void;
}

export const Landing: React.FC<LandingProps> = ({ questions, onOpenRegister }) => {
  return (
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
          onClick={onOpenRegister}
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
          {questions.slice(0, 3).map((question) => (
            <div key={question.id} className="border-l-4 pl-4 py-3" style={{borderLeftColor: '#12464d'}}>
              <h3 className="font-medium text-gray-900">{question.title}</h3>
              <p className="text-gray-600 mt-1">{question.content}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{question.author}</span>
                <span>{question.specialty}</span>
                <span>👍 {question.votes}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <button
            onClick={onOpenRegister}
            className="text-sm font-medium hover:underline"
            style={{color: '#12464d'}}
          >
            Join to see more questions and participate →
          </button>
        </div>
      </div>
    </main>
  );
}; 