import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Student } from "@/types";
import { ClassStorage } from "@/lib/storage";

interface StudentFormProps {
  student?: Student | null;
  onSave: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function StudentForm({ student, onSave, onCancel }: StudentFormProps) {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    phone: student?.phone || '',
    address: student?.address || '',
    dateOfBirth: student?.dateOfBirth || '',
    classId: student?.classId || '',
    section: student?.section || '',
    parentName: student?.parentName || '',
    parentPhone: student?.parentPhone || '',
    parentEmail: student?.parentEmail || '',
    admissionDate: student?.admissionDate || new Date().toISOString().split('T')[0],
    rollNumber: student?.rollNumber || '',
    bloodGroup: student?.bloodGroup || '',
    monthlyFee: student?.monthlyFee || 1000,
    feeStatus: student?.feeStatus || 'pending' as const,
    lastFeePaidDate: student?.lastFeePaidDate || '',
  });

  const classes = ClassStorage.getAll();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedClass = classes.find(c => c.id === formData.classId);
    const studentData = {
      ...formData,
      className: selectedClass?.name || 'Unknown Class'
    };
    onSave(studentData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {student ? 'Edit Student' : 'Add New Student'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="rollNumber">Roll Number *</Label>
                <Input
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input
                  id="bloodGroup"
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  placeholder="e.g., A+, B-, O+"
                />
              </div>
              <div>
                <Label htmlFor="classId">Class *</Label>
                <select
                  id="classId"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="section">Section *</Label>
                <Input
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  required
                  placeholder="e.g., A, B, C"
                />
              </div>
              <div>
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  name="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="monthlyFee">Monthly Fee (₹)</Label>
                <Input
                  id="monthlyFee"
                  name="monthlyFee"
                  type="number"
                  value={formData.monthlyFee}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="feeStatus">Fee Status</Label>
                <select
                  id="feeStatus"
                  name="feeStatus"
                  value={formData.feeStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
              {formData.feeStatus === 'paid' && (
                <div>
                  <Label htmlFor="lastFeePaidDate">Last Fee Paid Date</Label>
                  <Input
                    id="lastFeePaidDate"
                    name="lastFeePaidDate"
                    type="date"
                    value={formData.lastFeePaidDate}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Parent Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="parentName">Parent Name</Label>
                  <Input
                    id="parentName"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="parentPhone">Parent Phone</Label>
                  <Input
                    id="parentPhone"
                    name="parentPhone"
                    value={formData.parentPhone}
                    onChange={handleChange}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="parentEmail">Parent Email</Label>
                  <Input
                    id="parentEmail"
                    name="parentEmail"
                    type="email"
                    value={formData.parentEmail}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {student ? 'Update Student' : 'Add Student'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}