
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Bug, BugPriority, BugStatus } from "./types";

// Combine Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to a readable format
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

// Format relative time (e.g., "2 days ago")
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHours = Math.floor(diffInMin / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSec < 60) {
    return 'just now';
  } else if (diffInMin < 60) {
    return `${diffInMin} minute${diffInMin > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString);
  }
}

// Validate bug title
export function validateTitle(title: string): string | null {
  if (!title.trim()) {
    return 'Title is required';
  }
  if (title.length < 5) {
    return 'Title must be at least 5 characters';
  }
  if (title.length > 100) {
    return 'Title must be less than 100 characters';
  }
  return null;
}

// Validate bug description
export function validateDescription(description: string): string | null {
  if (!description.trim()) {
    return 'Description is required';
  }
  if (description.length < 10) {
    return 'Description must be at least 10 characters';
  }
  if (description.length > 500) {
    return 'Description must be less than 500 characters';
  }
  return null;
}

// Get status color based on bug status
export function getStatusColor(status: BugStatus): string {
  switch (status) {
    case 'open':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'in-progress':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

// Get priority color based on bug priority
export function getPriorityColor(priority: BugPriority): string {
  switch (priority) {
    case 'low':
      return 'text-bug-low';
    case 'medium':
      return 'text-bug-medium';
    case 'high':
      return 'text-bug-high';
    default:
      return 'text-gray-500';
  }
}

// Filter bugs by status
export function filterBugsByStatus(bugs: Bug[], status?: BugStatus): Bug[] {
  if (!status) return bugs;
  return bugs.filter(bug => bug.status === status);
}

// Sort bugs by different criteria
export function sortBugs(bugs: Bug[], sortBy: 'priority' | 'date' = 'date', order: 'asc' | 'desc' = 'desc'): Bug[] {
  return [...bugs].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityMap = { high: 3, medium: 2, low: 1 };
      const priorityA = priorityMap[a.priority] || 0;
      const priorityB = priorityMap[b.priority] || 0;
      return order === 'desc' ? priorityB - priorityA : priorityA - priorityB;
    } else {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    }
  });
}

// Search bugs by title and description
export function searchBugs(bugs: Bug[], query: string): Bug[] {
  if (!query.trim()) return bugs;
  const lowerQuery = query.toLowerCase();
  return bugs.filter(
    bug =>
      bug.title.toLowerCase().includes(lowerQuery) ||
      bug.description.toLowerCase().includes(lowerQuery)
  );
}
