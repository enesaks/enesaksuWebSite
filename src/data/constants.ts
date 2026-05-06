export const TABS = ['about', 'writings', 'projects', 'contact'];

export const ALL_CMDS = [
  'help', 'about', 'writings', 'projects', 'contact', 'whoami', 'date', 'ls',
  'pwd', 'uname', 'clear', 'history', 'neofetch', 'cd', 'open', 'snake', 'blog'
];

export const BOOT = [
  { t: 0,    cls:'boot-title', text:'ENESAKSU OS v2.5.0 — Personal Terminal Portfolio' },
  { t: 180,  cls:'boot-info',  text:'Kernel 6.8.0-enesaksu #1 SMP x86_64 GNU/Linux' },
  { t: 320,  cls:'',           text:'' },
  { t: 420,  cls:'boot-ok',   text:'[  OK  ] Starting docker.service' },
  { t: 530,  cls:'boot-ok',   text:'[  OK  ] Starting ollama.service ... qwen3:14b loaded' },
  { t: 640,  cls:'boot-ok',   text:'[  OK  ] Starting aws.credentials' },
  { t: 750,  cls:'boot-warn', text:'[ WARN ] wsl2.memory: 16GB allocated (RTX 5060 Ti)' },
  { t: 860,  cls:'boot-ok',   text:'[  OK  ] Fetching medium.com/@enesaks ... 9 articles' },
  { t: 970,  cls:'boot-ok',   text:'[  OK  ] Fetching github.com/enesaks ... 34 repos' },
  { t: 1080, cls:'boot-ok',   text:'[  OK  ] Starting portfolio.service on :3000' },
  { t: 1180, cls:'',           text:'' },
  { t: 1260, cls:'boot-ok',   text:'System ready. Welcome, Enes.' },
];

export const NEOFETCH_OUT = [
  `<div style="display:flex;gap:2.5rem;align-items:flex-start">`,
  `<pre style="color:#00ff41;font-size:10px;line-height:1.2;margin:0;font-family:'JetBrains Mono',monospace">`,
  `  ███████╗███╗   ██╗███████╗███████╗`,
  `  ██╔════╝████╗  ██║██╔════╝██╔════╝`,
  `  █████╗  ██╔██╗ ██║█████╗  ███████╗`,
  `  ██╔══╝  ██║╚██╗██║██╔══╝  ╚════██║`,
  `  ███████╗██║ ╚████║███████╗███████║`,
  `  ╚══════╝╚═╝  ╚═══╝╚══════╝╚══════╝`,
  `</pre><div style="line-height:1.8;font-size:12px">`,
  `<span style="color:#00d4ff">enes</span><span style="color:#007a1f">@</span><span style="color:#00d4ff">enesaks.com</span><br>`,
  `<span style="color:#007a1f">───────────────────────────</span><br>`,
  `<span style="color:#00d4ff">OS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> ENESAKSU OS v2.5.0<br>`,
  `<span style="color:#00d4ff">Host&nbsp;&nbsp;&nbsp;</span> enesaks.com (Vercel)<br>`,
  `<span style="color:#00d4ff">Kernel&nbsp;</span> 6.8.0-enesaksu #1 SMP<br>`,
  `<span style="color:#00d4ff">Shell&nbsp;&nbsp;</span> bash 5.2.0<br>`,
  `<span style="color:#00d4ff">DE&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> terminal-portfolio<br>`,
  `<span style="color:#00d4ff">GPU&nbsp;&nbsp;&nbsp;&nbsp;</span> RTX 5060 Ti 16GB<br>`,
  `<span style="color:#00d4ff">Memory&nbsp;</span> 16GB / 32GB<br>`,
  `<span style="color:#00d4ff">Uptime&nbsp;</span> since boot`,
  `</div></div>`,
].join('');

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

export const EXPERIENCE = [
  { period:'Ara 2025\nDevam ediyor · 5 ay', company:'Kartaca',          role:'System Monitoring',         badge:'CURRENT', badgeColor:'#00ff41' },
  { period:'Ağu 2025\nEyl 2025 · 2 ay',     company:'Halkbank',         role:'Stajyer',                    badge:'INTERN',  badgeColor:'#ffb000' },
  { period:'Eyl 2024\nEki 2024 · 2 ay',     company:'Bilsoft Yazılım',  role:'.NET Developer Intern',      badge:'INTERN',  badgeColor:'#ffb000' },
  { period:'Şub 2024\nAğu 2024 · 7 ay',     company:'Acunmedya Akademi',role:'Nish Trainings: C# & ASP.NET',badge:null,    badgeColor:'' },
];
