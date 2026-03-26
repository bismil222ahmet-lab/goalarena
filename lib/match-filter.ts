import type { Fixture } from '@/types/football';

const TOP_LEAGUE_IDS = new Set([
  39, 140, 135, 78, 61, 2, 3, 848, 307, 253, 1, 4, 5, 9, 10, 11, 12, 13, 15, 16, 17, 30, 45, 48, 71, 88, 94, 103, 106, 113, 119, 128, 143, 144, 169, 179, 188, 197, 203, 218, 235, 262, 283, 292, 318, 323, 332, 333, 345, 357, 383,
  // Turkish: only Süper Lig
  203
]);

// Turkish leagues to ALLOW (only Süper Lig)
const ALLOWED_TURKISH_IDS = new Set([203]);

// Turkish league IDs to EXCLUDE (all minor Turkish leagues)
const EXCLUDED_TURKISH_IDS = new Set([
  204, 205, 206, 207, 208, 518, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529, 530, 531, 551, 552
]);

const TOP_LEAGUE_KEYWORDS = [
  'premier league', 'la liga', 'serie a', 'bundesliga', 'ligue 1',
  'champions league', 'europa league', 'conference league',
  'world cup', 'euro 20', 'copa america', 'nations league',
  'super cup', 'fa cup', 'copa del rey', 'dfb pokal', 'coppa italia',
  'coupe de france', 'carabao cup', 'community shield',
  'saudi pro', 'mls', 'liga mx', 'brasileirão', 'serie a brazil',
  'eredivisie', 'primeira liga', 'süper lig', 'scottish premiership',
  'championship', 'pro league', 'a-league',
];

const EXCLUDED_KEYWORDS = [
  '2. lig', '3. lig', 'tff 2', 'tff 3', 'tff 1', 'regional', 'amateur',
  'youth', 'u19', 'u21', 'u23', 'women', 'reserve', 'friendly',
  '4th division', '5th division', 'county', 'lower division',
  'turkey cup', 'turkish cup',
];

const BIG_TEAMS = new Set([
  'real madrid', 'barcelona', 'atletico madrid', 'manchester city',
  'manchester united', 'liverpool', 'chelsea', 'arsenal', 'tottenham',
  'bayern munich', 'borussia dortmund', 'psg', 'paris saint germain',
  'juventus', 'inter', 'ac milan', 'napoli', 'roma',
  'galatasaray', 'fenerbahce', 'besiktas',
  'ajax', 'benfica', 'porto', 'sporting cp',
  'celtic', 'rangers', 'al ahly', 'al hilal', 'al nassr',
  'flamengo', 'boca juniors', 'river plate',
]);

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function isTopLeague(match: Fixture): boolean {
  if (TOP_LEAGUE_IDS.has(match.league?.id)) return true;
  const name = normalize(match.league?.name || '');
  return TOP_LEAGUE_KEYWORDS.some(k => name.includes(k));
}

function isExcluded(match: Fixture): boolean {
  const name = normalize(match.league?.name || '');
  const country = normalize(match.league?.country || '');
  // Exclude by keyword
  if (EXCLUDED_KEYWORDS.some(k => name.includes(k))) return true;
  // Exclude by Turkish league IDs
  if (EXCLUDED_TURKISH_IDS.has(match.league?.id)) return true;
  // Exclude Turkish leagues not in the allowed set
  if (country === 'turkey' && !ALLOWED_TURKISH_IDS.has(match.league?.id)) return true;
  return false;
}

function isBigTeam(teamName: string): boolean {
  return BIG_TEAMS.has(normalize(teamName));
}

export function getMatchPriority(match: Fixture): number {
  let score = 0;
  if (isTopLeague(match)) score += 50;
  if (isBigTeam(match.teams?.home?.name || '')) score += 25;
  if (isBigTeam(match.teams?.away?.name || '')) score += 25;
  // Live matches get a boost
  const status = match.fixture?.status?.short || '';
  if (['1H', '2H', 'HT', 'ET', 'P', 'LIVE'].includes(status)) score += 30;
  return score;
}

export function filterAndSortMatches(matches: Fixture[]): Fixture[] {
  return matches
    .filter(m => !isExcluded(m))
    .sort((a, b) => getMatchPriority(b) - getMatchPriority(a));
}
