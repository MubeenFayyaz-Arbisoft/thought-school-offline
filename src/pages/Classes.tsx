import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  School,
  Users,
  BookOpen,
  User
} from "lucide-react";
import { Class } from "@/types";
import { ClassStorage, StudentStorage, TeacherStorage, SubjectStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { ClassForm } from "@/components/forms/ClassForm";

export default function Classes() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const { toast } = useToast();

  const students = StudentStorage.getAll();
  const teachers = TeacherStorage.getAll();
  const subjects = SubjectStorage.getAll();

  useEffect(() => {
    loadClasses();
  }, []);

  useEffect(() => {
    filterClasses();
  }, [classes, searchTerm]);

  const loadClasses = () => {
    const allClasses = ClassStorage.getAll();
    setClasses(allClasses);
  };

  const filterClasses = () => {
    let filtered = classes;

    if (searchTerm) {
      filtered = filtered.filter(cls =>
        cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.grade.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredClasses(filtered);
  };

  const handleDeleteClass = (id: string) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      ClassStorage.delete(id);
      loadClasses();
      toast({
        title: "Success",
        description: "Class deleted successfully",
      });
    }
  };

  const getStudentCount = (classId: string) => {
    return students.filter(s => s.classId === classId).length;
  };

  const getClassTeacher = (teacherId?: string) => {
    if (!teacherId) return null;
    return teachers.find(t => t.id === teacherId);
  };

  const getSubjectNames = (subjectIds: string[]) => {
    return subjectIds.map(id => {
      const subject = subjects.find(s => s.id === id);
      return subject ? subject.name : 'Unknown';
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <School className="h-8 w-8" />
            Classes Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage class structure and sections
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Search */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by class name or grade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((cls) => {
          const studentCount = getStudentCount(cls.id);
          const classTeacher = getClassTeacher(cls.classTeacherId);
          const subjectNames = getSubjectNames(cls.subjects);

          return (
            <Card key={cls.id} className="border-border hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-foreground">{cls.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      Grade {cls.grade}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingClass(cls); setIsFormOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClass(cls.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Students</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{studentCount}</div>
                    <div className="text-xs text-muted-foreground">of {cls.capacity}</div>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <BookOpen className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Subjects</span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{cls.subjects.length}</div>
                    <div className="text-xs text-muted-foreground">assigned</div>
                  </div>
                </div>

                {/* Sections */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Sections:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {cls.sections.map((section, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {section}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Class Teacher */}
                {classTeacher && (
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">Class Teacher:</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{classTeacher.name}</p>
                  </div>
                )}

                {/* Subjects */}
                {cls.subjects.length > 0 && (
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm font-medium">Subjects:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {subjectNames.slice(0, 3).map((name, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {name}
                        </Badge>
                      ))}
                      {subjectNames.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{subjectNames.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredClasses.length === 0 && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <School className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No classes found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm 
                ? "No classes match your search criteria." 
                : "Start by adding your first class."}
            </p>
          </CardContent>
        </Card>
      )}

      <ClassForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingClass(null); }}
        classToEdit={editingClass}
        onSave={loadClasses}
      />
    </div>
  );
}