import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Subject, Class, Teacher } from "@/types";
import { SubjectStorage, ClassStorage, TeacherStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface SubjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  subjectToEdit?: Subject | null;
  onSave: () => void;
}

export function SubjectForm({ isOpen, onClose, subjectToEdit, onSave }: SubjectFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    creditHours: "",
    classIds: [] as string[]
  });
  const { toast } = useToast();

  const classes = ClassStorage.getAll();
  const teachers = TeacherStorage.getAll();

  useEffect(() => {
    if (subjectToEdit) {
      setFormData({
        name: subjectToEdit.name,
        code: subjectToEdit.code,
        description: subjectToEdit.description || "",
        creditHours: subjectToEdit.creditHours.toString(),
        classIds: subjectToEdit.classIds
      });
    } else {
      setFormData({
        name: "",
        code: "",
        description: "",
        creditHours: "",
        classIds: []
      });
    }
  }, [subjectToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.code || !formData.creditHours) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const subjectData: Subject = {
      id: subjectToEdit?.id || `subject-${Date.now()}`,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      creditHours: parseInt(formData.creditHours),
      classIds: formData.classIds,
      createdAt: subjectToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (subjectToEdit) {
      SubjectStorage.update(subjectData.id, subjectData);
      toast({
        title: "Success",
        description: "Subject updated successfully"
      });
    } else {
      SubjectStorage.create(subjectData);
      toast({
        title: "Success",
        description: "Subject created successfully"
      });
    }

    onSave();
    onClose();
  };

  const toggleClass = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter(id => id !== classId)
        : [...prev.classIds, classId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {subjectToEdit ? "Edit Subject" : "Add New Subject"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Subject Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Mathematics"
                required
              />
            </div>
            <div>
              <Label htmlFor="code">Subject Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                placeholder="MATH101"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="creditHours">Credit Hours *</Label>
            <Input
              id="creditHours"
              type="number"
              value={formData.creditHours}
              onChange={(e) => setFormData(prev => ({ ...prev, creditHours: e.target.value }))}
              placeholder="3"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the subject..."
              rows={3}
            />
          </div>

          <div>
            <Label>Assign to Classes</Label>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-3">
              {classes.map((cls) => (
                <div key={cls.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={cls.id}
                    checked={formData.classIds.includes(cls.id)}
                    onCheckedChange={() => toggleClass(cls.id)}
                  />
                  <Label htmlFor={cls.id} className="text-sm">
                    {cls.name} (Grade {cls.grade})
                  </Label>
                </div>
              ))}
            </div>
            {classes.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                No classes available. Please create classes first.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {subjectToEdit ? "Update Subject" : "Create Subject"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}