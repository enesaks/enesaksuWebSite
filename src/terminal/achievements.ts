/** Badges a visitor earns by exploring the terminal. Kept per browser in localStorage. */
const KEY = 'enesaks.achievements';

export const ACHIEVEMENTS: { id: string; title: string; hint: string }[] = [
  { id: 'hello',    title: 'Merhaba Dünya',      hint: 'ilk komutunu çalıştır' },
  { id: 'reader',   title: 'Kitap Kurdu',        hint: 'bir yazıyı cat ile oku' },
  { id: 'explorer', title: 'Kaşif',              hint: 'gizli dosyaları listele' },
  { id: 'root',     title: 'Root Yetkisi',       hint: 'gizli dosyanın içini gör' },
  { id: 'panic',    title: 'Kernel Panik',       hint: 'en tehlikeli komutu dene' },
  { id: 'konami',   title: 'Eski Toprak',        hint: 'efsanevi tuş dizisini gir' },
  { id: 'vim',      title: 'Vim Kaçağı',         hint: 'vim\'den çıkmayı başar' },
  { id: 'snake',    title: 'Yılan Terbiyecisi',  hint: 'snake\'te 10 puan yap' },
  { id: 'typer',    title: 'Hızlı Parmaklar',    hint: 'typer\'da 40 puan yap' },
  { id: 'theme',    title: 'Renk Körü Değil',    hint: 'fosfor rengini değiştir' },
  { id: 'devops',   title: 'Gerçek DevOps',      hint: 'docker ve kubectl kullan' },
  { id: 'grep',     title: 'Boru Ustası',        hint: 'bir çıktıyı grep\'e aktar' },
  { id: 'cow',      title: 'Muuu',               hint: 'ineği konuştur' },
  { id: 'weather',  title: 'Hava Durumu',        hint: 'havaya bak' },
  { id: 'off',      title: 'Elektrik Faturası',  hint: 'monitörü kapat' },
  { id: 'night',    title: 'Gece Kuşu',          hint: 'gece yarısından sonra uğra' },
];

const load = (): string[] => {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : []; }
  catch { return []; }
};

let unlocked = new Set<string>(load());

export const isUnlocked = (id: string) => unlocked.has(id);
export const unlockedCount = () => ACHIEVEMENTS.filter(a => unlocked.has(a.id)).length;

/** Unlocks a badge; returns it only the first time, so the caller can announce it. */
export const unlock = (id: string) => {
  const a = ACHIEVEMENTS.find(x => x.id === id);
  if (!a || unlocked.has(id)) return null;
  unlocked = new Set(unlocked).add(id);
  try { localStorage.setItem(KEY, JSON.stringify([...unlocked])); } catch { /* storage unavailable */ }
  return a;
};
