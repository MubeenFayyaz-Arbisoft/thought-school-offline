import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Class, Teacher, Subject } from "@/types";
import { ClassStorage, TeacherStorage, SubjectStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface ClassFormProps {
  isOpen: boolean;
  onClose: () => void;
  classToEdit?: Class | null;
  onSave: () => void;
}

export function ClassForm({ isOpen, onClose, classToEdit, onSave }: ClassFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    grade: "",
    sections: [] as string[],
    capacity: "",
    classTeacherId: "",
    subjects: [] as string[]
  });
  const [sectionInput, setSectionInput] = useState("");
  const { toast } = useToast();

  const teachers = TeacherStorage.getAll();
  const subjects = SubjectStorage.getAll();
  const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  useEffect(() => {
    if (classToEdit) {
      setFormData({
        name: classToEdit.name,
        grade: classToEdit.grade,
        sections: classToEdit.sections,
        capacity: classToEdit.capacity.toString(),
        classTeacherId: classToEdit.classTeacherId || "",
        subjects: classToEdit.subjects
      });
    } else {
      setFormData({
        name: "",
        grade: "",
        sections: [],
        capacity: "",
        classTeacherId: "",
        subjects: []
      });
    }
  }, [classToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.grade || !formData.capacity) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const classData: Class = {
      id: classToEdit?.id || `class-${Date.now()}`,
      name: formData.name,
      grade: formData.grade,
      sections: formData.sections,
      capacity: parseInt(formData.capacity),
      classTeacherId: formData.classTeacherId || undefined,
      subjects: formData.subjects,
      createdAt: classToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (classToEdit) {
      ClassStorage.update(classData.id, classData);
      toast({
        title: "Success",
        description: "Class updated successfully"
      });
    } else {
      ClassStorage.create(classData);
      toast({
        title: "Success",
        description: "Class created successfully"
      });
    }

    onSave();
    onClose();
  };

  const addSection = () => {
    if (sectionInput.trim() && !formData.sections.includes(sectionInput.trim())) {
      setFormData(prev => ({
        ...prev,
        sections: [...prev.sections, sectionInput.trim()]
      }));
      setSectionInput("");
    }
  };

  const removeSection = (section: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s !== section)
    }));
  };

  const toggleSubject = (subjectId: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.includes(subjectId)
        ? prev.subjects.filter(id => id !== subjectId)
        : [...prev.subjects, subjectId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {classToEdit ? "Edit Class" : "Add New Class"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Class Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Class 1-A"
                required
              />
            </div>
            <div>
              <Label htmlFor="grade">Grade *</Label>
              <Select value={formData.grade} onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Capacity *</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                placeholder="30"
                required
              />
            </div>
            <div>
              <Label htmlFor="classTeacher">Class Teacher</Label>
              <Select value={formData.classTeacherId} onValueChange={(value) => setFormData(prev => ({ ...prev, classTeacherId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No teacher assigned</SelectItem>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Sections</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={sectionInput}
                onChange={(e) => setSectionInput(e.target.value)}
                placeholder="Enter section (e.g., A, B, C)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSection())}
              />
              <Button type="button" onClick={addSection}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sections.map((section) => (
                <div key={section} className="bg-secondary px-2 py-1 rounded text-sm flex items-center gap-1">
                  {section}
                  <button type="button" onClick={() => removeSection(section)} className="ml-1 text-red-500">×</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Subjects</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-3">
              {subjects.map((subject) => (
                <div key={subject.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={subject.id}
                    checked={formData.subjects.includes(subject.id)}
                    onCheckedChange={() => toggleSubject(subject.id)}
                  />
                  <Label htmlFor={subject.id} className="text-sm">
                    {subject.name} ({subject.code})
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {classToEdit ? "Update Class" : "Create Class"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}