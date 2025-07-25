import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Syllabus, Subject, Teacher, Class } from "@/types";
import { SubjectStorage, TeacherStorage, ClassStorage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface SyllabusFormProps {
  isOpen: boolean;
  onClose: () => void;
  syllabusToEdit?: Syllabus | null;
  onSave: (syllabus: Syllabus) => void;
}

export function SyllabusForm({ isOpen, onClose, syllabusToEdit, onSave }: SyllabusFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subjectId: "",
    teacherId: "",
    classIds: [] as string[],
    grade: "",
    targetType: "monthly",
    startDate: "",
    endDate: "",
    topics: [] as string[],
    learningObjectives: [] as string[],
    assessmentMethods: [] as string[],
    resources: [] as string[]
  });
  
  const [newTopic, setNewTopic] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [newAssessment, setNewAssessment] = useState("");
  const [newResource, setNewResource] = useState("");
  
  const { toast } = useToast();

  const subjects = SubjectStorage.getAll();
  const teachers = TeacherStorage.getAll();
  const classes = ClassStorage.getAll();
  const grades = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  useEffect(() => {
    if (syllabusToEdit) {
      setFormData({
        title: syllabusToEdit.title,
        description: syllabusToEdit.description,
        subjectId: syllabusToEdit.subjectId,
        teacherId: syllabusToEdit.teacherId,
        classIds: syllabusToEdit.classIds,
        grade: syllabusToEdit.grade,
        targetType: syllabusToEdit.targetType,
        startDate: syllabusToEdit.startDate,
        endDate: syllabusToEdit.endDate,
        topics: syllabusToEdit.topics,
        learningObjectives: syllabusToEdit.learningObjectives,
        assessmentMethods: syllabusToEdit.assessmentMethods,
        resources: syllabusToEdit.resources
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        title: "",
        description: "",
        subjectId: "",
        teacherId: "",
        classIds: [],
        grade: "",
        targetType: "monthly",
        startDate: today,
        endDate: "",
        topics: [],
        learningObjectives: [],
        assessmentMethods: [],
        resources: []
      });
    }
  }, [syllabusToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.subjectId || !formData.teacherId || !formData.grade || !formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const syllabusData: Syllabus = {
      id: syllabusToEdit?.id || `syllabus-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      subjectId: formData.subjectId,
      teacherId: formData.teacherId,
      classIds: formData.classIds,
      grade: formData.grade,
      targetType: formData.targetType as "weekly" | "monthly",
      startDate: formData.startDate,
      endDate: formData.endDate,
      topics: formData.topics,
      learningObjectives: formData.learningObjectives,
      assessmentMethods: formData.assessmentMethods,
      resources: formData.resources,
      status: syllabusToEdit?.status || "planned",
      progressPercentage: syllabusToEdit?.progressPercentage || 0,
      createdAt: syllabusToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(syllabusData);
    toast({
      title: "Success",
      description: `Syllabus ${syllabusToEdit ? 'updated' : 'created'} successfully`
    });
    onClose();
  };

  const addToArray = (arrayName: string, value: string, setter: (value: string) => void) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [arrayName]: [...prev[arrayName as keyof typeof prev] as string[], value.trim()]
      }));
      setter("");
    }
  };

  const removeFromArray = (arrayName: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {syllabusToEdit ? "Edit Syllabus" : "Create New Syllabus"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Syllabus Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Mathematics Curriculum 2024"
                required
              />
            </div>
            <div>
              <Label htmlFor="targetType">Target Type *</Label>
              <Select value={formData.targetType} onValueChange={(value) => setFormData(prev => ({ ...prev, targetType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the syllabus..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Select value={formData.subjectId} onValueChange={(value) => setFormData(prev => ({ ...prev, subjectId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="teacher">Teacher *</Label>
              <Select value={formData.teacherId} onValueChange={(value) => setFormData(prev => ({ ...prev, teacherId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label>Assign to Classes</Label>
            <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded p-3">
              {classes.map((cls) => (
                <div key={cls.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={cls.id}
                    checked={formData.classIds.includes(cls.id)}
                    onCheckedChange={() => toggleClass(cls.id)}
                  />
                  <Label htmlFor={cls.id} className="text-sm">
                    {cls.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div>
            <Label>Topics</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Add a topic..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('topics', newTopic, setNewTopic))}
              />
              <Button type="button" onClick={() => addToArray('topics', newTopic, setNewTopic)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.topics.map((topic, index) => (
                <div key={index} className="addTopicSyllabus bg-secondary px-2 py-1 rounded text-sm flex items-center gap-1">
                  {topic}
                  <button type="button" onClick={() => removeFromArray('topics', index)} className="ml-1 text-red-500">×</button>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <Label>Learning Objectives</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Add a learning objective..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('learningObjectives', newObjective, setNewObjective))}
              />
              <Button type="button" onClick={() => addToArray('learningObjectives', newObjective, setNewObjective)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.learningObjectives.map((objective, index) => (
                <div key={index} className="addTopicSyllabus bg-secondary px-2 py-1 rounded text-sm flex items-center gap-1">
                  {objective}
                  <button type="button" onClick={() => removeFromArray('learningObjectives', index)} className="ml-1 text-red-500">×</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {syllabusToEdit ? "Update Syllabus" : "Create Syllabus"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}