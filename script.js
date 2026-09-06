/* =================== NAV TOGGLE =================== */
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('show');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', isOpen);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('show');
  menuBtn.classList.remove('open');
}));

/* =================== AUTHENTICATION SYSTEM =================== */
const authModalBackdrop = document.getElementById('authModalBackdrop');
const openAuthBtn = document.getElementById('openAuthBtn');
const heroAuthBtn = document.getElementById('heroAuthBtn');
const authModalClose = document.getElementById('authModalClose');
const tabLogin = document.getElementById('tabLogin');
const tabRegister = document.getElementById('tabRegister');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

function openAuthModal() {
  authModalBackdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeAuthModal() {
  authModalBackdrop.classList.remove('show');
  document.body.style.overflow = '';
}

openAuthBtn.addEventListener('click', openAuthModal);
heroAuthBtn.addEventListener('click', openAuthModal);
authModalClose.addEventListener('click', closeAuthModal);
authModalBackdrop.addEventListener('click', (e) => { if (e.target === authModalBackdrop) closeAuthModal(); });

tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabRegister.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
});

tabRegister.addEventListener('click', () => {
  tabRegister.classList.add('active');
  tabLogin.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  alert(`Logged in as: ${email}`);
  openAuthBtn.textContent = 'Account';
  closeAuthModal();
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  alert(`Registered user: ${name}`);
  openAuthBtn.textContent = 'Account';
  closeAuthModal();
});

/* =================== ACCESSIBILITY ENGINE =================== */
const ariaAnnouncer = document.getElementById('ariaAnnouncer');
function announce(msg) {
  ariaAnnouncer.textContent = '';
  setTimeout(() => { ariaAnnouncer.textContent = msg; }, 60);
}

const speechSupported = 'speechSynthesis' in window;

function speak(text, btnEl) {
  if(!speechSupported) { announce('Voice reading is not supported in this browser.'); return; }
  window.speechSynthesis.cancel();
  document.querySelectorAll('.listen-btn.speaking').forEach(b => { 
    b.classList.remove('speaking'); 
    const l = b.querySelector('span'); 
    if(l && l.dataset.defaultLabel) l.textContent = l.dataset.defaultLabel; 
  });
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.95;
  utter.pitch = 1;
  if(btnEl) {
    btnEl.classList.add('speaking');
    const label = btnEl.querySelector('span');
    if(label && !label.dataset.defaultLabel) label.dataset.defaultLabel = label.textContent;
    if(label) label.textContent = 'Stop listening';
    const reset = () => { btnEl.classList.remove('speaking'); if(label) label.textContent = label.dataset.defaultLabel; };
    utter.onend = reset;
    utter.onerror = reset;
  }
  window.speechSynthesis.speak(utter);
}

function toggleListen(text, btnEl) {
  if(btnEl.classList.contains('speaking')) {
    window.speechSynthesis.cancel();
    btnEl.classList.remove('speaking');
    const label = btnEl.querySelector('span');
    if(label && label.dataset.defaultLabel) label.textContent = label.dataset.defaultLabel;
    return;
  }
  speak(text, btnEl);
}

/* Read entire page aloud */
const readToggle = document.getElementById('readToggle');
const readToggleIcon = document.getElementById('readToggleIcon');
const readToggleLabel = document.getElementById('readToggleLabel');
let isReadingPage = false;

function buildFullPageNarration() {
  const hero = "Echoes of Kerala. Mythology and folklore of Kerala. The land remembers what the books forget. Sorcerer priests, outlaw heroes, serpent groves and vengeful spirits.";
  const storyPart = "Story Explorer. " + stories.map(s => `${s.title}. ${s.body} ${s.symbol}`).join(' ');
  const charPart = "Character Gallery. " + characters.map(c => `${c.name}, ${c.epithet}. ${c.origin} ${c.powers} ${c.relationships} ${c.story}`).join(' ');
  const vaultPart = "Folklore Vault. " + vault.map(g => `${g.heading}. ` + g.items.map(it => `${it.q}. ${it.a}`).join(' ')).join(' ');
  const pathPart = "Choose your path. The Guardian of the Sacred Grove. " + storyTree.start.text;
  return [hero, storyPart, charPart, vaultPart, pathPart].join(' ');
}

