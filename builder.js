/* ============================================================
   PROCV BUILDER.JS — COMPLETE, CLEAN, ZERO GLITCH
   ============================================================ */

/* ===== STATE ===== */
let tpl = 'modern';
let photo = null;
let edu = [], exp = [], skills = [], langs = [], certs = [], projs = [];
let _id = 1;
const uid = () => _id++;

/* ===== INIT ===== */
window.addEventListener('DOMContentLoaded', () => {
  const p = new URLSearchParams(window.location.search).get('t');
  if (['modern','classic','minimal','creative'].includes(p)) setTpl(p);
  else updateTplUI();
  render();
  calcATS();
});

/* ===== TABS ===== */
function goTab(name, btn) {
  document.querySelectorAll('.btab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.bpane').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const pane = document.getElementById('bp-' + name);
  if (pane) pane.classList.add('active');
}

/* ===== TEMPLATE ===== */
function setTpl(t) {
  tpl = t;
  document.querySelectorAll('.tmc').forEach(c => c.classList.remove('active'));
  const el = document.getElementById('tmc-' + t);
  if (el) el.classList.add('active');
  document.getElementById('tpl-name').textContent = t.charAt(0).toUpperCase() + t.slice(1);
  document.getElementById('tpl-modal').style.display = 'none';
  render();
}

function updateTplUI() {
  document.querySelectorAll('.tmc').forEach(c => c.classList.remove('active'));
  const el = document.getElementById('tmc-' + tpl);
  if (el) el.classList.add('active');
  document.getElementById('tpl-name').textContent = tpl.charAt(0).toUpperCase() + tpl.slice(1);
}

function openTplModal() {
  updateTplUI();
  document.getElementById('tpl-modal').style.display = 'flex';
}

function closeTplModal(e) {
  if (e.target === document.getElementById('tpl-modal'))
    document.getElementById('tpl-modal').style.display = 'none';
}

function toggleATS() {
  document.getElementById('ats-panel').classList.toggle('open');
}

/* ===== PHOTO ===== */
function handlePhoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { toast('Photo must be under 5MB'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    photo = e.target.result;
    const img = document.getElementById('photo-img');
    img.src = photo;
    img.style.display = 'block';
    document.getElementById('photo-ph').style.display = 'none';
    document.getElementById('photo-rm').style.display = 'inline-block';
    render();
  };
  reader.readAsDataURL(file);
}

function removePhoto() {
  photo = null;
  document.getElementById('photo-img').style.display = 'none';
  document.getElementById('photo-img').src = '';
  document.getElementById('photo-file').value = '';
  document.getElementById('photo-ph').style.display = 'flex';
  document.getElementById('photo-rm').style.display = 'none';
  render();
}

