import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Notice } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface NoticeFormProps {
  isOpen: boolean;
  onClose: () => void;
  noticeToEdit?: Notice | null;
  onSave: (notice: Notice) => void;
}

export function NoticeForm({ isOpen, onClose, noticeToEdit, onSave }: NoticeFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium",
    targetAudience: "all",
    expiryDate: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    if (noticeToEdit) {
      setFormData({
        title: noticeToEdit.title,
        content: noticeToEdit.content,
        priority: noticeToEdit.priority,
        targetAudience: noticeToEdit.targetAudience,
        expiryDate: noticeToEdit.expiryDate || ""
      });
    } else {
      setFormData({
        title: "",
        content: "",
        priority: "medium",
        targetAudience: "all",
        expiryDate: ""
      });
    }
  }, [noticeToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const noticeData: Notice = {
      id: noticeToEdit?.id || `notice-${Date.now()}`,
      title: formData.title,
      content: formData.content,
      priority: formData.priority as "low" | "medium" | "high" | "urgent",
      targetAudience: formData.targetAudience as "all" | "students" | "teachers" | "parents",
      createdBy: "Admin", // In real app, get from auth context
      createdAt: noticeToEdit?.createdAt || new Date().toISOString(),
      expiryDate: formData.expiryDate || undefined
    };

    onSave(noticeData);
    toast({
      title: "Success",
      description: `Notice ${noticeToEdit ? 'updated' : 'created'} successfully`
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {noticeToEdit ? "Edit Notice" : "Create New Notice"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Notice Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter notice title..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="audience">Target Audience *</Label>
              <Select value={formData.targetAudience} onValueChange={(value) => setFormData(prev => ({ ...prev, targetAudience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="teachers">Teachers</SelectItem>
                  <SelectItem value="parents">Parents</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
            <Input
              id="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="content">Notice Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your notice content here..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {noticeToEdit ? "Update Notice" : "Create Notice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}