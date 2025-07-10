import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog.tsx';
import { Input } from '@/components/ui/input.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Search, ClipboardCheck, Pill, Video, Star, Download, Eye, FileText, Plus, Edit3, Trash2 } from 'lucide-react';
import { EducationalContent } from '@shared/schema';
import { useAuth } from '@/hooks/useAuth.ts';
import { Button } from '@/components/ui/button.tsx';
import { Textarea } from '@/components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';
import { apiRequest, queryClient } from '@/lib/queryClient.ts';
import { useToast } from '@/hooks/use-toast.ts';

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EducationModal({ isOpen, onClose }: EducationModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatingBlog, setIsCreatingBlog] = useState(false);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [expandedContent, setExpandedContent] = useState<number | null>(null);
  
  const isAdmin = user?.role === 'admin';

  const { data: educationalContent = [], isLoading } = useQuery({
    queryKey: ['/api/education'],
    enabled: isOpen,
  });

  // Filter content based on search
  const filteredContent = educationalContent.filter((content: EducationalContent) =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    content.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            Educational Resources
            {isAdmin && (
              <Button
                onClick={() => setIsCreatingBlog(true)}
                size="sm"
                className="ml-4"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Blog Post
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Blog Creation Form */}
          {isCreatingBlog && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-blue-900">Create New Blog Post</h3>
              <Input
                placeholder="Blog post title..."
                value={blogTitle}
                onChange={(e) => setBlogTitle(e.target.value)}
              />
              <div className="space-y-2">
                <Select value={blogCategory} onValueChange={setBlogCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Blog Posts">Blog Posts</SelectItem>
                    <SelectItem value="Clinical Guidelines">Clinical Guidelines</SelectItem>
                    <SelectItem value="Procedures">Procedures</SelectItem>
                    <SelectItem value="Best Practices">Best Practices</SelectItem>
                    <SelectItem value="Case Studies">Case Studies</SelectItem>
                    <SelectItem value="custom">Add a new category</SelectItem>
                  </SelectContent>
                </Select>
                {blogCategory === 'custom' && (
                  <Input
                    placeholder="Enter custom category..."
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                  />
                )}
              </div>
              <Textarea
                placeholder="Write your blog post content..."
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={async () => {
                    try {
                      await apiRequest('POST', '/api/education', {
                        title: blogTitle,
                        content: blogContent,
                        category: blogCategory === 'custom' ? customCategory : blogCategory || 'Blog Posts',
                        contentType: 'blog',
                        isFeatured: false,
                        tags: ['blog', 'admin-created']
                      });
                      
                      queryClient.invalidateQueries({ queryKey: ['/api/education'] });
                      
                      // Reset form
                      setBlogTitle('');
                      setBlogContent('');
                      setBlogCategory('');
                      setCustomCategory('');
                      setIsCreatingBlog(false);
                      
                      toast({ title: "Blog post created successfully!" });
                    } catch (error) {
                      console.error('Blog creation error:', error);
                      toast({ title: "Failed to create blog post", variant: "destructive" });
                    }
                  }}
                  size="sm"
                >
                  Create Post
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreatingBlog(false);
                    setBlogTitle('');
                    setBlogContent('');
                    setBlogCategory('');
                    setCustomCategory('');
                  }}
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search educational content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[60vh]">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading educational content...</p>
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No educational content found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContent.map((content: EducationalContent) => (
                  <div key={content.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {content.contentType === 'protocol' ? (
                          <Pill className="w-6 h-6 text-blue-600" />
                        ) : content.contentType === 'video' ? (
                          <Video className="w-6 h-6 text-blue-600" />
                        ) : (
                          <ClipboardCheck className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-gray-900">{content.title}</h4>
                          {content.isFeatured && (
                            <Star className="w-5 h-5 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {expandedContent === content.id ? (
                            <div className="space-y-2">
                              <p className="whitespace-pre-wrap">{content.content}</p>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExpandedContent(null)}
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  Show less
                                </Button>
                                {user?.role === 'admin' && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={async () => {
                                      if (confirm('Are you sure you want to delete this educational content?')) {
                                        try {
                                          await apiRequest('DELETE', '/api/education/' + content.id);
                                          queryClient.invalidateQueries({ queryKey: ['/api/education'] });
                                          toast({ title: "Educational content deleted successfully!" });
                                        } catch (error) {
                                          console.error('Education deletion error:', error);
                                          toast({ title: "Failed to delete educational content", variant: "destructive" });
                                        }
                                      }
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete
                                  </Button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div>
                              <p>
                                {content.content.length > 200 
                                  ? `${content.content.substring(0, 200)}...` 
                                  : content.content}
                              </p>
                              {content.content.length > 200 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setExpandedContent(content.id)}
                                  className="text-blue-600 hover:text-blue-800 mt-1"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Read more
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Document attachments */}
                        {content.attachments && Array.isArray(content.attachments) && content.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {content.attachments.map((attachment: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                <div className="flex items-center space-x-2">
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm font-medium text-gray-700">
                                    {attachment.originalName || 'Document'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {attachment.size ? `${Math.round(attachment.size / 1024)} KB` : ''}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => {
                                      const filename = attachment.filename || attachment.originalName;
                                      if (filename) {
                                        const link = document.createElement('a');
                                        link.href = `/api/attachments/${filename}`;
                                        link.download = attachment.originalName || filename;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                      }
                                    }}
                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                    title="Download document"
                                    disabled={!attachment.filename && !attachment.originalName}
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {content.contentType}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {content.category}
                            </Badge>
                            {content.tags && Array.isArray(content.tags) && content.tags.length > 0 && (
                              content.tags.slice(0, 2).map((tag: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))
                            )}
                          </div>
                          {user?.role === 'admin' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={async () => {
                                if (confirm('Are you sure you want to delete this educational content?')) {
                                  try {
                                    await apiRequest('DELETE', '/api/education/' + content.id);
                                    queryClient.invalidateQueries({ queryKey: ['/api/education'] });
                                    toast({ title: "Educational content deleted successfully!" });
                                  } catch (error) {
                                    console.error('Education deletion error:', error);
                                    toast({ title: "Failed to delete educational content", variant: "destructive" });
                                  }
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}