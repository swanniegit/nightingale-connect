import React from 'react';
import { Question, DashboardStats } from '../types';

interface DashboardProps {
  questions: Question[];
  onSetActiveTab: (tab: 'questions') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ questions, onSetActiveTab }) => {
  const stats: DashboardStats = {
    activeQuestions: questions.length,
    totalResponses: questions.reduce((total, q) => total + q.responses, 0),
    totalVotes: questions.reduce((total, q) => total + q.votes, 0),
    specialties: 8,
    verifiedNPs: 234,
    knowledgeBase: 156,
    ruralConnections: 23,
  };

  return (
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
              <p className="text-lg sm:text-2xl font-bold" style={{color: '#12464d'}}>{stats.activeQuestions}</p>
            </div>
            <span className="text-2xl">💬</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Responses</p>
              <p className="text-lg sm:text-2xl font-bold" style={{color: '#0f7c3a'}}>{stats.totalResponses}</p>
            </div>
            <span className="text-2xl">💬</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Total Votes</p>
              <p className="text-lg sm:text-2xl font-bold" style={{color: '#7c2d12'}}>{stats.totalVotes}</p>
            </div>
            <span className="text-2xl">👍</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Specialties</p>
              <p className="text-lg sm:text-2xl font-bold" style={{color: '#c2410c'}}>{stats.specialties}</p>
            </div>
            <span className="text-2xl">🏥</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Verified NPs</p>
              <p className="text-lg sm:text-2xl font-bold" style={{color: '#0f7c3a'}}>{stats.verifiedNPs}</p>
            </div>
            <span className="text-2xl">👥</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Knowledge Base</p>
              <p className="text-lg sm:text-2xl font-bold" style={{color: '#7c2d12'}}>{stats.knowledgeBase}</p>
            </div>
            <span className="text-2xl">📚</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Rural Connections</p>
              <p className="text-lg sm:text-2xl font-bold" style={{color: '#c2410c'}}>{stats.ruralConnections}</p>
            </div>
            <span className="text-2xl">📍</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Recent Questions</h2>
        <div className="space-y-4">
          {questions.slice(0, 2).map((question) => (
            <div key={question.id} className="border-l-4 pl-4 py-2" style={{borderLeftColor: '#12464d'}}>
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">{question.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{question.content}</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-500">
                <span>By {question.author}</span>
                <span>{question.timestamp}</span>
                <span>{question.responses} responses</span>
                <span className="flex items-center gap-1">
                  👍 {question.votes}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button
            onClick={() => onSetActiveTab('questions')}
            className="text-sm font-medium hover:underline transition-colors"
            style={{color: '#12464d'}}
          >
            View all questions →
          </button>
        </div>
      </div>
    </div>
  );
}; 