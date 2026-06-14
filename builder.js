/* ============================================================
   PROCV BUILDER.JS — PDF FIX: builds from fresh HTML string
   ============================================================ */

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
  render(); calcATS();
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

function openTplModal() { updateTplUI(); document.getElementById('tpl-modal').style.display = 'flex'; }
function closeTplModal(e) { if (e.target === document.getElementById('tpl-modal')) document.getElementById('tpl-modal').style.display = 'none'; }
function toggleATS() { document.getElementById('ats-panel').classList.toggle('open'); }

/* ===== PHOTO ===== */
function handlePhoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { toast('Photo must be under 5MB'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    photo = e.target.result;
    const img = document.getElementById('photo-img');
    img.src = photo; img.style.display = 'block';
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
function gv(id) { const el = document.getElementById(id); return el ? el.value.trim() : ''; }

function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtDesc(text) {
  if (!text) return '';
  return text.split('\n').filter(l => l.trim()).map(line => {
    line = line.trim();
    const bull = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
    const content = bull ? line.replace(/^[•\-\*]\s*/, '') : line;
    return '<div class="cv-dline">' + (bull ? '<span class="cv-bullet">•</span>' : '') + '<span>' + content + '</span></div>';
  }).join('');
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

/* ===== EDUCATION ===== */
function addEdu() { edu.push({ id: uid(), degree:'', school:'', year:'', grade:'' }); renderEduList(); render(); }
function delEdu(id) { edu = edu.filter(e => e.id !== id); renderEduList(); render(); }
function renderEduList() {
  document.getElementById('edu-list').innerHTML = edu.map(e => `
    <div class="ecard">
      <div class="ecard-head"><span class="ecard-title">🎓 ${e.degree || 'New education entry'}</span><button class="btn-del" onclick="delEdu(${e.id})">✕</button></div>
      <div class="ecard-body">
        <div class="ec-full"><label>Degree / Qualification</label><input value="${esc(e.degree)}" placeholder="e.g. BS Computer Science, MBBS, BA English..." oninput="edu.find(x=>x.id===${e.id}).degree=this.value;renderEduList();render()"></div>
        <div class="ec-full"><label>Institution / University</label><input value="${esc(e.school)}" placeholder="e.g. University of Punjab, Lahore" oninput="edu.find(x=>x.id===${e.id}).school=this.value;render()"></div>
        <div><label>Year / Period</label><input value="${esc(e.year)}" placeholder="2020 – 2024" oninput="edu.find(x=>x.id===${e.id}).year=this.value;render()"></div>
        <div><label>Grade / GPA</label><input value="${esc(e.grade)}" placeholder="3.8 / 4.0" oninput="edu.find(x=>x.id===${e.id}).grade=this.value;render()"></div>
      </div>
    </div>`).join('');
}

/* ===== EXPERIENCE ===== */
function addExp() { exp.push({ id: uid(), role:'', company:'', period:'', desc:'' }); renderExpList(); render(); }
function delExp(id) { exp = exp.filter(e => e.id !== id); renderExpList(); render(); }
function renderExpList() {
  document.getElementById('exp-list').innerHTML = exp.map(e => `
    <div class="ecard">
      <div class="ecard-head"><span class="ecard-title">💼 ${e.role || 'New experience entry'}</span><button class="btn-del" onclick="delExp(${e.id})">✕</button></div>
      <div class="ecard-body">
        <div class="ec-full"><label>Job title / Position</label><input value="${esc(e.role)}" placeholder="e.g. Sales Manager, Teacher, Nurse, Designer..." oninput="exp.find(x=>x.id===${e.id}).role=this.value;renderExpList();render();calcATS()"></div>
        <div class="ec-full"><label>Employer / Organization</label><input value="${esc(e.company)}" placeholder="e.g. Company name, School, Hospital..." oninput="exp.find(x=>x.id===${e.id}).company=this.value;render()"></div>
        <div class="ec-full"><label>Period</label><input value="${esc(e.period)}" placeholder="e.g. March 2022 – Present" oninput="exp.find(x=>x.id===${e.id}).period=this.value;render()"></div>
        <div class="ec-full"><label>Responsibilities & achievements <span style="font-weight:400;color:#9aa0a6">(start lines with • for bullets)</span></label>
          <textarea rows="5" placeholder="• Describe your key responsibilities&#10;• List achievements and results&#10;• Quantify impact where possible" oninput="exp.find(x=>x.id===${e.id}).desc=this.value;render();calcATS()">${esc(e.desc)}</textarea>
        </div>
      </div>
    </div>`).join('');
}

/* ===== SKILLS ===== */
function addSkill() {
  const inp = document.getElementById('skill-inp');
  const v = inp.value.trim();
  if (v && !skills.includes(v)) { skills.push(v); inp.value = ''; renderSkillTags(); render(); calcATS(); }
  else if (skills.includes(v)) { toast('Already added!'); inp.value = ''; }
}
function qs(s) { if (!skills.includes(s)) { skills.push(s); renderSkillTags(); render(); calcATS(); } }
function removeSkill(s) { skills = skills.filter(x => x !== s); renderSkillTags(); render(); calcATS(); }
function renderSkillTags() {
  document.getElementById('skill-tags').innerHTML = skills.map(s =>
    '<div class="stag">' + esc(s) + '<button onclick="removeSkill(' + JSON.stringify(s) + ')">×</button></div>').join('');
}

function addLang() {
  const inp = document.getElementById('lang-inp');
  const v = inp.value.trim();
  if (v && !langs.includes(v)) { langs.push(v); inp.value = ''; renderLangTags(); render(); }
  else if (langs.includes(v)) { toast('Already added!'); inp.value = ''; }
}
function ql(l) { if (!langs.includes(l)) { langs.push(l); renderLangTags(); render(); } }
function removeLang(l) { langs = langs.filter(x => x !== l); renderLangTags(); render(); }
function renderLangTags() {
  document.getElementById('lang-tags').innerHTML = langs.map(l =>
    '<div class="stag">' + esc(l) + '<button onclick="removeLang(' + JSON.stringify(l) + ')">×</button></div>').join('');
}

/* ===== CERTS ===== */
function addCert() { certs.push({ id: uid(), name:'', org:'', year:'' }); renderCertList(); render(); }
function delCert(id) { certs = certs.filter(c => c.id !== id); renderCertList(); render(); }
function renderCertList() {
  document.getElementById('cert-list').innerHTML = certs.map(c => `
    <div class="ecard">
      <div class="ecard-head"><span class="ecard-title">🏅 ${c.name || 'New certification'}</span><button class="btn-del" onclick="delCert(${c.id})">✕</button></div>
      <div class="ecard-body">
        <div class="ec-full"><label>Certification name</label><input value="${esc(c.name)}" placeholder="e.g. AWS Certified, PMP, Google Analytics..." oninput="certs.find(x=>x.id===${c.id}).name=this.value;renderCertList();render()"></div>
        <div><label>Issuing organization</label><input value="${esc(c.org)}" placeholder="e.g. Amazon, PMI..." oninput="certs.find(x=>x.id===${c.id}).org=this.value;render()"></div>
        <div><label>Year</label><input value="${esc(c.year)}" placeholder="2024" oninput="certs.find(x=>x.id===${c.id}).year=this.value;render()"></div>
      </div>
    </div>`).join('');
}

/* ===== PROJECTS ===== */
function addProj() { projs.push({ id: uid(), name:'', tech:'', desc:'' }); renderProjList(); render(); }
function delProj(id) { projs = projs.filter(p => p.id !== id); renderProjList(); render(); }
function renderProjList() {
  document.getElementById('proj-list').innerHTML = projs.map(p => `
    <div class="ecard">
      <div class="ecard-head"><span class="ecard-title">💻 ${p.name || 'New project'}</span><button class="btn-del" onclick="delProj(${p.id})">✕</button></div>
      <div class="ecard-body">
        <div class="ec-full"><label>Project name</label><input value="${esc(p.name)}" placeholder="e.g. Sales Dashboard, School App..." oninput="projs.find(x=>x.id===${p.id}).name=this.value;renderProjList();render()"></div>
        <div class="ec-full"><label>Tools used</label><input value="${esc(p.tech)}" placeholder="e.g. Excel, Python, Figma..." oninput="projs.find(x=>x.id===${p.id}).tech=this.value;render()"></div>
        <div class="ec-full"><label>Description</label><textarea rows="3" placeholder="What you built and the outcome..." oninput="projs.find(x=>x.id===${p.id}).desc=this.value;render()">${esc(p.desc)}</textarea></div>
      </div>
    </div>`).join('');
}

/* ===== ATS ===== */
function calcATS() {
  const name=gv('p-name'), email=gv('p-email'), phone=gv('p-phone'), summary=gv('p-summary'), title=gv('p-title');
  const checks=[]; let score=0;

  if(name)  {score+=8; checks.push({t:'p',msg:'Full name present'});} else checks.push({t:'f',msg:'Full name missing'});
  if(email) {score+=7; checks.push({t:'p',msg:'Email present'});} else checks.push({t:'f',msg:'Email missing'});
  if(phone) {score+=5; checks.push({t:'p',msg:'Phone present'});} else checks.push({t:'w',msg:'Phone not added'});
  if(title) {score+=8; checks.push({t:'p',msg:'Job title present'});} else checks.push({t:'w',msg:'Job title missing'});
  if(summary.length>=60) {score+=15; checks.push({t:'p',msg:'Professional summary ✓'});}
  else if(summary.length>=10) {score+=7; checks.push({t:'w',msg:'Summary too short (aim 60+ chars)'});}
  else checks.push({t:'f',msg:'No summary — add one!'});

  const vE=exp.filter(e=>e.role&&e.company);
  if(vE.length>=2){score+=20;checks.push({t:'p',msg:vE.length+' experiences listed'});}
  else if(vE.length===1){score+=12;checks.push({t:'w',msg:'1 experience (add more)'});}
  else checks.push({t:'f',msg:'No work experience'});

  const hB=exp.some(e=>e.desc&&(e.desc.includes('•')||e.desc.includes('-')));
  if(hB&&vE.length){score+=7;checks.push({t:'p',msg:'Bullet points in experience'});}
  else if(vE.length) checks.push({t:'w',msg:'Use bullet points in experience'});

  const vEdu=edu.filter(e=>e.degree||e.school);
  if(vEdu.length){score+=10;checks.push({t:'p',msg:'Education listed'});}
  else checks.push({t:'w',msg:'No education added'});

  if(skills.length>=5){score+=15;checks.push({t:'p',msg:skills.length+' skills listed!'});}
  else if(skills.length>=2){score+=7;checks.push({t:'w',msg:skills.length+' skills (aim for 5+)'});}
  else checks.push({t:'f',msg:'Add at least 5 skills'});

  if(certs.filter(c=>c.name).length){score+=5;checks.push({t:'p',msg:'Certifications listed'});}

  score=Math.min(100,Math.max(0,score));

  const r=document.getElementById('ats-ring');
  if(r){r.setAttribute('stroke-dasharray',`${(score/100)*88} 88`);r.setAttribute('stroke',score>=70?'#4ade80':score>=45?'#fbbf24':'#f87171');}
  const n=document.getElementById('ats-num'); if(n)n.textContent=score;
  const s=document.getElementById('ats-sub'); if(s)s.textContent=score>=80?'Excellent!':score>=60?'Good':score>=40?'Fair':'Needs work';
  const d=document.getElementById('ats-donut-ring');
  if(d){d.setAttribute('stroke-dasharray',`${(score/100)*251} 251`);d.setAttribute('stroke',score>=70?'#188038':score>=45?'#ea8600':'#d93025');}
  const b=document.getElementById('ats-big'); if(b)b.textContent=score;
  const ra=document.getElementById('ats-rating');
  if(ra)ra.textContent=score>=80?'🟢 Excellent — ATS Ready!':score>=60?'🟡 Good':score>=40?'🟠 Fair':'🔴 Needs work';
  const li=document.getElementById('ats-list');
  if(li)li.innerHTML='<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#9aa0a6;margin-bottom:6px">Checklist</div>'+
    checks.map(c=>`<div class="ats-item ${c.t}"><span>${c.t==='p'?'✓':c.t==='w'?'⚠':'✗'}</span><span>${c.msg}</span></div>`).join('');
  const tips=[];
  if(!summary) tips.push('💡 Add a professional summary');
  if(skills.length<5) tips.push('💡 Add at least 5 skills');
  if(!hB&&vE.length) tips.push('💡 Use bullet points (•) in experience');
  if(!vE.length) tips.push('💡 Add work experience');
  const ti=document.getElementById('ats-tips');
  if(ti)ti.innerHTML=tips.length?'<div class="ats-tips-title">How to improve</div>'+tips.map(t=>`<div class="ats-tip">${t}</div>`).join(''):'';
}

/* ===== BUILD CV HTML (shared between preview and PDF) ===== */
function buildCVHTML(forPDF) {
  const name=gv('p-name'), title=gv('p-title'), email=gv('p-email'),
        phone=gv('p-phone'), loc=gv('p-loc'), link=gv('p-link'), summary=gv('p-summary');

  const contacts=[
    email?'✉ '+email:'', phone?'✆ '+phone:'',
    loc?'⌖ '+loc:'',     link?'⬡ '+link:''
  ].filter(Boolean).map(c=>'<span>'+c+'</span>').join('');

  const pHTML = photo ? '<img class="cv-photo" src="'+photo+'" alt="Profile">' : '';

  let h = '';

  if (tpl==='modern') {
    h += '<div class="cv-top">'+pHTML+'<div style="flex:1"><div class="cv-name">'+(name||'Your Name')+'</div>'+(title?'<div class="cv-role">'+title+'</div>':'')+'<div class="cv-contacts">'+contacts+'</div></div></div>';
  } else if (tpl==='creative') {
    h += '<div class="cv-top">'+pHTML+'<div><div class="cv-name">'+(name||'Your Name')+'</div>'+(title?'<div class="cv-role">'+title+'</div>':'')+'<div class="cv-contacts">'+contacts+'</div></div></div>';
  } else {
    h += '<div class="cv-top">'+pHTML+'<div class="cv-name">'+(name||'Your Name')+'</div>'+(title?'<div class="cv-role">'+title+'</div>':'')+'<div class="cv-contacts">'+contacts+'</div></div>';
  }

  if(summary) h+='<div class="cv-sec-title">Professional Summary</div><div class="cv-summary">'+summary+'</div>';

  const vExp=exp.filter(e=>e.role||e.company);
  if(vExp.length){
    h+='<div class="cv-sec-title">Work Experience</div>';
    vExp.forEach(e=>{
      h+='<div class="cv-item"><div class="cv-row"><div class="cv-iname">'+(e.role||'Position')+'</div>'+(e.period?'<div class="cv-idate">'+e.period+'</div>':'')+'</div>'+(e.company?'<div class="cv-isub">'+e.company+'</div>':'')+(e.desc?'<div class="cv-desc">'+fmtDesc(e.desc)+'</div>':'')+'</div>';
    });
  }

  const vEdu=edu.filter(e=>e.degree||e.school);
  if(vEdu.length){
    h+='<div class="cv-sec-title">Education</div>';
    vEdu.forEach(e=>{
      h+='<div class="cv-item"><div class="cv-row"><div class="cv-iname">'+(e.degree||'Qualification')+'</div>'+(e.year?'<div class="cv-idate">'+e.year+'</div>':'')+'</div><div class="cv-row" style="margin-top:1px">'+(e.school?'<div class="cv-isub">'+e.school+'</div>':'<div></div>')+(e.grade?'<div class="cv-idate">'+e.grade+'</div>':'')+'</div></div>';
    });
  }

  if(skills.length) h+='<div class="cv-sec-title">Skills</div><div class="cv-chips">'+skills.map(s=>'<span class="cv-chip">'+s+'</span>').join('')+'</div>';
  if(langs.length)  h+='<div class="cv-sec-title">Languages</div><div class="cv-chips">'+langs.map(l=>'<span class="cv-chip">'+l+'</span>').join('')+'</div>';

  const vC=certs.filter(c=>c.name);
  if(vC.length){
    h+='<div class="cv-sec-title">Certifications</div>';
    vC.forEach(c=>{h+='<div class="cv-item"><div class="cv-row"><div class="cv-iname">'+c.name+'</div>'+(c.year?'<div class="cv-idate">'+c.year+'</div>':'')+'</div>'+(c.org?'<div class="cv-isub">'+c.org+'</div>':'')+'</div>';});
  }

  const vP=projs.filter(p=>p.name);
  if(vP.length){
    h+='<div class="cv-sec-title">Projects</div>';
    vP.forEach(p=>{h+='<div class="cv-item"><div class="cv-iname">'+p.name+'</div>'+(p.tech?'<div class="cv-isub">'+p.tech+'</div>':'')+(p.desc?'<div class="cv-desc"><div class="cv-dline"><span>'+p.desc+'</span></div></div>':'')+'</div>';});
  }

  return h;
}

/* ===== RENDER PREVIEW ===== */
function render() {
  const name=gv('p-name'), email=gv('p-email'), summary=gv('p-summary');
  const hasContent=name||email||exp.length||edu.length||skills.length||summary;
  const page=document.getElementById('cv-page');
  if(!hasContent){
    page.className='cv-page';
    page.innerHTML='<div class="cv-empty"><div class="cv-empty-icon">📄</div><h3>Your CV preview will appear here</h3><p>Start filling in your details on the left and watch your professional CV build in real-time.</p></div>';
    return;
  }
  page.className='cv-page tpl-'+tpl;
  page.innerHTML=buildCVHTML(false);
}

/* ===== DOWNLOAD PDF ===== */
/* 
 * ROOT CAUSE OF EMPTY PDF:
 * html2canvas cannot capture elements inside overflow:hidden/scroll containers.
 * The cv-page sits inside .preview-scroll which has overflow-y:auto.
 * 
 * SOLUTION: Create a brand-new full HTML document in an iframe,
 * render it there (no overflow clipping), then capture that.
 */
function downloadPDF() {
  const name=gv('p-name'), email=gv('p-email'), summary=gv('p-summary');
  const hasContent=name||email||exp.length||edu.length||skills.length||summary;

  if(!hasContent){
    toast('⚠ Please fill in your details first!');
    return;
  }

  const filename=(gv('p-name')||'My_CV').replace(/\s+/g,'_')+'_CV.pdf';

  /* Disable buttons */
  const btns=document.querySelectorAll('#dl-btn,.btn-dl-final');
  btns.forEach(b=>{b._orig=b.innerHTML;b.innerHTML='⏳ Generating...';b.disabled=true;});

  /* Get the CSS text we need */
  const tplCSS = getTplCSS();

  /* Build full HTML for PDF rendering */
  const cvHTML = buildCVHTML(true);

  const fullHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:794px;margin:0;padding:0;background:#fff;font-family:Georgia,'Times New Roman',serif;font-size:11.5px;color:#1a1a1a;line-height:1.55}
${tplCSS}
</style>
</head>
<body>
<div class="cv-page tpl-${tpl}" style="width:794px;padding:44px 52px;background:#fff;min-height:auto;box-shadow:none;border-radius:0;">
${cvHTML}
</div>
</body>
</html>`;

  /* Create hidden iframe to render cleanly */
  const iframe = document.createElement('iframe');
  iframe.style.cssText='position:fixed;left:-9999px;top:0;width:794px;height:1122px;border:none;visibility:hidden';
  document.body.appendChild(iframe);

  iframe.onload = function() {
    const iDoc = iframe.contentDocument || iframe.contentWindow.document;
    const target = iDoc.querySelector('.cv-page');

    setTimeout(function() {
      const opt = {
        margin: [10,10,10,10],
        filename: filename,
        image: {type:'jpeg',quality:0.98},
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 794,
          windowWidth: 794,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: {unit:'mm',format:'a4',orientation:'portrait'}
      };

      html2pdf().set(opt).from(target).save()
        .then(function(){
          document.body.removeChild(iframe);
          btns.forEach(b=>{b.innerHTML=b._orig;b.disabled=false;});
          toast('✅ PDF downloaded! Check your Downloads folder.');
        })
        .catch(function(err){
          document.body.removeChild(iframe);
          btns.forEach(b=>{b.innerHTML=b._orig;b.disabled=false;});
          toast('⚠ Download failed — please try again.');
          console.error(err);
        });
    }, 800); /* wait for fonts to load in iframe */
  };

  /* Write HTML into iframe */
  iframe.srcdoc = fullHTML;
}

/* ===== INLINE CSS FOR PDF (all 4 templates) ===== */
function getTplCSS(){
  return `
.cv-page{font-family:Georgia,serif;font-size:11.5px;color:#1a1a1a;line-height:1.55;background:#fff}
.cv-empty{display:none}

/* MODERN */
.tpl-modern .cv-top{display:flex;align-items:flex-start;gap:18px;padding-bottom:14px;margin-bottom:16px;border-bottom:3px solid #1a73e8}
.tpl-modern .cv-photo{width:72px;height:72px;border-radius:50%;object-fit:cover;border:2.5px solid #e8f0fe;flex-shrink:0}
.tpl-modern .cv-name{font-family:'Inter',sans-serif;font-size:26px;font-weight:800;color:#1a1a1a;letter-spacing:-.025em;line-height:1.1;margin-bottom:2px}
.tpl-modern .cv-role{font-family:'Inter',sans-serif;font-size:12px;font-weight:600;color:#1a73e8;margin-bottom:7px}
.tpl-modern .cv-contacts{display:flex;flex-wrap:wrap;gap:2px 14px;font-family:'Inter',sans-serif;font-size:10px;color:#5f6368}
.tpl-modern .cv-contacts span{display:inline-block}
.tpl-modern .cv-sec-title{font-family:'Inter',sans-serif;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#1a73e8;border-bottom:1.5px solid #e8f0fe;padding-bottom:3px;margin:14px 0 8px}
.tpl-modern .cv-summary{font-family:'Inter',sans-serif;font-size:10.5px;color:#444;line-height:1.65}
.tpl-modern .cv-item{margin-bottom:9px}
.tpl-modern .cv-row{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.tpl-modern .cv-iname{font-weight:700;font-size:11px;color:#1a1a1a;flex:1}
.tpl-modern .cv-idate{font-family:'Inter',sans-serif;font-size:9.5px;color:#9aa0a6;white-space:nowrap}
.tpl-modern .cv-isub{font-family:'Inter',sans-serif;font-size:10px;color:#5f6368;font-style:italic;margin-top:1px}
.tpl-modern .cv-desc{font-family:'Inter',sans-serif;font-size:10px;color:#3c4043;margin-top:4px;line-height:1.5}
.tpl-modern .cv-dline{display:flex;gap:4px;margin-bottom:2px}
.tpl-modern .cv-bullet{color:#1a73e8;flex-shrink:0}
.tpl-modern .cv-chips{display:flex;flex-wrap:wrap;gap:4px}
.tpl-modern .cv-chip{font-family:'Inter',sans-serif;font-size:9px;padding:2px 8px;background:#e8f0fe;color:#1a73e8;border-radius:3px;font-weight:500}

/* CLASSIC */
.tpl-classic .cv-top{text-align:center;padding-bottom:12px;margin-bottom:14px;border-bottom:2px solid #1a1a1a}
.tpl-classic .cv-photo{width:62px;height:62px;border-radius:50%;object-fit:cover;border:2px solid #ddd;margin:0 auto 8px;display:block}
.tpl-classic .cv-name{font-family:'Playfair Display',Georgia,serif;font-size:25px;font-weight:700;color:#1a1a1a}
.tpl-classic .cv-role{font-family:'Inter',sans-serif;font-size:11px;font-weight:500;color:#666;text-transform:uppercase;letter-spacing:.1em;margin:3px 0 7px}
.tpl-classic .cv-contacts{display:flex;justify-content:center;flex-wrap:wrap;gap:2px 14px;font-family:'Inter',sans-serif;font-size:9.5px;color:#666}
.tpl-classic .cv-contacts span{display:inline-block}
.tpl-classic .cv-sec-title{font-family:'Playfair Display',serif;font-size:12.5px;font-weight:700;color:#1a1a1a;border-bottom:1.5px solid #1a1a1a;padding-bottom:2px;margin:13px 0 8px}
.tpl-classic .cv-summary{font-size:10.5px;color:#333;line-height:1.7}
.tpl-classic .cv-item{margin-bottom:9px}
.tpl-classic .cv-row{display:flex;justify-content:space-between;align-items:baseline}
.tpl-classic .cv-iname{font-weight:700;font-size:11px;color:#1a1a1a}
.tpl-classic .cv-idate{font-family:'Inter',sans-serif;font-size:9.5px;color:#888}
.tpl-classic .cv-isub{font-size:10px;color:#666;font-style:italic;margin-top:1px}
.tpl-classic .cv-desc{font-size:10.5px;color:#333;margin-top:4px;line-height:1.55}
.tpl-classic .cv-dline{display:flex;gap:4px;margin-bottom:2px}
.tpl-classic .cv-bullet{color:#555;flex-shrink:0}
.tpl-classic .cv-chips{display:flex;flex-wrap:wrap;gap:4px}
.tpl-classic .cv-chip{font-family:'Inter',sans-serif;font-size:9px;padding:2px 8px;background:#f1f3f4;color:#444;border-radius:3px}

/* MINIMAL */
.tpl-minimal .cv-top{padding-bottom:10px;margin-bottom:14px;border-bottom:1px solid #e0e0e0;overflow:hidden}
.tpl-minimal .cv-photo{width:58px;height:58px;border-radius:50%;object-fit:cover;float:right;margin-left:14px;border:1.5px solid #e0e0e0}
.tpl-minimal .cv-name{font-family:'Inter',sans-serif;font-size:24px;font-weight:300;color:#1a1a1a;letter-spacing:-.03em}
.tpl-minimal .cv-role{font-family:'Inter',sans-serif;font-size:11.5px;color:#999;margin:2px 0 6px}
.tpl-minimal .cv-contacts{display:flex;flex-wrap:wrap;gap:2px 14px;font-family:'Inter',sans-serif;font-size:9.5px;color:#bbb}
.tpl-minimal .cv-contacts span{display:inline-block}
.tpl-minimal .cv-sec-title{font-family:'Inter',sans-serif;font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:.14em;color:#bbb;margin:13px 0 8px}
.tpl-minimal .cv-summary{font-family:'Inter',sans-serif;font-size:10.5px;color:#555;line-height:1.7}
.tpl-minimal .cv-item{margin-bottom:9px;padding-left:10px;border-left:2px solid #eee}
.tpl-minimal .cv-row{display:flex;justify-content:space-between;align-items:baseline}
.tpl-minimal .cv-iname{font-family:'Inter',sans-serif;font-weight:600;font-size:11px;color:#1a1a1a}
.tpl-minimal .cv-idate{font-family:'Inter',sans-serif;font-size:9.5px;color:#ccc}
.tpl-minimal .cv-isub{font-family:'Inter',sans-serif;font-size:10px;color:#aaa;margin-top:1px}
.tpl-minimal .cv-desc{font-family:'Inter',sans-serif;font-size:10px;color:#555;margin-top:3px;line-height:1.55}
.tpl-minimal .cv-dline{display:flex;gap:4px;margin-bottom:2px}
.tpl-minimal .cv-bullet{color:#ccc;flex-shrink:0}
.tpl-minimal .cv-chips{display:flex;flex-wrap:wrap;gap:4px}
.tpl-minimal .cv-chip{font-family:'Inter',sans-serif;font-size:9px;padding:2px 8px;border:1px solid #e0e0e0;color:#666;border-radius:20px}

/* CREATIVE */
.tpl-creative .cv-top{background:linear-gradient(135deg,#7c3aed,#a855f7);margin:-44px -52px 18px;padding:22px 52px 18px;display:flex;align-items:center;gap:16px}
.tpl-creative .cv-photo{width:66px;height:66px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.4);flex-shrink:0}
.tpl-creative .cv-name{font-family:'Inter',sans-serif;font-size:22px;font-weight:800;color:#fff;letter-spacing:-.02em;margin-bottom:2px}
.tpl-creative .cv-role{font-family:'Inter',sans-serif;font-size:11px;color:rgba(255,255,255,.8);margin-bottom:6px}
.tpl-creative .cv-contacts{display:flex;flex-wrap:wrap;gap:2px 12px;font-family:'Inter',sans-serif;font-size:9.5px;color:rgba(255,255,255,.65)}
.tpl-creative .cv-contacts span{display:inline-block}
.tpl-creative .cv-sec-title{font-family:'Inter',sans-serif;font-size:8.5px;font-weight:800;text-transform:uppercase;letter-spacing:.12em;color:#7c3aed;background:#f5f0ff;padding:2px 8px;border-radius:3px;margin:14px 0 8px;display:inline-block}
.tpl-creative .cv-summary{font-family:'Inter',sans-serif;font-size:10.5px;color:#444;line-height:1.65}
.tpl-creative .cv-item{margin-bottom:9px}
.tpl-creative .cv-row{display:flex;justify-content:space-between;align-items:baseline}
.tpl-creative .cv-iname{font-family:'Inter',sans-serif;font-weight:700;font-size:11px;color:#1a1a1a}
.tpl-creative .cv-idate{font-family:'Inter',sans-serif;font-size:9.5px;color:#a855f7;white-space:nowrap}
.tpl-creative .cv-isub{font-family:'Inter',sans-serif;font-size:10px;color:#7c3aed;margin-top:1px}
.tpl-creative .cv-desc{font-family:'Inter',sans-serif;font-size:10px;color:#3c4043;margin-top:4px;line-height:1.5}
.tpl-creative .cv-dline{display:flex;gap:4px;margin-bottom:2px}
.tpl-creative .cv-bullet{color:#a855f7;flex-shrink:0}
.tpl-creative .cv-chips{display:flex;flex-wrap:wrap;gap:4px}
.tpl-creative .cv-chip{font-family:'Inter',sans-serif;font-size:9px;padding:2px 8px;background:#f5f0ff;color:#7c3aed;border-radius:3px;font-weight:500}
`;
    }
