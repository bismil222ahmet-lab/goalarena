import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HighlightVideo {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
}

async function fetchHighlights(queries: string[]): Promise<HighlightVideo[]> {
  const { data, error } = await supabase.functions.invoke('youtube-search', {
    body: { queries },
  });

  if (error) {
    console.error('Highlights fetch error:', error);
    throw new Error('Failed to fetch highlights');
  }

  return data?.videos || [];
}

const CATEGORY_QUERIES: Record<string, string[]> = {
  'all': [
    'football highlights today goals',
    'best goals today football',
    'match highlights today 2025',
  ],
  'premier-league': [
    'Premier League highlights goals today',
    'Premier League best goals 2025',
  ],
  'champions-league': [
    'Champions League highlights goals',
    'UEFA Champions League best moments',
  ],
  'la-liga': [
    'La Liga highlights goals today',
    'La Liga best goals 2025',
  ],
  'serie-a': [
    'Serie A highlights goals today',
    'Serie A best goals 2025',
  ],
  'bundesliga': [
    'Bundesliga highlights goals today',
    'Bundesliga best goals 2025',
  ],
};

export function useHighlights(category: string = 'all') {
  const queries = CATEGORY_QUERIES[category] || CATEGORY_QUERIES['all'];
  
  return useQuery({
    queryKey: ['highlights', category],
    queryFn: () => fetchHighlights(queries),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}

export function useHighlightSearch(searchQuery: string) {
  return useQuery({
    queryKey: ['highlights-search', searchQuery],
    queryFn: () => fetchHighlights([`${searchQuery} highlights goals`]),
    enabled: !!searchQuery.trim(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

export function useHomepageHighlights() {
  return useQuery({
    queryKey: ['highlights', 'homepage'],
    queryFn: () => fetchHighlights(['football highlights today goals']),
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    select: (data) => data.slice(0, 4),
  });
}