function startReadingPage() {
  if(!speechSupported) { announce('Voice reading is not supported in this browser.'); return; }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(buildFullPageNarration());
  utter.rate = 0.95;
  utter.onend = stopReadingPage;
  utter.onerror = stopReadingPage;
  window.speechSynthesis.speak(utter);
  isReadingPage = true;
  readToggle.classList.add('active');
  readToggle.setAttribute('aria-pressed', 'true');
  readToggleIcon.textContent = '❚❚';
  readToggleLabel.textContent = 'Stop reading';
  announce('Reading the whole page aloud.');
}

function stopReadingPage() {
  window.speechSynthesis.cancel();
  isReadingPage = false;
  readToggle.classList.remove('active');
  readToggle.setAttribute('aria-pressed', 'false');
  readToggleIcon.textContent = '▶';
  readToggleLabel.textContent = 'Read page';
}

readToggle.addEventListener('click', () => { isReadingPage ? stopReadingPage() : startReadingPage(); });

/* Accessibility Toolbar Controls */
const a11yFab = document.getElementById('a11yFab');
const a11yPanel = document.getElementById('a11yPanel');
a11yFab.addEventListener('click', () => {
  const showing = a11yPanel.classList.toggle('show');
  a11yFab.setAttribute('aria-expanded', showing);
});
document.addEventListener('click', (e) => {
  if(!a11yPanel.contains(e.target) && !a11yFab.contains(e.target)) {
    a11yPanel.classList.remove('show');
    a11yFab.setAttribute('aria-expanded', 'false');
  }
});

let fontScale = 100;
function applyFontScale() {
  document.body.style.fontSize = (17 * fontScale / 100).toFixed(1) + 'px';
  announce(`Text size set to ${fontScale}%.`);
}
document.getElementById('fontUp').addEventListener('click', () => { fontScale = Math.min(150, fontScale + 12); applyFontScale(); });
document.getElementById('fontDown').addEventListener('click', () => { fontScale = Math.max(88, fontScale - 12); applyFontScale(); });
document.getElementById('fontReset').addEventListener('click', () => { fontScale = 100; applyFontScale(); });

const contrastToggle = document.getElementById('contrastToggle');
contrastToggle.addEventListener('click', () => {
  const active = document.body.classList.toggle('high-contrast');
  contrastToggle.classList.toggle('active', active);
  contrastToggle.setAttribute('aria-pressed', active);
  announce(active ? 'High contrast mode on.' : 'High contrast mode off.');
});

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => { backToTop.classList.toggle('show', window.scrollY > 600); });
backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

