import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SalaryRecord } from "@/types";
import { TeacherStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface SalaryFormProps {
  isOpen: boolean;
  onClose: () => void;
  salaryToEdit?: SalaryRecord | null;
  onSave: (salary: SalaryRecord) => void;
}

export function SalaryForm({ isOpen, onClose, salaryToEdit, onSave }: SalaryFormProps) {
  const [formData, setFormData] = useState({
    teacherId: "",
    month: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
    paymentMethod: "bank_transfer",
    status: "pending"
  });
  const { toast } = useToast();
  const teachers = TeacherStorage.getAll();

  useEffect(() => {
    if (salaryToEdit) {
      setFormData({
        teacherId: salaryToEdit.teacherId,
        month: salaryToEdit.month,
        basicSalary: salaryToEdit.basicSalary.toString(),
        allowances: salaryToEdit.allowances?.toString() || "0",
        deductions: salaryToEdit.deductions?.toString() || "0",
        paymentMethod: salaryToEdit.paymentMethod as any,
        status: salaryToEdit.status as any
      });
    } else {
      const currentDate = new Date();
      const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
      setFormData({
        teacherId: "",
        month: currentMonth,
        basicSalary: "",
        allowances: "0",
        deductions: "0",
        paymentMethod: "bank_transfer",
        status: "pending"
      });
    }
  }, [salaryToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.teacherId || !formData.month || !formData.basicSalary) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const basicSalary = parseFloat(formData.basicSalary);
    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const totalSalary = basicSalary + allowances - deductions;

    const salaryData: SalaryRecord = {
      id: salaryToEdit?.id || `salary-${formData.teacherId}-${formData.month}`,
      teacherId: formData.teacherId,
      month: formData.month,
      basicSalary,
      allowances,
      deductions,
      totalSalary,
      status: formData.status as any,
      paymentMethod: formData.paymentMethod as any,
      paidDate: formData.status === 'paid' ? new Date().toISOString().split('T')[0] : undefined,
      createdAt: salaryToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(salaryData);
    toast({
      title: "Success",
      description: `Salary record ${salaryToEdit ? 'updated' : 'created'} successfully`
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {salaryToEdit ? "Edit Salary Record" : "Create Salary Record"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="teacher">Teacher *</Label>
            <Select value={formData.teacherId} onValueChange={(value) => setFormData(prev => ({ ...prev, teacherId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.name} ({teacher.employeeId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="month">Month *</Label>
            <Input
              id="month"
              type="month"
              value={formData.month}
              onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="basicSalary">Basic Salary *</Label>
            <Input
              id="basicSalary"
              type="number"
              value={formData.basicSalary}
              onChange={(e) => setFormData(prev => ({ ...prev, basicSalary: e.target.value }))}
              placeholder="Enter basic salary..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="allowances">Allowances</Label>
              <Input
                id="allowances"
                type="number"
                value={formData.allowances}
                onChange={(e) => setFormData(prev => ({ ...prev, allowances: e.target.value }))}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="deductions">Deductions</Label>
              <Input
                id="deductions"
                type="number"
                value={formData.deductions}
                onChange={(e) => setFormData(prev => ({ ...prev, deductions: e.target.value }))}
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select value={formData.paymentMethod} onValueChange={(value: any) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {salaryToEdit ? "Update Salary" : "Create Salary"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}