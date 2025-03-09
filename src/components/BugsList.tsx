
import React from "react";
import { Bug, BugStatus } from "@/lib/types";
import BugCard from "./BugCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { filterBugsByStatus, searchBugs } from "@/lib/utils";
import { Search } from "lucide-react";
import ErrorBoundary from "./ErrorBoundary";

interface BugsListProps {
  bugs: Bug[];
  isLoading: boolean;
  onStatusChange: (id: string, status: Bug['status']) => void;
  onEdit: (bug: Bug) => void;
  onDelete: (id: string) => void;
}

const BugsList: React.FC<BugsListProps> = ({
  bugs,
  isLoading,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<string>("all");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredBugs = React.useMemo(() => {
    const statusFiltered =
      activeTab === "all"
        ? bugs
        : filterBugsByStatus(bugs, activeTab as BugStatus);
    return searchBugs(statusFiltered, searchQuery);
  }, [bugs, activeTab, searchQuery]);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search bugs..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-muted rounded-lg"
                />
              ))}
            </div>
          ) : filteredBugs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                {searchQuery
                  ? "No bugs match your search"
                  : "No bugs found in this category"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredBugs.map((bug) => (
                <ErrorBoundary key={bug.id}>
                  <BugCard
                    bug={bug}
                    onStatusChange={onStatusChange}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                </ErrorBoundary>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BugsList;
