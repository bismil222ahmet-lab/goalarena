import AppLayout from '@/components/layout/AppLayout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Trophy, Zap, Globe, Users } from 'lucide-react';

export default function AboutPage() {
  usePageTitle('About GoalArena');
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">About GoalArena</h1>
        <p className="text-lg text-muted-foreground mb-10">Your ultimate destination for live football scores, news, transfers, and highlights.</p>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {[
            { icon: Zap, title: 'Real-Time Scores', desc: 'Get live match updates with minute-by-minute score tracking across all major leagues.' },
            { icon: Globe, title: 'Global Coverage', desc: 'Follow Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League, and more.' },
            { icon: Trophy, title: 'Complete Stats', desc: 'Access standings, fixtures, results, player stats, and head-to-head records.' },
            { icon: Users, title: 'Built for Fans', desc: 'A clean, fast, and beautiful experience designed for football enthusiasts worldwide.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-6">
              <Icon className="h-7 w-7 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Our Mission</h2>
            <p>GoalArena was created to bring football fans a fast, reliable, and beautifully designed platform to follow the beautiful game. We believe every fan deserves instant access to live scores, breaking news, transfer updates, and match highlights — all in one place.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">What We Offer</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Live match scores and real-time updates</li>
              <li>Comprehensive league standings and fixtures</li>
              <li>Breaking football news and transfer rumours</li>
              <li>Match highlights and video content</li>
              <li>Detailed match statistics and lineups</li>
              <li>Personalized favorites and notifications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-2">Our Commitment</h2>
            <p>We are committed to delivering accurate, timely, and unbiased football content. Our platform is continuously improved to provide the best possible experience for football fans around the world.</p>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
