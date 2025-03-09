
import React, { useState, useEffect } from "react";
import { Bug, BugPriority, CreateBugInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  Bug as BugIcon,
  Loader2,
} from "lucide-react";
import { validateTitle, validateDescription } from "@/lib/utils";

interface BugFormProps {
  initialBug?: Bug;
  onSubmit: (bugData: CreateBugInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const BugForm: React.FC<BugFormProps> = ({
  initialBug,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [title, setTitle] = useState(initialBug?.title || "");
  const [description, setDescription] = useState(initialBug?.description || "");
  const [priority, setPriority] = useState<BugPriority>(initialBug?.priority || "medium");
  const [errors, setErrors] = useState<{
    title: string | null;
    description: string | null;
  }>({
    title: null,
    description: null,
  });
  const [touched, setTouched] = useState({
    title: false,
    description: false,
  });

  const isEditing = !!initialBug;

  useEffect(() => {
    if (touched.title) {
      setErrors((prev) => ({
        ...prev,
        title: validateTitle(title),
      }));
    }
  }, [title, touched.title]);

  useEffect(() => {
    if (touched.description) {
      setErrors((prev) => ({
        ...prev,
        description: validateDescription(description),
      }));
    }
  }, [description, touched.description]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const handlePriorityChange = (value: string) => {
    setPriority(value as BugPriority);
  };

  const handleBlur = (field: "title" | "description") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched to show validation errors
    setTouched({ title: true, description: true });
    
    // Validate all fields
    const titleError = validateTitle(title);
    const descriptionError = validateDescription(description);
    
    setErrors({
      title: titleError,
      description: descriptionError,
    });
    
    // If there are no errors, submit the form
    if (!titleError && !descriptionError) {
      onSubmit({
        title,
        description,
        priority,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-medium">
          Title
        </Label>
        <Input
          id="title"
          value={title}
          onChange={handleTitleChange}
          onBlur={() => handleBlur("title")}
          placeholder="Enter bug title"
          className={`transition-all duration-300 ${
            errors.title ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
          disabled={isSubmitting}
        />
        {errors.title && (
          <div className="text-xs text-red-500 flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.title}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          onBlur={() => handleBlur("description")}
          placeholder="Describe the bug in detail"
          className={`min-h-32 resize-none transition-all duration-300 ${
            errors.description ? "border-red-500 focus-visible:ring-red-500" : ""
          }`}
          disabled={isSubmitting}
        />
        {errors.description && (
          <div className="text-xs text-red-500 flex items-center mt-1">
            <AlertCircle className="h-3 w-3 mr-1" />
            {errors.description}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority" className="text-sm font-medium">
          Priority
        </Label>
        <Select
          value={priority}
          onValueChange={handlePriorityChange}
          disabled={isSubmitting}
        >
          <SelectTrigger id="priority" className="w-full">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low" className="text-bug-low">Low</SelectItem>
            <SelectItem value="medium" className="text-bug-medium">Medium</SelectItem>
            <SelectItem value="high" className="text-bug-high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <BugIcon className="mr-2 h-4 w-4" />
              {isEditing ? "Update Bug" : "Create Bug"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default BugForm;
