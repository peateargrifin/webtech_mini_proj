// ─────────────────────────────────────────────
// DATA STORE
// ─────────────────────────────────────────────

const STATUS_ORDER = ['reported','verified','assigned','in-progress','resolved','closed'];

const CATEGORY_LABELS = {
  road: 'Road & Infrastructure',
  water: 'Water & Drainage',
  electricity: 'Electricity',
  sanitation: 'Sanitation',
  safety: 'Public Safety'
};

const STATUS_COLORS = {
  'reported':    '#ef4444',
  'verified':    '#f59e0b',
  'assigned':    '#3b82f6',
  'in-progress': '#8b5cf6',
  'resolved':    '#10b981',
  'closed':      '#6b7280'
};

const PRIORITY_ORDER = { critical:4, high:3, medium:2, low:1 };

// Map pin positions (SVG coordinate space 800x520)
let issues = [
  { id:'ISS-001', title:'Large pothole on MG Road near Bus Stop 5', category:'road', priority:'critical', status:'in-progress', zone:'Zone A — Central', ward:'Ward 3', lat:28.6300, lng:77.2100, mapX:240, mapY:170, desc:'Deep pothole causing vehicle damage and traffic jams during peak hours.', reported:'2024-11-10', assignedTo:'Road Dept. Team B', history:[{status:'reported',date:'2024-11-10'},{status:'verified',date:'2024-11-11'},{status:'assigned',date:'2024-11-13'},{status:'in-progress',date:'2024-11-15'}] },
  { id:'ISS-002', title:'Broken street light near Central Park', category:'electricity', priority:'high', status:'assigned', zone:'Zone A — Central', ward:'Ward 4', lat:28.6250, lng:77.2050, mapX:290, mapY:200, desc:'3 consecutive street lights non-functional creating a safety hazard at night.', reported:'2024-11-12', assignedTo:'Electricity Dept.', history:[{status:'reported',date:'2024-11-12'},{status:'verified',date:'2024-11-13'},{status:'assigned',date:'2024-11-14'}] },
  { id:'ISS-003', title:'Overflowing drain on Ring Road', category:'water', priority:'critical', status:'verified', zone:'Zone C — South', ward:'Ward 9', lat:28.6000, lng:77.2150, mapX:260, mapY:330, desc:'Drain overflow causing water logging and stagnant water posing health risk.', reported:'2024-11-14', assignedTo:null, history:[{status:'reported',date:'2024-11-14'},{status:'verified',date:'2024-11-15'}] },
  { id:'ISS-004', title:'Garbage pile near Sector 12 market', category:'sanitation', priority:'medium', status:'reported', zone:'Zone B — East', ward:'Ward 6', lat:28.6280, lng:77.2300, mapX:460, mapY:180, desc:'Uncollected garbage for 5+ days. Strong odour, attracting stray animals.', reported:'2024-11-16', assignedTo:null, history:[{status:'reported',date:'2024-11-16'}] },
  { id:'ISS-005', title:'Broken water pipe — NH-58 junction', category:'water', priority:'high', status:'resolved', zone:'Zone B — East', ward:'Ward 7', lat:28.6210, lng:77.2350, mapX:480, mapY:210, desc:'Burst pipe causing water wastage and road damage near the NH-58 flyover.', reported:'2024-11-08', assignedTo:'Water Dept. Team A', history:[{status:'reported',date:'2024-11-08'},{status:'verified',date:'2024-11-09'},{status:'assigned',date:'2024-11-09'},{status:'in-progress',date:'2024-11-10'},{status:'resolved',date:'2024-11-14'}] },
  { id:'ISS-006', title:'Illegal dumping near Zone D park', category:'sanitation', priority:'low', status:'closed', zone:'Zone D — SE', ward:'Ward 11', lat:28.5990, lng:77.2380, mapX:470, mapY:340, desc:'Contractor illegally dumped construction debris in public park area.', reported:'2024-11-01', assignedTo:'Sanitation Team D', history:[{status:'reported',date:'2024-11-01'},{status:'verified',date:'2024-11-02'},{status:'assigned',date:'2024-11-03'},{status:'in-progress',date:'2024-11-04'},{status:'resolved',date:'2024-11-07'},{status:'closed',date:'2024-11-09'}] },
  { id:'ISS-007', title:'Broken footpath slabs — Zone A walkway', category:'road', priority:'medium', status:'verified', zone:'Zone A — Central', ward:'Ward 2', lat:28.6320, lng:77.2080, mapX:210, mapY:160, desc:'Multiple broken footpath slabs near hospital entrance causing trip hazard.', reported:'2024-11-15', assignedTo:null, history:[{status:'reported',date:'2024-11-15'},{status:'verified',date:'2024-11-16'}] },
  { id:'ISS-008', title:'Faulty traffic signals at Ring Road crossing', category:'safety', priority:'critical', status:'in-progress', zone:'Zone D — SE', ward:'Ward 12', lat:28.6010, lng:77.2320, mapX:450, mapY:310, desc:'Traffic signals stuck on red on all sides for 3+ hours causing gridlock.', reported:'2024-11-16', assignedTo:'Smart Infrastructure Dept.', history:[{status:'reported',date:'2024-11-16'},{status:'verified',date:'2024-11-16'},{status:'assigned',date:'2024-11-16'},{status:'in-progress',date:'2024-11-16'}] },
  { id:'ISS-009', title:'Sewage leak on Ward 5 residential road', category:'water', priority:'high', status:'assigned', zone:'Zone C — South', ward:'Ward 5', lat:28.6080, lng:77.2100, mapX:250, mapY:360, desc:'Sewage water mixing with drinking water supply pipeline.', reported:'2024-11-13', assignedTo:'Water Dept. Team B', history:[{status:'reported',date:'2024-11-13'},{status:'verified',date:'2024-11-14'},{status:'assigned',date:'2024-11-15'}] },
  { id:'ISS-010', title:'Power outage — Zone B entire block', category:'electricity', priority:'high', status:'reported', zone:'Zone B — East', ward:'Ward 8', lat:28.6240, lng:77.2420, mapX:510, mapY:190, desc:'Complete power failure for 48 hours affecting 200+ households.', reported:'2024-11-17', assignedTo:null, history:[{status:'reported',date:'2024-11-17'}] }
];

