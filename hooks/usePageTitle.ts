import { useEffect } from 'react';

const SUFFIX = ' | GoalArena';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title}${SUFFIX}` : `GoalArena — Live Football Scores, Results & News`;
  }, [title]);
}
