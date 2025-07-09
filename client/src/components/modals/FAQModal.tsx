import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, ChevronDown, Pill, Heart, Gavel, Edit, Trash2, X, Save, Plus, Edit3, MessageSquare } from 'lucide-react';
import { FAQ } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import WoundCareChat from '@/components/chat/WoundCareChat';

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightFaqId?: number;
}

export default function FAQModal({ isOpen, onClose, highlightFaqId }: FAQModalProps) {
  const [activeTab, setActiveTab] = useState('faqs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editingAnswerId, setEditingAnswerId] = useState<number | null>(null);
  const [editAnswerText, setEditAnswerText] = useState('');
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Auto-open highlighted FAQ when modal opens and clear filters to show it
  useEffect(() => {
    if (isOpen && highlightFaqId) {
      // Switch to FAQ tab and clear search and category filters to ensure the highlighted FAQ is visible
      setActiveTab('faqs');
      setSearchQuery('');
      setSelectedCategory('');
      setOpenItems(prev => new Set(prev).add(highlightFaqId));
      
      // Scroll to the highlighted FAQ after a brief delay
      setTimeout(() => {
        const element = document.getElementById(`faq-${highlightFaqId}`);
        if (element) {
          // Get the scroll container
          const scrollContainer = element.closest('[data-radix-scroll-area-viewport]');
          if (scrollContainer) {
            const elementTop = element.offsetTop;
            const containerTop = scrollContainer.scrollTop;
            // Scroll to position the element at the top with some padding
            scrollContainer.scrollTo({
              top: elementTop - 20, // 20px padding from top
              behavior: 'smooth'
            });
          } else {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 300);
    }
  }, [isOpen, highlightFaqId]);

  const { data: allFaqs = [], isLoading } = useQuery({
    queryKey: ['/api/faqs'],
    enabled: isOpen,
  });

  // Client-side filtering for real-time search
  const faqs = allFaqs.filter((faq: FAQ) => {
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (faq.tags && faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from the actual FAQ data (using allFaqs for complete list)
  const uniqueCategories = [...new Set(allFaqs.map(faq => faq.category))];
  
  const categories = uniqueCategories.map(category => ({
    id: category,
    name: category,
    icon: category.includes('Clinical') ? Heart : 
          category.includes('Product') ? Pill : 
          category.includes('Professional') ? Gavel : Heart,
    color: category.includes('Clinical') ? 'text-green-600' :
           category.includes('Product') ? 'text-blue-600' :
           category.includes('Professional') ? 'text-purple-600' :
           category.includes('Medical Aid') ? 'text-red-600' :
           category.includes('Finding') ? 'text-indigo-600' : 'text-gray-600'
  }));

  const groupedFAQs = faqs.reduce((acc: Record<string, FAQ[]>, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            FAQ & Wound Care Assistant
            {highlightFaqId && (
              <span className="ml-2 text-sm text-blue-600 font-normal">
                (Showing FAQ #{highlightFaqId} from AI suggestion)
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full w-full">
          <TabsList className="grid grid-cols-2 mx-4 mt-4 w-auto max-w-[calc(100%-2rem)]">
            <TabsTrigger value="faqs" className="flex items-center gap-2 text-sm">
              <Search className="w-4 h-4" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="wound-care" className="flex items-center gap-2 text-sm">
              <MessageSquare className="w-4 h-4" />
              Chat with AI about woundcare
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faqs" className="p-6 space-y-6 flex-1">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('')}
                className="text-xs"
              >
                All Categories
              </Button>
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="text-xs flex items-center gap-1"
                  >
                    <IconComponent className={`w-3 h-3 ${category.color}`} />
                    {category.name}
                  </Button>
                );
              })}
            </div>

            <ScrollArea className="h-[60vh]">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading FAQs...</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No FAQs found. Try adjusting your search.</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <Collapsible key={faq.id} open={openItems.has(faq.id)}>
                    <CollapsibleTrigger asChild>
                      <Button
                        id={`faq-${faq.id}`}
                        variant="ghost"
                        className={`w-full justify-between p-4 h-auto text-left ${
                          highlightFaqId === faq.id 
                            ? 'bg-blue-50 hover:bg-blue-100 border-2 border-blue-200' 
                            : 'bg-white hover:bg-gray-50'
                        }`}
                        onClick={() => toggleItem(faq.id)}
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                          openItems.has(faq.id) ? 'rotate-180' : ''
                        }`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 pb-4">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      {faq.tags && Array.isArray(faq.tags) && faq.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {faq.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {categories.map((category) => {
                  const categoryFAQs = groupedFAQs[category.id] || [];
                  const IconComponent = category.icon;
                  
                  if (categoryFAQs.length === 0) return null;
                  
                  return (
                    <div key={category.id} className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <IconComponent className={`w-5 h-5 mr-2 ${category.color}`} />
                        {category.name}
                      </h3>
                      
                      <div className="space-y-3">
                        {categoryFAQs.map((faq) => (
                          <Collapsible key={faq.id} open={openItems.has(faq.id)}>
                            <CollapsibleTrigger asChild>
                              <Button
                                id={`faq-${faq.id}`}
                                variant="ghost"
                                className={`w-full justify-between p-4 h-auto text-left ${
                                  highlightFaqId === faq.id 
                                    ? 'bg-blue-50 hover:bg-blue-100 border-2 border-blue-200' 
                                    : 'bg-white hover:bg-gray-50'
                                }`}
                                onClick={() => toggleItem(faq.id)}
                              >
                                <span className="font-medium text-gray-900">{faq.question}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                                  openItems.has(faq.id) ? 'rotate-180' : ''
                                }`} />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-4 pb-4">
                              <div className="bg-gray-50 rounded-lg p-4">
                                {editingAnswerId === faq.id ? (
                                  <div className="space-y-3">
                                    <Textarea
                                      value={editAnswerText}
                                      onChange={(e) => setEditAnswerText(e.target.value)}
                                      placeholder="Enter FAQ answer..."
                                      className="min-h-[100px]"
                                    />
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        size="sm"
                                        onClick={async () => {
                                          try {
                                            await apiRequest('PATCH', '/api/faqs/' + faq.id, { answer: editAnswerText });
                                            queryClient.invalidateQueries({ queryKey: ['/api/faqs'] });
                                            setEditingAnswerId(null);
                                            setEditAnswerText('');
                                            toast({ title: "FAQ answer updated successfully!" });
                                          } catch (error) {
                                            console.error('FAQ update error:', error);
                                            toast({ title: "Failed to update FAQ answer", variant: "destructive" });
                                          }
                                        }}
                                      >
                                        <Save className="w-4 h-4 mr-1" />
                                        Save
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditingAnswerId(null);
                                          setEditAnswerText('');
                                        }}
                                      >
                                        <X className="w-4 h-4 mr-1" />
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{faq.answer}</p>
                                    {isAdmin && (
                                      <div className="flex items-center space-x-2 mt-3">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setEditingAnswerId(faq.id);
                                            setEditAnswerText(faq.answer);
                                          }}
                                        >
                                          <Edit3 className="w-4 h-4 mr-1" />
                                          Edit Answer
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={async () => {
                                            if (confirm('Are you sure you want to delete this FAQ?')) {
                                              try {
                                                await apiRequest('DELETE', '/api/faqs/' + faq.id);
                                                queryClient.invalidateQueries({ queryKey: ['/api/faqs'] });
                                                toast({ title: "FAQ deleted successfully!" });
                                              } catch (error) {
                                                console.error('FAQ deletion error:', error);
                                                toast({ title: "Failed to delete FAQ", variant: "destructive" });
                                              }
                                            }
                                          }}
                                        >
                                          <Trash2 className="w-4 h-4 mr-1" />
                                          Delete
                                        </Button>
                                      </div>
                                    )}
                                    {faq.tags && Array.isArray(faq.tags) && faq.tags.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-3">
                                        {faq.tags.map((tag, index) => (
                                          <span
                                            key={index}
                                            className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </div>
                  );
                })}
                
                {Object.keys(groupedFAQs).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No FAQs found matching your search.</p>
                  </div>
                )}
              </div>
            )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="wound-care" className="p-6 flex-1">
            <WoundCareChat />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
