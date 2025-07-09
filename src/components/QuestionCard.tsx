import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  onClick?: () => void;
  showFullContent?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = React.memo(({
  question,
  onClick,
  showFullContent = false,
}) => {
  const content = showFullContent 
    ? question.content 
    : question.content.length > 150 
      ? `${question.content.substring(0, 150)}...` 
      : question.content;

  return (
    <div 
      className={`border rounded-lg p-4 transition-colors ${
        onClick ? 'cursor-pointer hover:bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      <h3 className="font-medium mb-2 text-gray-900">{question.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{content}</p>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>{question.author}</span>
        <span>{question.specialty}</span>
        <span>👍 {question.votes}</span>
        <span>💬 {question.responses} responses</span>
        {!showFullContent && (
          <span className="text-xs text-gray-400">{question.timestamp}</span>
        )}
      </div>
      {showFullContent && (
        <div className="mt-3 flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

QuestionCard.displayName = 'QuestionCard'; 