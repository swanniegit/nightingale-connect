import { AISuggestion as AISuggestionType } from '@shared/schema';
import { Button } from '@/components/ui/button.tsx';
import { Bot, Brain, ExternalLink, AlertTriangle, Lock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient.ts';

interface AISuggestionProps {
  suggestion: AISuggestionType;
  onOpenFAQ: (faqId?: number) => void;
  onOpenEducation: (contentId?: number) => void;
}

export default function AISuggestion({
  suggestion,
  onOpenFAQ,
  onOpenEducation,
}: AISuggestionProps) {
  const isLLM = suggestion.suggestionType === 'llm';
  const isUpgrade = suggestion.suggestionType === 'upgrade';
  
  // Fetch FAQ data for local suggestions
  const { data: faqData } = useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/faqs');
      return res.json();
    },
    enabled: !isLLM && !isUpgrade && suggestion.faqReferences.length > 0,
  });

  // Fetch education data for local suggestions
  const { data: educationData } = useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/education');
      return res.json();
    },
    enabled: !isLLM && !isUpgrade && suggestion.educationReferences.length > 0,
  });

  const bgColor = isLLM ? 'bg-purple-50' : 'bg-yellow-50';
  const borderColor = isLLM ? 'border-purple-200' : 'border-yellow-200';
  const iconBg = isLLM ? 'bg-purple-500' : 'bg-yellow-500';
  const labelText = isLLM ? 'AI Response' : 'AI Suggestion';

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4 ml-11 shadow-sm`}>
      <div className="flex items-start space-x-3">
        <div className={`w-6 h-6 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
          {isLLM ? (
            <Brain className="text-white w-3 h-3" />
          ) : (
            <Bot className="text-white w-3 h-3" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs font-medium text-gray-700">{labelText}</span>
            {isLLM && (
              <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                GPT-4
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-800 mb-3">
            <div 
              dangerouslySetInnerHTML={{ 
                __html: suggestion.suggestion.replace(/\n/g, '<br>') 
              }} 
            />
          </div>
          
          {/* FAQ References for local suggestions */}
          {!isLLM && !isUpgrade && suggestion.faqReferences.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-2">Related FAQs:</p>
              <div className="flex flex-wrap gap-2">
                {suggestion.faqReferences.map((faqId) => {
                  const faq = faqData?.find((f: any) => f.id === faqId);
                  return faq ? (
                    <Button
                      key={faqId}
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenFAQ(faqId)}
                      className="text-xs h-auto py-1 px-2"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      {faq.question.length > 50 ? `${faq.question.substring(0, 50)}...`