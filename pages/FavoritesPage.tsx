import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/common/LoadingStates';
import { Star, Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Favorite {
  id: string;
  item_type: string;
  item_id: string;
  item_name: string;
  item_logo: string | null;
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    if (!user) return;
    const { data } = await (supabase.from as any)('favorites').select('*').eq('user_id', user.id);
    setFavorites(data || []);
    setLoading(false);
  };

  useEffect(() => { loadFavorites(); }, [user]);

  const removeFavorite = async (id: string) => {
    await (supabase.from as any)('favorites').delete().eq('id', id);
    setFavorites(f => f.filter(fav => fav.id !== id));
    toast.success('Removed from favorites');
  };

  return (
    <AppLayout>
      <h1 className="font-display text-2xl font-bold mb-6">Favorites</h1>
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : favorites.length === 0 ? (
        <EmptyState icon={Star} title="No favorites yet" description="Add your favorite teams and leagues to see them here." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map(f => (
            <div key={f.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
              {f.item_logo && <img src={f.item_logo} alt={f.item_name} className="h-10 w-10 object-contain" />}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{f.item_name}</p>
                <p className="text-xs text-muted-foreground capitalize">{f.item_type}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFavorite(f.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
