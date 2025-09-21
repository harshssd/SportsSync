import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Token Encryption</CardTitle>
          <CardDescription>
            Manage the encryption key for stored access tokens.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            In a production environment, an administrative interface would be
            provided here to safely rotate the `TOKEN_ENC_KEY` and trigger a
            re-encryption of all stored tokens in the database.
          </p>
          <p className="mt-4 text-sm font-semibold">This is a placeholder for Phase 1.</p>
        </CardContent>
      </Card>
    </div>
  );
}