let filteredIssues = [...issues];
let issueCounter = issues.length + 1;

const activityLog = [
  { icon:'🔧', text:'ISS-001 status advanced to <strong>In Progress</strong> by Road Dept. Team B', time:'2 hours ago' },
  { icon:'✅', text:'ISS-005 marked <strong>Resolved</strong> — Burst pipe repaired on NH-58', time:'3 hours ago' },
  { icon:'📍', text:'ISS-008 geo-verified at Ring Road crossing (28.6010, 77.2320)', time:'5 hours ago' },
  { icon:'🗂', text:'ISS-006 <strong>Closed</strong> after citizen confirmation in Zone D', time:'1 day ago' },
  { icon:'📝', text:'New issue ISS-010 submitted — Power outage in Zone B', time:'1 day ago' },
  { icon:'👷', text:'ISS-009 assigned to Water Dept. Team B', time:'2 days ago' },
];

// ─────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    const id = 'tab-' + btn.dataset.tab;
    document.getElementById(id).classList.add('active');
    if (btn.dataset.tab === 'list') renderList();
    if (btn.dataset.tab === 'dashboard') renderDashboard();
    if (btn.dataset.tab === 'map') renderPins(filteredIssues);
  });
});

// ─────────────────────────────────────────────
// MAP — PIN RENDERING
// ─────────────────────────────────────────────
function renderPins(data) {
  const layer = document.getElementById('pins-layer');
  layer.innerHTML = '';
  data.forEach(issue => {
    const color = STATUS_COLORS[issue.status] || '#6b7280';
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('class','pin');
    g.setAttribute('data-id', issue.id);
    g.setAttribute('transform',`translate(${issue.mapX},${issue.mapY})`);

    // Shadow
    const shadow = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
    shadow.setAttribute('cx','0'); shadow.setAttribute('cy','3');
    shadow.setAttribute('rx','6'); shadow.setAttribute('ry','3');
    shadow.setAttribute('fill','rgba(0,0,0,0.15)');
    g.appendChild(shadow);

    // Pin body
    const pin = document.createElementNS('http://www.w3.org/2000/svg','path');
    pin.setAttribute('d','M0,-22 C6,-22 10,-17 10,-12 C10,-5 0,2 0,2 C0,2 -10,-5 -10,-12 C-10,-17 -6,-22 0,-22 Z');
    pin.setAttribute('fill', color);
    pin.setAttribute('stroke','#fff'); pin.setAttribute('stroke-width','1.5');
    g.appendChild(pin);

    // Inner dot
    const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('cx','0'); dot.setAttribute('cy','-13');
    dot.setAttribute('r','3.5'); dot.setAttribute('fill','#fff');
    g.appendChild(dot);

    // Priority ring for critical
    if (issue.priority === 'critical') {
      const ring = document.createElementNS('http://www.w3.org/2000/svg','circle');
      ring.setAttribute('cx','0'); ring.setAttribute('cy','-13');
      ring.setAttribute('r','14'); ring.setAttribute('fill','none');
      ring.setAttribute('stroke', color); ring.setAttribute('stroke-width','2');
      ring.setAttribute('stroke-opacity','0.4'); ring.setAttribute('stroke-dasharray','3 3');
      g.insertBefore(ring, pin);
    }

    g.addEventListener('mouseenter', (e) => showTooltip(e, issue));
    g.addEventListener('mouseleave', hideTooltip);
    g.addEventListener('click', () => openModal(issue.id));
    layer.appendChild(g);
  });
}

