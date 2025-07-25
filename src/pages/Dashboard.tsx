import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Users, 
  GraduationCap, 
  School, 
  BookOpen, 
  TrendingUp,
  Calendar,
  ClipboardCheck,
  UserCheck,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Target,
  CreditCard,
  Bell
} from "lucide-react";
import { StudentStorage, TeacherStorage, ClassStorage, SubjectStorage, AttendanceStorage } from "@/lib/storage";
import { DashboardStats } from "@/types";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalSubjects: 0,
    todayAttendanceRate: 0,
    monthlyAttendanceRate: 0,
    totalFeesCollected: 0,
    pendingFees: 0,
    overdueNotices: 0,
    activeSyllabus: 0,
    unpaidSalaries: 0,
    studentsPresent: 0,
    studentsAbsent: 0,
  });

  useEffect(() => {
    // Calculate dashboard statistics
    const students = StudentStorage.getAll();
    const teachers = TeacherStorage.getAll();
    const classes = ClassStorage.getAll();
    const subjects = SubjectStorage.getAll();
    const attendance = AttendanceStorage.getAll();

    const today = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.filter(a => a.date === today);
    const presentToday = todayAttendance.filter(a => a.status === 'present').length;
    const todayAttendanceRate = todayAttendance.length > 0 ? (presentToday / todayAttendance.length) * 100 : 0;

    // Calculate monthly attendance rate (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyAttendance = attendance.filter(a => new Date(a.date) >= thirtyDaysAgo);
    const presentMonth = monthlyAttendance.filter(a => a.status === 'present').length;
    const monthlyAttendanceRate = monthlyAttendance.length > 0 ? (presentMonth / monthlyAttendance.length) * 100 : 0;

    // Calculate additional stats
    const studentsPresent = todayAttendance.filter(a => a.status === 'present').length;
    const studentsAbsent = todayAttendance.filter(a => a.status === 'absent').length;
    
    // Mock fee calculations (in real app, this would come from fee storage)
    const totalFeesCollected = students.length * 5000; // Mock calculation
    const pendingFees = students.length * 1000; // Mock calculation
    
    setStats({
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalClasses: classes.length,
      totalSubjects: subjects.length,
      todayAttendanceRate: Math.round(todayAttendanceRate),
      monthlyAttendanceRate: Math.round(monthlyAttendanceRate),
      totalFeesCollected,
      pendingFees,
      overdueNotices: 2, // Mock data
      activeSyllabus: subjects.length, // Mock calculation
      unpaidSalaries: 3, // Mock data
      studentsPresent,
      studentsAbsent,
    });
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Teachers",
      value: stats.totalTeachers,
      icon: GraduationCap,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Total Classes",
      value: stats.totalClasses,
      icon: School,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Total Subjects",
      value: stats.totalSubjects,
      icon: BookOpen,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  const performanceCards = [
    {
      title: "Today's Attendance",
      value: `${stats.todayAttendanceRate}%`,
      icon: UserCheck,
      color: stats.todayAttendanceRate >= 80 ? "text-success" : stats.todayAttendanceRate >= 60 ? "text-warning" : "text-destructive",
      bgColor: stats.todayAttendanceRate >= 80 ? "bg-success/10" : stats.todayAttendanceRate >= 60 ? "bg-warning/10" : "bg-destructive/10",
    },
    {
      title: "Monthly Attendance",
      value: `${stats.monthlyAttendanceRate}%`,
      icon: TrendingUp,
      color: stats.monthlyAttendanceRate >= 80 ? "text-success" : stats.monthlyAttendanceRate >= 60 ? "text-warning" : "text-destructive",
      bgColor: stats.monthlyAttendanceRate >= 80 ? "bg-success/10" : stats.monthlyAttendanceRate >= 60 ? "bg-warning/10" : "bg-destructive/10",
    },
  ];

  const financialCards = [
    {
      title: "Total Fees Collected",
      value: `₹${stats.totalFeesCollected.toLocaleString()}`,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Pending Fees",
      value: `₹${stats.pendingFees.toLocaleString()}`,
      icon: CreditCard,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Unpaid Salaries",
      value: stats.unpaidSalaries,
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Active Syllabus",
      value: stats.activeSyllabus,
      icon: Target,
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  const dailyMonitoringCards = [
    {
      title: "Students Present",
      value: stats.studentsPresent,
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Students Absent",
      value: stats.studentsAbsent,
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Pending Notices",
      value: stats.overdueNotices,
      icon: Bell,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to The Thoughts School and Academy Management System
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          <Calendar className="w-4 h-4 mr-2" />
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Card key={card.title} className="transition-all duration-200 hover:shadow-lg border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {performanceCards.map((card) => (
          <Card key={card.title} className="transition-all duration-200 hover:shadow-lg border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {card.title.includes('Today') ? 'Based on today\'s records' : 'Last 30 days average'}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Overview */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Financial Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialCards.map((card) => (
            <Card key={card.title} className="transition-all duration-200 hover:shadow-lg border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Monitoring */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Clock className="h-6 w-6" />
          Today's Monitoring
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dailyMonitoringCards.map((card) => (
            <Card key={card.title} className="transition-all duration-200 hover:shadow-lg border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/attendance" className="p-4 rounded-lg bg-muted/30 border border-border cursor-pointer hover:bg-muted/50 transition-colors block">
              <h3 className="font-semibold text-foreground">Mark Attendance</h3>
              <p className="text-sm text-muted-foreground">Record today's student attendance</p>
          </Link>

          <Link to="/expenses">
            <Card className="border-border hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Receipt className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Manage Expenses</h3>
                    <p className="text-sm text-muted-foreground">Track school expenses</p>
                  </div>
                </div>
                <Badge variant="outline">Expenses</Badge>
              </CardContent>
            </Card>
          </Link>
            <Link to="/students" className="p-4 rounded-lg bg-muted/30 border border-border cursor-pointer hover:bg-muted/50 transition-colors block">
              <h3 className="font-semibold text-foreground">Add New Student</h3>
              <p className="text-sm text-muted-foreground">Register a new student</p>
            </Link>
            <Link to="/teachers" className="p-4 rounded-lg bg-muted/30 border border-border cursor-pointer hover:bg-muted/50 transition-colors block">
              <h3 className="font-semibold text-foreground">Add New Teacher</h3>
              <p className="text-sm text-muted-foreground">Register a new teacher</p>
            </Link>
            <Link to="/fees" className="p-4 rounded-lg bg-muted/30 border border-border cursor-pointer hover:bg-muted/50 transition-colors block">
              <h3 className="font-semibold text-foreground">Manage Fees</h3>
              <p className="text-sm text-muted-foreground">Handle student fee records</p>
            </Link>
            <Link to="/notices" className="p-4 rounded-lg bg-muted/30 border border-border cursor-pointer hover:bg-muted/50 transition-colors block">
              <h3 className="font-semibold text-foreground">Post Notices</h3>
              <p className="text-sm text-muted-foreground">Publish announcements</p>
            </Link>
            <Link to="/subjects" className="p-4 rounded-lg bg-muted/30 border border-border cursor-pointer hover:bg-muted/50 transition-colors block">
              <h3 className="font-semibold text-foreground">Manage Subjects</h3>
              <p className="text-sm text-muted-foreground">Subject assignments</p>
            </Link>
            <Link to="/classes" className="p-4 rounded-lg bg-muted/30 border border-border cursor-pointer hover:bg-muted/50 transition-colors block">
              <h3 className="font-semibold text-foreground">Manage Classes</h3>
              <p className="text-sm text-muted-foreground">Class management</p>
            </Link>
            <Link to="/attendance" className="p-4 rounded-lg bg-muted/30 border border-border cursor-pointer hover:bg-muted/50 transition-colors block">
              <h3 className="font-semibold text-foreground">View Reports</h3>
              <p className="text-sm text-muted-foreground">Generate attendance reports</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}