import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Search, 
  BookOpen, 
  Calendar,
  Target,
  Clock,
  CheckCircle,
  User,
  School,
  Edit,
  Trash2
} from "lucide-react";
import { SubjectStorage, TeacherStorage, ClassStorage } from "@/lib/storage";
import { Subject, Teacher, Class, Syllabus } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { SyllabusForm } from "@/components/forms/SyllabusForm";

export default function SyllabusPage() {
  const [syllabusRecords, setSyllabusRecords] = useState<Syllabus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState<Syllabus | null>(null);
  const { toast } = useToast();

  const subjects = SubjectStorage.getAll();
  const teachers = TeacherStorage.getAll();
  const classes = ClassStorage.getAll();

  useEffect(() => {
    loadSyllabusData();
  }, []);

  const loadSyllabusData = () => {
    // Generate sample syllabus records
    const sampleSyllabus: Syllabus[] = subjects.slice(0, 8).map((subject, index) => {
      const teacher = teachers[index % teachers.length];
      const relatedClasses = classes.filter(c => c.subjects.includes(subject.id));
      
      return {
        id: `syllabus-${subject.id}-${index}`,
        title: `${subject.name} Curriculum - ${new Date().getFullYear()}`,
        description: `Comprehensive ${subject.name.toLowerCase()} syllabus covering all essential topics and practical applications.`,
        subjectId: subject.id,
        teacherId: teacher?.id || '',
        classIds: relatedClasses.map(c => c.id),
        grade: relatedClasses[0]?.grade || '1',
        targetType: index % 2 === 0 ? 'monthly' : 'weekly',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + (index % 2 === 0 ? 1 : 0) + 1, 0).toISOString().split('T')[0],
        topics: [
          `Introduction to ${subject.name}`,
          'Fundamental Concepts',
          'Practical Applications',
          'Advanced Topics',
          'Assessment and Evaluation'
        ],
        learningObjectives: [
          'Understand core principles',
          'Apply knowledge practically',
          'Develop critical thinking',
          'Master essential skills'
        ],
        assessmentMethods: ['Written Tests', 'Practical Assignments', 'Projects', 'Presentations'],
        resources: ['Textbooks', 'Online Materials', 'Laboratory Equipment', 'Digital Tools'],
        status: ['planned', 'in-progress', 'completed', 'delayed'][index % 4] as any,
        progressPercentage: Math.floor(Math.random() * 100),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
    
    setSyllabusRecords(sampleSyllabus);
  };

  const handleSaveSyllabus = (syllabus: Syllabus) => {
    if (editingSyllabus) {
      setSyllabusRecords(prev => prev.map(s => s.id === syllabus.id ? syllabus : s));
    } else {
      setSyllabusRecords(prev => [syllabus, ...prev]);
    }
    setIsFormOpen(false);
    setEditingSyllabus(null);
  };

  const handleUpdateProgress = (record: Syllabus) => {
    const newProgress = prompt(`Update progress for "${record.title}" (0-100):`, record.progressPercentage.toString());
    
    if (newProgress !== null) {
      const progressValue = parseInt(newProgress);
      if (!isNaN(progressValue) && progressValue >= 0 && progressValue <= 100) {
        updateProgress(record.id, progressValue);
      } else {
        toast({
          title: "Error",
          description: "Please enter a valid progress value between 0 and 100",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteSyllabus = (id: string) => {
    if (window.confirm("Are you sure you want to delete this syllabus?")) {
      setSyllabusRecords(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Success",
        description: "Syllabus deleted successfully",
      });
    }
  };

  const filteredRecords = syllabusRecords.filter(record => {
    const subject = subjects.find(s => s.id === record.subjectId);
    const teacher = teachers.find(t => t.id === record.teacherId);
    
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = gradeFilter === 'all' || record.grade === gradeFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesGrade && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'planned': return 'secondary';
      case 'delayed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      case 'planned': return Calendar;
      case 'delayed': return Target;
      default: return BookOpen;
    }
  };

  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject?.name || 'Unknown Subject';
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher?.name || 'Unassigned';
  };

  const getClassNames = (classIds: string[]) => {
    return classIds.map(id => {
      const classData = classes.find(c => c.id === id);
      return classData?.name || 'Unknown';
    }).join(', ');
  };

  const updateProgress = (recordId: string, newProgress: number) => {
    setSyllabusRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { 
            ...record, 
            progressPercentage: newProgress,
            status: newProgress === 100 ? 'completed' : 'in-progress'
          }
        : record
    ));
    
    toast({
      title: "Success",
      description: "Syllabus progress updated successfully",
    });
  };

  // Calculate summary stats
  const totalSyllabus = filteredRecords.length;
  const completedSyllabus = filteredRecords.filter(r => r.status === 'completed').length;
  const inProgressSyllabus = filteredRecords.filter(r => r.status === 'in-progress').length;
  const averageProgress = filteredRecords.reduce((sum, r) => sum + r.progressPercentage, 0) / (totalSyllabus || 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Syllabus Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage curriculum progress and targets
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Syllabus
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Syllabus
            </CardTitle>
            <BookOpen className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalSyllabus}</div>
            <p className="text-xs text-muted-foreground">Active curricula</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{completedSyllabus}</div>
            <p className="text-xs text-muted-foreground">Finished curricula</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              In Progress
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{inProgressSyllabus}</div>
            <p className="text-xs text-muted-foreground">Active curricula</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Progress
            </CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{Math.round(averageProgress)}%</div>
            <p className="text-xs text-muted-foreground">Overall completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by title, subject, or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Grades</option>
              {Array.from(new Set(classes.map(c => c.grade))).map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Syllabus Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecords.map((record) => {
          const StatusIcon = getStatusIcon(record.status);
          return (
            <Card key={record.id} className="border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{record.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{record.description}</p>
                  </div>
                  <Badge variant={getStatusColor(record.status) as any}>
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{getSubjectName(record.subjectId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{getTeacherName(record.teacherId)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-muted-foreground" />
                    <span>Grade {record.grade}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{record.targetType}</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{record.progressPercentage}%</span>
                  </div>
                  <Progress value={record.progressPercentage} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Start Date:</span>
                    <p className="font-medium">{new Date(record.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">End Date:</span>
                    <p className="font-medium">{new Date(record.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Classes:</span>
                  <p className="text-sm text-muted-foreground">{getClassNames(record.classIds)}</p>
                </div>

                <div>
                  <span className="text-sm font-medium">Topics ({record.topics.length}):</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {record.topics.slice(0, 3).map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                    {record.topics.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{record.topics.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" size="sm" onClick={() => { setEditingSyllabus(record); setIsFormOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteSyllabus(record.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleUpdateProgress(record)}>
                    Update Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRecords.length === 0 && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No syllabus records found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || gradeFilter !== "all" || statusFilter !== "all"
                ? "No syllabus records match your search criteria." 
                : "Start by creating syllabus records for your subjects."}
            </p>
          </CardContent>
        </Card>
      )}

      <SyllabusForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingSyllabus(null); }}
        syllabusToEdit={editingSyllabus}
        onSave={handleSaveSyllabus}
      />
    </div>
  );
}