import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-3xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Welcome to SportsSync. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our
            application.
          </p>

          <h2 className="text-xl font-semibold pt-4">1. Information We Collect</h2>
          <p>
            We may collect information about you in a variety of ways. The
            information we may collect via the Application includes:
          </p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Personal Data:</strong> Personally identifiable information,
              such as your name and email address, that you voluntarily give to
              us when you register with the Application.
            </li>
            <li>
              <strong>Social Media Data:</strong> We access basic account information
              from social networking sites, such as Instagram, such as your
              username, profile picture, and public media, in accordance with the
              authorization procedures determined by such social networking site.
              We do not store your passwords. Access tokens are stored encrypted.
            </li>
          </ul>

          <h2 className="text-xl font-semibold pt-4">2. Use of Your Information</h2>
          <p>
            Having accurate information about you permits us to provide you with a
            smooth, efficient, and customized experience. Specifically, we may
            use information collected about you via the Application to display
            your social media content within your personal dashboard.
          </p>

          <h2 className="text-xl font-semibold pt-4">3. Contact Us</h2>
          <p>
            If you have questions or comments about this Privacy Policy, please
            contact us at: <a href="mailto:privacy@sportssync.example.com" className="text-primary hover:underline">privacy@sportssync.example.com</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
