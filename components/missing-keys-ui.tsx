"use client";

import { AlertCircle, Key, Server, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function MissingKeysUI() {
  const isMissingUrl = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project");
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const isMissingKey = !key || key.includes("your-anon-key");

  if (!isMissingUrl && !isMissingKey) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg shadow-2xl border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
             <Key className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Action Required</CardTitle>
          <CardDescription>
            Supabase credentials are missing or invalid.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border">
              <Settings className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-bold">Step 1: Create .env.local</p>
                <p className="text-xs text-muted-foreground">
                  Create a file named <code className="bg-muted px-1 rounded">.env.local</code> in the project root.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border">
              <Server className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-bold">Step 2: Add Keys</p>
                <p className="text-xs text-muted-foreground">
                  Paste your Supabase URL and Anon Key from the dashboard.
                </p>
                <pre className="mt-2 text-[10px] bg-black text-white p-2 rounded overflow-x-auto">
                  NEXT_PUBLIC_SUPABASE_URL=...{"\n"}
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
                </pre>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center gap-3">
             <AlertCircle className="h-5 w-5 text-primary shrink-0" />
             <p className="text-xs text-primary font-medium"> Restart the server after adding keys to apply changes.</p>
          </div>

          <Button 
            className="w-full h-12 rounded-xl text-md font-bold"
            onClick={() => window.location.reload()}
          >
            I've added the keys, reload app
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