/* =================== STORY EXPLORER DATA =================== */
const stories = [
  {
    title: "Kadamattathu Kathanar",
    region: "Central Kerala",
    timeline: ["The apprentice priest", "A pact with a Yakshi", "Magic turned to mercy", "Turned to stone"],
    body: "A young priest at Kadamattom is said to have learned sorcery in secret from a Yakshi — a spirit bound to a tree near the church. Where others feared her, he treated her with respect, and she taught him her arts in return. He used what he learned to protect the sick and outwit bandits, becoming a quiet legend across the region. In the most repeated ending, his own power grew too vast for the world to hold, and he chose to turn himself to stone rather than let it be misused — his likeness said to remain at the church to this day.",
    symbol: "A recurring lesson in Kerala folklore: power borrowed from the feared is only safe in the hands of the humble."
  },
  {
    title: "Parayipetta Panthirukulam",
    region: "Pan-Kerala",
    timeline: ["A sage's household", "Twelve children, one mother", "Raised apart, remembered together"],
    body: "The tale follows a Brahmin sage and Panchami, a woman from a community considered low in the caste order of the time. Their twelve children were said to have been placed at birth into twelve different households across Kerala, each family belonging to a different caste and craft. Grown, each child became renowned in their own right — as scholars, smiths, physicians and temple officiants — yet the story insists on their shared birth. It is told less as history than as argument: proof, in narrative form, that Kerala's many communities share one root.",
    symbol: "A folk tale used, deliberately, to unsettle caste hierarchy rather than confirm it."
  },
  {
    title: "Kayamkulam Kochunni",
    region: "Southern Kerala, 19th century",
    timeline: ["A poor household", "The first theft", "Giving to the landless", "Captured by the Travancore forces"],
    body: "Half history, half legend, Kochunni is remembered as an outlaw who robbed wealthy landlords and moneylenders and distributed what he took among tenant farmers and the poor. Stories describe him slipping past guards, disguising himself, and outwitting captors again and again — until the Travancore kingdom's forces finally caught up with him. Whether or not the historical Kochunni matched the legend, the folk version has outlived the record: a reminder of how badly an unjust economy needed a hero, even an illegal one.",
    symbol: "The outlaw-hero figure — justice taken by hand when the law will not give it."
  },
  {
    title: "Thacholi Othenan and the Northern Ballads",
    region: "North Malabar",
    timeline: ["Trained in the kalari", "The rival duels", "A hero's death", "Sung ever since"],
    body: "The Vadakkan Pattukal — the Northern Ballads — preserve the exploits of Thacholi Othenan, a Kalaripayattu master whose skill with a sword and shield made him the most celebrated hero of the cycle. The ballads describe duels fought over honour, land and love, sung for generations by travelling balladeers rather than read from any single book. Othenan's story ends, as many hero-ballads do, in a duel he does not survive — but the songs themselves became the lasting monument.",
    symbol: "Oral ballads as living archive: the hero survives only as long as someone keeps singing."
  },
  {
    title: "The Yakshi of the Palm Grove",
    region: "Pan-Kerala",
    timeline: ["A woman wronged", "Death without justice", "A beautiful stranger on the road", "A grove best not entered at dusk"],
    body: "Across Kerala's folklore, a Yakshi is a spirit born from a woman who died with an injustice unresolved. She is said to appear at night as a strikingly beautiful woman waiting near a palm or banyan tree, drawing travellers off their path. Some tellings end in tragedy for the traveller; others describe a Yakshi who can be pacified through respect, ritual, or an act of genuine kindness — echoing the Kadamattathu Kathanar tale. Old family compounds sometimes maintain small shrines to a resident Yakshi rather than risk her anger.",
    symbol: "A cautionary figure that keeps unresolved harm from being forgotten — even generations later."
  }
];

const storyList = document.getElementById('storyList');
stories.forEach((s) => {
  const card = document.createElement('div');
  card.className = 'story-card';
  card.innerHTML = `
    <button class="story-head" aria-expanded="false">
      <h3>${s.title}</h3>
      <span class="region">${s.region}</span>
      <span class="story-toggle" aria-hidden="true">+</span>
    </button>
    <div class="story-body" inert>
      <div class="story-body-inner">
        <ul class="story-timeline">
          ${s.timeline.map((t, idx) => `<li><span class="num">${idx+1}</span> ${t}</li>`).join('')}
        </ul>
        <p>${s.body}</p>
        <p class="story-symbol">${s.symbol}</p>
        <button class="listen-btn" data-listen type="button">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 5V4L8 9H4z"/><path d="M17 8a5 5 0 010 8"/></svg>
          <span>Listen to this tale</span>
        </button>
      </div>
    </div>
  `;
  const head = card.querySelector('.story-head');
  const body = card.querySelector('.story-body');
  const listenBtn = card.querySelector('[data-listen]');
  listenBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleListen(`${s.title}. ${s.body} ${s.symbol}`, listenBtn);
  });
  head.addEventListener('click', () => {
    const willOpen = !card.classList.contains('open');
    document.querySelectorAll('.story-card.open').forEach(c => {
      if(c !== card) {
        c.classList.remove('open');
        c.querySelector('.story-head').setAttribute('aria-expanded','false');
        c.querySelector('.story-body').setAttribute('inert','');
      }
    });
    card.classList.toggle('open', willOpen);
    head.setAttribute('aria-expanded', willOpen);
    if(willOpen) { body.removeAttribute('inert'); } else { body.setAttribute('inert',''); window.speechSynthesis.cancel(); }
  });
  storyList.appendChild(card);
});

