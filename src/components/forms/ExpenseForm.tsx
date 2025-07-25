import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Expense, Class } from "@/types";
import { ClassStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: Expense | null;
  onSave: (expense: Expense) => void;
}

export function ExpenseForm({ isOpen, onClose, expenseToEdit, onSave }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    amount: "",
    date: "",
    spentBy: "",
    approvedBy: "",
    paymentMethod: "cash",
    receipientType: "school",
    studentGrade: "",
    studentClass: "",
    vendor: "",
    receiptNumber: "",
    status: "pending"
  });
  const { toast } = useToast();

  const classes = ClassStorage.getAll();
  const currentYear = new Date().getFullYear();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        title: expenseToEdit.title,
        description: expenseToEdit.description || "",
        category: expenseToEdit.category,
        amount: expenseToEdit.amount.toString(),
        date: expenseToEdit.date,
        spentBy: expenseToEdit.spentBy,
        approvedBy: expenseToEdit.approvedBy || "",
        paymentMethod: expenseToEdit.paymentMethod,
        receipientType: expenseToEdit.receipientType,
        studentGrade: expenseToEdit.studentGrade || "",
        studentClass: expenseToEdit.studentClass || "",
        vendor: expenseToEdit.vendor || "",
        receiptNumber: expenseToEdit.receiptNumber || "",
        status: expenseToEdit.status
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: "",
        description: "",
        category: "other",
        amount: "",
        date: today,
        spentBy: "",
        approvedBy: "",
        paymentMethod: "cash",
        receipientType: "school",
        studentGrade: "",
        studentClass: "",
        vendor: "",
        receiptNumber: "",
        status: "pending"
      });
    }
  }, [expenseToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount || !formData.date || !formData.spentBy) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const expenseDate = new Date(formData.date);
    const monthName = months[expenseDate.getMonth()];
    
    const expenseData: Expense = {
      id: expenseToEdit?.id || `expense-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      category: formData.category as Expense['category'],
      amount: parseFloat(formData.amount),
      date: formData.date,
      month: monthName,
      year: expenseDate.getFullYear(),
      spentBy: formData.spentBy,
      approvedBy: formData.approvedBy || undefined,
      paymentMethod: formData.paymentMethod as Expense['paymentMethod'],
      receipientType: formData.receipientType as Expense['receipientType'],
      studentGrade: formData.studentGrade || undefined,
      studentClass: formData.studentClass || undefined,
      vendor: formData.vendor || undefined,
      receiptNumber: formData.receiptNumber || undefined,
      status: formData.status as Expense['status'],
      createdAt: expenseToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(expenseData);
    toast({
      title: "Success",
      description: `Expense ${expenseToEdit ? 'updated' : 'created'} successfully`
    });
    onClose();
  };

  const isStudentRelated = ['books', 'uniform', 'notebooks', 'diary', 'stationary'].includes(formData.category);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {expenseToEdit ? "Edit Expense" : "Add New Expense"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Expense Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Mathematics Books Purchase"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="classes">Classes Expense</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="uniform">Uniform</SelectItem>
                  <SelectItem value="notebooks">Notebooks</SelectItem>
                  <SelectItem value="diary">Diary</SelectItem>
                  <SelectItem value="stationary">Stationary</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
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
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="spentBy">Spent By *</Label>
              <Input
                id="spentBy"
                value={formData.spentBy}
                onChange={(e) => setFormData(prev => ({ ...prev, spentBy: e.target.value }))}
                placeholder="Staff member name"
                required
              />
            </div>
            <div>
              <Label htmlFor="receipientType">Recipient Type</Label>
              <Select value={formData.receipientType} onValueChange={(value) => setFormData(prev => ({ ...prev, receipientType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="vendor">Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isStudentRelated && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-3">Student-Related Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="studentGrade">Grade</Label>
                  <Select value={formData.studentGrade} onValueChange={(value) => setFormData(prev => ({ ...prev, studentGrade: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Grades</SelectItem>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="studentClass">Class</Label>
                  <Select value={formData.studentClass} onValueChange={(value) => setFormData(prev => ({ ...prev, studentClass: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Classes</SelectItem>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.name}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vendor">Vendor/Supplier</Label>
              <Input
                id="vendor"
                value={formData.vendor}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                placeholder="Vendor or supplier name"
              />
            </div>
            <div>
              <Label htmlFor="receiptNumber">Receipt/Invoice Number</Label>
              <Input
                id="receiptNumber"
                value={formData.receiptNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, receiptNumber: e.target.value }))}
                placeholder="Receipt or invoice number"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="approvedBy">Approved By</Label>
              <Input
                id="approvedBy"
                value={formData.approvedBy}
                onChange={(e) => setFormData(prev => ({ ...prev, approvedBy: e.target.value }))}
                placeholder="Approver name"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description/Notes</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Additional details about the expense..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {expenseToEdit ? "Update Expense" : "Create Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}