// Tooltip
const tooltip = document.getElementById('map-tooltip');
function showTooltip(e, issue) {
  const mapEl = document.getElementById('city-map');
  const rect = mapEl.getBoundingClientRect();
  const svgEl = document.getElementById('map-svg');
  const svgRect = svgEl.getBoundingClientRect();
  const scaleX = svgRect.width / 800;
  const scaleY = svgRect.height / 520;
  const tx = issue.mapX * scaleX + (svgRect.left - rect.left);
  const ty = issue.mapY * scaleY + (svgRect.top - rect.top) - 35;
  tooltip.style.left = (tx - 80) + 'px';
  tooltip.style.top = (ty - 50) + 'px';
  tooltip.innerHTML = `<strong>${issue.id}</strong><br>${issue.title}<br><span style="opacity:0.7">${issue.zone} · ${capitalize(issue.status)}</span>`;
  tooltip.classList.remove('hidden');
}
function hideTooltip() { tooltip.classList.add('hidden'); }

function applyFilters() {
  const cat = document.getElementById('filter-cat').value;
  const st  = document.getElementById('filter-status').value;
  const pr  = document.getElementById('filter-priority').value;
  filteredIssues = issues.filter(i =>
    (cat === 'all' || i.category === cat) &&
    (st  === 'all' || i.status   === st)  &&
    (pr  === 'all' || i.priority === pr)
  );
  renderPins(filteredIssues);
}

function resetMapView() {
  document.getElementById('filter-cat').value = 'all';
  document.getElementById('filter-status').value = 'all';
  document.getElementById('filter-priority').value = 'all';
  filteredIssues = [...issues];
  renderPins(filteredIssues);
}

// ─────────────────────────────────────────────
// ISSUE LIST
// ─────────────────────────────────────────────
function renderList() {
  const q = (document.getElementById('search-input').value || '').toLowerCase();
  const sort = document.getElementById('sort-select').value;
  let data = issues.filter(i =>
    i.id.toLowerCase().includes(q) ||
    i.title.toLowerCase().includes(q) ||
    i.zone.toLowerCase().includes(q) ||
    i.ward.toLowerCase().includes(q)
  );
  if (sort === 'date-desc') data.sort((a,b) => b.reported.localeCompare(a.reported));
  else if (sort === 'date-asc') data.sort((a,b) => a.reported.localeCompare(b.reported));
  else if (sort === 'priority') data.sort((a,b) => PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority]);
  else if (sort === 'status') data.sort((a,b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));

  const tbody = document.getElementById('issues-tbody');
  tbody.innerHTML = data.map(i => `
    <tr>
      <td><code style="font-size:12px;color:#2563eb">${i.id}</code></td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${i.title}</td>
      <td><span class="badge badge-${i.category}">${CATEGORY_LABELS[i.category]}</span></td>
      <td style="font-size:12px">${i.zone}<br><span style="color:#9ca3af">${i.ward}</span></td>
      <td><span class="badge badge-${i.status}">${formatStatus(i.status)}</span></td>
      <td><span class="badge badge-${i.priority}">${capitalize(i.priority)}</span></td>
      <td style="font-size:12px;white-space:nowrap">${formatDate(i.reported)}</td>
      <td><button class="action-btn" onclick="openModal('${i.id}')">View</button></td>
    </tr>
  `).join('');
}

