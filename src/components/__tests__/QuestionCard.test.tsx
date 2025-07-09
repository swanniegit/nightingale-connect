import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionCard } from '../QuestionCard';
import { Question } from '../../types';

const mockQuestion: Question = {
  id: 1,
  title: 'Test Question Title',
  content: 'This is a test question content that should be displayed properly.',
  author: 'Dr. Test User',
  specialty: 'Primary Care',
  province: 'Gauteng',
  votes: 10,
  responses: 3,
  tags: ['test', 'primary-care'],
  timestamp: '2 hours ago'
};

describe('QuestionCard', () => {
  it('renders question information correctly', () => {
    render(<QuestionCard question={mockQuestion} />);
    
    expect(screen.getByText('Test Question Title')).toBeInTheDocument();
    expect(screen.getByText('This is a test question content that should be displayed properly.')).toBeInTheDocument();
    expect(screen.getByText('Dr. Test User')).toBeInTheDocument();
    expect(screen.getByText('Primary Care')).toBeInTheDocument();
    expect(screen.getByText('👍 10')).toBeInTheDocument();
    expect(screen.getByText('💬 3 responses')).toBeInTheDocument();
  });

  it('truncates long content when showFullContent is false', () => {
    const longQuestion = {
      ...mockQuestion,
      content: 'A'.repeat(200) // Very long content
    };
    
    render(<QuestionCard question={longQuestion} />);
    
    const content = screen.getByText(/A{150}/);
    expect(content).toBeInTheDocument();
    expect(content.textContent).toContain('...');
  });

  it('shows full content when showFullContent is true', () => {
    const longQuestion = {
      ...mockQuestion,
      content: 'A'.repeat(200)
    };
    
    render(<QuestionCard question={longQuestion} showFullContent={true} />);
    
    const content = screen.getByText('A'.repeat(200));
    expect(content).toBeInTheDocument();
    expect(content.textContent).not.toContain('...');
  });

  it('displays tags when showFullContent is true', () => {
    render(<QuestionCard question={mockQuestion} showFullContent={true} />);
    
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('primary-care')).toBeInTheDocument();
  });

  it('does not display tags when showFullContent is false', () => {
    render(<QuestionCard question={mockQuestion} showFullContent={false} />);
    
    expect(screen.queryByText('test')).not.toBeInTheDocument();
    expect(screen.queryByText('primary-care')).not.toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<QuestionCard question={mockQuestion} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Test Question Title'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies hover styles when onClick is provided', () => {
    render(<QuestionCard question={mockQuestion} onClick={() => {}} />);
    
    const card = screen.getByText('Test Question Title').closest('div');
    expect(card).toHaveClass('cursor-pointer', 'hover:bg-gray-50');
  });

  it('does not apply hover styles when onClick is not provided', () => {
    render(<QuestionCard question={mockQuestion} />);
    
    const card = screen.getByText('Test Question Title').closest('div');
    expect(card).not.toHaveClass('cursor-pointer', 'hover:bg-gray-50');
  });
}); 