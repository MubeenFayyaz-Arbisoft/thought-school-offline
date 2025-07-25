import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from "lucide-react";
import { Teacher } from "@/types";
import { SubjectStorage, ClassStorage } from "@/lib/storage";

interface TeacherFormProps {
  teacher?: Teacher | null;
  onSave: (teacher: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function TeacherForm({ teacher, onSave, onCancel }: TeacherFormProps) {
  const [formData, setFormData] = useState({
    name: teacher?.name || "",
    email: teacher?.email || "",
    phone: teacher?.phone || "",
    address: teacher?.address || "",
    dateOfBirth: teacher?.dateOfBirth || "",
    qualification: teacher?.qualification || "",
    experience: teacher?.experience || "",
    subjects: teacher?.subjects || [],
    classes: teacher?.classes || [],
    joiningDate: teacher?.joiningDate || "",
    employeeId: teacher?.employeeId || "",
    salary: teacher?.salary || 0,
  });

  const subjects = SubjectStorage.getAll();
  const classes = ClassStorage.getAll();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'salary' ? Number(value) : value
    }));
  };

  const handleMultiSelectChange = (field: 'subjects' | 'classes', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(id => id !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>
            {teacher ? "Edit Teacher" : "Add New Teacher"}
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
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="joiningDate">Joining Date *</Label>
                <Input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="qualification">Qualification *</Label>
                <Input
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="experience">Experience *</Label>
                <Input
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g., 5 years"
                  required
                />
              </div>
              <div>
                <Label htmlFor="salary">Monthly Salary</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="Enter salary amount"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Subjects Teaching</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {subjects.map((subject) => (
                  <label key={subject.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject.id)}
                      onChange={() => handleMultiSelectChange('subjects', subject.id)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{subject.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label>Classes Assigned</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {classes.map((cls) => (
                  <label key={cls.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.classes.includes(cls.id)}
                      onChange={() => handleMultiSelectChange('classes', cls.id)}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{cls.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {teacher ? "Update Teacher" : "Add Teacher"}
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