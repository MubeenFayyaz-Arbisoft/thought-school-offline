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
  Clock
} from "lucide-react";
import { StudentStorage, ClassStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  feeType: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod?: string;
  receiptNumber?: string;
}

export default function Fees() {
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FeeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
    const feeTypes = ['Tuition Fee', 'Transport Fee', 'Activity Fee', 'Library Fee', 'Lab Fee'];
    
    students.slice(0, 20).forEach((student, index) => {
      const feeType = feeTypes[index % feeTypes.length];
      const amount = feeType === 'Tuition Fee' ? 5000 : 
                    feeType === 'Transport Fee' ? 1500 :
                    feeType === 'Activity Fee' ? 800 :
                    feeType === 'Library Fee' ? 300 : 500;
      
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + 1);
      
      const isPaid = Math.random() > 0.3; // 70% chance of being paid
      const isOverdue = !isPaid && Math.random() > 0.7; // 30% of unpaid are overdue
      
      const record: FeeRecord = {
        id: (index + 1).toString(),
        studentId: student.id,
        studentName: student.name,
        classId: student.classId,
        feeType,
        amount,
        dueDate: dueDate.toISOString().split('T')[0],
        status: isPaid ? 'paid' : isOverdue ? 'overdue' : 'pending',
        paidDate: isPaid ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
        paymentMethod: isPaid ? ['Cash', 'Card', 'Bank Transfer'][Math.floor(Math.random() * 3)] : undefined,
        receiptNumber: isPaid ? `RCP${(index + 1).toString().padStart(4, '0')}` : undefined,
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
        record.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(record => record.status === statusFilter);
    }

    setFilteredRecords(filtered);
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

  const getClassName = (classId: string) => {
    const classData = classes.find(c => c.id === classId);
    return classData ? classData.name : "Unknown Class";
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
        <Button className="bg-primary hover:bg-primary/90">
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
                        <span>{getClassName(record.classId)}</span>
                        <span>•</span>
                        <span>{record.feeType}</span>
                        {record.receiptNumber && (
                          <>
                            <span>•</span>
                            <span>Receipt: {record.receiptNumber}</span>
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
                    {record.paidDate && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>Paid: {new Date(record.paidDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {record.paymentMethod && (
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        <span>{record.paymentMethod}</span>
                      </div>
                    )}
                  </div>
                  {record.status !== 'paid' && (
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Mark as Paid
                    </Button>
                  )}
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
    </div>
  );
}