import React from 'react';
import { Question } from '../types';

interface QuestionsProps {
  questions: Question[];
}

export const Questions: React.FC<QuestionsProps> = ({ questions }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Questions & Answers</h2>
      <p className="text-gray-600 mb-4">Ask questions, share knowledge, and connect with fellow NPs.</p>
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">{question.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{question.content}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{question.author}</span>
              <span>{question.specialty}</span>
              <span>👍 {question.votes}</span>
              <span>💬 {question.responses} responses</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 