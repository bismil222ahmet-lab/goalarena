import AppLayout from '@/components/layout/AppLayout';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function TermsOfServicePage() {
  usePageTitle('Terms of Service');
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 22, 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing and using GoalArena, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p>GoalArena provides live football scores, match results, fixtures, transfer news, player updates, league standings, and video highlights. Our content is for informational and entertainment purposes only.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. User Accounts</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You are responsible for maintaining the security of your account.</li>
              <li>You must provide accurate and complete information during registration.</li>
              <li>You are responsible for all activities that occur under your account.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Scrape, copy, or redistribute our content without permission</li>
              <li>Use automated tools to access our service excessively</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Intellectual Property</h2>
            <p>All content on GoalArena, including text, graphics, logos, and software, is the property of GoalArena or its licensors and is protected by intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Third-Party Content</h2>
            <p>Our website may display content from third-party sources including match data providers, news agencies, and video platforms (e.g., YouTube). We do not claim ownership of third-party content and are not responsible for its accuracy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Advertisements</h2>
            <p>GoalArena displays advertisements through Google AdSense. We are not responsible for the content of third-party advertisements. Your interactions with advertisers are solely between you and the advertiser.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Disclaimer of Warranties</h2>
            <p>GoalArena is provided "as is" without warranties of any kind. We do not guarantee the accuracy, completeness, or timeliness of match scores, statistics, or any other data.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Limitation of Liability</h2>
            <p>GoalArena shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">11. Contact</h2>
            <p>For questions regarding these Terms of Service, please visit our <a href="/contact" className="text-primary hover:underline">contact page</a>.</p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
