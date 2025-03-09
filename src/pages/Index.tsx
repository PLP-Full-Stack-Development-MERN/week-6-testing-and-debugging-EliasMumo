
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchBugs, createBug, updateBug, deleteBug } from "@/lib/api";
import { Bug, BugStatus, CreateBugInput, UpdateBugInput } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import BugsList from "@/components/BugsList";
import BugForm from "@/components/BugForm";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Plus, Bug as BugIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

const BugTracker: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [bugToDelete, setBugToDelete] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Fetch bugs
  const {
    data: bugs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bugs"],
    queryFn: fetchBugs,
    staleTime: 60000, // 1 minute
  });

  // Create bug mutation
  const createBugMutation = useMutation({
    mutationFn: (newBug: CreateBugInput) => createBug(newBug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] });
      setIsFormOpen(false);
      toast.success("Bug created successfully");
    },
    onError: (error: Error) => {
      console.error("Error creating bug:", error);
      toast.error("Failed to create bug");
    },
  });

  // Update bug mutation
  const updateBugMutation = useMutation({
    mutationFn: (updatedBug: UpdateBugInput) => updateBug(updatedBug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] });
      setIsFormOpen(false);
      setSelectedBug(null);
      toast.success("Bug updated successfully");
    },
    onError: (error: Error) => {
      console.error("Error updating bug:", error);
      toast.error("Failed to update bug");
    },
  });

  // Delete bug mutation
  const deleteBugMutation = useMutation({
    mutationFn: (id: string) => deleteBug(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bugs"] });
      setBugToDelete(null);
      setIsDeleteDialogOpen(false);
      toast.success("Bug deleted successfully");
    },
    onError: (error: Error) => {
      console.error("Error deleting bug:", error);
      toast.error("Failed to delete bug");
    },
  });

  // Handle opening the create bug form
  const handleCreateBugClick = () => {
    setSelectedBug(null);
    setIsFormOpen(true);
  };

  // Handle opening the edit bug form
  const handleEditClick = (bug: Bug) => {
    setSelectedBug(bug);
    setIsFormOpen(true);
  };

  // Handle opening the delete confirmation dialog
  const handleDeleteClick = (id: string) => {
    setBugToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  // Handle status change
  const handleStatusChange = (id: string, status: BugStatus) => {
    updateBugMutation.mutate({ id, status });
  };

  // Handle create/update bug form submission
  const handleFormSubmit = async (bugData: CreateBugInput) => {
    if (selectedBug) {
      updateBugMutation.mutate({
        id: selectedBug.id,
        ...bugData,
      });
    } else {
      createBugMutation.mutate(bugData);
    }
  };

  // Close the form dialog
  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedBug(null);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (bugToDelete) {
      deleteBugMutation.mutate(bugToDelete);
    }
  };

  // Close the delete dialog
  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setBugToDelete(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Bug Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage bugs in your projects
            </p>
          </div>
          <Button onClick={handleCreateBugClick} className="bg-primary hover:bg-primary/90 animate-slide-in">
            <Plus className="mr-1 h-4 w-4" />
            New Bug
          </Button>
        </div>

        <ErrorBoundary>
          {error ? (
            <div className="p-8 text-center bg-muted/30 rounded-lg border border-muted">
              <h2 className="text-xl font-semibold mb-2">Failed to load bugs</h2>
              <p className="text-muted-foreground mb-4">
                There was an error loading the bug list.
              </p>
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries({ queryKey: ["bugs"] })}
              >
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Retry
              </Button>
            </div>
          ) : (
            <BugsList
              bugs={bugs}
              isLoading={isLoading}
              onStatusChange={handleStatusChange}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          )}
        </ErrorBoundary>
      </div>

      {/* Create/Edit Bug Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BugIcon className="mr-2 h-5 w-5" />
              {selectedBug ? "Edit Bug" : "Create New Bug"}
            </DialogTitle>
          </DialogHeader>
          <BugForm
            initialBug={selectedBug || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isSubmitting={
              createBugMutation.isPending || updateBugMutation.isPending
            }
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the bug
              report.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteBugMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BugTracker;
