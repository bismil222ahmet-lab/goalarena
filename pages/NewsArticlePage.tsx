import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AppLayout from '@/components/layout/AppLayout';
import { ArrowLeft, Loader2, Calendar, User } from 'lucide-react';
import type { NewsItem } from '@/types/football';

export default function NewsArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [related, setRelated] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await (supabase.from as any)('news_items').select('*').eq('slug', slug).single();
      setArticle(data);
      if (data) {
        const { data: relatedData } = await (supabase.from as any)('news_items')
          .select('*')
          .neq('id', data.id)
          .order('created_at', { ascending: false })
          .limit(3);
        setRelated(relatedData || []);
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  if (loading) return <AppLayout><div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></AppLayout>;
  if (!article) return <AppLayout><div className="text-center py-20 text-muted-foreground">Article not found.</div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <Link to="/news" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-5 font-medium">
          <ArrowLeft className="h-4 w-4" /> Back to News
        </Link>

        <span className="text-xs font-semibold text-primary uppercase tracking-wider">{article.category}</span>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mt-1 mb-3 leading-tight">{article.title}</h1>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{article.author}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>

        {article.image_url && (
          <div className="aspect-video rounded-xl overflow-hidden mb-6 border border-border">
            <img src={article.image_url} alt={article.title} className="h-full w-full object-cover" />
          </div>
        )}

        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{article.summary}</p>

        <div className="prose prose-sm max-w-none text-foreground prose-headings:font-display prose-headings:text-foreground prose-a:text-primary" dangerouslySetInnerHTML={{ __html: article.content }} />

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="font-display text-lg font-bold mb-4">Related Articles</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map(r => (
                <Link key={r.id} to={`/news/${r.slug}`} className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-md transition-all">
                  {r.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img src={r.image_url} alt={r.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
                    </div>
                  )}
                  <div className="p-3">
                    <span className="text-[10px] font-semibold text-primary uppercase">{r.category}</span>
                    <h4 className="mt-0.5 text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{r.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}