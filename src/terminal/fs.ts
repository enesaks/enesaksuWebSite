import { getRemote, Article, Project } from './remote';

/** A tiny read-only virtual file system: ~ with two directories fed by Medium and GitHub. */
export type Kind = 'dir' | 'file' | 'exec' | 'repo';
export interface Entry { name: string; kind: Kind; size: number; article?: Article; project?: Project }

export const HOME = '/home/enes';
/** cwd is '' for ~, or the name of a first-level directory. */
export const cwdLabel = (cwd: string) => (cwd ? `~/${cwd}` : '~');
export const cwdAbs = (cwd: string) => (cwd ? `${HOME}/${cwd}` : HOME);

export const entries = (dir: string): Entry[] | null => {
  const { articles, projects } = getRemote();
  if (dir === '') {
    return [
      { name: 'about.txt', kind: 'file', size: 512 },
      { name: 'contact.json', kind: 'file', size: 348 },
      { name: 'experience.log', kind: 'file', size: 421 },
      { name: 'projects', kind: 'dir', size: 4096 },
      { name: 'snake.sh', kind: 'exec', size: 2048 },
      { name: 'writings', kind: 'dir', size: 4096 },
    ];
  }
  if (dir === 'writings') {
    return articles.map(a => ({ name: a.slug, kind: 'file' as Kind, size: 1024 + a.desc.length * 37, article: a }));
  }
  if (dir === 'projects') {
    return projects.map(p => ({ name: p.title, kind: 'repo' as Kind, size: 4096, project: p }));
  }
  return null;
};

export type Resolved =
  | { ok: true; dir: string; entry?: Entry }      // entry undefined => the directory itself
  | { ok: false; reason: 'notfound' | 'notdir' };

export const resolvePath = (cwd: string, arg: string): Resolved => {
  let segs = cwd ? [cwd] : [];
  let rest = arg.trim();
  if (rest === '~' || rest.startsWith('~/')) { segs = []; rest = rest.slice(1); }
  else if (rest === HOME || rest.startsWith(HOME + '/')) { segs = []; rest = rest.slice(HOME.length); }
  else if (rest.startsWith('/')) return { ok: false, reason: 'notfound' };

  for (const part of rest.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') { segs.pop(); continue; }
    segs.push(part);
  }

  if (segs.length === 0) return { ok: true, dir: '' };
  const top = entries('')!.find(e => e.name === segs[0]);
  if (!top) return { ok: false, reason: 'notfound' };
  if (segs.length === 1) return top.kind === 'dir' ? { ok: true, dir: top.name } : { ok: true, dir: '', entry: top };
  if (top.kind !== 'dir') return { ok: false, reason: 'notdir' };
  const child = entries(top.name)!.find(e => e.name === segs[1]);
  if (!child) return { ok: false, reason: 'notfound' };
  if (segs.length === 2) return { ok: true, dir: top.name, entry: child };
  return { ok: false, reason: child.kind === 'repo' ? 'notfound' : 'notdir' };
};

/** Candidates for Tab completion of a (possibly partial) path argument. */
export const completePath = (cwd: string, partial: string): { base: string; names: { name: string; kind: Kind }[] } => {
  const cut = partial.lastIndexOf('/');
  const base = cut >= 0 ? partial.slice(0, cut + 1) : '';
  const prefix = cut >= 0 ? partial.slice(cut + 1) : partial;
  const target = base ? resolvePath(cwd, base) : ({ ok: true, dir: cwd } as Resolved);
  if (!target.ok || target.entry) return { base, names: [] };
  const list = entries(target.dir) || [];
  return { base, names: list.filter(e => e.name.startsWith(prefix)).map(e => ({ name: e.name, kind: e.kind })) };
};
