import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DataDeletionPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Data Deletion Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            You have the right to request the deletion of your personal data
            that we have collected.
          </p>

          <h2 className="text-xl font-semibold pt-4">How to Delete Your Data</h2>
          <p>
            To request the deletion of your account and all associated data,
            including your user profile and any connected social media tokens,
            please follow these steps:
          </p>
          <ol className="list-decimal pl-6">
            <li>
              Send an email to our support team at{" "}
              <a href="mailto:deletion@sportssync.example.com" className="text-primary hover:underline">
                deletion@sportssync.example.com
              </a>.
            </li>
            <li>
              Use the subject line: "Data Deletion Request".
            </li>
            <li>
              In the body of the email, please include the email address
              associated with your SportsSync account.
            </li>
          </ol>
          <p>
            We will process your request within 30 days of receipt. Once your
            data is deleted, it cannot be recovered.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