// ─────────────────────────────────────────────
// MODAL — ISSUE DETAIL + WORKFLOW
// ─────────────────────────────────────────────
function openModal(id) {
  const issue = issues.find(i => i.id === id);
  if (!issue) return;
  const nextStatus = STATUS_ORDER[STATUS_ORDER.indexOf(issue.status) + 1];
  const isLast = !nextStatus;

  const timelineHTML = STATUS_ORDER.map((s, idx) => {
    const histItem = issue.history.find(h => h.status === s);
    const isDone = histItem && STATUS_ORDER.indexOf(s) < STATUS_ORDER.indexOf(issue.status);
    const isActive = s === issue.status;
    const isLast = idx === STATUS_ORDER.length - 1;
    return `
      <div class="wt-step">
        <div class="wt-line-wrap">
          <div class="wt-circle ${isDone?'done':''} ${isActive?'active':''}"></div>
          ${!isLast ? `<div class="wt-connector ${isDone?'done':''}"></div>` : ''}
        </div>
        <div class="wt-body">
          <div class="wt-status-label" style="color:${isActive ? STATUS_COLORS[s] : (isDone?'#6b7280':'#d1d5db')}">${formatStatus(s)}</div>
          ${histItem ? `<div class="wt-status-date">${formatDate(histItem.date)}${s==='assigned'&&issue.assignedTo?' · '+issue.assignedTo:''}</div>` : '<div class="wt-status-date" style="color:#e5e7eb">Pending</div>'}
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('modal-content').innerHTML = `
    <div class="modal-title">${issue.title}</div>
    <div class="modal-meta">
      <span class="badge badge-${issue.status}">${formatStatus(issue.status)}</span>
      <span class="badge badge-${issue.priority}">${capitalize(issue.priority)}</span>
      <span class="badge badge-${issue.category}">${CATEGORY_LABELS[issue.category]}</span>
      <code style="font-size:11px;color:#9ca3af;align-self:center">${issue.id}</code>
    </div>
    <div class="modal-section">
      <label>Description</label>
      <p>${issue.desc}</p>
    </div>
    <div class="modal-section">
      <label>Geotag</label>
      <div class="geo-tag-display">
        <span>📍 Lat: <strong>${issue.lat}</strong></span>
        <span>Lng: <strong>${issue.lng}</strong></span>
        <span>📌 ${issue.zone}</span>
        <span>${issue.ward}</span>
      </div>
    </div>
    <div class="modal-section">
      <label>Status Workflow</label>
      <div class="workflow-timeline">${timelineHTML}</div>
      ${!isLast ? `<button class="advance-btn" onclick="advanceStatus('${issue.id}')">Advance to: ${formatStatus(nextStatus)} →</button>` : '<p style="font-size:12px;color:#10b981;margin-top:8px">✓ Issue fully closed</p>'}
    </div>
    ${issue.assignedTo ? `<div class="modal-section"><label>Assigned To</label><p>${issue.assignedTo}</p></div>` : ''}
  `;

  document.getElementById('modal-overlay').classList.remove('hidden');
}

function advanceStatus(id) {
  const issue = issues.find(i => i.id === id);
  if (!issue) return;
  const idx = STATUS_ORDER.indexOf(issue.status);
  if (idx < STATUS_ORDER.length - 1) {
    issue.status = STATUS_ORDER[idx + 1];
    const today = new Date().toISOString().split('T')[0];
    issue.history.push({ status: issue.status, date: today });
    activityLog.unshift({
      icon: '🔄',
      text: `${issue.id} advanced to <strong>${formatStatus(issue.status)}</strong>`,
      time: 'just now'
    });
    openModal(id); // re-render modal
    renderPins(filteredIssues);
  }
}

function closeModal(e) {
  if (!e || e.target.id === 'modal-overlay' || e.currentTarget.classList?.contains('modal-close')) {
    document.getElementById('modal-overlay').classList.add('hidden');
  }
}

// ─────────────────────────────────────────────
// REPORT FORM
// ─────────────────────────────────────────────
function autoGeolocate() {
  const status = document.getElementById('geo-status');
  status.className = 'geo-status loading';
  status.textContent = 'Detecting location…';
  status.classList.remove('hidden');
  if (!navigator.geolocation) {
    status.className = 'geo-status error';
    status.textContent = 'Geolocation not supported by your browser.';
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    document.getElementById('f-lat').value = pos.coords.latitude.toFixed(4);
    document.getElementById('f-lng').value = pos.coords.longitude.toFixed(4);
    status.className = 'geo-status success';
    status.textContent = `Location detected: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
  }, () => {
    // fallback mock for demo
    document.getElementById('f-lat').value = '28.6139';
    document.getElementById('f-lng').value = '77.2090';
    status.className = 'geo-status success';
    status.textContent = 'Demo location set: 28.6139, 77.2090 (allow location for real coords)';
  });
}

