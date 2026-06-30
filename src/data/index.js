/* data.js */
/* ============================================================
   BFF mock data — window.DATA
   Real Bangladesh players & teams where possible (2025–26).
   ============================================================ */
(function () {
  const pa = (s) => s.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  // hue per player for deterministic avatar tint
  const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };

  function P(o) {
    return Object.assign({
      initials: pa(o.name),
      hue: hue(o.name),
    }, o);
  }

  // ---------- MEN'S SENIOR ----------
  const menSenior = [
    P({ id:'m1', name:'Anisur Rahman Zico', pos:'GK', no:1, age:28, club:'Bashundhara Kings', caps:42, goals:0, rating:7.4, foot:'Right', ht:188, value:'৳1.4Cr', form:[6,7,8,7,7], status:'Available', district:'Satkhira', joined:2016 }),
    P({ id:'m2', name:'Tariq Kazi', pos:'DF', no:6, age:28, club:'Bashundhara Kings', caps:36, goals:1, rating:7.1, foot:'Right', ht:183, value:'৳1.1Cr', form:[7,7,6,8,7], status:'Available', district:'Helsinki (FIN)', joined:2021 }),
    P({ id:'m3', name:'Topu Barman', pos:'DF', no:4, age:31, club:'Bashundhara Kings', caps:51, goals:5, rating:7.0, foot:'Right', ht:181, value:'৳82L', form:[7,6,7,7,6], status:'Available', district:'Rajshahi', joined:2014 }),
    P({ id:'m4', name:'Hamza Choudhury', pos:'MF', no:8, age:28, club:'Sheffield United', caps:6, goals:1, rating:7.9, foot:'Right', ht:178, value:'৳34Cr', form:[8,8,7,9,8], status:'Available', district:'Sylhet / Loughborough', joined:2025, captain:false, marquee:true }),
    P({ id:'m5', name:'Jamal Bhuyan', pos:'MF', no:10, age:35, club:'Arctic Lions (DEN)', caps:84, goals:3, rating:7.2, foot:'Right', ht:177, value:'৳60L', form:[7,7,8,6,7], status:'Available', district:'Dhaka / Copenhagen', joined:2013, captain:true }),
    P({ id:'m6', name:'Sohel Rana', pos:'MF', no:13, age:30, club:'Abahani Limited Dhaka', caps:39, goals:2, rating:6.9, foot:'Right', ht:174, value:'৳52L', form:[6,7,7,6,7], status:'Available', district:'Noakhali', joined:2017 }),
    P({ id:'m7', name:'Rakib Hossain', pos:'FW', no:11, age:24, club:'Bashundhara Kings', caps:31, goals:7, rating:7.5, foot:'Right', ht:176, value:'৳1.6Cr', form:[8,7,8,7,8], status:'Available', district:'Chandpur', joined:2020 }),
    P({ id:'m8', name:'Sheikh Morsalin', pos:'FW', no:17, age:20, club:'Bashundhara Kings', caps:18, goals:4, rating:7.6, foot:'Right', ht:179, value:'৳2.1Cr', form:[8,9,7,8,8], status:'Available', district:'Jhenaidah', joined:2022, prospect:true }),
    P({ id:'m9', name:'Faisal Ahmed Fahim', pos:'FW', no:19, age:21, club:'Mohammedan SC', caps:11, goals:3, rating:7.3, foot:'Left', ht:175, value:'৳95L', form:[7,8,7,7,8], status:'Available', district:'Dhaka', joined:2023, prospect:true }),
    P({ id:'m10', name:'Fahamidul Islam', pos:'FW', no:23, age:19, club:'AC Olbia (ITA)', caps:3, goals:0, rating:7.0, foot:'Left', ht:177, value:'৳70L', form:[7,7,6,7,7], status:'Available', district:'Brahmanbaria / Italy', joined:2025, prospect:true }),
    P({ id:'m11', name:'Mohammad Ibrahim', pos:'MF', no:7, age:26, club:'Bashundhara Kings', caps:33, goals:2, rating:7.0, foot:'Left', ht:170, value:'৳74L', form:[7,6,7,8,6], status:'Knock', district:'Cox\u2019s Bazar', joined:2018 }),
    P({ id:'m12', name:'Isa Faysal', pos:'DF', no:3, age:23, club:'Abahani Limited Dhaka', caps:14, goals:0, rating:6.8, foot:'Left', ht:180, value:'৳48L', form:[6,7,6,7,7], status:'Available', district:'Kushtia', joined:2022 }),
    P({ id:'m13', name:'Saad Uddin', pos:'DF', no:2, age:28, club:'Mohammedan SC', caps:27, goals:1, rating:6.9, foot:'Right', ht:178, value:'৳44L', form:[7,6,7,6,7], status:'Available', district:'Feni', joined:2017 }),
    P({ id:'m14', name:'Mehedi Hasan Mithu', pos:'GK', no:22, age:24, club:'Fortis FC', caps:5, goals:0, rating:6.7, foot:'Right', ht:185, value:'৳30L', form:[6,7,6,6,7], status:'Available', district:'Tangail', joined:2023 }),
    P({ id:'m15', name:'Shahriar Emon', pos:'FW', no:14, age:22, club:'Fortis FC', caps:7, goals:2, rating:7.1, foot:'Right', ht:173, value:'৳58L', form:[7,8,6,7,7], status:'Available', district:'Barishal', joined:2023, prospect:true }),
  ];

  // ---------- WOMEN'S SENIOR ----------
  const womenSenior = [
    P({ id:'w1', name:'Rupna Chanda', pos:'GK', no:1, age:24, club:'Bashundhara Kings W', caps:39, goals:0, rating:7.8, foot:'Right', ht:168, value:'—', form:[8,8,7,9,8], status:'Available', district:'Rangamati', joined:2019, badge:'SAFF Best GK' }),
    P({ id:'w2', name:'Masura Parvin', pos:'DF', no:4, age:27, club:'Nasrin SC', caps:48, goals:2, rating:7.4, foot:'Right', ht:165, value:'—', form:[7,8,7,7,8], status:'Available', district:'Satkhira', joined:2016, captainAlt:true }),
    P({ id:'w3', name:'Shiuli Azim', pos:'DF', no:5, age:26, club:'Bashundhara Kings W', caps:34, goals:1, rating:7.2, foot:'Right', ht:163, value:'—', form:[7,7,8,7,7], status:'Available', district:'Mymensingh', joined:2018 }),
    P({ id:'w4', name:'Maria Manda', pos:'MF', no:8, age:24, club:'Bashundhara Kings W', caps:41, goals:5, rating:7.6, foot:'Right', ht:160, value:'—', form:[8,7,8,8,7], status:'Available', district:'Mymensingh (Kalsindur)', joined:2016 }),
    P({ id:'w5', name:'Monika Chakma', pos:'MF', no:7, age:23, club:'Bashundhara Kings W', caps:38, goals:9, rating:7.7, foot:'Left', ht:158, value:'—', form:[8,8,9,7,8], status:'Available', district:'Rangamati', joined:2017 }),
    P({ id:'w6', name:'Sanjida Akhter', pos:'MF', no:11, age:25, club:'East Bengal (IND)', caps:43, goals:8, rating:7.5, foot:'Right', ht:161, value:'—', form:[7,8,8,7,8], status:'Available', district:'Mymensingh', joined:2016 }),
    P({ id:'w7', name:'Sabina Khatun', pos:'FW', no:10, age:32, club:'Bashundhara Kings W', caps:75, goals:38, rating:8.1, foot:'Right', ht:164, value:'—', form:[9,8,9,8,9], status:'Available', district:'Satkhira', joined:2009, captain:true, marquee:true, badge:'Record scorer' }),
    P({ id:'w8', name:'Krishna Rani Sarkar', pos:'FW', no:9, age:24, club:'Bashundhara Kings W', caps:46, goals:24, rating:7.9, foot:'Right', ht:162, value:'—', form:[8,9,8,8,9], status:'Available', district:'Tangail', joined:2016 }),
    P({ id:'w9', name:'Ritu Porna Chakma', pos:'FW', no:17, age:21, club:'Bashundhara Kings W', caps:29, goals:14, rating:8.0, foot:'Left', ht:159, value:'—', form:[9,8,9,9,8], status:'Available', district:'Rangamati', joined:2021, prospect:true, badge:'SAFF 2024 MVP' }),
    P({ id:'w10', name:'Shamsunnahar Jr.', pos:'FW', no:15, age:22, club:'Nasrin SC', caps:31, goals:11, rating:7.6, foot:'Right', ht:160, value:'—', form:[8,7,8,8,7], status:'Available', district:'Mymensingh', joined:2018 }),
    P({ id:'w11', name:'Maria Akter', pos:'DF', no:3, age:20, club:'Bashundhara Kings W', caps:16, goals:0, rating:7.1, foot:'Right', ht:162, value:'—', form:[7,7,7,8,7], status:'Available', district:'Mymensingh', joined:2022, prospect:true }),
    P({ id:'w12', name:'Swapna Rani', pos:'MF', no:14, age:19, club:'ARB College', caps:12, goals:3, rating:7.3, foot:'Right', ht:157, value:'—', form:[7,8,7,8,7], status:'Available', district:'Rangpur', joined:2023, prospect:true }),
  ];

  // ---------- Real player photos (freely-licensed, Wikimedia Commons) ----------
  // Only well-known senior internationals have free-licensed photos; everyone
  // else keeps the generated initials avatar. The Avatar component falls back
  // to initials automatically if an image ever fails to load.
  const PHOTOS = {
    m1: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Anisurrahmanzico.2021.jpg/330px-Anisurrahmanzico.2021.jpg',
    m2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Tariq_Kazi_playing_for_Bangladesh_in_2023.jpg/330px-Tariq_Kazi_playing_for_Bangladesh_in_2023.jpg',
    m3: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Topu_Barman_in_2021.jpg/330px-Topu_Barman_in_2021.jpg',
    m4: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Hamza_Choudhury_23082025_%28portrait%29.jpg/330px-Hamza_Choudhury_23082025_%28portrait%29.jpg',
    m5: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Jamal_Bhuyan_%28cropped%29.png/330px-Jamal_Bhuyan_%28cropped%29.png',
    m6: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Sohel_Rana_in_2021.jpg/330px-Sohel_Rana_in_2021.jpg',
    m7: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Rakib_Hossain_%28cropped%29.png',
    w2: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Masura_Parvin_%28cropped%29.jpg',
    w4: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Maria_Manda_%28cropped%29.jpg',
    w5: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Monica_Chakma_%28cropped%29.jpg',
    w6: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Sanjida_Akther.jpg/330px-Sanjida_Akther.jpg',
    w7: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Sabina_Khatun%2C_Bangladesh_women%27s_football_team_arrival_SAFF_Championship_winners_Dhaka_2022-09-21_%28PID-0020986%29_%28cropped%29.jpg/330px-Sabina_Khatun%2C_Bangladesh_women%27s_football_team_arrival_SAFF_Championship_winners_Dhaka_2022-09-21_%28PID-0020986%29_%28cropped%29.jpg',
    w9: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Ritu_Porna_Chakma%2C_Dhaka_%28cropped%29.jpg/330px-Ritu_Porna_Chakma%2C_Dhaka_%28cropped%29.jpg',
  };
  [...menSenior, ...womenSenior].forEach((p) => { if (PHOTOS[p.id]) p.photo = PHOTOS[p.id]; });

  // ---------- Build age-level squads by trimming + ageing down ----------
  function makeYouth(src, label, maxAge, prefix) {
    const pick = src.filter(p => p.prospect).concat(src.filter(p => !p.prospect));
    return pick.slice(0, 9).map((p, i) => P({
      id: prefix + i,
      name: p.name.includes(' ') ? p.name : p.name,
      pos: p.pos, no: p.no, age: Math.min(p.age, maxAge - 1 - (i % 3)),
      club: p.club, caps: Math.max(2, Math.round(p.caps / 4)), goals: Math.round(p.goals / 3),
      rating: +(p.rating - 0.3).toFixed(1), foot: p.foot, ht: p.ht, value: p.value,
      form: p.form, status: 'Available', district: p.district, joined: 2024, prospect: true,
    }));
  }

  const teams = {
    men_senior:  { id:'men_senior', label:"Men's Senior", short:'SEN', gender:'men', level:'Senior', squad: menSenior, coach:'Javier Cabrera', coachNat:'Spain', fifa:184, formation:'4-2-3-1', nextOpp:'Bhutan', comp:'AFC Asian Cup Qual.' },
    men_u23:     { id:'men_u23', label:"Men's U-23", short:'U23', gender:'men', level:'U-23', squad: makeYouth(menSenior,'U23',23,'mu23'), coach:'Maruful Haque', coachNat:'Bangladesh', fifa:null, formation:'4-3-3', nextOpp:'Nepal', comp:'AFC U-23 Qual.' },
    men_u20:     { id:'men_u20', label:"Men's U-20", short:'U20', gender:'men', level:'U-20', squad: makeYouth(menSenior,'U20',20,'mu20'), coach:'Golam Zilani', coachNat:'Bangladesh', fifa:null, formation:'4-4-2', nextOpp:'India', comp:'SAFF U-20' },
    men_u17:     { id:'men_u17', label:"Men's U-17", short:'U17', gender:'men', level:'U-17', squad: makeYouth(menSenior,'U17',17,'mu17'), coach:'Mohammad Imtiaz', coachNat:'Bangladesh', fifa:null, formation:'4-3-3', nextOpp:'Maldives', comp:'SAFF U-17' },
    women_senior:{ id:'women_senior', label:"Women's Senior", short:'SEN', gender:'women', level:'Senior', squad: womenSenior, coach:'Peter Butler', coachNat:'England', fifa:128, formation:'4-3-3', nextOpp:'Nepal', comp:'SAFF W. Championship', trophy:'SAFF Champions 2024' },
    women_u20:   { id:'women_u20', label:"Women's U-20", short:'U20', gender:'women', level:'U-20', squad: makeYouth(womenSenior,'U20',20,'wu20'), coach:'Saiful Bari Titu', coachNat:'Bangladesh', fifa:null, formation:'4-3-3', nextOpp:'India', comp:'SAFF U-20 W.' },
    women_u17:   { id:'women_u17', label:"Women's U-17", short:'U17', gender:'women', level:'U-17', squad: makeYouth(womenSenior,'U17',17,'wu17'), coach:'Mahbubur Rahman', coachNat:'Bangladesh', fifa:null, formation:'4-4-2', nextOpp:'Bhutan', comp:'SAFF U-17 W.' },
  };

  // ---------- Fixtures ----------
  const fixtures = [
    { id:'f1', team:'women_senior', comp:'SAFF W. Championship', stage:'Final', date:'2026-06-09', time:'19:30', venue:'Dasharath Stadium, Kathmandu', home:'Bangladesh', away:'Nepal', hf:'🇧🇩', af:'🇳🇵', status:'Upcoming', tickets:true },
    { id:'f2', team:'men_senior', comp:'AFC Asian Cup Qual.', stage:'Group C · MD5', date:'2026-06-14', time:'17:00', venue:'Bashundhara Kings Arena, Dhaka', home:'Bangladesh', away:'Bhutan', hf:'🇧🇩', af:'🇧🇹', status:'Upcoming', tickets:true },
    { id:'f3', team:'men_u23', comp:'AFC U-23 Qual.', stage:'Group B', date:'2026-06-18', time:'16:00', venue:'Jinnah Stadium, Islamabad', home:'Nepal', away:'Bangladesh', hf:'🇳🇵', af:'🇧🇩', status:'Upcoming', tickets:false },
    { id:'f4', team:'men_senior', comp:'AFC Asian Cup Qual.', stage:'Group C · MD6', date:'2026-06-19', time:'20:00', venue:'Thuwunna Stadium, Yangon', home:'Myanmar', away:'Bangladesh', hf:'🇲🇲', af:'🇧🇩', status:'Upcoming', tickets:false },
    { id:'f5', team:'women_u20', comp:'SAFF U-20 W.', stage:'Semi-final', date:'2026-06-22', time:'15:30', venue:'BFF Artificial Turf, Dhaka', home:'Bangladesh', away:'India', hf:'🇧🇩', af:'🇮🇳', status:'Upcoming', tickets:true },
    // results
    { id:'f6', team:'men_senior', comp:'AFC Asian Cup Qual.', stage:'Group C · MD4', date:'2026-03-25', time:'', venue:'Bashundhara Kings Arena, Dhaka', home:'Bangladesh', away:'India', hf:'🇧🇩', af:'🇮🇳', status:'Result', hs:1, as:1, scorers:'Morsalin 67\'' },
    { id:'f7', team:'women_senior', comp:'SAFF W. Championship', stage:'Semi-final', date:'2026-06-05', time:'', venue:'Dasharath Stadium, Kathmandu', home:'Bangladesh', away:'Bhutan', hf:'🇧🇩', af:'🇧🇹', status:'Result', hs:3, as:0, scorers:'Ritu Porna 12\', Sabina 44\', Krishna 78\'' },
    { id:'f8', team:'men_senior', comp:'Friendly', stage:'Intl. Friendly', date:'2026-03-19', time:'', venue:'Bashundhara Kings Arena, Dhaka', home:'Bangladesh', away:'Hong Kong', hf:'🇧🇩', af:'🇭🇰', status:'Result', hs:2, as:1, scorers:'Hamza 23\', Rakib 71\'' },
    { id:'f9', team:'women_senior', comp:'SAFF W. Championship', stage:'Group A', date:'2026-06-01', time:'', venue:'Dasharath Stadium, Kathmandu', home:'Bangladesh', away:'Pakistan', hf:'🇧🇩', af:'🇵🇰', status:'Result', hs:5, as:0, scorers:'Sabina ×2, Krishna, Monika, Ritu' },
    { id:'f10', team:'men_u20', comp:'SAFF U-20', stage:'Final', date:'2026-02-14', time:'', venue:'BFF Artificial Turf, Dhaka', home:'Bangladesh', away:'Nepal', hf:'🇧🇩', af:'🇳🇵', status:'Result', hs:2, as:1, scorers:'Emon 34\', Fahim 88\'' },
  ];

  // ---------- Competitions / standings ----------
  const standings = [
    { p:'Bangladesh', f:'🇧🇩', pl:4, w:2, d:1, l:1, gf:6, ga:5, pts:7, us:true },
    { p:'India', f:'🇮🇳', pl:4, w:2, d:2, l:0, gf:7, ga:3, pts:8 },
    { p:'Myanmar', f:'🇲🇲', pl:4, w:2, d:0, l:2, gf:5, ga:5, pts:6 },
    { p:'Bhutan', f:'🇧🇹', pl:4, w:0, d:1, l:3, gf:2, ga:7, pts:1 },
  ];

  // ---------- Records ----------
  const records = {
    // All-time international goal scorers (men) — Bangladesh national team.
    topScorersMen: [
      { name:'Ashraf Uddin Ahmed Chunnu', span:'1979–1988 · 50 caps', g:17 },
      { name:'Zahid Ameli', span:'1980s', g:15 },
      { name:'Sheikh Mohammad Aslam', span:'1982–1994', g:14 },
      { name:'Alfaz Ahmed', span:'1993–2007', g:11 },
      { name:'Kazi Salahuddin · Wasim · Shakawat Rony', span:'Joint 5th · 8 goals each', g:8 },
    ],
    topScorersWomen: [
      { name:'Sabina Khatun', span:'2009– · 75 caps', g:38 },
      { name:'Krishna Rani Sarkar', span:'2016–', g:24 },
      { name:'Sirat Jahan Swapna', span:'2018–2023', g:18 },
      { name:'Ritu Porna Chakma', span:'2021–', g:14 },
      { name:'Tahura Khatun', span:'2018–', g:12 },
    ],
    // Featured all-time record holders for the headline highlight card.
    recordHolderMen: { name:'Ashraf Uddin Ahmed Chunnu', goals:17, apps:50, span:'1979–1988',
      note:'All-time highest international goal scorer for the Bangladesh national football team.',
      photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Retirement_of_Chunnu.jpg/330px-Retirement_of_Chunnu.jpg' },
    recordHolderWomen: { name:'Sabina Khatun', goals:38, apps:75, span:'2009–present',
      note:'Record scorer and talisman of the Bangladesh women’s national team.',
      photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Sabina_Khatun%2C_Bangladesh_women%27s_football_team_arrival_SAFF_Championship_winners_Dhaka_2022-09-21_%28PID-0020986%29_%28cropped%29.jpg/330px-Sabina_Khatun%2C_Bangladesh_women%27s_football_team_arrival_SAFF_Championship_winners_Dhaka_2022-09-21_%28PID-0020986%29_%28cropped%29.jpg' },
    mostCapsMen: [
      { name:'Jamal Bhuyan', g:84 }, { name:'Topu Barman', g:51 }, { name:'Anisur Rahman Zico', g:42 }, { name:'Sohel Rana', g:39 },
    ],
    mostCapsWomen: [
      { name:'Sabina Khatun', g:75 }, { name:'Masura Parvin', g:48 }, { name:'Krishna Rani Sarkar', g:46 }, { name:'Sanjida Akhter', g:43 },
    ],
    honours: [
      { t:'SAFF Women\u2019s Championship', y:'2024', who:'Women\u2019s Senior', win:true },
      { t:'SAFF Women\u2019s Championship', y:'2022', who:'Women\u2019s Senior', win:true },
      { t:'SAFF U-20 Championship', y:'2026', who:'Men\u2019s U-20', win:true },
      { t:'SAFF Championship', y:'2003', who:'Men\u2019s Senior', win:true },
      { t:'SA Games Gold', y:'1999', who:'Men\u2019s Senior', win:true },
    ],
  };

  // ---------- Development pathway ----------
  const pathway = [
    { stage:'Grassroots', age:'U-8 – U-12', players:14200, centres:64, color:'#2f72e3', desc:'School & district feeder programmes across all 64 districts.' },
    { stage:'Talent ID', age:'U-13 – U-15', players:3850, centres:18, color:'#159255', desc:'Regional academies & BFF Elite Academy intake combine.' },
    { stage:'Youth National', age:'U-16 – U-17', players:640, centres:8, color:'#e3a72f', desc:'AFC/SAFF age-group squads & residential camps.' },
    { stage:'Junior National', age:'U-18 – U-20', players:280, centres:5, color:'#ee7a2f', desc:'U-20 & U-23 pipeline into Bangladesh Premier League clubs.' },
    { stage:'Senior Elite', age:'U-23 – Senior', players:48, centres:2, color:'#ee2939', desc:'National team pool, diaspora recruitment & pro contracts.' },
  ];

  const clubs = ['Bashundhara Kings','Abahani Limited Dhaka','Mohammedan SC','Fortis FC','Sheikh Russel KC','Bangladesh Police FC','Rahmatganj MFS','Brothers Union','Fakirerpool YMC','Nasrin SC','ARB College','Bashundhara Kings W'];

  // ---------- Activity feed ----------
  const activity = [
    { who:'Hamza Choudhury', act:'cleared international registration', tag:'Registration', t:'14 min ago', icon:'check' },
    { who:'Women\u2019s Senior', act:'squad of 23 confirmed for SAFF Final', tag:'Squad', t:'1 hr ago', icon:'users' },
    { who:'Sheikh Morsalin', act:'medical: minor knock, fit to train', tag:'Medical', t:'3 hr ago', icon:'health' },
    { who:'BFF Elite Academy', act:'42 players added to U-15 talent pool', tag:'Development', t:'Yesterday', icon:'star' },
    { who:'Fixture', act:'vs Bhutan (Jun 14) — tickets live', tag:'Fixture', t:'Yesterday', icon:'cal' },
  ];

  const allPlayers = [...menSenior, ...womenSenior];

  window.DATA = { teams, fixtures, standings, records, pathway, clubs, activity, allPlayers, menSenior, womenSenior };
})();

/* data-ext.js */
/* ============================================================
   Extended FMS data per digitalization guideline → window.DATA2
   Clubs, coaches, referees, transfers, discipline, analytics,
   roadmap, KPIs, app ecosystem.
   ============================================================ */
(function () {
  const clubs = [
    { id:'c1', name:'Bashundhara Kings', city:'Dhaka', div:'BPL', founded:2016, license:'A', status:'Licensed', players:31, coach:'Valeriu Tița', titles:5, hue:150 },
    { id:'c2', name:'Abahani Limited Dhaka', city:'Dhaka', div:'BPL', founded:1972, license:'A', status:'Licensed', players:28, coach:'Mario Lemos', titles:6, hue:205 },
    { id:'c3', name:'Mohammedan SC', city:'Dhaka', div:'BPL', founded:1936, license:'A', status:'Licensed', players:27, coach:'Alfaz Ahmed', titles:5, hue:0 },
    { id:'c4', name:'Fortis FC', city:'Dhaka', div:'BPL', founded:2022, license:'B', status:'Review', players:25, coach:'Masud Parvez', titles:0, hue:32 },
    { id:'c5', name:'Bangladesh Police FC', city:'Dhaka', div:'BPL', founded:2011, license:'B', status:'Licensed', players:26, coach:'Saiful Bari Titu', titles:0, hue:225 },
    { id:'c6', name:'Sheikh Russel KC', city:'Dhaka', div:'BPL', founded:1996, license:'B', status:'Licensed', players:24, coach:'Sayed Nayeemuddin', titles:1, hue:280 },
    { id:'c7', name:'Rahmatganj MFS', city:'Old Dhaka', div:'BPL', founded:1933, license:'B', status:'Pending', players:23, coach:'Kamal Babu', titles:0, hue:18 },
    { id:'c8', name:'Brothers Union', city:'Dhaka', div:'Championship', founded:1949, license:'C', status:'Review', players:22, coach:'Amalesh Sen', titles:0, hue:120 },
    { id:'c9', name:'Bashundhara Kings W', city:'Dhaka', div:'Women\u2019s League', founded:2021, license:'A', status:'Licensed', players:25, coach:'Mahbubur Rahman', titles:4, hue:330 },
    { id:'c10', name:'Nasrin SC', city:'Dhaka', div:'Women\u2019s League', founded:2012, license:'B', status:'Licensed', players:23, coach:'Golam Robbani', titles:2, hue:300 },
  ];

  const coaches = [
    { id:'co1', name:'Javier Cabrera', role:'Head Coach · Men\u2019s Senior', license:'AFC Pro', nat:'Spain', status:'Valid', expiry:'2027', courses:12 },
    { id:'co2', name:'Peter Butler', role:'Head Coach · Women\u2019s Senior', license:'UEFA Pro', nat:'England', status:'Valid', expiry:'2028', courses:15 },
    { id:'co3', name:'Maruful Haque', role:'Head Coach · Men\u2019s U-23', license:'AFC Pro', nat:'Bangladesh', status:'Valid', expiry:'2026', courses:9 },
    { id:'co4', name:'Saiful Bari Titu', role:'Technical Director (Youth)', license:'AFC A', nat:'Bangladesh', status:'Renewal due', expiry:'2026', courses:8 },
    { id:'co5', name:'Golam Zilani', role:'Head Coach · Men\u2019s U-20', license:'AFC A', nat:'Bangladesh', status:'Valid', expiry:'2027', courses:6 },
    { id:'co6', name:'Mahbubur Rahman', role:'Head Coach · Women\u2019s U-17', license:'AFC B', nat:'Bangladesh', status:'Valid', expiry:'2027', courses:5 },
    { id:'co7', name:'Mohammad Imtiaz', role:'Head Coach · Men\u2019s U-17', license:'AFC B', nat:'Bangladesh', status:'Renewal due', expiry:'2026', courses:4 },
  ];

  const referees = [
    { id:'r1', name:'Jalaluddin', cat:'FIFA', role:'Referee', matches:142, rating:8.4, fitness:'Passed', status:'Active', district:'Dhaka' },
    { id:'r2', name:'Md. Bitu Mia', cat:'FIFA', role:'Assistant', matches:128, rating:8.1, fitness:'Passed', status:'Active', district:'Chattogram' },
    { id:'r3', name:'Sayma Akter', cat:'FIFA', role:'Referee', matches:96, rating:8.3, fitness:'Passed', status:'Active', district:'Dhaka' },
    { id:'r4', name:'Tahmina Akter', cat:'National', role:'Assistant', matches:74, rating:7.6, fitness:'Pending', status:'Active', district:'Khulna' },
    { id:'r5', name:'Sujit Banerjee', cat:'FIFA', role:'Referee', matches:118, rating:7.9, fitness:'Passed', status:'Active', district:'Sylhet' },
    { id:'r6', name:'Abu Sayeed', cat:'National', role:'Referee', matches:63, rating:7.4, fitness:'Passed', status:'Suspended', district:'Rajshahi' },
    { id:'r7', name:'Nayeem Hasan', cat:'National', role:'VAR', matches:41, rating:7.7, fitness:'Passed', status:'Active', district:'Dhaka' },
  ];

  const transfers = [
    { id:'t1', player:'Faisal Ahmed Fahim', from:'Mohammedan SC', to:'Bashundhara Kings', fee:'৳1.2Cr', type:'Permanent', status:'Approved', date:'2026-06-02' },
    { id:'t2', player:'Shahriar Emon', from:'Fortis FC', to:'Abahani Limited Dhaka', fee:'৳85L', type:'Permanent', status:'Pending', date:'2026-06-03' },
    { id:'t3', player:'Isa Faysal', from:'Abahani Limited Dhaka', to:'Sheikh Russel KC', fee:'Loan', type:'Loan', status:'Review', date:'2026-06-01' },
    { id:'t4', player:'Mehedi Hasan Mithu', from:'Fortis FC', to:'Bangladesh Police FC', fee:'৳30L', type:'Permanent', status:'Approved', date:'2026-05-28' },
    { id:'t5', player:'Sohel Rana', from:'Abahani Limited Dhaka', to:'Mohammedan SC', fee:'Free', type:'Free', status:'Pending', date:'2026-05-30' },
  ];

  const discipline = [
    { id:'d1', player:'Topu Barman', club:'Bashundhara Kings', offense:'2nd yellow', sanction:'1 match ban', fine:'৳20K', status:'Active', date:'2026-03-25' },
    { id:'d2', player:'Saad Uddin', club:'Mohammedan SC', offense:'Serious foul play', sanction:'3 match ban', fine:'৳60K', status:'Active', date:'2026-03-20' },
    { id:'d3', player:'Mohammad Ibrahim', club:'Bashundhara Kings', offense:'Dissent (yellow)', sanction:'Warning', fine:'৳10K', status:'Served', date:'2026-02-14' },
    { id:'d4', player:'Sujit Banerjee (ref)', club:'—', offense:'Match report delay', sanction:'Review', fine:'—', status:'Pending', date:'2026-06-01' },
  ];

  // KPI targets (guideline §16)
  const kpis = [
    { k:'Registered players', now:62, target:'+200%', val:'18,420', delta:'+312/mo', pct:62 },
    { k:'Youth participation', now:71, target:'+150%', val:'21,900', delta:'+18% YoY', pct:71 },
    { k:'Match data accuracy', now:93, target:'95%+', val:'93%', delta:'+5pt', pct:93 },
    { k:'Fan engagement', now:48, target:'+300%', val:'1.2M', delta:'+44%', pct:48 },
    { k:'Digital revenue', now:55, target:'Growth', val:'৳9.4Cr', delta:'+27%', pct:55 },
    { k:'Match ops time', now:78, target:'-70%', val:'-58%', delta:'on track', pct:78 },
  ];

  // 5-month roadmap (guideline §15) — detailed program
  const roadmap = [
    { y:'Month 1', cy:'Apr 2026', theme:'Foundation', state:'done', progress:100, owner:'IT Operations',
      milestone:'Central FMS & player registration go-live',
      items:[
        { t:'Player registration system', s:'done', q:'W1' },
        { t:'Competition management', s:'done', q:'W2' },
        { t:'Website modernization', s:'done', q:'W3' },
        { t:'Cloud infrastructure setup', s:'done', q:'W4' },
      ] },
    { y:'Month 2', cy:'May 2026', theme:'Mobile & Access', state:'done', progress:100, owner:'App Development',
      milestone:'Federation Super App + e-ticketing launch',
      items:[
        { t:'Mobile apps', s:'done', q:'W1' },
        { t:'Referee digitalization', s:'done', q:'W2' },
        { t:'E-ticketing', s:'done', q:'W3' },
        { t:'Digital player ID rollout', s:'done', q:'W4' },
      ] },
    { y:'Month 3', cy:'Jun 2026', theme:'Football Intelligence', state:'active', progress:45, owner:'Football Analytics',
      milestone:'Analytics department & AI scouting operational',
      items:[
        { t:'Analytics department', s:'done', q:'W1' },
        { t:'Video analysis pipeline', s:'active', q:'W2' },
        { t:'AI scouting & talent ID', s:'active', q:'W3' },
        { t:'GPS / load monitoring', s:'planned', q:'W4' },
      ] },
    { y:'Month 4', cy:'Jul 2026', theme:'Smart Infrastructure', state:'next', progress:0, owner:'Innovation Lab',
      milestone:'National football data centre online',
      items:[
        { t:'Smart stadiums', s:'planned', q:'W1–W2' },
        { t:'Integrated ecosystem', s:'planned', q:'W2' },
        { t:'National football data center', s:'planned', q:'W3' },
        { t:'VAR & goal-line tech', s:'planned', q:'W4' },
      ] },
    { y:'Month 5', cy:'Aug 2026', theme:'Global Integration', state:'planned', progress:0, owner:'Federation Board',
      milestone:'Fully data-driven, export-ready federation',
      items:[
        { t:'Fully data-driven federation', s:'planned', q:'W1' },
        { t:'International integration (FIFA/AFC)', s:'planned', q:'W2' },
        { t:'Exportable football tech services', s:'planned', q:'W3–W4' },
        { t:'Blockchain ticketing & transfers', s:'planned', q:'W4' },
      ] },
  ];

  // App ecosystem (guideline §7)
  const apps = [
    { name:'Federation Super App', icon:'globe', feats:['Live scores','Tickets','Player database','Fantasy'], status:'Beta', color:'#00684a' },
    { name:'Referee App', icon:'whistle', feats:['Assignments','Digital reports','Fitness'], status:'Live', color:'#2f72e3' },
    { name:'Coach App', icon:'flow', feats:['Training plans','Tactical board','Video review'], status:'Dev', color:'#e3a72f' },
    { name:'Scout App', icon:'search', feats:['Talent ID','Match observations','Ratings'], status:'Dev', color:'#ee2939' },
  ];

  // Analytics dept metrics (guideline §6)
  const analytics = {
    teamForm: [62, 58, 71, 65, 74, 69, 78, 72, 81, 76],
    metrics: [
      { k:'Possession', v:54, comp:48 },
      { k:'Pass accuracy', v:81, comp:76 },
      { k:'Pressing intensity', v:67, comp:61 },
      { k:'xG per match', v:1.42, comp:1.18, raw:true },
      { k:'Defensive duels won', v:58, comp:55 },
      { k:'High turnovers', v:71, comp:64 },
    ],
    injuryRisk: [
      { name:'Mohammad Ibrahim', risk:'High', load:92, note:'Calf load elevated' },
      { name:'Topu Barman', risk:'Medium', load:74, note:'Minutes accumulation' },
      { name:'Sabina Khatun', risk:'Medium', load:68, note:'Age + match density' },
      { name:'Rakib Hossain', risk:'Low', load:41, note:'Optimal' },
    ],
    recruitment: [
      { name:'Fahamidul Islam', tag:'Diaspora · ITA', fit:88, pos:'FW' },
      { name:'Cuba Michael', tag:'Diaspora · ENG', fit:84, pos:'MF' },
      { name:'Swapna Rani', tag:'U-20 · Rangpur', fit:82, pos:'MF' },
      { name:'Maria Akter', tag:'U-20 · Mymensingh', fit:79, pos:'DF' },
    ],
  };

  window.DATA2 = { clubs, coaches, referees, transfers, discipline, kpis, roadmap, apps, analytics };
})();

/* data-infra.js */
/* ============================================================
   Infrastructure / competition / ticketing / sports-science data
   → window.DATA3  (covers remaining roadmap initiatives)
   ============================================================ */
(function () {
  // ---- Competition management ----
  const competitions = [
    { id:'bpl', name:'Bangladesh Premier League', short:'BPL', type:'League', teams:10, played:54, total:90, round:'Match-week 18', leader:'Bashundhara Kings', status:'Live', season:'2025–26', color:'#00684a' },
    { id:'fedcup', name:'Federation Cup', short:'Fed Cup', type:'Knockout', teams:10, played:11, total:15, round:'Semi-finals', leader:'Abahani Limited', status:'Live', season:'2025–26', color:'#ee2939' },
    { id:'indcup', name:'Independence Cup', short:'Ind. Cup', type:'Knockout', teams:12, played:16, total:16, round:'Completed', leader:'Mohammedan SC', status:'Done', season:'2025–26', color:'#e3a72f' },
    { id:'wfl', name:'Women\u2019s Football League', short:'WFL', type:'League', teams:9, played:28, total:72, round:'Match-week 7', leader:'Bashundhara Kings W', status:'Live', season:'2025–26', color:'#c41e2c' },
    { id:'bcl', name:'Bangladesh Championship League', short:'BCL', type:'League', teams:12, played:60, total:132, round:'Match-week 11', leader:'Wari Club', status:'Live', season:'2025–26', color:'#2f72e3' },
    { id:'school', name:'National School Football Championship', short:'School', type:'Group + Knockout', teams:64, played:96, total:188, round:'Divisional rounds', leader:'BKSP', status:'Live', season:'2025–26', color:'#8a5cf6' },
  ];

  const bplTable = [
    { p:'Bashundhara Kings', pl:18, w:14, d:3, l:1, gf:42, ga:11, pts:45 },
    { p:'Abahani Limited Dhaka', pl:18, w:12, d:4, l:2, gf:38, ga:16, pts:40 },
    { p:'Mohammedan SC', pl:18, w:11, d:3, l:4, gf:31, ga:19, pts:36 },
    { p:'Bangladesh Police FC', pl:18, w:8, d:5, l:5, gf:24, ga:22, pts:29 },
    { p:'Fortis FC', pl:18, w:7, d:4, l:7, gf:22, ga:24, pts:25 },
    { p:'Sheikh Russel KC', pl:18, w:6, d:5, l:7, gf:20, ga:25, pts:23 },
    { p:'Rahmatganj MFS', pl:18, w:5, d:4, l:9, gf:17, ga:28, pts:19 },
    { p:'Brothers Union', pl:18, w:4, d:3, l:11, gf:15, ga:33, pts:15 },
    { p:'Fakirerpool YMC', pl:18, w:3, d:4, l:11, gf:14, ga:34, pts:13 },
    { p:'Chittagong Abahani', pl:18, w:2, d:5, l:11, gf:12, ga:35, pts:11 },
  ];

  // Fed Cup bracket (semis + final)
  const bracket = {
    semis: [
      { a:'Abahani Limited', b:'Fortis FC', as:2, bs:1, done:true },
      { a:'Bashundhara Kings', b:'Mohammedan SC', as:null, bs:null, done:false, when:'Jun 12' },
    ],
    final: { a:'Abahani Limited', b:'Winner SF2', when:'Jun 20', venue:'Bashundhara Kings Arena' },
  };

  // National School Football Championship bracket (school names)
  const schoolBracket = {
    semis: [
      { a:'BKSP', b:'St. Joseph High School', as:3, bs:1, done:true },
      { a:'Dhaka Residential Model College', b:'Govt. Laboratory High School', as:null, bs:null, done:false, when:'Jun 18' },
    ],
    final: { a:'BKSP', b:'Winner SF2', when:'Jun 27', venue:'BFF Artificial Turf, Dhaka' },
  };

  const matchTech = [
    { k:'VAR-equipped venues', v:3, d:'of 7 BPL venues', icon:'globe' },
    { k:'Goal-line technology', v:2, d:'Hawk-Eye installed', icon:'ball' },
    { k:'Avg VAR check', v:'48s', d:'-22s vs last season', icon:'clock' },
    { k:'Reviews this season', v:64, d:'14 overturned', icon:'whistle' },
  ];

  // ---- E-ticketing ----
  const ticketMatches = [
    { id:'tk1', home:'Bangladesh', away:'Bhutan', hf:'🇧🇩', af:'🇧🇹', comp:'AFC Asian Cup Qual.', date:'Jun 14', time:'17:00', venue:'Bashundhara Kings Arena', cap:14000, sold:11240, status:'On sale' },
    { id:'tk2', home:'Bangladesh W', away:'India W', hf:'🇧🇩', af:'🇮🇳', comp:'SAFF U-20 W. Semi', date:'Jun 22', time:'15:30', venue:'BFF Artificial Turf', cap:5000, sold:3120, status:'On sale' },
    { id:'tk3', home:'Bashundhara Kings', away:'Abahani', hf:'🟢', af:'🔵', comp:'BPL · MW19', date:'Jun 16', time:'18:45', venue:'Bashundhara Kings Arena', cap:14000, sold:6800, status:'On sale' },
    { id:'tk4', home:'Mohammedan SC', away:'Fortis FC', hf:'⚫', af:'🟠', comp:'Federation Cup SF', date:'Jun 12', time:'17:00', venue:'Bangabandhu Stadium', cap:36000, sold:9400, status:'On sale' },
  ];

  const ticketTiers = [
    { name:'VIP Box', price:2500, sold:78, total:120, color:'#e3a72f' },
    { name:'Premium Stand', price:1000, sold:1840, total:2200, color:'#00684a' },
    { name:'Grandstand', price:500, sold:4200, total:5000, color:'#2f72e3' },
    { name:'General', price:200, sold:5122, total:6680, color:'#6b7d74' },
  ];

  const ticketStats = { revenue:'৳1.84Cr', sold:11240, digital:96, gateTime:'-71%' };

  // ---- Season passes ----
  const seasonPasses = [
    { id:'sp1', name:'Bangladesh National — Home Season Pass', team:'Bangladesh', scope:'All Bangladesh home internationals', comp:'2025–26 internationals', matches:7, tier:'Premium Stand', price:5500, save:1500, perks:['Reserved Premium seat for every home match','Priority entry via fast-lane QR gate','10% off official merchandise','Members-only matchday lounge'], sold:840, total:1500, popular:true, color:'#00684a' },
    { id:'sp2', name:'Bangladesh Women — Season Pass', team:'Bangladesh W', scope:'All home women’s internationals', comp:'2025–26 internationals', matches:5, tier:'Grandstand', price:1800, save:700, perks:['Grandstand seat for every home women’s match','Priority QR entry','Support women’s football'], sold:410, total:900, color:'#2f72e3' },
    { id:'sp3', name:'BPL Club Season Ticket — Bashundhara Kings', team:'Bashundhara Kings', scope:'All Bashundhara Kings home league fixtures', comp:'Bangladesh Premier League 2025–26', matches:9, tier:'Grandstand', price:3200, save:1300, perks:['Same seat all season at Kings Arena','Cup-tie priority booking','Club newsletter & member card'], sold:1260, total:2000, color:'#e3a72f' },
    { id:'sp4', name:'VIP All-Access Annual Pass', team:'All venues', scope:'Every BFF-organised match · VIP Box', comp:'All competitions 2025–26', matches:21, tier:'VIP Box', price:24000, save:8000, perks:['VIP Box at every BFF match nationwide','Chauffeured pick-up & drop-off on matchdays','Hospitality & catering included','Guaranteed parking','Meet-and-greet invitations'], sold:54, total:120, color:'#8a5cf6' },
  ];

  const paymentMethods = [
    { id:'bkash', name:'bKash', kind:'Mobile wallet', color:'#e2136e', hint:'Pay from your bKash balance' },
    { id:'nagad', name:'Nagad', kind:'Mobile wallet', color:'#ec1c24', hint:'Pay from your Nagad wallet' },
    { id:'rocket', name:'Rocket', kind:'Mobile wallet', color:'#8c3494', hint:'DBBL Rocket payment' },
    { id:'card', name:'Card', kind:'Visa / Mastercard', color:'#1a4fa0', hint:'Debit or credit card' },
  ];

  const ticketOrders = [
    { id:'BFF-T0241', buyer:'Imran Hossain', match:'Bangladesh v Bhutan', tier:'Premium Stand', qty:2, amount:2000, method:'bKash', status:'Confirmed', when:'2 min ago', gate:'pending' },
    { id:'BFF-T0240', buyer:'Sadia Afrin', match:'Bangladesh v Bhutan', tier:'General', qty:4, amount:800, method:'Nagad', status:'Confirmed', when:'11 min ago', gate:'pending' },
    { id:'BFF-T0239', buyer:'Rahim Uddin', match:'Bangladesh W v India W', tier:'Grandstand', qty:2, amount:1000, method:'bKash', status:'Confirmed', when:'24 min ago', gate:'checked-in' },
    { id:'BFF-T0238', buyer:'Tanvir Ahmed', match:'Bashundhara Kings v Abahani', tier:'VIP Box', qty:1, amount:2500, method:'Card', status:'Confirmed', when:'38 min ago', gate:'pending' },
    { id:'BFF-T0237', buyer:'Nusrat Jahan', match:'Bangladesh v Bhutan', tier:'General', qty:3, amount:600, method:'Rocket', status:'Refunded', when:'1 hr ago', gate:'—' },
    { id:'BFF-T0236', buyer:'Karim Sheikh', match:'Mohammedan v Fortis', tier:'Grandstand', qty:2, amount:1000, method:'bKash', status:'Confirmed', when:'1 hr ago', gate:'checked-in' },
  ];

  // ---- Sports science: GPS / load monitoring ----
  const gpsLoad = [
    { name:'Rakib Hossain', pos:'FW', dist:10.8, sprint:34, hsr:612, load:78, acwr:1.12, status:'Optimal' },
    { name:'Sheikh Morsalin', pos:'FW', dist:11.2, sprint:38, hsr:705, load:84, acwr:1.28, status:'Monitor' },
    { name:'Hamza Choudhury', pos:'MF', dist:12.1, sprint:29, hsr:540, load:81, acwr:1.04, status:'Optimal' },
    { name:'Jamal Bhuyan', pos:'MF', dist:11.4, sprint:24, hsr:430, load:72, acwr:0.96, status:'Optimal' },
    { name:'Mohammad Ibrahim', pos:'MF', dist:10.2, sprint:27, hsr:498, load:93, acwr:1.46, status:'High risk' },
    { name:'Tariq Kazi', pos:'DF', dist:10.6, sprint:22, hsr:388, load:69, acwr:1.01, status:'Optimal' },
  ];

  // Video analysis pipeline (kanban-style stages)
  const videoPipeline = [
    { stage:'Ingested', color:'#6b7d74', items:[ { t:'BD vs India — full match', meta:'94 min · 1080p', tag:'Senior' }, { t:'BPL: Kings vs Mohammedan', meta:'96 min', tag:'Scout' } ] },
    { stage:'Auto-tagging', color:'#2f72e3', items:[ { t:'BD W vs Bhutan — SAFF SF', meta:'AI events: 412', tag:'Women' }, { t:'U-20 Final vs Nepal', meta:'AI events: 388', tag:'Youth' } ] },
    { stage:'Analyst review', color:'#e3a72f', items:[ { t:'Opponent: Myanmar pressing', meta:'Analyst: R. Islam', tag:'Tactical' } ] },
    { stage:'Published', color:'#1a9e62', items:[ { t:'Set-piece clip pack — Bhutan', meta:'18 clips', tag:'Senior' }, { t:'Ritu Porna — finishing reel', meta:'9 clips', tag:'Player' } ] },
  ];

  // AI scouting & talent ID
  const aiScout = [
    { name:'Fahamidul Islam', pos:'FW', age:19, region:'Italy (diaspora)', fit:91, traits:['Off-ball runs','Left foot','Pace'], flag:'🇮🇹' },
    { name:'Cuba Michael', pos:'MF', age:18, region:'England (diaspora)', fit:87, traits:['Press resistance','Vision'], flag:'🏴' },
    { name:'Swapna Rani', pos:'MF', age:19, region:'Rangpur', fit:85, traits:['Box-to-box','Set pieces'], flag:'🇧🇩' },
    { name:'Mithun Chowdhury', pos:'DF', age:17, region:'Chattogram academy', fit:82, traits:['Aerial','Recovery pace'], flag:'🇧🇩' },
    { name:'Asma Akter', pos:'FW', age:16, region:'Mymensingh (Kalsindur)', fit:80, traits:['Finishing','Dribbling'], flag:'🇧🇩' },
  ];

  const aiScoutStats = { scanned:'4.2M', flagged:312, diaspora:38, watchlist:54 };

  // ---- Infrastructure & ecosystem ----
  const stadiums = [
    { name:'Bashundhara Kings Arena', city:'Dhaka', cap:14000, smart:92, year:'2022', floodlux:'2,400 lux', pitch:'Hybrid GrassMaster', feats:['LED pitch lighting','Stadium-wide 5G','Digital QR turnstiles','VAR review room','HD scoreboard & ribbon LEDs','IP-CCTV crowd analytics'], status:'Smart-ready', host:'AFC Cup, BPL', map:{ x:62, y:46 }, region:'Dhaka',
      systems:[ { k:'Digital access & e-ticketing', s:'live' }, { k:'LED floodlights (2,400 lux)', s:'live' }, { k:'VAR & goal-line technology', s:'live' }, { k:'Stadium-wide 5G / Wi-Fi 6', s:'live' }, { k:'IP-CCTV crowd analytics', s:'live' }, { k:'HD scoreboard & ribbon LEDs', s:'live' }, { k:'Hybrid GrassMaster pitch', s:'live' }, { k:'Solar / energy management', s:'progress' } ] },
    { name:'Bangabandhu National Stadium', city:'Dhaka', cap:36000, smart:64, year:'2024', floodlux:'1,800 lux', pitch:'Hybrid turf', feats:['Renovated 2024','Hybrid turf','CCTV analytics','New media tribune'], status:'Upgrading', host:'SAFF, internationals', map:{ x:60, y:48 }, region:'Dhaka',
      systems:[ { k:'Digital access & e-ticketing', s:'live' }, { k:'LED floodlights (1,800 lux)', s:'live' }, { k:'Hybrid turf', s:'live' }, { k:'CCTV analytics', s:'live' }, { k:'New media tribune', s:'live' }, { k:'VAR & goal-line technology', s:'progress' }, { k:'Stadium-wide 5G / Wi-Fi 6', s:'progress' }, { k:'Energy management', s:'planned' } ] },
    { name:'Sylhet District Stadium', city:'Sylhet', cap:18000, smart:58, year:'2023', floodlux:'1,400 lux', pitch:'Natural grass', feats:['LED floodlights','E-ticket gates','Practice ground'], status:'Upgrading', host:'AFC qualifiers', map:{ x:82, y:30 }, region:'Sylhet',
      systems:[ { k:'Digital access & e-ticketing', s:'live' }, { k:'LED floodlights (1,400 lux)', s:'live' }, { k:'Practice ground', s:'live' }, { k:'CCTV analytics', s:'progress' }, { k:'Hybrid turf upgrade', s:'progress' }, { k:'VAR & goal-line technology', s:'planned' }, { k:'5G / connectivity', s:'planned' } ] },
    { name:'M. A. Aziz Stadium', city:'Chattogram', cap:20000, smart:41, year:'2027 (planned)', floodlux:'Planned', pitch:'Natural grass', feats:['Planned 2027 retrofit','Floodlight upgrade','Digital gates'], status:'Planned', host:'BPL', map:{ x:78, y:72 }, region:'Chattogram',
      systems:[ { k:'Digital access & e-ticketing', s:'progress' }, { k:'LED floodlight upgrade', s:'planned' }, { k:'Hybrid turf', s:'planned' }, { k:'CCTV analytics', s:'planned' }, { k:'VAR & goal-line technology', s:'planned' }, { k:'5G / connectivity', s:'planned' } ] },
    { name:'Sheikh Kamal Stadium', city:'Nilphamari', cap:22000, smart:55, year:'2023', floodlux:'1,600 lux', pitch:'Natural grass', feats:['Modern floodlights','E-ticketing','Women\u2019s match host'], status:'Upgrading', host:'Women\u2019s internationals', map:{ x:50, y:16 }, region:'Rangpur',
      systems:[ { k:'Digital access & e-ticketing', s:'live' }, { k:'LED floodlights (1,600 lux)', s:'live' }, { k:'Women\u2019s match facilities', s:'live' }, { k:'CCTV analytics', s:'progress' }, { k:'Hybrid turf upgrade', s:'progress' }, { k:'VAR infrastructure', s:'planned' }, { k:'5G / connectivity', s:'planned' } ] },
    { name:'BFF Technical & Football HQ', city:'Dhaka', cap:5000, smart:78, year:'2025', floodlux:'1,200 lux', pitch:'2× artificial turf', feats:['Elite academy pitches','GPS performance lab','Video analysis suite','Medical & recovery centre'], status:'Smart-ready', host:'Age-group camps', map:{ x:58, y:44 }, region:'Dhaka',
      systems:[ { k:'2× artificial turf pitches', s:'live' }, { k:'GPS performance lab', s:'live' }, { k:'Video analysis suite', s:'live' }, { k:'Medical & recovery centre', s:'live' }, { k:'LED floodlights (1,200 lux)', s:'live' }, { k:'Residential academy block', s:'progress' }, { k:'Hydrotherapy pool', s:'planned' } ] },
  ];

  const stadiumSummary = { venues:6, smartReady:2, avgSmart:65, capacity:'115,000+', target:'12 smart venues by 2028' };
  const smartSystems = [
    { k:'Digital access / e-ticketing', pct:72 },
    { k:'Floodlight & LED upgrade', pct:67 },
    { k:'CCTV & crowd analytics', pct:58 },
    { k:'5G / connectivity', pct:44 },
    { k:'VAR & goal-line infrastructure', pct:38 },
  ];

  const dataCenter = {
    uptime:'99.98%', records:'18.4M', dailyEvents:'2.1M', storage:'74 TB',
    nodes:[ { k:'Player records', v:'18,420' }, { k:'Match events logged', v:'1.2M / season' }, { k:'Video assets', v:'9,840 hrs' }, { k:'API calls / day', v:'3.4M' } ],
  };

  const ecosystem = [
    { node:'Central FMS', desc:'Player, club, competition core', status:'live' },
    { node:'Mobile apps', desc:'Fan · Referee · Coach · Scout', status:'live' },
    { node:'Analytics engine', desc:'AI/ML performance & injury', status:'live' },
    { node:'E-ticketing', desc:'Sales · access control', status:'live' },
    { node:'Data center', desc:'Storage · APIs · backup', status:'building' },
    { node:'Smart stadiums', desc:'IoT · 5G · VAR', status:'building' },
  ];

  const integrations = [
    { org:'FIFA Connect', what:'Player ID & eligibility sync', status:'Connected', icon:'globe' },
    { org:'AFC Competitions', what:'Squad lists & match data', status:'Connected', icon:'trophy' },
    { org:'FIFA Forward', what:'Funding & project reporting', status:'Connected', icon:'check' },
    { org:'SAFF Data Exchange', what:'Regional fixtures & stats', status:'Pilot', icon:'arrowr' },
    { org:'Transfer Matching System', what:'International transfers (ITC)', status:'Connected', icon:'cards' },
  ];

  const exportable = [
    { name:'FMS-as-a-Service', desc:'License the federation platform to regional associations', stage:'Pilot' },
    { name:'Referee Digital Suite', desc:'Assignment + digital reporting toolkit', stage:'Ready' },
    { name:'Talent ID Engine', desc:'AI scouting model & combine analytics', stage:'R&D' },
    { name:'E-ticketing Gateway', desc:'White-label ticketing + access control', stage:'Ready' },
  ];

  const maturity = [
    { k:'Data capture', pct:88 }, { k:'Process digitization', pct:76 }, { k:'Analytics adoption', pct:61 },
    { k:'Automation', pct:54 }, { k:'AI-driven decisions', pct:42 },
  ];

  window.DATA3 = {
    competitions, bplTable, bracket, schoolBracket, matchTech,
    ticketMatches, ticketTiers, ticketStats, seasonPasses, paymentMethods, ticketOrders,
    gpsLoad, videoPipeline, aiScout, aiScoutStats,
    stadiums, stadiumSummary, smartSystems, dataCenter, ecosystem, integrations, exportable, maturity,
  };
})();

/* data-archive.js */
/* ============================================================
   National Players Archive — Bangladesh football history (1972–)
   → window.DATA4
   Historical legends & milestones. Stats are archival/approximate.
   ============================================================ */
(function () {
  const pa = (s) => s.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  const L = (o) => Object.assign({ initials: pa(o.name), hue: hue(o.name) }, o);

  // Eras of Bangladesh national football
  const eras = [
    { id:'found', label:'Foundation Era', span:'1972–1979', color:'#6b4f2a', desc:'Birth of the federation and the first national side after independence.' },
    { id:'golden', label:'Golden Generation', span:'1980–1989', color:'#b8860b', desc:'Dhaka derby heyday; iconic stars and packed stadiums.' },
    { id:'silver', label:'The Munna Era', span:'1990–1999', color:'#5b7a8c', desc:'Defensive greats and the 1999 SA Games gold in Kathmandu.' },
    { id:'saff', label:'SAFF Champions', span:'2000–2009', color:'#1f7a4d', desc:'2003 SAFF Championship triumph on home soil.' },
    { id:'rebuild', label:'Rebuilding Years', span:'2010–2019', color:'#2f5fa3', desc:'Transition, youth investment and the women\u2019s programme founded.' },
    { id:'modern', label:'Modern & Women\u2019s Rise', span:'2020–', color:'#00684a', desc:'Women\u2019s SAFF titles and diaspora recruitment (Hamza, Fahamidul).' },
  ];

  // Hall of fame — legendary national players (men & women across eras)
  const legends = [
    L({ name:'Kazi Salahuddin', era:'golden', pos:'FW', years:'1973–1984', caps:38, goals:8, no:9, note:'Bangladesh\u2019s first football superstar; later BFF President.', icon:'star', hof:true, photo:'https://upload.wikimedia.org/wikipedia/commons/e/e2/Kazi_Salahuddin%2C_Ganabhaban_Dhaka_2016-06-28_%28cropped%29.jpg' }),
    L({ name:'Ashraf Uddin Chunnu', era:'golden', pos:'FW', years:'1978–1988', caps:34, goals:11, no:7, note:'Prolific striker of the Dhaka derby golden age.', photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Retirement_of_Chunnu.jpg/330px-Retirement_of_Chunnu.jpg' }),
    L({ name:'Sheikh Mohammad Aslam', era:'golden', pos:'FW', years:'1982–1991', caps:32, goals:13, no:10, note:'First Bangladeshi to score 100+ domestic league goals.', photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Sheikh_Mohammad_Aslam.png/330px-Sheikh_Mohammad_Aslam.png' }),
    L({ name:'Monem Munna', era:'silver', pos:'DF', years:'1986–1997', caps:40, goals:3, no:5, note:'The greatest defender in Bangladesh history; iconic No. 5.', icon:'shield', hof:true }),
    L({ name:'Kaiser Hamid', era:'silver', pos:'DF', years:'1985–1996', caps:36, goals:2, no:3, note:'Elegant centre-back and national captain.' }),
    L({ name:'Rumi', era:'silver', pos:'MF', years:'1988–1998', caps:30, goals:5, no:8, note:'Midfield engine of the 1990s national side.' }),
    L({ name:'Golam Gaus', era:'found', pos:'DF', years:'1972–1979', caps:22, goals:1, no:4, note:'Member of the very first post-independence national team.' }),
    L({ name:'Pratap Shankar Hazra', era:'found', pos:'MF', years:'1973–1980', caps:24, goals:4, no:6, note:'Early national-team mainstay and captain.' }),
    L({ name:'Aminul Haque', era:'saff', pos:'GK', years:'1995–2011', caps:55, goals:0, no:1, note:'Goalkeeper & captain of the 2003 SAFF-winning team.', icon:'shield', hof:true, photo:'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Md._Aminul_Haque%2C_Youth_and_Sports_Minister%2C_presents_Arafat_Rahman_Koko_Memorial_Award_at_Le_M%C3%A9ridien_Dhaka%2C_2026-03-01_%28cropped%29.jpg/330px-Md._Aminul_Haque%2C_Youth_and_Sports_Minister%2C_presents_Arafat_Rahman_Koko_Memorial_Award_at_Le_M%C3%A9ridien_Dhaka%2C_2026-03-01_%28cropped%29.jpg' }),
    L({ name:'Arif Khan Joy', era:'saff', pos:'MF', years:'1999–2008', caps:42, goals:9, no:11, note:'Scored the winner that sealed 2003 SAFF glory.', hof:true }),
    L({ name:'Alfaz Ahmed', era:'saff', pos:'FW', years:'1996–2007', caps:39, goals:14, no:9, note:'Lethal finisher of the SAFF-champion generation.' }),
    L({ name:'Rajani Kanta Barman', era:'saff', pos:'DF', years:'2001–2011', caps:44, goals:2, no:5, note:'Commanding centre-back of the 2000s.' }),
    L({ name:'Mamunul Islam', era:'rebuild', pos:'MF', years:'2008–2018', caps:56, goals:6, no:17, note:'Creative captain through the rebuilding decade.', hof:true }),
    L({ name:'Mithun Chowdhury', era:'rebuild', pos:'FW', years:'2011–2021', caps:50, goals:12, no:22, note:'Leading scorer of the 2010s national side.' }),
    L({ name:'Sabina Khatun', era:'modern', pos:'FW', years:'2009–', caps:75, goals:38, no:10, note:'Record scorer; captain of back-to-back SAFF champions.', icon:'trophy', hof:true, marquee:true }),
    L({ name:'Jamal Bhuyan', era:'modern', pos:'MF', years:'2013–', caps:84, goals:3, no:10, note:'Most-capped men\u2019s captain; diaspora trailblazer.', icon:'star', hof:true }),
  ];

  // Milestones / "firsts"
  const milestones = [
    { y:'1972', t:'Bangladesh Football Federation founded', d:'Affiliated to FIFA (1974) and AFC.', kind:'Foundation' },
    { y:'1973', t:'First official international', d:'National team\u2019s debut on the international stage.', kind:'First' },
    { y:'1979', t:'First Asian competition entry', d:'Bangladesh enters AFC qualification.', kind:'First' },
    { y:'1985', t:'First FIFA World Cup qualifiers', d:'Maiden World Cup qualifying campaign.', kind:'First' },
    { y:'1999', t:'SA Games Gold — Kathmandu', d:'Men\u2019s team wins South Asian Games gold.', kind:'Title' },
    { y:'2003', t:'SAFF Championship winners', d:'Crowned South Asian champions in Dhaka.', kind:'Title' },
    { y:'2009', t:'Women\u2019s national team formed', d:'Bangladesh women debut internationally.', kind:'First' },
    { y:'2022', t:'Women\u2019s SAFF Champions', d:'First major women\u2019s continental-region title.', kind:'Title' },
    { y:'2024', t:'Women retain SAFF crown', d:'Back-to-back SAFF Women\u2019s Championships.', kind:'Title' },
    { y:'2025', t:'Hamza Choudhury debuts', d:'First English Premier League-based player caps up.', kind:'First' },
  ];

  const archiveStats = { sinceYear:1972, totalCapped:'1,180+', hofMembers:legends.filter(l=>l.hof).length, titles:5 };

  window.DATA4 = { eras, legends, milestones, archiveStats };
})();

/* data-hunt.js */
/* ============================================================
   Player Hunt — open trial registrations & talent-hunt pipeline
   → window.DATA5
   Boys & girls register for age groups U13–U23, upload skill video.
   ============================================================ */
(function () {
  const pa = (s) => s.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
  const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };
  const A = (o) => Object.assign({ initials: pa(o.name), hue: hue(o.name) }, o);

  const ageGroups = ['U-13', 'U-15', 'U-17', 'U-19', 'U-20', 'U-23'];

  // pipeline stages for the talent hunt
  const stages = ['New', 'Reviewing', 'Trial', 'Selected', 'Rejected'];

  const districts = ['Dhaka','Chattogram','Sylhet','Rajshahi','Khulna','Rangpur','Mymensingh','Barishal','Cox\u2019s Bazar','Rangamati','Tangail','Satkhira','Jashore','Bogura','Cumilla'];

  // Skill ratings the scout assigns (0–100); for New ones some are null
  const applicants = [
    A({ id:'ap1', name:'Tanvir Ahmed', gender:'boy', age:12, group:'U-13', pos:'FW', district:'Dhaka', foot:'Right', height:152, stage:'Reviewing', applied:'2026-05-28', video:true, length:'2:14', skills:{ technique:78, pace:84, physical:62, gameIntel:71 }, rating:7.6, scout:'R. Islam', note:'Sharp finisher, two-footed. Strong trial candidate.' }),
    A({ id:'ap2', name:'Rifat Hossain', gender:'boy', age:14, group:'U-15', pos:'MF', district:'Chattogram', foot:'Left', height:165, stage:'Trial', applied:'2026-05-21', video:true, length:'3:02', skills:{ technique:82, pace:74, physical:70, gameIntel:85 }, rating:8.0, scout:'A. Karim', note:'Excellent vision & passing range. Invited to regional trial.' }),
    A({ id:'ap3', name:'Sumaiya Akter', gender:'girl', age:13, group:'U-15', pos:'FW', district:'Mymensingh', foot:'Right', height:158, stage:'Selected', applied:'2026-05-18', video:true, length:'2:46', skills:{ technique:88, pace:90, physical:66, gameIntel:80 }, rating:8.4, scout:'P. Butler', note:'Outstanding pace & finishing — from Kalsindur pipeline. Selected for camp.' }),
    A({ id:'ap4', name:'Jahid Hasan', gender:'boy', age:16, group:'U-17', pos:'DF', district:'Khulna', foot:'Right', height:178, stage:'New', applied:'2026-06-03', video:true, length:'1:58', skills:null, rating:null, scout:null, note:'' }),
    A({ id:'ap5', name:'Nusrat Jahan', gender:'girl', age:15, group:'U-17', pos:'MF', district:'Rangamati', foot:'Right', height:160, stage:'Reviewing', applied:'2026-05-30', video:true, length:'2:31', skills:{ technique:80, pace:78, physical:64, gameIntel:82 }, rating:7.8, scout:'P. Butler', note:'Composed central midfielder, good engine.' }),
    A({ id:'ap6', name:'Mehedi Hasan', gender:'boy', age:18, group:'U-19', pos:'GK', district:'Rajshahi', foot:'Right', height:186, stage:'Reviewing', applied:'2026-05-29', video:true, length:'2:08', skills:{ technique:74, pace:60, physical:82, gameIntel:76 }, rating:7.5, scout:'A. Karim', note:'Commanding keeper, great reflexes & frame.' }),
    A({ id:'ap7', name:'Arif Khan', gender:'boy', age:17, group:'U-19', pos:'FW', district:'Sylhet', foot:'Left', height:174, stage:'New', applied:'2026-06-04', video:true, length:'2:55', skills:null, rating:null, scout:null, note:'' }),
    A({ id:'ap8', name:'Priya Das', gender:'girl', age:18, group:'U-20', pos:'DF', district:'Khulna', foot:'Right', height:167, stage:'Trial', applied:'2026-05-24', video:true, length:'2:19', skills:{ technique:76, pace:80, physical:78, gameIntel:74 }, rating:7.7, scout:'P. Butler', note:'Athletic full-back, overlaps well. Trial confirmed.' }),
    A({ id:'ap9', name:'Sakib Al Hasan', gender:'boy', age:19, group:'U-20', pos:'MF', district:'Bogura', foot:'Right', height:176, stage:'Reviewing', applied:'2026-05-27', video:true, length:'3:14', skills:{ technique:84, pace:72, physical:75, gameIntel:83 }, rating:7.9, scout:'R. Islam', note:'Box-to-box, tactically mature.' }),
    A({ id:'ap10', name:'Roksana Begum', gender:'girl', age:16, group:'U-17', pos:'GK', district:'Satkhira', foot:'Right', height:170, stage:'New', applied:'2026-06-05', video:true, length:'1:47', skills:null, rating:null, scout:null, note:'' }),
    A({ id:'ap11', name:'Imran Hossain', gender:'boy', age:21, group:'U-23', pos:'DF', district:'Cumilla', foot:'Left', height:182, stage:'Reviewing', applied:'2026-05-26', video:true, length:'2:40', skills:{ technique:78, pace:76, physical:84, gameIntel:79 }, rating:7.8, scout:'A. Karim', note:'Strong centre-back, good aerial presence.' }),
    A({ id:'ap12', name:'Fatema Khatun', gender:'girl', age:14, group:'U-15', pos:'MF', district:'Tangail', foot:'Right', height:156, stage:'Selected', applied:'2026-05-15', video:true, length:'2:22', skills:{ technique:86, pace:82, physical:60, gameIntel:84 }, rating:8.2, scout:'P. Butler', note:'Gifted playmaker. Selected for U-15 girls camp.' }),
    A({ id:'ap13', name:'Naim Sheikh', gender:'boy', age:12, group:'U-13', pos:'MF', district:'Jashore', foot:'Right', height:148, stage:'New', applied:'2026-06-04', video:true, length:'2:05', skills:null, rating:null, scout:null, note:'' }),
    A({ id:'ap14', name:'Sabbir Rahman', gender:'boy', age:16, group:'U-17', pos:'FW', district:'Cox\u2019s Bazar', foot:'Right', height:172, stage:'Rejected', applied:'2026-05-12', video:true, length:'1:52', skills:{ technique:62, pace:70, physical:58, gameIntel:60 }, rating:6.3, scout:'R. Islam', note:'Raw; encouraged to re-apply next cycle.' }),
    A({ id:'ap15', name:'Mitu Akter', gender:'girl', age:19, group:'U-20', pos:'FW', district:'Rangpur', foot:'Left', height:163, stage:'Reviewing', applied:'2026-05-31', video:true, length:'2:37', skills:{ technique:81, pace:86, physical:68, gameIntel:77 }, rating:7.9, scout:'P. Butler', note:'Direct winger, beats players 1v1.' }),
    A({ id:'ap16', name:'Hasibul Islam', gender:'boy', age:22, group:'U-23', pos:'FW', district:'Barishal', foot:'Right', height:179, stage:'Trial', applied:'2026-05-22', video:true, length:'3:08', skills:{ technique:83, pace:81, physical:80, gameIntel:78 }, rating:8.1, scout:'A. Karim', note:'Complete forward, clinical. Trial scheduled Jun 16.' }),
  ];

  const camps = [
    { group:'U-13', date:'Jun 21', venue:'BFF Technical Centre, Dhaka', invited:18 },
    { group:'U-15', date:'Jun 24', venue:'BKSP, Savar', invited:22 },
    { group:'U-17', date:'Jun 27', venue:'BFF Artificial Turf, Dhaka', invited:24 },
    { group:'U-20', date:'Jun 30', venue:'Sylhet District Stadium', invited:26 },
  ];

  window.DATA5 = { ageGroups, stages, districts, applicants, camps };
})();

