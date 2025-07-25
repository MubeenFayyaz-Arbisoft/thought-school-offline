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
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar
} from "lucide-react";
import { Student } from "@/types";
import { StudentStorage, ClassStorage } from "@/lib/storage";
import { StudentForm } from "@/components/forms/StudentForm";
import { useToast } from "@/hooks/use-toast";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const { toast } = useToast();

  const classes = ClassStorage.getAll();

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm, selectedClass]);

  const loadStudents = () => {
    const allStudents = StudentStorage.getAll();
    setStudents(allStudents);
  };

  const filterStudents = () => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClass !== "all") {
      filtered = filtered.filter(student => student.classId === selectedClass);
    }

    setFilteredStudents(filtered);
  };

  const handleSaveStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingStudent) {
      const updatedStudent = {
        ...studentData,
        id: editingStudent.id,
        createdAt: editingStudent.createdAt,
        updatedAt: new Date().toISOString(),
      };
      StudentStorage.update(editingStudent.id, updatedStudent);
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    } else {
      const newStudent = {
        ...studentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      StudentStorage.add(newStudent);
      toast({
        title: "Success",
        description: "Student added successfully",
      });
    }
    
    loadStudents();
    setIsFormOpen(false);
    setEditingStudent(null);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      StudentStorage.delete(id);
      loadStudents();
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    }
  };

  const getClassName = (classId: string) => {
    const classData = classes.find(c => c.id === classId);
    return classData ? classData.name : "Unknown Class";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-8 w-8" />
            Students Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage student records and information
          </p>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name, email, or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="border-border hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg text-foreground">{student.name}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    Roll: {student.rollNumber}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStudent(student)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteStudent(student.id)}
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
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{student.address}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(student.dateOfBirth).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border">
                <Badge variant="secondary">
                  {getClassName(student.classId)} - {student.section}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>
                  <strong>Parent:</strong> {student.parentName}
                </div>
                <div>
                  <strong>Contact:</strong> {student.parentPhone}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span><strong>Monthly Fee:</strong> ₹{student.monthlyFee}</span>
                  <Badge 
                    variant={
                      student.feeStatus === 'paid' ? 'default' : 
                      student.feeStatus === 'pending' ? 'secondary' : 'destructive'
                    }
                    className="text-xs"
                  >
                    {student.feeStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No students found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || selectedClass !== "all" 
                ? "No students match your search criteria." 
                : "Start by adding your first student."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Student Form Modal */}
      {isFormOpen && (
        <StudentForm
          student={editingStudent}
          onSave={handleSaveStudent}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingStudent(null);
          }}
        />
      )}
    </div>
  );
}