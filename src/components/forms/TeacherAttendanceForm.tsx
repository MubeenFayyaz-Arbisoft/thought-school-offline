import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { StudentStorage, ClassStorage, AttendanceStorage, TeacherStorage } from "@/lib/storage";
import { Student, AttendanceRecord, Teacher } from "@/types";
import { CheckCircle, XCircle, Clock, Users, Calendar } from "lucide-react";

interface TeacherAttendanceFormProps {
  teacherId: string;
  onSave: () => void;
  onCancel: () => void;
}

export function TeacherAttendanceForm({ teacherId, onSave, onCancel }: TeacherAttendanceFormProps) {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late' | 'excused'>>({});
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const { toast } = useToast();

  const classes = ClassStorage.getAll();

  useEffect(() => {
    const teacherData = TeacherStorage.findById(teacherId);
    setTeacher(teacherData || null);
  }, [teacherId]);

  useEffect(() => {
    if (selectedClass) {
      const classStudents = StudentStorage.getByClass(selectedClass);
      setStudents(classStudents);
      
      // Load existing attendance for this date
      const existingAttendance = AttendanceStorage.getByDate(selectedDate);
      const attendanceMap: Record<string, 'present' | 'absent' | 'late' | 'excused'> = {};
      
      classStudents.forEach(student => {
        const existing = existingAttendance.find(a => a.studentId === student.id && a.classId === selectedClass);
        attendanceMap[student.id] = existing?.status || 'present';
      });
      
      setAttendance(attendanceMap);
    }
  }, [selectedClass, selectedDate]);

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = () => {
    if (!selectedClass || !teacher) {
      toast({
        title: "Error",
        description: "Please select a class",
        variant: "destructive",
      });
      return;
    }

    // Save attendance records
    students.forEach(student => {
      const existingRecord = AttendanceStorage.getByDate(selectedDate)
        .find(a => a.studentId === student.id && a.classId === selectedClass);

      const attendanceRecord: AttendanceRecord = {
        id: existingRecord?.id || `${student.id}-${selectedClass}-${selectedDate}`,
        studentId: student.id,
        classId: selectedClass,
        date: selectedDate,
        status: attendance[student.id] || 'present',
        markedBy: teacher.name,
        createdAt: existingRecord?.createdAt || new Date().toISOString(),
      };

      if (existingRecord) {
        AttendanceStorage.update(existingRecord.id, attendanceRecord);
      } else {
        AttendanceStorage.add(attendanceRecord);
      }
    });

    toast({
      title: "Success",
      description: "Attendance marked successfully",
    });

    onSave();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'default';
      case 'absent': return 'destructive';
      case 'late': return 'secondary';
      case 'excused': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return CheckCircle;
      case 'absent': return XCircle;
      case 'late': return Clock;
      case 'excused': return Clock;
      default: return CheckCircle;
    }
  };

  // Filter classes that the teacher is assigned to
  const teacherClasses = teacher ? classes.filter(cls => teacher.classes.includes(cls.id)) : [];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Mark Attendance - {teacher?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date and Class Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="class">Class</Label>
              <select
                id="class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Select Class</option>
                {teacherClasses.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student List */}
          {selectedClass && students.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Students ({students.length})</h3>
                <Badge variant="outline">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(selectedDate).toLocaleDateString()}
                </Badge>
              </div>
              
              <div className="max-h-96 overflow-y-auto space-y-2">
                {students.map((student) => {
                  const currentStatus = attendance[student.id] || 'present';
                  const StatusIcon = getStatusIcon(currentStatus);
                  
                  return (
                    <Card key={student.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            currentStatus === 'present' ? 'bg-success/10' :
                            currentStatus === 'absent' ? 'bg-destructive/10' :
                            currentStatus === 'late' ? 'bg-warning/10' : 'bg-muted/10'
                          }`}>
                            <StatusIcon className={`h-4 w-4 ${
                              currentStatus === 'present' ? 'text-success' :
                              currentStatus === 'absent' ? 'text-destructive' :
                              currentStatus === 'late' ? 'text-warning' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">Roll: {student.rollNumber}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {(['present', 'absent', 'late', 'excused'] as const).map((status) => (
                            <Button
                              key={status}
                              variant={currentStatus === status ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleAttendanceChange(student.id, status)}
                              className="capitalize"
                            >
                              {status}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {selectedClass && students.length === 0 && (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Students Found</h3>
              <p className="text-muted-foreground">No students are enrolled in this class.</p>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedClass || students.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              Save Attendance
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}