/* ===== HELPERS ===== */
function gv(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function fmtDesc(text) {
  if (!text) return '';
  return text.split('\n').filter(l => l.trim()).map(line => {
    line = line.trim();
    const bull = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
    const content = bull ? line.replace(/^[•\-\*]\s*/, '') : line;
    return `<div class="cv-dline">${bull ? '<span class="cv-bullet">•</span>' : ''}<span>${content}</span></div>`;
  }).join('');
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* ===== EDUCATION ===== */
function addEdu() {
  edu.push({ id: uid(), degree: '', school: '', year: '', grade: '' });
  renderEduList(); render();
}
function delEdu(id) { edu = edu.filter(e => e.id !== id); renderEduList(); render(); }
function renderEduList() {
  document.getElementById('edu-list').innerHTML = edu.map(e => `
    <div class="ecard">
      <div class="ecard-head">
        <span class="ecard-title">🎓 ${e.degree || 'New education entry'}</span>
        <button class="btn-del" onclick="delEdu(${e.id})" title="Delete">✕</button>
      </div>
      <div class="ecard-body">
        <div class="ec-full">
          <label>Degree / Qualification</label>
          <input value="${esc(e.degree)}" placeholder="e.g. BS Computer Science, MBBS, BA English..." oninput="edu.find(x=>x.id===${e.id}).degree=this.value;renderEduList();render()">
        </div>
        <div class="ec-full">
          <label>Institution / University / School</label>
          <input value="${esc(e.school)}" placeholder="e.g. University of Punjab, Lahore" oninput="edu.find(x=>x.id===${e.id}).school=this.value;render()">
        </div>
        <div>
          <label>Year / Period</label>
          <input value="${esc(e.year)}" placeholder="2020 – 2024" oninput="edu.find(x=>x.id===${e.id}).year=this.value;render()">
        </div>
        <div>
          <label>Grade / GPA (optional)</label>
          <input value="${esc(e.grade)}" placeholder="3.8 / 4.0 or A+" oninput="edu.find(x=>x.id===${e.id}).grade=this.value;render()">
        </div>
      </div>
    </div>`).join('');
}

/* ===== EXPERIENCE ===== */
function addExp() {
  exp.push({ id: uid(), role: '', company: '', period: '', desc: '' });
  renderExpList(); render();
}
function delExp(id) { exp = exp.filter(e => e.id !== id); renderExpList(); render(); }
function renderExpList() {
  document.getElementById('exp-list').innerHTML = exp.map(e => `
    <div class="ecard">
      <div class="ecard-head">
        <span class="ecard-title">💼 ${e.role || 'New experience entry'}</span>
        <button class="btn-del" onclick="delExp(${e.id})" title="Delete">✕</button>
      </div>
      <div class="ecard-body">
        <div class="ec-full">
          <label>Job title / Position</label>
          <input value="${esc(e.role)}" placeholder="e.g. Sales Manager, Teacher, Nurse, Designer..." oninput="exp.find(x=>x.id===${e.id}).role=this.value;renderExpList();render();calcATS()">
        </div>
        <div class="ec-full">
          <label>Employer / Organization / Company</label>
          <input value="${esc(e.company)}" placeholder="e.g. Company name, School, Hospital, NGO..." oninput="exp.find(x=>x.id===${e.id}).company=this.value;render()">
        </div>
        <div class="ec-full">
          <label>Period</label>
          <input value="${esc(e.period)}" placeholder="e.g. March 2022 – Present" oninput="exp.find(x=>x.id===${e.id}).period=this.value;render()">
        </div>
        <div class="ec-full">
          <label>Responsibilities & achievements <span style="font-weight:400;color:#9aa0a6">(start lines with • for bullet points)</span></label>
          <textarea rows="5" placeholder="• Describe your key responsibilities&#10;• List achievements and results&#10;• Quantify impact where possible (e.g. increased sales by 20%)&#10;• Mention tools, methods, or people managed" oninput="exp.find(x=>x.id===${e.id}).desc=this.value;render();calcATS()">${esc(e.desc)}</textarea>
        </div>
      </div>
    </div>`).join('');
}

/* ===== SKILLS ===== */
function addSkill() {
  const inp = document.getElementById('skill-inp');
  const v = inp.value.trim();
  if (v && !skills.includes(v)) { skills.push(v); inp.value = ''; renderSkillTags(); render(); calcATS(); }
  else if (skills.includes(v)) { toast('Skill already added!'); inp.value = ''; }
}
function qs(s) { if (!skills.includes(s)) { skills.push(s); renderSkillTags(); render(); calcATS(); } }
function removeSkill(s) { skills = skills.filter(x => x !== s); renderSkillTags(); render(); calcATS(); }
function renderSkillTags() {
  document.getElementById('skill-tags').innerHTML = skills.map(s =>
    `<div class="stag">${esc(s)}<button onclick="removeSkill(${JSON.stringify(s)})">×</button></div>`).join('');
}

/* ===== LANGUAGES ===== */
function addLang() {
  const inp = document.getElementById('lang-inp');
  const v = inp.value.trim();
  if (v && !langs.includes(v)) { langs.push(v); inp.value = ''; renderLangTags(); render(); }
  else if (langs.includes(v)) { toast('Language already added!'); inp.value = ''; }
}
function ql(l) { if (!langs.includes(l)) { langs.push(l); renderLangTags(); render(); } }
function removeLang(l) { langs = langs.filter(x => x !== l); renderLangTags(); render(); }
function renderLangTags() {
  document.getElementById('lang-tags').innerHTML = langs.map(l =>
    `<div class="stag">${esc(l)}<button onclick="removeLang(${JSON.stringify(l)})">×</button></div>`).join('');
}

/* ===== CERTIFICATIONS ===== */
function addCert() {
  certs.push({ id: uid(), name: '', org: '', year: '' });
  renderCertList(); render();
}
function delCert(id) { certs = certs.filter(c => c.id !== id); renderCertList(); render(); }
function renderCertList() {
  document.getElementById('cert-list').innerHTML = certs.map(c => `
    <div class="ecard">
      <div class="ecard-head">
        <span class="ecard-title">🏅 ${c.name || 'New certification'}</span>
        <button class="btn-del" onclick="delCert(${c.id})" title="Delete">✕</button>
      </div>
      <div class="ecard-body">
        <div class="ec-full">
          <label>Certification name</label>
          <input value="${esc(c.name)}" placeholder="e.g. AWS Certified, Google Analytics, PMP..." oninput="certs.find(x=>x.id===${c.id}).name=this.value;renderCertList();render()">
        </div>
        <div>
          <label>Issuing organization</label>
          <input value="${esc(c.org)}" placeholder="e.g. Amazon, Google, PMI..." oninput="certs.find(x=>x.id===${c.id}).org=this.value;render()">
        </div>
        <div>
          <label>Year</label>
          <input value="${esc(c.year)}" placeholder="e.g. 2024" oninput="certs.find(x=>x.id===${c.id}).year=this.value;render()">
        </div>
      </div>
    </div>`).join('');
}

/* ===== PROJECTS ===== */
function addProj() {
  projs.push({ id: uid(), name: '', tech: '', desc: '' });
  renderProjList(); render();
}
function delProj(id) { projs = projs.filter(p => p.id !== id); renderProjList(); render(); }
function renderProjList() {
  document.getElementById('proj-list').innerHTML = projs.map(p => `
    <div class="ecard">
      <div class="ecard-head">
        <span class="ecard-title">💻 ${p.name || 'New project'}</span>
        <button class="btn-del" onclick="delProj(${p.id})" title="Delete">✕</button>
      </div>
      <div class="ecard-body">
        <div class="ec-full">
          <label>Project name</label>
          <input value="${esc(p.name)}" placeholder="e.g. Hospital Management System, Sales Dashboard..." oninput="projs.find(x=>x.id===${p.id}).name=this.value;renderProjList();render()">
        </div>
        <div class="ec-full">
          <label>Tools / Technologies used</label>
          <input value="${esc(p.tech)}" placeholder="e.g. Excel, Python, React, Figma..." oninput="projs.find(x=>x.id===${p.id}).tech=this.value;render()">
        </div>
        <div class="ec-full">
          <label>Description</label>
          <textarea rows="3" placeholder="Brief description of what you built, your role, and the outcome..." oninput="projs.find(x=>x.id===${p.id}).desc=this.value;render()">${esc(p.desc)}</textarea>
        </div>
      </div>
    </div>`).join('');
}

/* ===== ESCAPE HTML ===== */
function esc(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ===== ATS SCORE ===== */
function calcATS() {
  const name    = gv('p-name');
  const email   = gv('p-email');
  const phone   = gv('p-phone');
  const summary = gv('p-summary');
  const title   = gv('p-title');

  const checks = [];
  let score = 0;

  /* Contact info */
  if (name)  { score += 8;  checks.push({ t: 'p', msg: 'Full name present' }); }
  else          checks.push({ t: 'f', msg: 'Full name is missing' });
  if (email) { score += 7;  checks.push({ t: 'p', msg: 'Email address present' }); }
  else          checks.push({ t: 'f', msg: 'Email address is missing' });
  if (phone) { score += 5;  checks.push({ t: 'p', msg: 'Phone number present' }); }
  else          checks.push({ t: 'w', msg: 'Phone number not added' });
  if (title) { score += 8;  checks.push({ t: 'p', msg: 'Job title present' }); }
  else          checks.push({ t: 'w', msg: 'Job title missing' });

  /* Summary */
  if (summary.length >= 60)      { score += 15; checks.push({ t: 'p', msg: 'Professional summary added ✓' }); }
  else if (summary.length >= 10) { score += 7;  checks.push({ t: 'w', msg: 'Summary is too short (aim for 60+ chars)' }); }
  else                             checks.push({ t: 'f', msg: 'No summary — add one for higher ATS score' });

  /* Experience */
  const vExp = exp.filter(e => e.role && e.company);
  if (vExp.length >= 2)      { score += 20; checks.push({ t: 'p', msg: `${vExp.length} work experiences listed` }); }
  else if (vExp.length === 1){ score += 12; checks.push({ t: 'w', msg: '1 experience listed (add more if possible)' }); }
  else                         checks.push({ t: 'f', msg: 'No work experience added' });

  /* Bullet points */
  const hasBullets = exp.some(e => e.desc && (e.desc.includes('•') || e.desc.includes('-') || e.desc.includes('*')));
  if (hasBullets && vExp.length) { score += 7; checks.push({ t: 'p', msg: 'Bullet points used in experience' }); }
  else if (vExp.length)           checks.push({ t: 'w', msg: 'Use bullet points in experience descriptions' });

  /* Education */
  const vEdu = edu.filter(e => e.degree || e.school);
  if (vEdu.length) { score += 10; checks.push({ t: 'p', msg: 'Education listed' }); }
  else               checks.push({ t: 'w', msg: 'No education added' });

  /* Skills */
  if (skills.length >= 5)      { score += 15; checks.push({ t: 'p', msg: `${skills.length} skills listed (excellent!)` }); }
  else if (skills.length >= 2) { score += 7;  checks.push({ t: 'w', msg: `${skills.length} skills listed (aim for 5+)` }); }
  else                           checks.push({ t: 'f', msg: 'Add at least 5 relevant skills' });

  /* Certifications bonus */
  if (certs.filter(c => c.name).length) { score += 5; checks.push({ t: 'p', msg: 'Certifications listed' }); }

  score = Math.min(100, Math.max(0, score));

  /* Mini pill */
  const circ = 88;
  const fill = (score / 100) * circ;
  const ring = document.getElementById('ats-ring');
  if (ring) {
    ring.setAttribute('stroke-dasharray', `${fill} ${circ}`);
    ring.setAttribute('stroke', score >= 70 ? '#4ade80' : score >= 45 ? '#fbbf24' : '#f87171');
  }
  const numEl = document.getElementById('ats-num');
  const subEl = document.getElementById('ats-sub');
  if (numEl) numEl.textContent = score;
  if (subEl) subEl.textContent = score >= 80 ? 'Excellent!' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs work';

  /* Panel donut */
  const donut = document.getElementById('ats-donut-ring');
  if (donut) {
    const dc = 251;
    donut.setAttribute('stroke-dasharray', `${(score / 100) * dc} ${dc}`);
    donut.setAttribute('stroke', score >= 70 ? '#188038' : score >= 45 ? '#ea8600' : '#d93025');
  }
  const bigEl = document.getElementById('ats-big');
  if (bigEl) bigEl.textContent = score;
  const ratingEl = document.getElementById('ats-rating');
  if (ratingEl) ratingEl.textContent =
    score >= 80 ? '🟢 Excellent — ATS Ready!' :
    score >= 60 ? '🟡 Good — small improvements needed' :
    score >= 40 ? '🟠 Fair — add more content' :
    '🔴 Needs work — fill in more sections';

  /* Checklist */
  const listEl = document.getElementById('ats-list');
  if (listEl) {
    listEl.innerHTML = '<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9aa0a6;margin-bottom:6px">Checklist</div>' +
      checks.map(c => `<div class="ats-item ${c.t}"><span>${c.t==='p'?'✓':c.t==='w'?'⚠':'✗'}</span><span>${c.msg}</span></div>`).join('');
  }

  /* Tips */
  const tips = [];
  if (!summary)            tips.push('💡 Add a professional summary to boost your score significantly');
  if (skills.length < 5)  tips.push('💡 Add at least 5 skills relevant to your target job');
  if (!hasBullets && vExp.length) tips.push('💡 Use bullet points (start lines with •) to list your achievements clearly');
  if (!vExp.length)        tips.push('💡 Add work experience — include internships, part-time or volunteer work');
  if (!vEdu.length)        tips.push('💡 Add your education details');
  if (!certs.length)       tips.push('💡 Adding certifications can improve your ATS score and stand out');

  const tipsEl = document.getElementById('ats-tips');
  if (tipsEl) {
    tipsEl.innerHTML = tips.length
      ? '<div class="ats-tips-title">How to improve</div>' + tips.map(t => `<div class="ats-tip">${t}</div>`).join('')
      : '';
  }
}

/* ===== RENDER PREVIEW ===== */
function render() {
  const name    = gv('p-name');
  const title   = gv('p-title');
  const email   = gv('p-email');
  const phone   = gv('p-phone');
  const loc     = gv('p-loc');
  const link    = gv('p-link');
  const summary = gv('p-summary');

  const hasContent = name || email || exp.length || edu.length || skills.length || summary;
  const page = document.getElementById('cv-page');

  if (!hasContent) {
    page.className = 'cv-page';
    page.innerHTML = `
      <div class="cv-empty">
        <div class="cv-empty-icon">📄</div>
        <h3>Your CV preview will appear here</h3>
        <p>Start filling in your details on the left and watch your professional CV build in real-time.</p>
      </div>`;
    return;
  }

  page.className = `cv-page tpl-${tpl}`;

  const contacts = [
    email ? `✉ ${email}` : '',
    phone ? `✆ ${phone}` : '',
    loc   ? `⌖ ${loc}`   : '',
    link  ? `⬡ ${link}`  : ''
  ].filter(Boolean);

  const contactsHTML = contacts.map(c => `<span>${c}</span>`).join('');
  const photoHTML = photo ? `<img class="cv-photo" src="${photo}" alt="Profile">` : '';

  let html = '';

  /* --- Header --- */
  if (tpl === 'modern') {
    html += `<div class="cv-top">${photoHTML}<div style="flex:1"><div class="cv-name">${name||'Your Name'}</div>${title?`<div class="cv-role">${title}</div>`:''}<div class="cv-contacts">${contactsHTML}</div></div></div>`;
  } else if (tpl === 'classic') {
    html += `<div class="cv-top">${photoHTML}<div class="cv-name">${name||'Your Name'}</div>${title?`<div class="cv-role">${title}</div>`:''}<div class="cv-contacts">${contactsHTML}</div></div>`;
  } else if (tpl === 'minimal') {
    html += `<div class="cv-top">${photoHTML}<div class="cv-name">${name||'Your Name'}</div>${title?`<div class="cv-role">${title}</div>`:''}<div class="cv-contacts">${contactsHTML}</div></div>`;
  } else if (tpl === 'creative') {
    html += `<div class="cv-top">${photoHTML}<div><div class="cv-name">${name||'Your Name'}</div>${title?`<div class="cv-role">${title}</div>`:''}<div class="cv-contacts">${contactsHTML}</div></div></div>`;
  }

  /* --- Summary --- */
  if (summary) {
    html += `<div class="cv-sec-title">Professional Summary</div><div class="cv-summary">${summary}</div>`;
  }

  /* --- Experience --- */
  const vExp = exp.filter(e => e.role || e.company);
  if (vExp.length) {
    html += `<div class="cv-sec-title">Work Experience</div>`;
    vExp.forEach(e => {
      html += `<div class="cv-item">
        <div class="cv-row">
          <div class="cv-iname">${e.role||'Position'}</div>
          ${e.period ? `<div class="cv-idate">${e.period}</div>` : ''}
        </div>
        ${e.company ? `<div class="cv-isub">${e.company}</div>` : ''}
        ${e.desc ? `<div class="cv-desc">${fmtDesc(e.desc)}</div>` : ''}
      </div>`;
    });
  }

  /* --- Education --- */
  const vEdu = edu.filter(e => e.degree || e.school);
  if (vEdu.length) {
    html += `<div class="cv-sec-title">Education</div>`;
    vEdu.forEach(e => {
      html += `<div class="cv-item">
        <div class="cv-row">
          <div class="cv-iname">${e.degree||'Qualification'}</div>
          ${e.year ? `<div class="cv-idate">${e.year}</div>` : ''}
        </div>
        <div class="cv-row" style="margin-top:1px">
          ${e.school ? `<div class="cv-isub">${e.school}</div>` : '<div></div>'}
          ${e.grade  ? `<div class="cv-idate">${e.grade}</div>` : ''}
        </div>
      </div>`;
    });
  }

  /* --- Skills --- */
  if (skills.length) {
    html += `<div class="cv-sec-title">Skills</div><div class="cv-chips">${skills.map(s=>`<span class="cv-chip">${s}</span>`).join('')}</div>`;
  }

  /* --- Languages --- */
  if (langs.length) {
    html += `<div class="cv-sec-title">Languages</div><div class="cv-chips">${langs.map(l=>`<span class="cv-chip">${l}</span>`).join('')}</div>`;
  }

  /* --- Certifications --- */
  const vCerts = certs.filter(c => c.name);
  if (vCerts.length) {
    html += `<div class="cv-sec-title">Certifications</div>`;
    vCerts.forEach(c => {
      html += `<div class="cv-item">
        <div class="cv-row">
          <div class="cv-iname">${c.name}</div>
          ${c.year ? `<div class="cv-idate">${c.year}</div>` : ''}
        </div>
        ${c.org ? `<div class="cv-isub">${c.org}</div>` : ''}
      </div>`;
    });
  }

  /* --- Projects --- */
  const vProjs = projs.filter(p => p.name);
  if (vProjs.length) {
    html += `<div class="cv-sec-title">Projects</div>`;
    vProjs.forEach(p => {
      html += `<div class="cv-item">
        <div class="cv-iname">${p.name}</div>
        ${p.tech ? `<div class="cv-isub">${p.tech}</div>` : ''}
        ${p.desc ? `<div class="cv-desc"><div class="cv-dline"><span>${p.desc}</span></div></div>` : ''}
      </div>`;
    });
  }

  page.innerHTML = html;
}

/* ===== DOWNLOAD PDF ===== */
function downloadPDF() {
  const page = document.getElementById('cv-page');
  if (page.querySelector('.cv-empty')) {
    toast('⚠ Please add your details first!');
    return;
  }

  const name = gv('p-name') || 'My_CV';
  const filename = name.replace(/\s+/g, '_') + `_${tpl}.pdf`;

  /* Build a clean off-screen clone */
  const holder = document.createElement('div');
  holder.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:#fff;padding:0;margin:0';
  document.body.appendChild(holder);

  /* Clone the cv-page element exactly */
  const clone = page.cloneNode(true);
  clone.style.cssText = [
    'width:794px',
    'min-height:auto',
    'padding:44px 52px',
    'box-shadow:none',
    'border-radius:0',
    'margin:0',
    'background:#fff',
    'font-family:Georgia,serif',
    'font-size:11.5px',
    'line-height:1.55',
    'color:#1a1a1a'
  ].join(';');
  holder.appendChild(clone);

  /* Inline all CSS from stylesheets */
  let cssText = '';
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      Array.from(sheet.cssRules || []).forEach(rule => { cssText += rule.cssText + '\n'; });
    } catch(e) {}
  });
  const styleTag = document.createElement('style');
  styleTag.textContent = cssText;
  holder.insertBefore(styleTag, clone);

  /* Disable download button */
  const dlBtns = document.querySelectorAll('#dl-btn, .btn-dl-final');
  dlBtns.forEach(b => { b._orig = b.innerHTML; b.innerHTML = '⏳ Generating...'; b.disabled = true; });

  const opt = {
    margin: [8, 8, 8, 8],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 794
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(holder).save()
    .then(() => {
      document.body.removeChild(holder);
      dlBtns.forEach(b => { b.innerHTML = b._orig; b.disabled = false; });
      toast('✅ PDF downloaded! Check your Downloads folder.');
    })
    .catch(err => {
      document.body.removeChild(holder);
      dlBtns.forEach(b => { b.innerHTML = b._orig; b.disabled = false; });
      toast('⚠ Download failed. Please try again.');
      console.error('PDF error:', err);
    });
}
