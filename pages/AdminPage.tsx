import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Newspaper, Play, BarChart3, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

type AdminTab = 'overview' | 'news' | 'highlights' | 'transfers';

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('overview');

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold mb-2">GoalArena Admin</h1>
      <p className="text-sm text-muted-foreground mb-6">Manage your football platform content</p>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {([
          { key: 'overview' as AdminTab, label: 'Overview', icon: BarChart3 },
          { key: 'news' as AdminTab, label: 'News', icon: Newspaper },
          { key: 'highlights' as AdminTab, label: 'Highlights', icon: Play },
          { key: 'transfers' as AdminTab, label: 'Transfers', icon: ArrowRightLeft },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all border whitespace-nowrap',
              tab === t.key ? 'bg-primary text-primary-foreground border-primary shadow-md' : 'bg-card text-muted-foreground border-border hover:text-foreground'
            )}
          >
            <t.icon className="h-4 w-4" />{t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <AdminOverview />}
      {tab === 'news' && <ManageNews />}
      {tab === 'highlights' && <ManageHighlights />}
      {tab === 'transfers' && <ManageTransfers />}
    </AppLayout>
  );
}

function AdminOverview() {
  const [counts, setCounts] = useState({ news: 0, highlights: 0, transfers: 0 });

  useEffect(() => {
    async function load() {
      const [n, h, t] = await Promise.all([
        (supabase.from as any)('news_items').select('id', { count: 'exact', head: true }),
        (supabase.from as any)('highlight_videos').select('id', { count: 'exact', head: true }),
        (supabase.from as any)('transfers').select('id', { count: 'exact', head: true }),
      ]);
      setCounts({ news: n.count || 0, highlights: h.count || 0, transfers: t.count || 0 });
    }
    load();
  }, []);

  const cards = [
    { label: 'News Articles', value: counts.news, icon: Newspaper },
    { label: 'Highlight Videos', value: counts.highlights, icon: Play },
    { label: 'Transfers', value: counts.transfers, icon: ArrowRightLeft },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(c => (
        <div key={c.label} className="rounded-xl border border-border bg-card p-6">
          <c.icon className="h-8 w-8 text-primary mb-3" />
          <p className="text-3xl font-bold font-display text-foreground">{c.value}</p>
          <p className="text-sm text-muted-foreground">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

function ManageNews() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', summary: '', content: '', image_url: '', category: 'General', slug: '', author: 'Admin' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await (supabase.from as any)('news_items').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { error } = await (supabase.from as any)('news_items').insert({ ...form, slug });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('News article added!');
    setForm({ title: '', summary: '', content: '', image_url: '', category: 'General', slug: '', author: 'Admin' });
    load();
  };

  const handleDelete = async (id: string) => {
    await (supabase.from as any)('news_items').delete().eq('id', id);
    toast.success('Deleted');
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-display font-semibold">Add News Article</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
          <div className="space-y-2"><Label>Image URL</Label><Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} /></div>
          <div className="space-y-2"><Label>Author</Label><Input value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></div>
        </div>
        <div className="space-y-2"><Label>Summary</Label><Input value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} required /></div>
        <div className="space-y-2"><Label>Content (HTML)</Label><Textarea rows={5} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required /></div>
        <Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Plus className="mr-1 h-4 w-4" /> Add Article</Button>
      </form>

      <div className="space-y-2">
        {loading ? <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /> : items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No news articles yet.</p>
        ) : items.map(item => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.category} • {new Date(item.created_at).toLocaleDateString()}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManageHighlights() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', video_url: '', thumbnail_url: '', match_info: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await (supabase.from as any)('highlight_videos').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await (supabase.from as any)('highlight_videos').insert(form);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Highlight added!');
    setForm({ title: '', video_url: '', thumbnail_url: '', match_info: '' });
    load();
  };

  const handleDelete = async (id: string) => {
    await (supabase.from as any)('highlight_videos').delete().eq('id', id);
    toast.success('Deleted');
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-display font-semibold">Add Highlight Video</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
          <div className="space-y-2"><Label>Match Info</Label><Input value={form.match_info} onChange={e => setForm({ ...form, match_info: e.target.value })} /></div>
          <div className="space-y-2"><Label>Video URL (YouTube)</Label><Input value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} required /></div>
          <div className="space-y-2"><Label>Thumbnail URL</Label><Input value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} /></div>
        </div>
        <Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Plus className="mr-1 h-4 w-4" /> Add Highlight</Button>
      </form>

      <div className="space-y-2">
        {loading ? <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /> : items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No highlights yet.</p>
        ) : items.map(item => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground truncate">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.match_info}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ManageTransfers() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ player_name: '', from_club: '', to_club: '', fee: 'Undisclosed', status: 'rumor', player_image: '', from_club_logo: '', to_club_logo: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await (supabase.from as any)('transfers').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await (supabase.from as any)('transfers').insert(form);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success('Transfer added!');
    setForm({ player_name: '', from_club: '', to_club: '', fee: 'Undisclosed', status: 'rumor', player_image: '', from_club_logo: '', to_club_logo: '' });
    load();
  };

  const handleDelete = async (id: string) => {
    await (supabase.from as any)('transfers').delete().eq('id', id);
    toast.success('Deleted');
    load();
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-display font-semibold">Add Transfer</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2"><Label>Player Name</Label><Input value={form.player_name} onChange={e => setForm({ ...form, player_name: e.target.value })} required /></div>
          <div className="space-y-2"><Label>From Club</Label><Input value={form.from_club} onChange={e => setForm({ ...form, from_club: e.target.value })} required /></div>
          <div className="space-y-2"><Label>To Club</Label><Input value={form.to_club} onChange={e => setForm({ ...form, to_club: e.target.value })} required /></div>
          <div className="space-y-2"><Label>Fee</Label><Input value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} /></div>
          <div className="space-y-2"><Label>Status</Label><Input value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} placeholder="rumor / official / completed" /></div>
          <div className="space-y-2"><Label>Player Image URL</Label><Input value={form.player_image} onChange={e => setForm({ ...form, player_image: e.target.value })} /></div>
        </div>
        <Button type="submit" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}<Plus className="mr-1 h-4 w-4" /> Add Transfer</Button>
      </form>

      <div className="space-y-2">
        {loading ? <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" /> : items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No transfers yet.</p>
        ) : items.map(item => (
          <div key={item.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium text-foreground truncate">{item.player_name}</p>
              <p className="text-xs text-muted-foreground">{item.from_club} → {item.to_club} • {item.fee}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}