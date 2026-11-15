export const BOOT = [
  { t: 0,    cls:"c-bright", text:"ENESAKSU OS v2.5.0 (tty1)" },
  { t: 160,  cls:"c-cyan",   text:"Kernel 6.8.0-enesaksu #1 SMP x86_64 GNU/Linux" },
  { t: 300,  cls:"",         text:"" },
  { t: 400,  cls:"",         text:"[    0.000000] BIOS-provided physical RAM map: 640K base, 32G extended" },
  { t: 500,  cls:"ok",       text:"[  OK  ] Started docker.service" },
  { t: 600,  cls:"ok",       text:"[  OK  ] Started ollama.service (qwen3:14b loaded)" },
  { t: 700,  cls:"ok",       text:"[  OK  ] Reached target aws.credentials" },
  { t: 800,  cls:"warn",     text:"[ WARN ] wsl2.memory: 16GB allocated (RTX 5060 Ti)" },
  { t: 900,  cls:"ok",       text:"[  OK  ] Mounted medium.com/@enesaks on ~/writings" },
  { t: 1000, cls:"ok",       text:"[  OK  ] Mounted github.com/enesaks on ~/projects" },
  { t: 1100, cls:"ok",       text:"[  OK  ] Started portfolio.service on :3000" },
  { t: 1220, cls:"",         text:"" },
];

export const ARTICLES = [
  { date:'AUG 18, 2025 · PINNED', title:'AWS ( Amazon Web Server ) Notlarım', desc:'AWS üzerinde çalışırken edindiğim bilgileri kısa ve öz şekilde topladığım notlardır.', tags:['AWS','CLOUD'], url:'https://medium.com/@enesaks/aws-amazon-web-server-notlar%C4%B1m-c92b29da0c6c' },
  { date:'AUG 11, 2025 · PINNED', title:'Git Notlarım', desc:'Git üzerinde çalışırken edindiğim bilgiler. Versiyon kontrolünün temelleri.', tags:['GIT','DEVOPS'], url:'https://medium.com/@enesaks/git-notlar%C4%B1m-b3ae2961ce0a' },
  { date:'JUL 5, 2025', title:'Linux Shell Scripting: Temeller ve Kod Örnekleri', desc:'Linux Shell Scripting üzerinde çalışırken edindiğim notlar ve pratik örnekler.', tags:['LINUX','BASH'], url:'https://medium.com/@enesaks/linux-shell-scripting-nedir-0bb9d584fb10' },
  { date:'DEC 13, 2024 · PINNED', title:'Linux Notlarım', desc:'Linux öğrenirken edindiğim bilgiler. Komutlar, dosya sistemi, kullanıcı yönetimi.', tags:['LINUX','SYSADMIN'], url:'https://medium.com/@enesaks/linux-notlar%C4%B1m-ea4c547535d1' },
  { date:'AUG 31, 2024 · PINNED', title:'Docker Notlarım', desc:'Docker üzerinde çalışırken edindiğim bilgileri kısa ve öz şekilde topladığım notlar.', tags:['DOCKER','CONTAINER'], url:'https://medium.com/@enesaks/docker-notlar%C4%B1m-b1011f78f813' },
  { date:'NOV 4, 2024', title:".NET Core API'de Identity Kullanarak Kullanıcı Kayıt ve Giriş İşlemleri", desc:'Basit bir .NET Core API projesinde Identity ile auth sistemi kurulumu.', tags:['.NET','C#','API'], url:'https://medium.com/@enesaks/net-core-apide-identity-kullanarak-kullan%C4%B1c%C4%B1-kay%C4%B1t-ve-giri%C5%9F-i%CC%87%C5%9Flemleri-a27a750e39b0' },
  { date:'SEP 22, 2024', title:'Dependency Injection Nedir? Transient, Scoped ve Singleton Farkları', desc:'DI kavramını ve .NET\'teki üç yaşam döngüsü farkını açıkladım.', tags:['.NET','DESIGN PATTERN'], url:'https://medium.com/@enesaks/dependency-injection-nedir-transient-scoped-ve-singleton-farklar%C4%B1-2c0d7d711965' },
  { date:'SEP 9, 2024', title:'.NET Core ile Basit Bir REST API Projesi Nasıl Yapılır?', desc:'Sıfırdan RESTful API geliştirme adımları, endpoint tasarımı ve best practice\'ler.', tags:['.NET','REST','API'], url:'https://medium.com/@enesaks/net-core-ile-basit-bir-restful-api-projesi-nas%C4%B1l-yap%C4%B1l%C4%B1r-ec8aa4694d45' },
  { date:'AUG 29, 2024', title:"Windows'ta C# ile Geliştirilen Projeyi Linux'a Nasıl Taşıyabiliriz?", desc:'.NET Core cross-platform özelliği ile Windows projelerini Linux ortamına taşıma rehberi.', tags:['LINUX','.NET','MIGRATION'], url:'https://medium.com/@enesaks/windows-%C3%BCzerinde-c-ile-geli%C5%9Ftirilen-bir-projeyi-linuxa-nas%C4%B1l-ta%C5%9F%C4%B1yabiliriz-b2d7f177e84e' },
];