/* =================== CHARACTER GALLERY DATA =================== */
const characters = [
  {
    name: "Muthappan", type: "deity", epithet: "The folk deity of the hunt", teaser: "Worshipped with dogs, arrows and toddy at his side.",
    origin: "Muthappan is worshipped chiefly at Parassinikadavu in North Kerala...", powers: "Protector of hunters, the poor, and the excluded...",
    relationships: "Embodied during Theyyam performances...", story: "Associated with dawn rituals at his shrine..."
  },
  {
    name: "Kadamattathu Kathanar", type: "sorcerer", epithet: "The priest who learned sorcery", teaser: "Trained by a spirit he refused to fear.",
    origin: "A priest of the Kadamattom church...", powers: "Command over spirits, illusion, and healing...",
    relationships: "His teacher, the Yakshi...", story: "Said to have turned himself to stone..."
  },
  {
    name: "Thacholi Othenan", type: "warrior", epithet: "Hero of the Northern Ballads", teaser: "A Kalaripayattu master sung about for centuries.",
    origin: "The central figure of the Vadakkan Pattukal...", powers: "Mastery of the sword...",
    relationships: "His rivalries and romances...", story: "Dies in a duel in most versions..."
  },
  {
    name: "Kayamkulam Kochunni", type: "outlaw", epithet: "The outlaw who robbed the landlords", teaser: "Kerala's answer to a Robin Hood legend.",
    origin: "A 19th-century figure from southern Kerala...", powers: "Escape artistry, disguise...",
    relationships: "Remembered in opposition to the Travancore kingdom...", story: "Eventually captured by royal forces..."
  },
  {
    name: "The Yakshi", type: "spirit", epithet: "The spirit of unfinished grief", teaser: "Beautiful, dangerous, and born of injustice.",
    origin: "Said to form from the spirit of a woman...", powers: "Illusion and allure...",
    relationships: "Occasionally a teacher or ally...", story: "Some family compounds maintain small shrines..."
  },
  {
    name: "The Naga of the Sarpa Kavu", type: "naga", epithet: "Guardian of the serpent grove", teaser: "Worshipped in the untouched groves behind old homes.",
    origin: "Serpent deities believed to inhabit sarpa kavu...", powers: "Protection of the household and land...",
    relationships: "Tended rather than confronted...", story: "The tradition doubles as one of Kerala's oldest conservation practices..."
  }
];

const iconMap = {
  deity: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 27 C6 15 14 6 20 6 C26 6 34 15 34 27"/><circle cx="20" cy="27" r="3"/><path d="M12 27 L12 19 M20 27 L20 15 M28 27 L28 19"/></svg>`,
  sorcerer: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 6 C14 14 12 18 12 24 C12 30 16 34 20 34 C24 34 28 30 28 24 C28 18 26 14 20 6 Z"/><path d="M20 18 C17 22 17 26 20 29 C23 26 23 22 20 18 Z"/></svg>`,
  warrior: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 8 L28 24 M28 8 L12 24"/><path d="M20 24 L20 33 M14 33 L26 33"/></svg>`,
  outlaw: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 18 C8 12 13 8 20 8 C27 8 32 12 32 18 L32 22 C32 24 30 24 30 21 C26 25 14 25 10 21 C10 24 8 24 8 22 Z"/><circle cx="15" cy="16" r="1.3" fill="currentColor" stroke="none"/><circle cx="25" cy="16" r="1.3" fill="currentColor" stroke="none"/></svg>`,
  spirit: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M20 6 C12 14 12 20 16 24 C10 26 10 32 16 34 C20 35 22 32 20 28 C26 30 30 24 26 20 C32 18 30 10 24 12 C26 8 24 5 20 6 Z"/></svg>`,
  naga: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M8 32 C8 26 14 26 14 20 C14 14 8 14 8 8"/><path d="M8 8 L12 8 M8 8 L8 12"/><circle cx="8" cy="6" r="1" fill="currentColor" stroke="none"/></svg>`
};

