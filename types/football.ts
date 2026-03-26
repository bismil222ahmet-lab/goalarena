export interface Fixture {
  fixture: {
    id: number;
    referee: string | null;
    timezone: string;
    date: string;
    timestamp: number;
    venue: { id: number; name: string; city: string } | null;
    status: {
      long: string;
      short: string;
      elapsed: number | null;
    };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: {
    home: TeamInfo;
    away: TeamInfo;
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface TeamInfo {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface MatchEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number; name: string };
  assist: { id: number | null; name: string | null };
  type: string;
  detail: string;
  comments: string | null;
}

export interface MatchLineup {
  team: { id: number; name: string; logo: string; colors: any };
  coach: { id: number; name: string; photo: string };
  formation: string;
  startXI: Array<{ player: { id: number; name: string; number: number; pos: string } }>;
  substitutes: Array<{ player: { id: number; name: string; number: number; pos: string } }>;
}

export interface MatchStatistic {
  team: { id: number; name: string; logo: string };
  statistics: Array<{ type: string; value: string | number | null }>;
}

export interface Standing {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  group: string;
  form: string;
  status: string;
  description: string | null;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
}

export interface League {
  league: { id: number; name: string; type: string; logo: string };
  country: { name: string; code: string; flag: string };
  seasons: Array<{ year: number; current: boolean }>;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image_url: string;
  category: string;
  slug: string;
  created_at: string;
  author: string;
}

export interface TransferItem {
  id: string;
  player_name: string;
  player_image: string;
  from_club: string;
  from_club_logo: string;
  to_club: string;
  to_club_logo: string;
  fee: string;
  status: 'rumor' | 'official' | 'completed';
  created_at: string;
}

export interface HighlightVideo {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  match_info: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  theme_preference: 'light' | 'dark' | 'system';
  created_at: string;
}
