const FORTUNES = [
  'Prod\'da çalışıyorsa dokunma. Çalışmıyorsa da cuma günü dokunma.',
  '"Benim makinemde çalışıyordu." — O zaman makineni gönderelim. Docker böyle doğdu.',
  'İki zor problem vardır: önbelleği geçersiz kılmak, isim vermek ve bir eksik bir fazla hataları.',
  'Yedeği olmayan veri, veri değildir; sadece henüz kaybolmamıştır.',
  'Her şey bir YAML girinti hatasına bakar.',
  'rm -rf yazmadan önce bir kez, Enter\'a basmadan önce iki kez düşün.',
  'DNS değildir. DNS olamaz. DNS\'ti.',
  'İzlemediğin sistem çalışmıyordur; sadece henüz haberin yoktur.',
  'En iyi kesinti, tatbikatını önceden yaptığın kesintidir.',
  'Otomatikleştirmeye değmeyecek kadar küçük iş yoktur; üçüncü kez yapıyorsan betiğini yaz.',
  'Pipeline yeşilse git kahve al. Kırmızıysa kahveyi sonra alırsın.',
  'Geçici çözüm kadar kalıcı bir şey yoktur.',
  'Log yoksa olay da yoktur.',
  'sudo: büyük güç, büyük sorumluluk getirir.',
];

export const fortune = () => FORTUNES[Math.floor(Math.random() * FORTUNES.length)];

const wrap = (text: string, width: number) => {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (line && (line + ' ' + word).length > width) { lines.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
};

/** Classic speech-bubble cow. */
export const cowsay = (text: string, width = 34) => {
  const lines = wrap(text, width);
  const w = Math.max(...lines.map(l => l.length));
  const bubble = lines.length === 1
    ? [`< ${lines[0].padEnd(w)} >`]
    : lines.map((l, i) => {
        const [a, b] = i === 0 ? ['/', '\\'] : i === lines.length - 1 ? ['\\', '/'] : ['|', '|'];
        return `${a} ${l.padEnd(w)} ${b}`;
      });
  return [
    ' ' + '_'.repeat(w + 2),
    ...bubble,
    ' ' + '-'.repeat(w + 2),
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ].join('\n');
};
