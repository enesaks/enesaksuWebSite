import { useSyncExternalStore } from 'react';
import { ARTICLES, PROJECTS } from '../data/constants';

export interface Article { date: string; title: string; desc: string; tags: string[]; url: string; slug: string }
export interface Project { title: string; desc: string; tags: string[]; url: string; status: string; stars?: number; updated?: string }

interface RemoteState { articles: Article[]; projects: Project[]; loading: boolean }

const TR: Record<string, string> = { 'ı':'i', 'ğ':'g', 'ü':'u', 'ş':'s', 'ö':'o', 'ç':'c', 'â':'a', 'î':'i', 'û':'u' };

const slugify = (title: string) =>
  title
    .toLocaleLowerCase('tr-TR')
    .replace(/[ığüşöçâîû]/g, ch => TR[ch] || ch)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 36)
    .replace(/-+$/, '') || 'yazi';

/** Gives every article a unique, shell-friendly file name. */
const withSlugs = (items: Omit<Article, 'slug'>[]): Article[] => {
  const seen = new Map<string, number>();
  return items.map(a => {
    const base = slugify(a.title);
    const n = (seen.get(base) || 0) + 1;
    seen.set(base, n);
    return { ...a, slug: `${n > 1 ? `${base}-${n}` : base}.md` };
  });
};

let state: RemoteState = { articles: withSlugs(ARTICLES), projects: PROJECTS, loading: true };
const listeners = new Set<() => void>();
const set = (patch: Partial<RemoteState>) => { state = { ...state, ...patch }; listeners.forEach(l => l()); };

const fetchArticles = async () => {
  const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@enesaks');
  if (!res.ok) throw new Error('rss');
  const data = await res.json();
  if (data.status !== 'ok' || !Array.isArray(data.items) || !data.items.length) throw new Error('rss data');
  set({
    articles: withSlugs(data.items.map((item: any) => {
      const clean = String(item.content || '').replace(/<[^>]*>?/gm, '').replace(/\s+/g, ' ').trim();
      return {
        date: new Date(item.pubDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase(),
        title: item.title,
        desc: clean.length > 160 ? clean.substring(0, 160) + '...' : clean,
        tags: item.categories || [],
        url: item.link,
      };
    })),
  });
};

const fetchProjects = async () => {
  const res = await fetch('https://api.github.com/users/enesaks/repos?sort=updated&direction=desc&per_page=100');
  if (!res.ok) throw new Error('github');
  const data = await res.json();
  if (!Array.isArray(data) || !data.length) throw new Error('github data');
  set({
    projects: data.map((repo: any) => ({
      title: repo.name,
      desc: repo.description || 'Açıklama bulunmuyor.',
      tags: repo.topics?.length ? repo.topics : [repo.language || 'code'],
      url: repo.html_url,
      status: repo.archived ? 'archived' : 'live',
      stars: repo.stargazers_count || 0,
      updated: repo.pushed_at
        ? new Date(repo.pushed_at).toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' })
        : undefined,
    })),
  });
};

let started = false;
/** Fetches live Medium / GitHub data once; the bundled fallback data stays in place if a request fails. */
export const loadRemote = () => {
  if (started) return;
  started = true;
  Promise.allSettled([fetchArticles(), fetchProjects()]).then(() => set({ loading: false }));
};

export const getRemote = () => state;
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export const useRemote = () => useSyncExternalStore(subscribe, getRemote);
