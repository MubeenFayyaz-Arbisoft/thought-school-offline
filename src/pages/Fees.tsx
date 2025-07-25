import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  CreditCard,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Trash2
} from "lucide-react";
import { StudentStorage, ClassStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { FeeForm } from "@/components/forms/FeeForm";
import { FeeRecord } from "@/types";


export default function Fees() {
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FeeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeRecord | null>(null);
  const { toast } = useToast();

  const students = StudentStorage.getAll();
  const classes = ClassStorage.getAll();

  useEffect(() => {
    loadFeeRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [feeRecords, searchTerm, statusFilter]);

  const loadFeeRecords = () => {
    // Generate sample fee records for first 20 students
    const sampleRecords: FeeRecord[] = [];
    const feeTypes = ['tuition', 'transport', 'books', 'uniform', 'other'] as const;
    const paymentMethods = ['cash', 'bank', 'online'] as const;
    
    students.slice(0, 20).forEach((student, index) => {
      const feeType = feeTypes[index % feeTypes.length];
      const amount = feeType === 'tuition' ? 5000 : 
                    feeType === 'transport' ? 1500 :
                    feeType === 'books' ? 800 :
                    feeType === 'uniform' ? 300 : 500;
      
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 1);
      
      const isPaid = Math.random() > 0.3; // 70% chance of being paid
      const isOverdue = !isPaid && Math.random() > 0.7; // 30% of unpaid are overdue
      
      const record: FeeRecord = {
        id: (index + 1).toString(),
        studentId: student.id,
        studentName: student.name,
        className: student.className,
        feeType,
        amount,
        dueDate: dueDate.toISOString().split('T')[0],
        month: new Date().toLocaleDateString('en-US', { month: 'long' }),
        year: new Date().getFullYear(),
        status: isPaid ? 'paid' : isOverdue ? 'overdue' : 'pending',
        paymentDate: isPaid ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
        paymentMethod: isPaid ? paymentMethods[Math.floor(Math.random() * paymentMethods.length)] : undefined,
        collectedBy: isPaid ? 'Admin' : undefined,
        description: `${feeType.charAt(0).toUpperCase() + feeType.slice(1)} fee for ${student.name}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      sampleRecords.push(record);
    });
    
    setFeeRecords(sampleRecords);
  };

  const filterRecords = () => {
    let filtered = feeRecords;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.feeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    setFilteredRecords(filtered);
  };

  const handleSaveFee = (fee: FeeRecord) => {
    if (editingFee) {
      setFeeRecords(prev => prev.map(f => f.id === fee.id ? fee : f));
    } else {
      setFeeRecords(prev => [...prev, fee]);
    }
    setIsFormOpen(false);
    setEditingFee(null);
  };

  const handleDeleteFee = (id: string) => {
    if (window.confirm("Are you sure you want to delete this fee record?")) {
      setFeeRecords(prev => prev.filter(f => f.id !== id));
      toast({
        title: "Success",
        description: "Fee record deleted successfully",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'overdue': return XCircle;
      default: return Clock;
    }
  };

  const getClassName = (className: string) => {
    return className || "Unknown Class";
  };

  const totalAmount = feeRecords.reduce((sum, record) => sum + record.amount, 0);
  const paidAmount = feeRecords.filter(r => r.status === 'paid').reduce((sum, record) => sum + record.amount, 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-8 w-8" />
            Fee Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage student fees and payments
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Fee Record
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-lg font-semibold">${totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Collected</p>
                <p className="text-lg font-semibold">${paidAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-lg font-semibold">${pendingAmount.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <XCircle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-lg font-semibold">
                  {feeRecords.filter(r => r.status === 'overdue').length}
                </p>
              </div>
            </div>
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
                placeholder="Search by student name, fee type, or receipt number..."
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

      {/* Fee Records */}
      <div className="space-y-4">
        {filteredRecords.map((record) => {
          const StatusIcon = getStatusIcon(record.status);
          return (
            <Card key={record.id} className="border-border hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${
                      record.status === 'paid' ? 'bg-success/10' :
                      record.status === 'pending' ? 'bg-warning/10' : 'bg-destructive/10'
                    }`}>
                      <StatusIcon className={`h-5 w-5 ${
                        record.status === 'paid' ? 'text-success' :
                        record.status === 'pending' ? 'text-warning' : 'text-destructive'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{record.studentName}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{getClassName(record.className)}</span>
                        <span>•</span>
                        <span>{record.feeType.charAt(0).toUpperCase() + record.feeType.slice(1)} Fee</span>
                        {record.description && (
                          <>
                            <span>•</span>
                            <span>{record.description}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">${record.amount}</p>
                    <Badge variant={getStatusColor(record.status)} className="mt-1">
                      {record.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {new Date(record.dueDate).toLocaleDateString()}</span>
                    </div>
                    {record.paymentDate && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Paid: {new Date(record.paymentDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {record.paymentMethod && (
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        <span>{record.paymentMethod}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { setEditingFee(record); setIsFormOpen(true); }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFee(record.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {record.status !== 'paid' && (
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Mark as Paid
                      </Button>
                    )}
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
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No fee records found</h3>
            <p className="text-muted-foreground text-center">
              {searchTerm || statusFilter !== "all" 
                ? "No records match your search criteria." 
                : "Start by adding fee records for students."}
            </p>
          </CardContent>
        </Card>
      )}

      <FeeForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingFee(null); }}
        feeToEdit={editingFee}
        onSave={handleSaveFee}
      />
    </div>
  );
}