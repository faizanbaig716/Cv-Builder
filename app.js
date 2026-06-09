/* ===== STATE ===== */
let edu = [], exp = [], skills = [], langs = [], certs = [], projs = [];
let idCounter = 1;
const uid = () => idCounter++;

/* ===== TABS ===== */
function switchTab(name, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + name).classList.add('active');
}

/* ===== HELPERS ===== */
function val(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function formatDesc(text) {
  if (!text) return '';
  return text.split('\n').filter(l => l.trim()).map(line => {
    line = line.trim();
    const isBullet = line.startsWith('•') || line.startsWith('-');
    const content = isBullet ? line.replace(/^[•\-]\s*/, '') : line;
    return `<div class="cv-desc-line">${isBullet ? '<span class="cv-desc-bullet">•</span>' : ''}<span>${content}</span></div>`;
  }).join('');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/* ===== EDUCATION ===== */
function addEdu() {
  edu.push({ id: uid(), degree: '', school: '', year: '', grade: '' });
  renderEduList();
  render();
}

function delEdu(id) {
  edu = edu.filter(e => e.id !== id);
  renderEduList();
  render();
}

function renderEduList() {
  document.getElementById('edu-list').innerHTML = edu.map(e => `
    <div class="card-block">
      <div class="card-block-header">
        <span class="card-block-label">Education entry</span>
        <button class="btn-del" onclick="delEdu(${e.id})" title="Remove">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
      <div class="field"><label>Degree / Qualification</label>
        <input value="${e.degree}" placeholder="BS Computer Science" oninput="edu.find(x=>x.id===${e.id}).degree=this.value;render()">
      </div>
      <div class="field"><label>Institution</label>
        <input value="${e.school}" placeholder="FAST University, Lahore" oninput="edu.find(x=>x.id===${e.id}).school=this.value;render()">
      </div>
      <div class="two-col">
        <div class="field"><label>Year / Period</label>
          <input value="${e.year}" placeholder="2018 – 2022" oninput="edu.find(x=>x.id===${e.id}).year=this.value;render()">
        </div>
        <div class="field"><label>Grade / GPA</label>
          <input value="${e.grade}" placeholder="3.8 / 4.0" oninput="edu.find(x=>x.id===${e.id}).grade=this.value;render()">
        </div>
      </div>
    </div>`).join('');
}

/* ===== EXPERIENCE ===== */
function addExp() {
  exp.push({ id: uid(), role: '', company: '', period: '', desc: '' });
  renderExpList();
  render();
}

function delExp(id) {
  exp = exp.filter(e => e.id !== id);
  renderExpList();
  render();
}

function renderExpList() {
  document.getElementById('exp-list').innerHTML = exp.map(e => `
    <div class="card-block">
      <div class="card-block-header">
        <span class="card-block-label">Experience entry</span>
        <button class="btn-del" onclick="delExp(${e.id})" title="Remove">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
      <div class="field"><label>Job title</label>
        <input value="${e.role}" placeholder="Senior Frontend Developer" oninput="exp.find(x=>x.id===${e.id}).role=this.value;render()">
      </div>
      <div class="field"><label>Company / Organization</label>
        <input value="${e.company}" placeholder="Systems Limited" oninput="exp.find(x=>x.id===${e.id}).company=this.value;render()">
      </div>
      <div class="field"><label>Period</label>
        <input value="${e.period}" placeholder="Jan 2022 – Present" oninput="exp.find(x=>x.id===${e.id}).period=this.value;render()">
      </div>
      <div class="field"><label>Description <span style="font-weight:400;color:#9e9b94">(start lines with • or - for bullets)</span></label>
        <textarea rows="4" placeholder="• Built RESTful APIs using Node.js&#10;• Reduced page load time by 40%&#10;• Led a team of 5 developers" oninput="exp.find(x=>x.id===${e.id}).desc=this.value;render()">${e.desc}</textarea>
      </div>
    </div>`).join('');
}

/* ===== SKILLS ===== */
function addSkill() {
  const inp = document.getElementById('skill-inp');
  const v = inp.value.trim();
  if (v && !skills.includes(v)) { skills.push(v); inp.value = ''; renderSkillTags(); render(); }
}

function removeSkill(s) {
  skills = skills.filter(x => x !== s);
  renderSkillTags();
  render();
}

function renderSkillTags() {
  document.getElementById('skill-tags').innerHTML = skills.map(s =>
    `<div class="tag">${s}<button onclick="removeSkill(${JSON.stringify(s)})">×</button></div>`).join('');
}

function addLang() {
  const inp = document.getElementById('lang-inp');
  const v = inp.value.trim();
  if (v && !langs.includes(v)) { langs.push(v); inp.value = ''; renderLangTags(); render(); }
}

function removeLang(l) {
  langs = langs.filter(x => x !== l);
  renderLangTags();
  render();
}

function renderLangTags() {
  document.getElementById('lang-tags').innerHTML = langs.map(l =>
    `<div class="tag">${l}<button onclick="removeLang(${JSON.stringify(l)})">×</button></div>`).join('');
}

/* ===== CERTIFICATIONS ===== */
function addCert() {
  certs.push({ id: uid(), name: '', org: '', year: '' });
  renderCertList();
  render();
}

function delCert(id) {
  certs = certs.filter(c => c.id !== id);
  renderCertList();
  render();
}

function renderCertList() {
  document.getElementById('cert-list').innerHTML = certs.map(c => `
    <div class="card-block">
      <div class="card-block-header">
        <span class="card-block-label">Certification</span>
        <button class="btn-del" onclick="delCert(${c.id})" title="Remove">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
      <div class="field"><label>Certification name</label>
        <input value="${c.name}" placeholder="AWS Certified Solutions Architect" oninput="certs.find(x=>x.id===${c.id}).name=this.value;render()">
      </div>
      <div class="two-col">
        <div class="field"><label>Issuing organization</label>
          <input value="${c.org}" placeholder="Amazon Web Services" oninput="certs.find(x=>x.id===${c.id}).org=this.value;render()">
        </div>
        <div class="field"><label>Year</label>
          <input value="${c.year}" placeholder="2023" oninput="certs.find(x=>x.id===${c.id}).year=this.value;render()">
        </div>
      </div>
    </div>`).join('');
}

/* ===== PROJECTS ===== */
function addProj() {
  projs.push({ id: uid(), name: '', tech: '', desc: '' });
  renderProjList();
  render();
}

function delProj(id) {
  projs = projs.filter(p => p.id !== id);
  renderProjList();
  render();
}

function renderProjList() {
  document.getElementById('proj-list').innerHTML = projs.map(p => `
    <div class="card-block">
      <div class="card-block-header">
        <span class="card-block-label">Project</span>
        <button class="btn-del" onclick="delProj(${p.id})" title="Remove">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
        </button>
      </div>
      <div class="field"><label>Project name</label>
        <input value="${p.name}" placeholder="E-commerce Platform" oninput="projs.find(x=>x.id===${p.id}).name=this.value;render()">
      </div>
      <div class="field"><label>Tech stack</label>
        <input value="${p.tech}" placeholder="React, Node.js, MongoDB, AWS" oninput="projs.find(x=>x.id===${p.id}).tech=this.value;render()">
      </div>
      <div class="field"><label>Description</label>
        <textarea rows="3" placeholder="Brief description of what you built and your role..." oninput="projs.find(x=>x.id===${p.id}).desc=this.value;render()">${p.desc}</textarea>
      </div>
    </div>`).join('');
}

/* ===== RENDER PREVIEW ===== */
function render() {
  const name    = val('p-name');
  const title   = val('p-title');
  const email   = val('p-email');
  const phone   = val('p-phone');
  const loc     = val('p-loc');
  const link    = val('p-link');
  const summary = val('p-summary');

  const hasAny = name || title || email || phone || loc || link || summary ||
    edu.some(e => e.degree || e.school) ||
    exp.some(e => e.role || e.company) ||
    skills.length || langs.length || certs.length || projs.length;

  if (!hasAny) {
    document.getElementById('cv-preview').innerHTML = `
      <div class="cv-empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>
        <p>Start filling in your details<br>to see a live preview here</p>
      </div>`;
    return;
  }

  const contacts = [
    email ? `<span>✉ ${email}</span>` : '',
    phone ? `<span>✆ ${phone}</span>` : '',
    loc   ? `<span>⌖ ${loc}</span>`   : '',
    link  ? `<span>⬡ ${link}</span>`  : '',
  ].filter(Boolean).join('');

  let html = `<div class="cv-wrap">
    <div class="cv-top">
      <div class="cv-name">${name || 'Your Name'}</div>
      ${title ? `<div class="cv-job-title">${title}</div>` : ''}
      ${contacts ? `<div class="cv-contacts">${contacts}</div>` : ''}
    </div>`;

  if (summary) {
    html += `<div class="cv-section">
      <div class="cv-section-title">Professional summary</div>
      <div class="cv-summary-text">${summary}</div>
    </div>`;
  }

  const validExp = exp.filter(e => e.role || e.company);
  if (validExp.length) {
    html += `<div class="cv-section"><div class="cv-section-title">Work experience</div>`;
    validExp.forEach(e => {
      html += `<div class="cv-item">
        <div class="cv-row">
          <div class="cv-item-name">${e.role || 'Position'}</div>
          ${e.period ? `<div class="cv-item-date">${e.period}</div>` : ''}
        </div>
        ${e.company ? `<div class="cv-item-sub">${e.company}</div>` : ''}
        ${e.desc ? `<div class="cv-desc">${formatDesc(e.desc)}</div>` : ''}
      </div>`;
    });
    html += `</div>`;
  }

  const validEdu = edu.filter(e => e.degree || e.school);
  if (validEdu.length) {
    html += `<div class="cv-section"><div class="cv-section-title">Education</div>`;
    validEdu.forEach(e => {
      html += `<div class="cv-item">
        <div class="cv-row">
          <div class="cv-item-name">${e.degree || 'Qualification'}</div>
          ${e.year ? `<div class="cv-item-date">${e.year}</div>` : ''}
        </div>
        <div class="cv-row">
          ${e.school ? `<div class="cv-item-sub">${e.school}</div>` : '<div></div>'}
          ${e.grade ? `<div class="cv-item-grade">${e.grade}</div>` : ''}
        </div>
      </div>`;
    });
    html += `</div>`;
  }

  if (skills.length) {
    html += `<div class="cv-section">
      <div class="cv-section-title">Technical skills</div>
      <div class="cv-skills-wrap">${skills.map(s => `<span class="cv-skill">${s}</span>`).join('')}</div>
    </div>`;
  }

  if (langs.length) {
    html += `<div class="cv-section">
      <div class="cv-section-title">Languages</div>
      <div class="cv-skills-wrap">${langs.map(l => `<span class="cv-skill">${l}</span>`).join('')}</div>
    </div>`;
  }

  const validCerts = certs.filter(c => c.name);
  if (validCerts.length) {
    html += `<div class="cv-section"><div class="cv-section-title">Certifications</div>`;
    validCerts.forEach(c => {
      html += `<div class="cv-item">
        <div class="cv-row">
          <div class="cv-item-name">${c.name}</div>
          ${c.year ? `<div class="cv-item-date">${c.year}</div>` : ''}
        </div>
        ${c.org ? `<div class="cv-item-sub">${c.org}</div>` : ''}
      </div>`;
    });
    html += `</div>`;
  }

  const validProjs = projs.filter(p => p.name);
  if (validProjs.length) {
    html += `<div class="cv-section"><div class="cv-section-title">Projects</div>`;
    validProjs.forEach(p => {
      html += `<div class="cv-item">
        <div class="cv-item-name">${p.name}</div>
        ${p.tech ? `<div class="cv-item-sub">${p.tech}</div>` : ''}
        ${p.desc ? `<div class="cv-desc"><div class="cv-desc-line"><span>${p.desc}</span></div></div>` : ''}
      </div>`;
    });
    html += `</div>`;
  }

  html += `</div>`;
  document.getElementById('cv-preview').innerHTML = html;
}

/* ===== DOWNLOAD PDF ===== */
function downloadPDF() {
  const cvEl = document.getElementById('cv-preview');
  const content = cvEl.querySelector('.cv-wrap');

  if (!content) {
    alert('Please fill in your details before downloading.');
    return;
  }

  const name = val('p-name') || 'My_CV';
  const filename = name.replace(/\s+/g, '_') + '_CV.pdf';

  const opt = {
    margin: [12, 15, 12, 15],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2.5, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Clone for export (avoid preview panel clips)
  const clone = content.cloneNode(true);
  clone.style.cssText = 'font-family: Georgia, serif; font-size: 11px; line-height: 1.55; color: #1a1917; width: 170mm; padding: 0;';

  html2pdf().set(opt).from(clone).save().then(() => {
    showToast('✓ PDF downloaded successfully!');
  }).catch(() => {
    showToast('Download failed — please try again.');
  });
}

/* ===== INIT ===== */
render();