export const PROJECTS = [
  { title:'AWS-IAM-S3-Ec2-Proje', desc:'AWS IAM, S3 bucket ve EC2 instance yönetimini kapsayan mini proje. IAM rolleri, politikalar ve servisler arası yetkilendirme.', tags:['AWS','IAM','S3','EC2','SHELL'], url:'https://github.com/enesaks/AWS-IAM-S3-Ec2-Proje', status:'live' },
  { title:'Linux-Git-GitHub-Mini-Proje', desc:'Linux ortamında Git ve GitHub workflow\'larını kapsayan mini proje. Branch yönetimi, merge stratejileri ve CI temelleri.', tags:['LINUX','GIT','GITHUB','DEVOPS'], url:'https://github.com/enesaks/Linux-Git-GitHub-Mini-Proje', status:'live' },
  { title:'dotNetFurnitureProject', desc:'.NET Core ile geliştirilen full-stack mobilya e-ticaret projesi. Katmanlı mimari, REST API ve frontend entegrasyonu.', tags:['.NET CORE','C#','SQL SERVER','HTML'], url:'https://github.com/enesaks/dotNetFurnitureProject', status:'live' },
  { title:'AuthorizationAPI', desc:'C# ile geliştirilmiş JWT tabanlı kimlik doğrulama ve yetkilendirme API\'si. Identity ile kullanıcı yönetimi.', tags:['C#','JWT','API','AUTH'], url:'https://github.com/enesaks/AuthorizationAPI', status:'live' },
  { title:'Arduino-Guvenlik-Sensor-Projesi', desc:'Arduino + ESP8266 WiFi modülü ile ultrasonik sensör kullanarak kişi algılama. IFTTT ile mobil bildirim sistemi.', tags:['ARDUINO','ESP8266','IOT','IFTTT'], url:'https://github.com/enesaks/Arduino-Guvenlik-Sensor-Projesi', status:'live' },
  { title:'enesaksuWebSite', desc:'Bu terminal portfolio sitesi. React + TypeScript + Vite ile geliştirildi. Vercel üzerinde deploy edildi.', tags:['REACT','TYPESCRIPT','VITE','VERCEL'], url:'https://github.com/enesaks/enesaksuWebSite', status:'wip' },
];

export const FOCUS = ['Linux', 'Docker', 'CI/CD', 'AWS', 'Cloud'];

export const EDUCATION = { school: 'Bolu Abant İzzet Baysal Üniversitesi', degree: 'Bilgisayar Mühendisliği', years: '2022 – 2025', gpa: '3.17 / 4.00' };

export const LANGUAGES = 'İngilizce (B1)';

export const SKILLS: [string, string[]][] = [
  ['cloud',      ['AWS (EC2, S3, IAM, Auto Scaling, Load Balancer)']],
  ['devops & os', ['Linux', 'Docker', 'Git', 'GitHub', 'Bash/Shell Scripting', 'N8N']],
  ['monitoring', ['Prometheus', 'Grafana', 'ServiceNow']],
  ['yazılım',    ['Python', 'C#', '.NET Core', 'Java', 'SQL', 'Kotlin', 'C']],
];

export const CERTIFICATES = [
  'Google Cloud Digital Leader',
  'Bulut Bilişim Temelleri ve AWS Çözüm Mimarlığına Giriş',
  'NDG Linux Unhatched',
  "A'dan Z'ye Docker",
  'Java Web Development (Backend)',
  'Python & Qt Application Development',
  'Android Mobile Application Development',
  'Introduction to Cybersecurity (Cisco)',
];

// start / end: 'YYYY-MM'. end: null => devam ediyor (süre her ziyarette güncel hesaplanır).
export const EXPERIENCE: { start:string; end:string|null; company:string; role:string; badge:string|null; badgeColor:string; details:string[] }[] = [
  { start:'2025-12', end:'2026-08', company:'Kartaca', role:'System Monitoring', badge:null, badgeColor:'', details:[
    'Şişecam fabrikalarındaki üretim sistemlerinin ve makinaların Prometheus ve Grafana ile sürekli izlenmesinde aktif rol aldım.',
    'Operasyonel olayların ServiceNow üzerinden takibi ve ilk müdahale süreçlerinde görev aldım.',
    'Monitoring araçları ve olay yönetimi süreçleri konusunda operasyon ekibine destek sağladım.',
  ] },
  { start:'2025-08', end:'2025-09', company:'Halkbank', role:'IT Intern', badge:null, badgeColor:'', details:[
    'Kurumsal BT süreçlerini gözlemledim ve teknik ekiplerle birlikte çalışma deneyimi kazandım.',
  ] },
  { start:'2024-09', end:'2024-10', company:'Bilsoft Yazılım', role:'.NET Developer Intern', badge:null, badgeColor:'', details:[
    'REST API geliştirme ve üçüncü parti servislerle entegrasyon çalışmaları gerçekleştirdim.',
    'Entity Framework Code First yaklaşımı ve SQL tabanlı uygulamalar üzerinde geliştirme yaptım.',
  ] },
  { start:'2024-02', end:'2024-08', company:'Acunmedya Akademi', role:'Nish Trainings: C# & ASP.NET', badge:null, badgeColor:'', details:[] },
];

const MONTHS_TR = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];

/** '2025-12', null -> 'Ara 2025 — Devam ediyor · 1 yıl' (başlangıç ve bitiş ayı dahil sayılır) */
export const formatPeriod = (start: string, end: string | null, now: Date = new Date()): string => {
  const [sy, sm] = start.split('-').map(Number);
  const [ey, em] = end ? end.split('-').map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const total = Math.max(1, (ey - sy) * 12 + (em - sm) + 1);
  const years = Math.floor(total / 12);
  const months = total % 12;
  const duration = [years ? `${years} yıl` : '', months ? `${months} ay` : ''].filter(Boolean).join(' ');
  const endLabel = end ? `${MONTHS_TR[em - 1]} ${ey}` : 'Devam ediyor';
  return `${MONTHS_TR[sm - 1]} ${sy} — ${endLabel} · ${duration}`;
};