function handleFileSelect(e) {
  const f = e.target.files[0];
  if (f) document.getElementById('file-label').textContent = '✓ ' + f.name;
}

function handleDrop(e) {
  e.preventDefault();
  const f = e.dataTransfer.files[0];
  if (f && f.type.startsWith('image/')) {
    document.getElementById('f-file').files = e.dataTransfer.files;
    document.getElementById('file-label').textContent = '✓ ' + f.name;
  }
}

function submitIssue() {
  const title    = document.getElementById('f-title').value.trim();
  const category = document.getElementById('f-category').value;
  const priority = document.getElementById('f-priority').value;
  const lat      = parseFloat(document.getElementById('f-lat').value);
  const lng      = parseFloat(document.getElementById('f-lng').value);
  const zone     = document.getElementById('f-zone').value;
  const ward     = document.getElementById('f-ward').value.trim();
  const desc     = document.getElementById('f-desc').value.trim();
  const msg      = document.getElementById('submit-msg');

  if (!title || !category || !priority) {
    msg.className = 'submit-msg error';
    msg.textContent = 'Please fill in all required fields (Title, Category, Priority).';
    msg.classList.remove('hidden');
    return;
  }
  if (!lat || !lng) {
    msg.className = 'submit-msg error';
    msg.textContent = 'Please add geotag coordinates or use Auto-detect.';
    msg.classList.remove('hidden');
    return;
  }

  const id = 'ISS-' + String(issueCounter).padStart(3,'0');
  issueCounter++;
  const today = new Date().toISOString().split('T')[0];

  // Map position — random-ish within zone bounds
  const zonePos = {
    'Zone A — Central': { x:[180,370], y:[145,280] },
    'Zone B — East':    { x:[415,600], y:[145,280] },
    'Zone C — South':   { x:[180,370], y:[310,400] },
    'Zone D — SE':      { x:[415,600], y:[310,400] },
  };
  const zp = zonePos[zone] || { x:[100,700], y:[50,480] };
  const mapX = Math.round(zp.x[0] + Math.random() * (zp.x[1] - zp.x[0]));
  const mapY = Math.round(zp.y[0] + Math.random() * (zp.y[1] - zp.y[0]));

  const newIssue = {
    id, title, category, priority,
    status: 'reported',
    zone: zone || 'Zone A — Central',
    ward: ward || 'Ward —',
    lat, lng, mapX, mapY,
    desc: desc || 'No description provided.',
    reported: today,
    assignedTo: null,
    history: [{ status: 'reported', date: today }]
  };

  issues.unshift(newIssue);
  filteredIssues = [...issues];
  activityLog.unshift({ icon:'📝', text:`New issue <strong>${id}</strong> submitted — ${title.substring(0,40)}…`, time:'just now' });

  msg.className = 'submit-msg success';
  msg.textContent = `✓ Issue ${id} submitted successfully with geotag (${lat}, ${lng}).`;
  msg.classList.remove('hidden');
  resetForm(true);
  renderPins(filteredIssues);
}

