
export interface Bug {
  id: string;
  title: string;
  description: string;
  status: BugStatus;
  priority: BugPriority;
  createdAt: string;
  updatedAt: string;
}

export type BugStatus = 'open' | 'in-progress' | 'resolved';
export type BugPriority = 'low' | 'medium' | 'high';

export interface CreateBugInput {
  title: string;
  description: string;
  priority: BugPriority;
}

export interface UpdateBugInput {
  id: string;
  title?: string;
  description?: string;
  status?: BugStatus;
  priority?: BugPriority;
}
