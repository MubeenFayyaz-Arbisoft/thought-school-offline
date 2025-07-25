import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Bell,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { NoticeForm } from "@/components/forms/NoticeForm";
import { Notice } from "@/types";


export default function Notices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load sample notices
    const sampleNotices: Notice[] = [
      {
        id: '1',
        title: 'Annual Sports Day - 2024',
        content: 'The annual sports day will be held on March 15th, 2024. All students are requested to participate in various sports activities. Parents are welcome to attend.',
        priority: 'high',
        targetAudience: 'all',
        createdBy: 'Principal',
        createdAt: new Date().toISOString(),
        expiryDate: '2024-03-15',
      },
      {
        id: '2',
        title: 'Parent-Teacher Meeting',
        content: 'Parent-teacher meetings are scheduled for this Saturday. Please check with your class teacher for specific timings.',
        priority: 'medium',
        targetAudience: 'parents',
        createdBy: 'Academic Coordinator',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '3',
        title: 'Library Books Return Reminder',
        content: 'All students who have borrowed books from the library are requested to return them by Friday. Late fees will be applicable after the due date.',
        priority: 'low',
        targetAudience: 'students',
        createdBy: 'Librarian',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: '4',
        title: 'School Closure - Weather Alert',
        content: 'Due to severe weather conditions, the school will remain closed tomorrow. Online classes will be conducted as per regular schedule.',
        priority: 'urgent',
        targetAudience: 'all',
        createdBy: 'Principal',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
    ];
    setNotices(sampleNotices);
  }, []);

  const handleSaveNotice = (notice: Notice) => {
    if (editingNotice) {
      setNotices(prev => prev.map(n => n.id === notice.id ? notice : n));
    } else {
      setNotices(prev => [notice, ...prev]);
    }
    setIsFormOpen(false);
    setEditingNotice(null);
  };

  const handleDeleteNotice = (id: string) => {
    if (window.confirm("Are you sure you want to delete this notice?")) {
      setNotices(prev => prev.filter(n => n.id !== id));
      toast({
        title: "Success",
        description: "Notice deleted successfully",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getAudienceColor = (audience: string) => {
    switch (audience) {
      case 'all': return 'default';
      case 'students': return 'secondary';
      case 'teachers': return 'outline';
      case 'parents': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notices & Announcements
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage school notices and announcements
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Create Notice
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <Bell className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-lg font-semibold">
                  {notices.filter(n => n.priority === 'urgent').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-lg font-semibold">
                  {notices.filter(n => n.priority === 'high').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Bell className="h-4 w-4 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-lg font-semibold">{notices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Eye className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-lg font-semibold">
                  {notices.filter(n => new Date(n.createdAt).toDateString() === new Date().toDateString()).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notices List */}
      <div className="space-y-4">
        {notices.map((notice) => (
          <Card key={notice.id} className="border-border hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg text-foreground">{notice.title}</CardTitle>
                    <Badge variant={getPriorityColor(notice.priority)}>
                      {notice.priority.toUpperCase()}
                    </Badge>
                    <Badge variant={getAudienceColor(notice.targetAudience)}>
                      {notice.targetAudience.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{notice.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(notice.createdAt).toLocaleDateString()}</span>
                    </div>
                    {notice.expiryDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Expires: {new Date(notice.expiryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingNotice(notice); setIsFormOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNotice(notice.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{notice.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {notices.length === 0 && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No notices found</h3>
            <p className="text-muted-foreground text-center">
              Start by creating your first notice or announcement.
            </p>
          </CardContent>
        </Card>
      )}

      <NoticeForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingNotice(null); }}
        noticeToEdit={editingNotice}
        onSave={handleSaveNotice}
      />
    </div>
  );
}