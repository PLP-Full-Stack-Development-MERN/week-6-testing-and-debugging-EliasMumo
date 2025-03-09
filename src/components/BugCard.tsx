
import React from "react";
import { Bug } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, AlertTriangle, Clock } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime, getStatusColor, getPriorityColor } from "@/lib/utils";

interface BugCardProps {
  bug: Bug;
  onStatusChange: (id: string, status: Bug['status']) => void;
  onEdit: (bug: Bug) => void;
  onDelete: (id: string) => void;
}

const BugCard: React.FC<BugCardProps> = ({ bug, onStatusChange, onEdit, onDelete }) => {
  const statusBadgeClasses = getStatusColor(bug.status);
  const priorityClasses = getPriorityColor(bug.priority);
  
  return (
    <Card className="animate-scale-in stagger-item w-full transition-shadow duration-300 hover:shadow-elevated">
      <CardHeader className="flex-row items-start justify-between gap-4 py-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              variant="outline" 
              className={`h-6 px-2 font-medium uppercase text-xs tracking-wider ${statusBadgeClasses}`}
            >
              {bug.status.replace('-', ' ')}
            </Badge>
            <div className={`flex items-center text-xs font-medium ${priorityClasses}`}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              {bug.priority.charAt(0).toUpperCase() + bug.priority.slice(1)}
            </div>
          </div>
          <h3 className="text-lg font-semibold line-clamp-2">{bug.title}</h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit(bug)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(bug.id)}>
              Delete
            </DropdownMenuItem>
            {bug.status !== 'open' && (
              <DropdownMenuItem onClick={() => onStatusChange(bug.id, 'open')}>
                Mark as Open
              </DropdownMenuItem>
            )}
            {bug.status !== 'in-progress' && (
              <DropdownMenuItem onClick={() => onStatusChange(bug.id, 'in-progress')}>
                Mark as In Progress
              </DropdownMenuItem>
            )}
            {bug.status !== 'resolved' && (
              <DropdownMenuItem onClick={() => onStatusChange(bug.id, 'resolved')}>
                Mark as Resolved
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-muted-foreground line-clamp-3">{bug.description}</p>
      </CardContent>
      <CardFooter className="py-2 pt-4 text-xs text-muted-foreground">
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Updated {formatRelativeTime(bug.updatedAt)}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BugCard;
