"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOrganizationList, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Kanban, Building2, ArrowRight, Plus } from "lucide-react";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const { isLoaded, createOrganization, setActive, userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  });
  const [orgName, setOrgName] = useState("");
  const [creating, setCreating] = useState(false);
  const [mode, setMode] = useState<"choose" | "create">("choose");

  const handleCreate = async () => {
    if (!orgName.trim() || !isLoaded || !createOrganization || !setActive) return;
    setCreating(true);
    try {
      const org = await createOrganization({ name: orgName.trim() });
      await setActive({ organization: org.id });
      toast.success(`Workspace "${orgName}" created!`);
      router.push("/dashboard");
    } catch {
      toast.error("Failed to create workspace. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (orgId: string) => {
    if (!isLoaded || !setActive) return;
    try {
      await setActive({ organization: orgId });
      router.push("/dashboard");
    } catch {
      toast.error("Failed to switch workspace.");
    }
  };

  const existingOrgs = userMemberships?.data ?? [];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <Kanban className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Set up your workspace</h1>
          <p className="text-muted-foreground mt-2">
            Hey {user?.firstName ?? "there"} 👋 Create or join a workspace to get started.
          </p>
        </div>

        {existingOrgs.length > 0 && mode === "choose" && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Your workspaces
              </CardTitle>
              <CardDescription>You already belong to these workspaces</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {existingOrgs.map((mem) => (
                <button
                  key={mem.organization.id}
                  onClick={() => handleJoin(mem.organization.id)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent hover:border-primary/50 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                      {mem.organization.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{mem.organization.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{mem.role?.toLowerCase()}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
              <Button variant="outline" className="w-full mt-4" onClick={() => setMode("create")}>
                <Plus className="w-4 h-4 mr-2" /> Create new workspace
              </Button>
            </CardContent>
          </Card>
        )}

        {(existingOrgs.length === 0 || mode === "create") && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Create a workspace</CardTitle>
              <CardDescription>This will be your team&apos;s shared space on CollabBoard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgName">Workspace name</Label>
                <Input
                  id="orgName"
                  placeholder="e.g. Acme Inc"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
              </div>
              <Button onClick={handleCreate} disabled={!orgName.trim() || creating} className="w-full">
                {creating ? "Creating…" : "Create workspace"} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {existingOrgs.length > 0 && (
                <Button variant="ghost" className="w-full" onClick={() => setMode("choose")}>
                  Back to workspaces
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