function resetForm(keepMsg) {
  ['f-title','f-lat','f-lng','f-ward','f-desc'].forEach(id => document.getElementById(id).value = '');
  ['f-category','f-priority','f-zone'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('file-label').textContent = 'Click to upload or drag & drop';
  document.getElementById('geo-status').classList.add('hidden');
  if (!keepMsg) document.getElementById('submit-msg').classList.add('hidden');
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
function renderDashboard() {
  // Stats
  const total = issues.length;
  const open = issues.filter(i => i.status !== 'closed' && i.status !== 'resolved').length;
  const critical = issues.filter(i => i.priority === 'critical').length;
  const resolved = issues.filter(i => i.status === 'resolved' || i.status === 'closed').length;

  document.getElementById('stat-grid').innerHTML = [
    { label:'Total Issues', value:total, delta:'All time' },
    { label:'Open Issues', value:open, delta:'Needs attention', color:'#ef4444' },
    { label:'Critical Priority', value:critical, delta:'Immediate action', color:'#dc2626' },
    { label:'Resolved / Closed', value:resolved, delta:'Successfully handled', color:'#10b981' },
  ].map(s => `
    <div class="stat-card">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value" style="${s.color?'color:'+s.color:''}">${s.value}</div>
      <div class="stat-delta">${s.delta}</div>
    </div>
  `).join('');

  // By Status
  renderBarChart('chart-status', countBy('status', STATUS_ORDER), STATUS_COLORS, formatStatus);
  // By Category
  renderBarChart('chart-category', countBy('category'), {
    road:'#0ea5e9', water:'#06b6d4', electricity:'#eab308', sanitation:'#22c55e', safety:'#a855f7'
  }, k => CATEGORY_LABELS[k] || k);
  // By Zone
  renderBarChart('chart-zone', countBy('zone'), { 'Zone A — Central':'#3b82f6','Zone B — East':'#10b981','Zone C — South':'#f59e0b','Zone D — SE':'#8b5cf6' }, k => k.replace(' — ','\n'));
  // By Priority
  renderBarChart('chart-priority', countBy('priority', ['critical','high','medium','low']), {
    critical:'#ef4444', high:'#f97316', medium:'#eab308', low:'#22c55e'
  }, capitalize);

  // Activity feed
  document.getElementById('activity-feed').innerHTML = activityLog.slice(0,8).map(a => `
    <div class="activity-item">
      <div class="activity-icon">${a.icon}</div>
      <div>
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>
  `).join('');
}

function countBy(key, order) {
  const counts = {};
  issues.forEach(i => { counts[i[key]] = (counts[i[key]] || 0) + 1; });
  if (order) {
    const out = {};
    order.forEach(k => { if (counts[k]) out[k] = counts[k]; });
    return out;
  }
  return counts;
}

function renderBarChart(containerId, data, colors, labelFn) {
  const el = document.getElementById(containerId);
  const max = Math.max(...Object.values(data), 1);
  el.innerHTML = Object.entries(data).map(([k,v]) => `
    <div class="bar-row">
      <div class="bar-row-label">${labelFn(k)}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${Math.round(v/max*100)}%;background:${colors[k]||'#3b82f6'}"></div>
      </div>
      <div class="bar-count">${v}</div>
    </div>
  `).join('');
}

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function formatStatus(s) {
  const map = { 'reported':'Reported','verified':'Verified','assigned':'Assigned','in-progress':'In Progress','resolved':'Resolved','closed':'Closed' };
  return map[s] || capitalize(s);
}
function formatDate(d) {
  if (!d) return '';
  const [y,m,day] = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(day)} ${months[parseInt(m)-1]} ${y}`;
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
renderPins(issues);
renderList();