const charGrid = document.getElementById('charGrid');
characters.forEach(c => {
  const tile = document.createElement('button');
  tile.className = 'char-tile';
  tile.innerHTML = `
    <span class="char-icon" aria-hidden="true">${iconMap[c.type] || ''}</span>
    <span class="epithet">${c.epithet}</span>
    <h3>${c.name}</h3>
    <p class="teaser">${c.teaser}</p>
    <span class="open-label">View full story &rarr;</span>
  `;
  tile.addEventListener('click', () => openModal(c));
  charGrid.appendChild(tile);
});

const modalBackdrop = document.getElementById('modalBackdrop');
const modalContent = document.getElementById('modalContent');
let lastFocusedBeforeModal = null;

function trapFocus(e) {
  if(e.key !== 'Tab') return;
  const focusable = Array.from(modalContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
  if(!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if(e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if(!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}

function openModal(c) {
  lastFocusedBeforeModal = document.activeElement;
  modalContent.innerHTML = `
    <button class="modal-close" id="modalClose" aria-label="Close">&times;</button>
    <span class="epithet">${c.epithet}</span>
    <h3 id="modalCharName">${c.name}</h3>
    <dl>
      <dt>Origin</dt><dd>${c.origin}</dd>
      <dt>Powers</dt><dd>${c.powers}</dd>
      <dt>Relationships</dt><dd>${c.relationships}</dd>
      <dt>Story</dt><dd>${c.story}</dd>
    </dl>
    <button class="listen-btn" id="modalListenBtn" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 5V4L8 9H4z"/><path d="M17 8a5 5 0 010 8"/></svg>
      <span>Listen to this story</span>
    </button>
  `;
  modalContent.setAttribute('aria-labelledby', 'modalCharName');
  modalBackdrop.classList.add('show');
  modalContent.querySelector('#modalClose').addEventListener('click', closeModal);
  const modalListenBtn = modalContent.querySelector('#modalListenBtn');
  modalListenBtn.addEventListener('click', () => {
    toggleListen(`${c.name}. ${c.epithet}. Origin: ${c.origin} Powers: ${c.powers} Relationships: ${c.relationships} Story: ${c.story}`, modalListenBtn);
  });
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', trapFocus);
  const focusable = modalContent.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if(focusable.length) focusable[0].focus();
  announce(`Opened details for ${c.name}.`);
}

function closeModal() {
  modalBackdrop.classList.remove('show');
  document.body.style.overflow = '';
  window.speechSynthesis.cancel();
  document.removeEventListener('keydown', trapFocus);
  if(lastFocusedBeforeModal) lastFocusedBeforeModal.focus();
}
modalBackdrop.addEventListener('click', (e) => { if(e.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && modalBackdrop.classList.contains('show')) closeModal(); });

/* =================== FOLKLORE VAULT DATA =================== */
const vault = [
  {
    heading: "Festivals",
    items: [
      { q: "Onam", a: "A ten-day harvest festival marking the yearly homecoming of King Mahabali..." },
      { q: "Thrissur Pooram", a: "A temple festival famous for rows of caparisoned elephants..." },
      { q: "Theyyam season", a: "Between roughly November and May, North Kerala's Theyyam ritual..." },
      { q: "Vishu", a: "The Malayalam New Year, opened with the Vishukkani..." }
    ]
  },
  {
    heading: "Customs",
    items: [
      { q: "Sarpa Kavu", a: "Small sacred groves kept deliberately wild within family land..." },
      { q: "Kalamezhuthu", a: "Ritual floor drawings made from natural powders..." },
      { q: "Kaikottikali", a: "A women's clap-and-step folk dance performed in a circle..." }
    ]
  },
  {
    heading: "Proverbs",
    items: [
      { q: "\"The crow that boasted of the peacock's feathers\"", a: "A folk phrase used for anyone claiming credit..." },
      { q: "\"Water finds its own level\"", a: "A saying applied to people or situations that inevitably settle..." }
    ]
  },
  {
    heading: "Oral Traditions",
    items: [
      { q: "Vadakkan Pattukal", a: "The Northern Ballads — a cycle of songs about warriors..." },
      { q: "Aithihyamala", a: "A landmark early-20th-century compilation of Kerala's legends..." }
    ]
  }
];

const vaultGroups = document.getElementById('vaultGroups');
vault.forEach(group => {
  const div = document.createElement('div');
  div.className = 'vault-group';
  div.innerHTML = `<h3>${group.heading}</h3>` + group.items.map(it => `
    <details class="vault-item">
      <summary>${it.q}</summary>
      <p>${it.a}</p>
    </details>
  `).join('');
  vaultGroups.appendChild(div);
});

/* =================== CHOOSE YOUR PATH =================== */
const storyTree = {
  start: {
    label: "— Dusk, at the edge of the grove —",
    text: "The sarpa kavu behind the old tharavadu has never been cleared. Tonight, past the tangle of trees, you notice a faint light moving between the trunks — low, steady, unlike a torch. Someone, or something, is waiting.",
    choices: [
      { label: "Step into the grove", next: "approach" },
      { label: "Turn back toward the house", next: "retreat" }
    ]
  },
  approach: {
    label: "— Among the trees —",
    text: "The light resolves into a shape: a coiled form, scales catching what little moonlight reaches this far in. It does not move to strike. It watches, as if deciding whether you understand where you're standing.",
    choices: [
      { label: "Kneel and offer your respect", next: "endBlessed" },
      { label: "Reach for the shape, drawn by curiosity", next: "endMarked" }
    ]
  },
  retreat: {
    label: "— At the veranda steps —",
    text: "You stop yourself before the tree line and turn back. Behind you, the grove falls silent in a way that feels less like relief than acknowledgement — as though your caution has been noted, and approved of.",
    isEnd: true,
    ending: "The Cautious One",
    endingText: "You never learn what watched you that night. But every year after, your household's harvest comes in a little heavier than your neighbours', and no one in your family can quite explain why."
  },
  endBlessed: {
    label: "— The grove accepts you —",
    isEnd: true,
    ending: "Keeper of the Grove",
    endingText: "The coiled shape lowers itself, unhurried, and is gone before you can be sure it was ever fully there. From that night on, you tend the grove without being asked to — clearing no branch, disturbing no stone. Neighbours later say your family's sarpa kavu is the last untouched one for three villages around."
  },
  endMarked: {
    label: "— A hand too quick —",
    isEnd: true,
    ending: "The Marked One",
    endingText: "The shape recoils, and the light in the grove goes out at once. You find your way back to the house in true darkness. In the years after, when travellers pass your family's gate at dusk, they say they feel watched — and they hurry on without knowing quite why."
  }
};

const sceneMap = {
  start: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="150" fill="#17281f"/><circle cx="165" cy="30" r="14" fill="#e3ac3f" opacity="0.85"/><path d="M20 150 L45 70 L70 150 Z" fill="#0e1913"/><path d="M60 150 L90 55 L120 150 Z" fill="#0e1913"/><path d="M100 150 L130 75 L160 150 Z" fill="#0e1913"/><circle cx="95" cy="112" r="4" fill="#e3ac3f"/></svg>`,
  approach: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="150" fill="#17281f"/><circle cx="165" cy="30" r="14" fill="#e3ac3f" opacity="0.85"/><path d="M20 150 L45 70 L70 150 Z" fill="#0e1913"/><path d="M130 150 L160 75 L190 150 Z" fill="#0e1913"/><path d="M65 128 C82 116 84 108 100 108 C116 108 118 116 135 118" stroke="#c9932a" stroke-width="4" fill="none"/><circle cx="100" cy="106" r="3" fill="#f1e7cd"/></svg>`,
  retreat: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="150" fill="#2a1b12"/><rect x="15" y="90" width="55" height="45" fill="#4c110c"/><polygon points="10,90 42,65 75,90" fill="#711d16"/><rect x="35" y="105" width="16" height="30" fill="#e3ac3f" opacity="0.85"/><path d="M120 150 L145 70 L170 150 Z" fill="#17281f"/><path d="M150 150 L175 80 L195 150 Z" fill="#17281f"/></svg>`,
  endBlessed: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="150" fill="#17281f"/><circle cx="100" cy="88" r="48" fill="#e3ac3f" opacity="0.18"/><path d="M58 112 C76 96 78 84 100 84 C122 84 124 96 142 100" stroke="#e3ac3f" stroke-width="5" fill="none"/><circle cx="100" cy="82" r="4" fill="#f1e7cd"/><path d="M20 150 L45 80 L70 150 Z" fill="#0e1913"/><path d="M130 150 L155 80 L180 150 Z" fill="#0e1913"/></svg>`,
  endMarked: `<svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="150" fill="#0e0a06"/><path d="M20 150 L45 70 L70 150 Z" fill="#000000"/><path d="M130 150 L155 70 L180 150 Z" fill="#000000"/><path d="M100 20 L92 60 L104 58 L88 112" stroke="#711d16" stroke-width="3" fill="none"/></svg>`
};

let currentNode = 'start';
const pathText = document.getElementById('path-text');
const pathChoices = document.getElementById('path-choices');
const pathLabel = document.getElementById('pathNodeLabel');
const pathRestart = document.getElementById('path-restart');
const pathListenBtn = document.getElementById('pathListenBtn');
const groveScene = document.getElementById('groveScene');

function getNodeSpeechText(nodeKey) {
  const node = storyTree[nodeKey];
  return node.isEnd
    ? `${node.label}. ${node.endingText} Ending reached: ${node.ending}.`
    : `${node.label}. ${node.text}`;
}

function renderPath(nodeKey) {
  window.speechSynthesis.cancel();
  pathListenBtn.classList.remove('speaking');
  const defaultLabel = pathListenBtn.querySelector('span');
  if(defaultLabel && defaultLabel.dataset.defaultLabel) defaultLabel.textContent = defaultLabel.dataset.defaultLabel;

  const node = storyTree[nodeKey];
  pathLabel.textContent = node.label;
  pathChoices.innerHTML = '';
  groveScene.innerHTML = sceneMap[nodeKey] || sceneMap.start;

  if(node.isEnd) {
    pathText.innerHTML = `${node.endingText} <span class="path-ending-badge">Ending reached: ${node.ending}</span>`;
    pathRestart.style.display = 'inline-block';
    announce(`Ending reached: ${node.ending}.`);
  } else {
    pathText.textContent = node.text;
    pathRestart.style.display = 'none';
    node.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.label;
      btn.addEventListener('click', () => {
        currentNode = choice.next;
        renderPath(currentNode);
      });
      pathChoices.appendChild(btn);
    });
  }
}

pathListenBtn.addEventListener('click', () => {
  toggleListen(getNodeSpeechText(currentNode), pathListenBtn);
});

pathRestart.addEventListener('click', () => {
  currentNode = 'start';
  renderPath(currentNode);
});

renderPath(currentNode);