import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  DollarSign, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Edit,
  Trash2
} from "lucide-react";
import { TeacherStorage } from "@/lib/storage";
import { Teacher, SalaryRecord } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { SalaryForm } from "@/components/forms/SalaryForm";

export default function Salary() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<SalaryRecord | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const teachersData = TeacherStorage.getAll();
    setTeachers(teachersData);
    
    // Generate sample salary records
    const sampleSalaryRecords: SalaryRecord[] = teachersData.map(teacher => ({
      id: `salary-${teacher.id}-${new Date().getFullYear()}-${new Date().getMonth() + 1}`,
      teacherId: teacher.id,
      month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
      basicSalary: teacher.salary || 30000,
      allowances: 5000,
      deductions: 2000,
      totalSalary: (teacher.salary || 30000) + 5000 - 2000,
      status: Math.random() > 0.7 ? 'pending' : 'paid',
      paidDate: Math.random() > 0.5 ? new Date().toISOString().split('T')[0] : undefined,
      paymentMethod: 'bank_transfer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    
    setSalaryRecords(sampleSalaryRecords);
  };

  const handleSaveSalary = (salary: SalaryRecord) => {
    if (editingSalary) {
      setSalaryRecords(prev => prev.map(s => s.id === salary.id ? salary : s));
    } else {
      setSalaryRecords(prev => [salary, ...prev]);
    }
    setIsFormOpen(false);
    setEditingSalary(null);
  };

  const handleGeneratePayslip = (record: SalaryRecord) => {
    const teacher = teachers.find(t => t.id === record.teacherId);
    const teacherName = teacher?.name || 'Unknown Teacher';
    const employeeId = teacher?.employeeId || 'N/A';
    
    // Create payslip content
    const payslipContent = `
PAYSLIP FOR ${record.month}
============================
Employee: ${teacherName}
Employee ID: ${employeeId}
Month: ${record.month}

EARNINGS:
Basic Salary: ₹${record.basicSalary.toLocaleString()}
Allowances: ₹${(record.allowances || 0).toLocaleString()}

DEDUCTIONS:
Deductions: ₹${(record.deductions || 0).toLocaleString()}

NET SALARY: ₹${record.totalSalary.toLocaleString()}
Status: ${record.status.toUpperCase()}
${record.paidDate ? `Paid Date: ${new Date(record.paidDate).toLocaleDateString()}` : ''}
    `;

    // Create and download payslip
    const blob = new Blob([payslipContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_${teacherName.replace(/\s+/g, '_')}_${record.month}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Success",
      description: "Payslip generated and downloaded successfully",
    });
  };

  const handleDeleteSalary = (id: string) => {
    if (window.confirm("Are you sure you want to delete this salary record?")) {
      setSalaryRecords(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Success",
        description: "Salary record deleted successfully",
      });
    }
  };

  const filteredRecords = salaryRecords.filter(record => {
    const teacher = teachers.find(t => t.id === record.teacherId);
    const teacherName = teacher?.name || '';
    
    const matchesSearch = teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher?.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return XCircle;
      default: return FileText;
    }
  };

  const handleMarkAsPaid = (recordId: string) => {
    setSalaryRecords(prev => prev.map(record => 
      record.id === recordId 
        ? { ...record, status: 'paid' as const, paidDate: new Date().toISOString().split('T')[0] }
        : record
    ));
    
    toast({
      title: "Success",
      description: "Salary marked as paid successfully",
    });
  };

  const getTeacherName = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher?.name || 'Unknown Teacher';
  };

  const getTeacherEmployeeId = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher?.employeeId || 'N/A';
  };

  // Calculate summary stats
  const totalPaid = filteredRecords.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.totalSalary, 0);
  const totalPending = filteredRecords.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.totalSalary, 0);
  const totalRecords = filteredRecords.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Salary Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage teacher salaries and payroll
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Salary Record
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Paid
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₹{totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">₹{totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">To be processed</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Records
            </CardTitle>
            <FileText className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalRecords}</div>
            <p className="text-xs text-muted-foreground">This month</p>
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
                placeholder="Search by teacher name or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Salary Records */}
      <div className="space-y-4">
        {filteredRecords.map((record) => {
          const StatusIcon = getStatusIcon(record.status);
          return (
            <Card key={record.id} className="border-border">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {getTeacherName(record.teacherId)}
                      </h3>
                      <Badge variant="outline">
                        ID: {getTeacherEmployeeId(record.teacherId)}
                      </Badge>
                      <Badge variant={getStatusColor(record.status) as any}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Month:</span>
                        <p className="font-medium">{record.month}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Basic Salary:</span>
                        <p className="font-medium">₹{record.basicSalary.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Salary:</span>
                        <p className="font-medium text-lg">₹{record.totalSalary.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {record.status === 'paid' ? 'Paid Date:' : 'Due Date:'}
                        </span>
                        <p className="font-medium">
                          {record.paidDate ? new Date(record.paidDate).toLocaleDateString() : 'Pending'}
                        </p>
                      </div>
                    </div>
                    
                    {record.allowances && record.deductions && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Allowances: </span>
                            <span className="text-success">+₹{record.allowances.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Deductions: </span>
                            <span className="text-destructive">-₹{record.deductions.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingSalary(record); setIsFormOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSalary(record.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {record.status === 'pending' && (
                      <Button
                        onClick={() => handleMarkAsPaid(record.id)}
                        size="sm"
                        className="bg-success hover:bg-success/90"
                      >
                        Mark as Paid
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => handleGeneratePayslip(record)}>
                      Generate Payslip
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredRecords.length === 0 && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No salary records found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter !== "all" 
                ? "No salary records match your search criteria." 
                : "Start by creating salary records for teachers."}
            </p>
          </CardContent>
        </Card>
      )}

      <SalaryForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingSalary(null); }}
        salaryToEdit={editingSalary}
        onSave={handleSaveSalary}
      />
    </div>
  );
}