import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FeeRecord, Student } from "@/types";
import { StudentStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface FeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  feeToEdit?: FeeRecord | null;
  onSave: (fee: FeeRecord) => void;
}

export function FeeForm({ isOpen, onClose, feeToEdit, onSave }: FeeFormProps) {
  const [formData, setFormData] = useState({
    studentId: "",
    feeType: "tuition",
    amount: "",
    dueDate: "",
    month: "",
    year: new Date().getFullYear().toString(),
    paymentMethod: "",
    collectedBy: "",
    description: "",
    status: "pending"
  });
  const { toast } = useToast();

  const students = StudentStorage.getAll();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i - 2);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    if (feeToEdit) {
      setFormData({
        studentId: feeToEdit.studentId,
        feeType: feeToEdit.feeType,
        amount: feeToEdit.amount.toString(),
        dueDate: feeToEdit.dueDate,
        month: feeToEdit.month,
        year: feeToEdit.year.toString(),
        paymentMethod: feeToEdit.paymentMethod || "",
        collectedBy: feeToEdit.collectedBy || "",
        description: feeToEdit.description || "",
        status: feeToEdit.status
      });
    } else {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const defaultDueDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 15).toISOString().split('T')[0];
      
      setFormData({
        studentId: "",
        feeType: "tuition",
        amount: "",
        dueDate: defaultDueDate,
        month: months[nextMonth.getMonth()],
        year: nextMonth.getFullYear().toString(),
        paymentMethod: "",
        collectedBy: "",
        description: "",
        status: "pending"
      });
    }
  }, [feeToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.amount || !formData.dueDate || !formData.month) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.status === "paid" && (!formData.paymentMethod || !formData.collectedBy)) {
      toast({
        title: "Error",
        description: "Payment method and collector are required for paid fees",
        variant: "destructive"
      });
      return;
    }

    const student = students.find(s => s.id === formData.studentId);
    
    const feeData: FeeRecord = {
      id: feeToEdit?.id || `fee-${Date.now()}`,
      studentId: formData.studentId,
      studentName: student?.name || "",
      className: student?.className || "",
      feeType: formData.feeType as "tuition" | "books" | "uniform" | "diary" | "transport" | "other",
      amount: parseFloat(formData.amount),
      dueDate: formData.dueDate,
      month: formData.month,
      year: parseInt(formData.year),
      status: formData.status as "pending" | "paid" | "overdue" | "partial",
      paymentMethod: formData.paymentMethod as "cash" | "bank" | "online" | undefined,
      collectedBy: formData.collectedBy || undefined,
      paymentDate: formData.status === "paid" ? new Date().toISOString().split('T')[0] : undefined,
      description: formData.description || undefined,
      createdAt: feeToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(feeData);
    toast({
      title: "Success",
      description: `Fee record ${feeToEdit ? 'updated' : 'created'} successfully`
    });
    onClose();
  };

  const selectedStudent = students.find(s => s.id === formData.studentId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {feeToEdit ? "Edit Fee Record" : "Add New Fee Record"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student">Student *</Label>
              <Select value={formData.studentId} onValueChange={(value) => setFormData(prev => ({ ...prev, studentId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} ({student.className})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="feeType">Fee Type *</Label>
              <Select value={formData.feeType} onValueChange={(value) => setFormData(prev => ({ ...prev, feeType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tuition">Tuition Fee</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="uniform">Uniform</SelectItem>
                  <SelectItem value="diary">Diary</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="month">Month *</Label>
              <Select value={formData.month} onValueChange={(value) => setFormData(prev => ({ ...prev, month: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Select value={formData.year} onValueChange={(value) => setFormData(prev => ({ ...prev, year: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.status === "paid" && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="online">Online Payment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="collectedBy">Collected By *</Label>
                <Input
                  id="collectedBy"
                  value={formData.collectedBy}
                  onChange={(e) => setFormData(prev => ({ ...prev, collectedBy: e.target.value }))}
                  placeholder="Staff member name"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="description">Description/Notes</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional notes..."
            />
          </div>

          {selectedStudent && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-2">Student Information</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Name:</strong> {selectedStudent.name}<br />
                <strong>Class:</strong> {selectedStudent.className}<br />
                <strong>Roll Number:</strong> {selectedStudent.rollNumber}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {feeToEdit ? "Update Fee" : "Create Fee Record"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}