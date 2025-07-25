import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  DollarSign,
  Calendar,
  User,
  CreditCard,
  Building,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";
import { Expense } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { ExpenseForm } from "@/components/forms/ExpenseForm";

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const categories = [
    'classes', 'books', 'uniform', 'notebooks', 'diary', 
    'stationary', 'transport', 'utilities', 'maintenance', 'other'
  ];

  useEffect(() => {
    loadExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchTerm, monthFilter, categoryFilter, statusFilter]);

  const loadExpenses = () => {
    // Generate sample expense data
    const sampleExpenses: Expense[] = [
      {
        id: '1',
        title: 'Mathematics Books Purchase',
        description: 'Textbooks for Grade 5 students',
        category: 'books',
        amount: 1500,
        date: '2024-01-15',
        month: 'January',
        year: 2024,
        spentBy: 'John Admin',
        approvedBy: 'Principal Smith',
        paymentMethod: 'bank',
        receipientType: 'student',
        studentGrade: '5',
        studentClass: 'Grade 5-A',
        vendor: 'Educational Books Ltd',
        receiptNumber: 'INV-2024-001',
        status: 'paid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Classroom Maintenance',
        description: 'Repair and painting of Grade 3 classrooms',
        category: 'maintenance',
        amount: 2500,
        date: '2024-01-20',
        month: 'January',
        year: 2024,
        spentBy: 'Maintenance Team',
        paymentMethod: 'cash',
        receipientType: 'vendor',
        vendor: 'City Contractors',
        status: 'approved',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        title: 'School Uniforms',
        description: 'Uniforms for new students',
        category: 'uniform',
        amount: 800,
        date: '2024-02-01',
        month: 'February',
        year: 2024,
        spentBy: 'Sarah Wilson',
        paymentMethod: 'online',
        receipientType: 'student',
        studentGrade: 'all',
        vendor: 'Uniform Supply Co',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        title: 'Stationary Supplies',
        description: 'Notebooks, pens, pencils for all grades',
        category: 'stationary',
        amount: 1200,
        date: '2024-02-10',
        month: 'February',
        year: 2024,
        spentBy: 'Office Manager',
        paymentMethod: 'bank',
        receipientType: 'school',
        status: 'paid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    setExpenses(sampleExpenses);
  };

  const filterExpenses = () => {
    let filtered = expenses;

    if (searchTerm) {
      filtered = filtered.filter(expense =>
        expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.spentBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (monthFilter !== 'all') {
      filtered = filtered.filter(expense => expense.month === monthFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(expense => expense.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(expense => expense.status === statusFilter);
    }

    setFilteredExpenses(filtered);
  };

  const handleDeleteExpense = (id: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      setExpenses(prev => prev.filter(e => e.id !== id));
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
    }
  };

  const handleSaveExpense = (expense: Expense) => {
    if (editingExpense) {
      setExpenses(prev => prev.map(e => e.id === expense.id ? expense : e));
    } else {
      setExpenses(prev => [...prev, expense]);
    }
    setIsFormOpen(false);
    setEditingExpense(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'approved': return 'info';
      case 'pending': return 'warning';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'approved': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return XCircle;
      default: return AlertCircle;
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Calculate summary stats
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const paidExpenses = filteredExpenses.filter(e => e.status === 'paid').reduce((sum, exp) => sum + exp.amount, 0);
  const pendingExpenses = filteredExpenses.filter(e => e.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0);
  const thisMonthExpenses = filteredExpenses.filter(e => e.month === months[new Date().getMonth()]).reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Expense Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage school expenses
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${totalExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All expenses</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${paidExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${pendingExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${thisMonthExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month</p>
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
                placeholder="Search by title, person, or vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {getCategoryLabel(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Expense List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredExpenses.map((expense) => {
          const StatusIcon = getStatusIcon(expense.status);
          return (
            <Card key={expense.id} className="border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{expense.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{expense.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(expense.status) as any}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => { setEditingExpense(expense); setIsFormOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">${expense.amount.toLocaleString()}</span>
                  <Badge variant="outline">{getCategoryLabel(expense.category)}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(expense.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{expense.paymentMethod}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{expense.spentBy}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{expense.receipientType}</span>
                  </div>
                </div>

                {expense.studentGrade && expense.studentClass && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-sm font-medium">Student Info:</span>
                    <p className="text-sm text-muted-foreground">
                      Grade {expense.studentGrade} - {expense.studentClass}
                    </p>
                  </div>
                )}

                {expense.vendor && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-sm font-medium">Vendor:</span>
                    <p className="text-sm text-muted-foreground">{expense.vendor}</p>
                  </div>
                )}

                {expense.receiptNumber && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-sm font-medium">Receipt:</span>
                    <p className="text-sm text-muted-foreground">{expense.receiptNumber}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredExpenses.length === 0 && (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No expenses found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || monthFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all"
                ? "No expenses match your search criteria." 
                : "Start by adding your first expense."}
            </p>
          </CardContent>
        </Card>
      )}

      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingExpense(null); }}
        expenseToEdit={editingExpense}
        onSave={handleSaveExpense}
      />
    </div>
  );
}