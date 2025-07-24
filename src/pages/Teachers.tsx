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
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  BookOpen
} from "lucide-react";
import { Teacher } from "@/types";
import { TeacherStorage, SubjectStorage, ClassStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const subjects = SubjectStorage.getAll();
  const classes = ClassStorage.getAll();

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchTerm]);

  const loadTeachers = () => {
    const allTeachers = TeacherStorage.getAll();
    setTeachers(allTeachers);
  };

  const filterTeachers = () => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTeachers(filtered);
  };

  const handleDeleteTeacher = (id: string) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      TeacherStorage.delete(id);
      loadTeachers();
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
      });
    }
  };

  const getSubjectNames = (subjectIds: string[]) => {
    return subjectIds.map(id => {
      const subject = subjects.find(s => s.id === id);
      return subject ? subject.name : 'Unknown';
    }).join(', ');
  };

  const getClassNames = (classIds: string[]) => {
    return classIds.map(id => {
      const classData = classes.find(c => c.id === id);
      return classData ? classData.name : 'Unknown';
    }).join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <GraduationCap className="h-8 w-8" />
            Teachers Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage teacher records and assignments
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Search */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, email, or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <Card key={teacher.id} className="border-border hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-foreground">{teacher.name}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    ID: {teacher.employeeId}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{teacher.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Joined: {new Date(teacher.joiningDate).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-border">
                <div className="mb-2">
                  <span className="text-sm font-medium">Qualification:</span>
                  <p className="text-sm text-muted-foreground">{teacher.qualification}</p>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium">Experience:</span>
                  <p className="text-sm text-muted-foreground">{teacher.experience}</p>
                </div>
              </div>

              {teacher.subjects.length > 0 && (
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">Subjects:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {teacher.subjects.map((subjectId, index) => {
                      const subject = subjects.find(s => s.id === subjectId);
                      return (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {subject ? subject.name : 'Unknown'}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {teacher.classes.length > 0 && (
                <div className="pt-2">
                  <span className="text-sm font-medium">Classes: </span>
                  <span className="text-sm text-muted-foreground">
                    {getClassNames(teacher.classes)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No teachers found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm 
                ? "No teachers match your search criteria." 
                : "Start by adding your first teacher."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}