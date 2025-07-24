import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  ClipboardCheck,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  UserX,
  Filter
} from "lucide-react";
import { AttendanceRecord, Student } from "@/types";
import { AttendanceStorage, StudentStorage, ClassStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const { toast } = useToast();

  const classes = ClassStorage.getAll();

  useEffect(() => {
    if (selectedClass) {
      loadStudentsAndAttendance();
    }
  }, [selectedDate, selectedClass]);

  const loadStudentsAndAttendance = () => {
    const classStudents = StudentStorage.getByClass(selectedClass);
    const dayAttendance = AttendanceStorage.getByDate(selectedDate);
    
    setStudents(classStudents);
    setAttendanceRecords(dayAttendance.filter(a => a.classId === selectedClass));
  };

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused') => {
    const existingRecord = attendanceRecords.find(r => r.studentId === studentId);
    
    if (existingRecord) {
      const updatedRecord = { ...existingRecord, status, updatedAt: new Date().toISOString() };
      AttendanceStorage.update(existingRecord.id, updatedRecord);
    } else {
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        studentId,
        classId: selectedClass,
        date: selectedDate,
        status,
        markedBy: 'Admin', // In a real app, this would be the logged-in user
        createdAt: new Date().toISOString(),
      };
      AttendanceStorage.add(newRecord);
    }
    
    loadStudentsAndAttendance();
    toast({
      title: "Attendance Updated",
      description: `Student marked as ${status}`,
    });
  };

  const getAttendanceStatus = (studentId: string) => {
    const record = attendanceRecords.find(r => r.studentId === studentId);
    return record?.status || null;
  };

  const getStatusIcon = (status: string | null) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'absent':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'late':
        return <Clock className="h-5 w-5 text-warning" />;
      case 'excused':
        return <UserX className="h-5 w-5 text-info" />;
      default:
        return <div className="h-5 w-5 border-2 border-muted rounded-full" />;
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'present':
        return 'bg-success text-success-foreground';
      case 'absent':
        return 'bg-destructive text-destructive-foreground';
      case 'late':
        return 'bg-warning text-warning-foreground';
      case 'excused':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const calculateStats = () => {
    const total = students.length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const absent = attendanceRecords.filter(r => r.status === 'absent').length;
    const late = attendanceRecords.filter(r => r.status === 'late').length;
    const excused = attendanceRecords.filter(r => r.status === 'excused').length;
    const unmarked = total - attendanceRecords.length;

    return { total, present, absent, late, excused, unmarked };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <ClipboardCheck className="h-8 w-8" />
            Attendance Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Mark and track student attendance
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Class</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full pl-10 px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-success">{stats.present}</div>
                <div className="text-sm text-muted-foreground">Present</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-destructive">{stats.absent}</div>
                <div className="text-sm text-muted-foreground">Absent</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-warning">{stats.late}</div>
                <div className="text-sm text-muted-foreground">Late</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-info">{stats.excused}</div>
                <div className="text-sm text-muted-foreground">Excused</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-muted-foreground">{stats.unmarked}</div>
                <div className="text-sm text-muted-foreground">Unmarked</div>
              </CardContent>
            </Card>
          </div>

          {/* Student List */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Students - {classes.find(c => c.id === selectedClass)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.map((student) => {
                  const status = getAttendanceStatus(student.id);
                  return (
                    <div key={student.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getStatusIcon(status)}
                        <div>
                          <h3 className="font-medium text-foreground">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Roll: {student.rollNumber} | Section: {student.section}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={status === 'present' ? 'default' : 'outline'}
                          onClick={() => markAttendance(student.id, 'present')}
                          className={status === 'present' ? 'bg-success hover:bg-success/90' : ''}
                        >
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={status === 'absent' ? 'default' : 'outline'}
                          onClick={() => markAttendance(student.id, 'absent')}
                          className={status === 'absent' ? 'bg-destructive hover:bg-destructive/90' : ''}
                        >
                          Absent
                        </Button>
                        <Button
                          size="sm"
                          variant={status === 'late' ? 'default' : 'outline'}
                          onClick={() => markAttendance(student.id, 'late')}
                          className={status === 'late' ? 'bg-warning hover:bg-warning/90' : ''}
                        >
                          Late
                        </Button>
                        <Button
                          size="sm"
                          variant={status === 'excused' ? 'default' : 'outline'}
                          onClick={() => markAttendance(student.id, 'excused')}
                          className={status === 'excused' ? 'bg-info hover:bg-info/90' : ''}
                        >
                          Excused
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!selectedClass && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ClipboardCheck className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Select a class</h3>
            <p className="text-muted-foreground text-center">
              Choose a class and date to start marking attendance
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}