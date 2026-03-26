import AppLayout from '@/components/layout/AppLayout';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function PrivacyPolicyPage() {
  usePageTitle('Privacy Policy');
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: March 22, 2026</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p>Welcome to GoalArena. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
            <p>We may collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Personal Information:</strong> Name, email address, and account details when you register.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, device information, and IP address.</li>
              <li><strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience. See our cookie consent banner for details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide, maintain, and improve our services</li>
              <li>To personalize your experience</li>
              <li>To communicate with you about updates and news</li>
              <li>To display relevant advertisements through Google AdSense</li>
              <li>To analyze usage patterns and improve performance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">4. Google AdSense & Advertising</h2>
            <p>We use Google AdSense to serve advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Ads Settings</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">5. Cookies</h2>
            <p>We use cookies for:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Necessary cookies:</strong> Required for website functionality.</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our site.</li>
              <li><strong>Advertising cookies:</strong> Used by Google AdSense to display relevant ads.</li>
            </ul>
            <p>You can manage your cookie preferences through our cookie consent banner.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">6. Data Sharing</h2>
            <p>We do not sell your personal data. We may share information with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Service providers who assist in operating our website</li>
              <li>Advertising partners (Google AdSense)</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">7. Your Rights (GDPR)</h2>
            <p>If you are in the EU/EEA, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">8. Data Security</h2>
            <p>We implement appropriate security measures to protect your data. However, no method of transmission over the internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">9. Children's Privacy</h2>
            <p>Our website is not intended for children under 13. We do not knowingly collect personal data from children.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground">10. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at <a href="/contact" className="text-primary hover:underline">our contact page</a>.</p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
