import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MessageSquare, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  usePageTitle('Contact Us');
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSending(true);
    // Simulate send
    await new Promise(r => setTimeout(r, 1000));
    toast.success('Your message has been sent. We will get back to you soon!');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-8">Have a question, feedback, or partnership inquiry? We'd love to hear from you.</p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Mail, title: 'Email', desc: 'contact@goalarena.app' },
            { icon: MessageSquare, title: 'Support', desc: 'We typically respond within 24 hours' },
            { icon: Send, title: 'Social', desc: 'Follow us on social media' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-5 text-center">
              <Icon className="h-6 w-6 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{desc}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Name *</label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email *</label>
              <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
            <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="What is this about?" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Message *</label>
            <Textarea rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Write your message here..." />
          </div>
          <Button type="submit" disabled={sending} className="w-full sm:w-auto">
            {sending ? 'Sending...' : 'Send Message'}
          </Button>
        </form>
      </div>
    </AppLayout>
  );
}
