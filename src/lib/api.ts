
import { Bug, CreateBugInput, UpdateBugInput } from "./types";
import { toast } from "sonner";

// Mock data - in a real app, this would be replaced with actual API calls
let mockBugs: Bug[] = [
  {
    id: "1",
    title: "Login button not working",
    description: "Users can't log in using the main login button in Chrome",
    status: "open",
    priority: "high",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: "2",
    title: "Pagination breaks on mobile",
    description: "The pagination controls overlap with content on screens smaller than 375px width",
    status: "in-progress",
    priority: "medium",
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "3",
    title: "Profile images not loading",
    description: "User profile images fail to load in the dashboard view",
    status: "resolved",
    priority: "low",
    createdAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 1).toISOString(),
  },
];

// Simulate API delay for more realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch all bugs
export const fetchBugs = async (): Promise<Bug[]> => {
  try {
    await delay(800); // Simulate network delay
    return [...mockBugs];
  } catch (error) {
    console.error("Error fetching bugs:", error);
    toast.error("Failed to fetch bugs");
    throw error;
  }
};

// Create a new bug
export const createBug = async (bugData: CreateBugInput): Promise<Bug> => {
  try {
    await delay(800);
    const newBug: Bug = {
      id: Date.now().toString(),
      ...bugData,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockBugs = [newBug, ...mockBugs];
    return newBug;
  } catch (error) {
    console.error("Error creating bug:", error);
    toast.error("Failed to create bug");
    throw error;
  }
};

// Update an existing bug
export const updateBug = async (bugData: UpdateBugInput): Promise<Bug> => {
  try {
    await delay(600);
    const index = mockBugs.findIndex(bug => bug.id === bugData.id);
    
    if (index === -1) {
      throw new Error("Bug not found");
    }
    
    const updatedBug = {
      ...mockBugs[index],
      ...bugData,
      updatedAt: new Date().toISOString(),
    };
    
    mockBugs[index] = updatedBug;
    mockBugs = [...mockBugs]; // Create a new array to trigger state updates
    
    return updatedBug;
  } catch (error) {
    console.error("Error updating bug:", error);
    toast.error("Failed to update bug");
    throw error;
  }
};

// Delete a bug
export const deleteBug = async (id: string): Promise<void> => {
  try {
    await delay(500);
    const index = mockBugs.findIndex(bug => bug.id === id);
    
    if (index === -1) {
      throw new Error("Bug not found");
    }
    
    mockBugs = mockBugs.filter(bug => bug.id !== id);
  } catch (error) {
    console.error("Error deleting bug:", error);
    toast.error("Failed to delete bug");
    throw error;
  }
};
