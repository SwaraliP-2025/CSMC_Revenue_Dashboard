/* CSMC Revenue Dashboard - script.js */

/* ===== NAVIGATION ===== */
function showSection(id, label) {
  document.querySelectorAll(".section").forEach(function(s){ s.classList.remove("active"); });
  document.getElementById(id).classList.add("active");
  var name = label || id.charAt(0).toUpperCase() + id.slice(1);
  document.getElementById("breadcrumbTitle").textContent = name;
  document.getElementById("breadcrumbLink").textContent  = name;
  document.getElementById("breadcrumbCurrent").textContent = name;
  document.querySelectorAll(".nav-btn").forEach(function(b){ b.classList.remove("active"); });
  var nb = document.getElementById("nav-" + id);
  if(nb) nb.classList.add("active");
  if(window.innerWidth <= 900){
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebarOverlay").classList.remove("active");
  }
}
function toggleSidebar() {
  var sb = document.getElementById("sidebar");
  var ov = document.getElementById("sidebarOverlay");
  if(window.innerWidth <= 900){ sb.classList.toggle("open"); ov.classList.toggle("active"); }
  else { sb.classList.toggle("collapsed"); }
}

/* ===== CLOCK ===== */
function updateClock() {
  var now = new Date();
  var days   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  var h = String(now.getHours()).padStart(2,"0");
  var m = String(now.getMinutes()).padStart(2,"0");
  var s = String(now.getSeconds()).padStart(2,"0");
  document.getElementById("clockTime").textContent = h+":"+m+":"+s;
  document.getElementById("clockDate").textContent =
    days[now.getDay()]+", "+String(now.getDate()).padStart(2,"0")+" "+months[now.getMonth()]+" "+now.getFullYear();
}
updateClock(); setInterval(updateClock, 1000);

/* ===== HELPERS ===== */
function sum(a){ return a.reduce(function(x,y){ return x+y; }, 0); }
function pct(a,b){ return b ? Math.round(a/b*100) : 0; }

/* Convert Lakhs value to actual rupees and format Indian style: 3,34,567 */
function toActual(lakhs){ return Math.round(lakhs * 100000); }
function fmtIndian(n){
  var s = String(n);
  if(s.length <= 3) return s;
  var last3 = s.slice(-3);
  var rest = s.slice(0, s.length - 3);
  var result = '';
  while(rest.length > 2){ result = ',' + rest.slice(-2) + result; rest = rest.slice(0, rest.length - 2); }
  return rest + (result || '') + ',' + last3;
}
/* Full figure: ₹3,34,567 */
function fmtFull(lakhs){ return '\u20b9' + fmtIndian(toActual(lakhs)); }
/* Short form: ₹3.35 L or ₹2.10 Cr — single line */
function fmt(l){ return l >= 100 ? '\u20b9'+(l/100).toFixed(2)+' Cr' : '\u20b9'+l.toFixed(2)+' L'; }
var MONTHS = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
var WARDS  = ["A-1","B-5","C-3","D-9","E-6","F-7","G-2","H-4","I-8","J-10"];

/* =============================================
   FY DATA STORE
   FY_DATA["2025-26"] = current year
   FY_DATA["2024-25"] = previous year
   ============================================= */
var activeFY = "2025-26";

var FY_DATA = {
  "2025-26": {
    propDemand:  [25,40,12,32,18,27,30,17,38,10],
    propColl:    { online:[10,18,5,14,8,12,13,7,17,4], cash:[6,10,3,8,4,6,7,4,10,2], cheque:[4,7,2,6,3,4,5,3,6,2] },
    propMoM:     [38,35,32,22,20,18,19,17,16,15,14,13],
    waterDemand: [7,10,4,8,5,9,8,6,9,3],
    waterColl:   { online:[2,4,1,3,2,3,3,2,3,1], cash:[2,3,1,2,1,3,2,2,3,1], cheque:[1,1,1,1,1,1,1,1,1,0] },
    waterMoM:    [9,8,7,5,4,4,3,3,3,3,2,2],
    misc: {
      gunthewari:  { label:"Gunthewari",           icon:"", color:"#5a3db8", demand:[12,14,11,15,13,16,14,17,15,18,16,20], online:[4,5,4,5,5,6,5,6,6,7,6,8],   cash:[4,5,3,5,4,5,4,6,5,6,5,7],   cheque:[2,2,2,3,2,3,3,3,2,3,3,3] },
      building:    { label:"Building Permission",  icon:"", color:"#0d4f8a", demand:[20,22,18,24,21,26,23,28,25,30,27,32], online:[7,8,6,9,8,10,8,10,9,11,10,12], cash:[6,7,6,8,7,9,8,10,9,10,9,11], cheque:[4,4,4,5,4,5,5,6,5,7,6,7] },
      betterment:  { label:"Betterment Charges",   icon:"", color:"#0a6b3a", demand:[8,9,7,10,8,11,9,12,10,13,11,14],     online:[2,3,2,3,3,4,3,4,4,5,4,5],   cash:[3,3,2,3,2,3,3,4,3,4,3,5],   cheque:[1,1,1,2,1,2,1,2,1,2,2,2] },
      tanker:      { label:"Tanker Bhade",         icon:"", color:"#7a5200", demand:[5,6,5,7,6,7,6,8,7,8,7,9],           online:[1,2,1,2,2,2,2,3,2,3,2,3],   cash:[2,2,2,3,2,3,2,3,3,3,3,4],   cheque:[1,1,1,1,1,1,1,1,1,1,1,1] },
      newwater:    { label:"New Water Connection", icon:"", color:"#1a7fc4", demand:[6,7,5,8,6,8,7,9,8,10,9,11],         online:[2,3,2,3,2,3,3,4,3,4,3,5],   cash:[2,2,1,2,2,2,2,3,2,3,3,3],   cheque:[1,1,1,1,1,1,1,1,1,1,1,1] },
      health:      { label:"Health & Sewerage",    icon:"", color:"#c0202e", demand:[10,11,9,12,10,13,11,14,12,15,13,16], online:[3,4,3,4,3,5,4,5,4,6,5,6],   cash:[3,3,3,4,3,4,3,5,4,5,4,6],   cheque:[2,2,1,2,2,2,2,2,2,2,2,2] },
      fire:        { label:"Fire NOC",             icon:"", color:"#c0202e", demand:[8,9,7,10,8,11,9,12,10,13,11,14],     online:[3,4,3,4,4,5,4,5,5,6,5,7],   cash:[2,2,2,3,2,3,3,3,3,3,3,3],   cheque:[1,1,1,1,1,1,1,2,1,2,2,2] },
      license:     { label:"Trade License",        icon:"", color:"#c98a00", demand:[18,20,17,22,19,24,21,26,23,28,25,30], online:[7,8,7,9,8,10,9,11,10,12,11,13], cash:[5,6,4,6,5,7,6,8,7,8,7,9], cheque:[3,3,3,4,3,4,3,4,3,5,4,5] }
    }
  },
  "2024-25": {
    propDemand:  [22,35,10,28,16,24,27,15,34,9],
    propColl:    { online:[8,15,4,12,7,10,11,6,15,3], cash:[5,9,3,7,3,5,6,3,9,2], cheque:[3,6,2,5,2,3,4,2,5,2] },
    propMoM:     [33,30,28,19,17,16,16,15,14,13,12,11],
    waterDemand: [6,9,3,7,4,8,7,5,8,3],
    waterColl:   { online:[2,3,1,2,1,3,2,2,2,1], cash:[1,2,1,2,1,2,2,1,3,1], cheque:[1,1,0,1,1,1,1,1,1,0] },
    waterMoM:    [8,7,6,4,3,3,3,2,2,2,2,2],
    misc: {
      gunthewari:  { label:"Gunthewari",           icon:"", color:"#5a3db8", demand:[10,12,9,13,11,14,12,15,13,16,14,18], online:[3,4,3,4,4,5,4,5,5,6,5,7],   cash:[3,4,3,4,3,4,3,5,4,5,4,6],   cheque:[2,2,1,2,2,2,2,2,2,2,2,2] },
      building:    { label:"Building Permission",  icon:"", color:"#0d4f8a", demand:[17,19,15,21,18,23,20,25,22,27,24,29], online:[6,7,5,8,7,9,7,9,8,10,9,11], cash:[5,6,5,7,6,8,7,9,8,9,8,10], cheque:[3,3,3,4,3,4,4,5,4,6,5,6] },
      betterment:  { label:"Betterment Charges",   icon:"", color:"#0a6b3a", demand:[7,8,6,9,7,10,8,11,9,12,10,13],     online:[2,2,2,3,2,3,2,3,3,4,3,4],   cash:[2,3,2,3,2,3,2,3,2,3,2,4],   cheque:[1,1,1,1,1,1,1,2,1,2,1,2] },
      tanker:      { label:"Tanker Bhade",         icon:"", color:"#7a5200", demand:[4,5,4,6,5,6,5,7,6,7,6,8],           online:[1,1,1,2,1,2,1,2,2,2,2,2],   cash:[2,2,1,2,2,2,2,2,2,3,2,3],   cheque:[0,1,1,1,1,1,1,1,1,1,1,1] },
      newwater:    { label:"New Water Connection", icon:"", color:"#1a7fc4", demand:[5,6,4,7,5,7,6,8,7,9,8,10],         online:[2,2,1,2,2,2,2,3,2,3,2,4],   cash:[1,2,1,2,1,2,2,2,2,2,2,3],   cheque:[1,1,1,1,1,1,1,1,1,1,1,1] },
      health:      { label:"Health & Sewerage",    icon:"", color:"#c0202e", demand:[9,10,8,11,9,12,10,13,11,14,12,15], online:[3,3,2,3,3,4,3,4,3,5,4,5],   cash:[2,3,2,3,2,3,3,4,3,4,3,5],   cheque:[1,2,1,2,1,2,2,2,2,2,2,2] },
      fire:        { label:"Fire NOC",             icon:"", color:"#c0202e", demand:[7,8,6,9,7,10,8,11,9,12,10,13],     online:[2,3,2,3,3,4,3,4,4,5,4,6],   cash:[2,2,2,2,2,2,2,3,2,3,2,3],   cheque:[1,1,1,1,1,1,1,1,1,2,1,2] },
      license:     { label:"Trade License",        icon:"", color:"#c98a00", demand:[16,18,15,20,17,22,19,24,21,26,23,28], online:[6,7,6,8,7,9,8,10,9,11,10,12], cash:[4,5,3,5,4,6,5,7,6,7,6,8], cheque:[3,3,2,3,2,3,3,3,3,4,3,4] }
    }
  }
};

/* compute .all for every FY and service */
Object.keys(FY_DATA).forEach(function(fy) {
  var d = FY_DATA[fy];
  d.propColl.all  = d.propColl.online.map(function(v,i){ return v+d.propColl.cash[i]+d.propColl.cheque[i]; });
  d.waterColl.all = d.waterColl.online.map(function(v,i){ return v+d.waterColl.cash[i]+d.waterColl.cheque[i]; });
  Object.keys(d.misc).forEach(function(k){
    var s = d.misc[k];
    s.all = s.online.map(function(v,i){ return v+s.cash[i]+s.cheque[i]; });
  });
});

/* active data pointers - set by switchFY */
var propDemand, propColl, propMoM, waterDemand, waterColl, waterMoM, miscServices;
var propTotal, waterTotal, miscTotal, propDemandTotal, waterDemandTotal, miscDemandTotal;
var propOutstanding, waterOutstanding, miscOutstanding, totalOutstanding, grandTotal, grandDemand;
var propOnline, waterOnline, miscOnline, totalDigital;
var propTotal_prev, waterTotal_prev, miscTotal_prev;
var propMoM_prev, waterMoM_prev;

function loadFYData(fy) {
  var d    = FY_DATA[fy];
  var prev = fy === "2025-26" ? FY_DATA["2024-25"] : null;

  propDemand   = d.propDemand;
  propColl     = d.propColl;
  propMoM      = d.propMoM;
  waterDemand  = d.waterDemand;
  waterColl    = d.waterColl;
  waterMoM     = d.waterMoM;
  miscServices = d.misc;

  propTotal   = sum(propColl.all);
  waterTotal  = sum(waterColl.all);
  miscTotal   = 0; Object.keys(miscServices).forEach(function(k){ miscTotal += sum(miscServices[k].all); });

  propDemandTotal  = sum(propDemand);
  waterDemandTotal = sum(waterDemand);
  miscDemandTotal  = 0; Object.keys(miscServices).forEach(function(k){ miscDemandTotal += sum(miscServices[k].demand); });

  propOutstanding  = propDemandTotal  - propTotal;
  waterOutstanding = waterDemandTotal - waterTotal;
  miscOutstanding  = 0; // No fixed demand for misc — usage-based services
  totalOutstanding = propOutstanding + waterOutstanding;
  grandTotal       = propTotal + waterTotal + miscTotal;
  grandDemand      = propDemandTotal + waterDemandTotal; // misc excluded — no fixed demand

  propOnline  = sum(propColl.online);
  waterOnline = sum(waterColl.online);
  miscOnline  = 0; Object.keys(miscServices).forEach(function(k){ miscOnline += sum(miscServices[k].online); });
  totalDigital = propOnline + waterOnline + miscOnline;

  if(prev) {
    propTotal_prev  = sum(prev.propColl.all);
    waterTotal_prev = sum(prev.waterColl.all);
    miscTotal_prev  = 0; Object.keys(prev.misc).forEach(function(k){ miscTotal_prev += sum(prev.misc[k].all); });
    propMoM_prev  = prev.propMoM;
    waterMoM_prev = prev.waterMoM;
  } else {
    propTotal_prev  = Math.round(propTotal  * 0.85);
    waterTotal_prev = Math.round(waterTotal * 0.85);
    miscTotal_prev  = Math.round(miscTotal  * 0.82);
    propMoM_prev  = propMoM.map(function(v){ return Math.round(v*0.85); });
    waterMoM_prev = waterMoM.map(function(v){ return Math.round(v*0.85); });
  }
}

loadFYData("2025-26");

/* ===== UPDATE KPI CARDS ===== */
function updateKPIs(fy) {
  var prevLabel = fy === "2025-26" ? "FY 2024-25" : "FY 2023-24";
  document.getElementById("kpi-prop-full").textContent    = fmtFull(propTotal);
  document.getElementById("kpi-prop-short").textContent   = fmt(propTotal);
  document.getElementById("kpi-prop-demand").textContent  = fmtFull(propDemandTotal);
  document.getElementById("kpi-prop-yoy").textContent     = (propTotal > propTotal_prev ? "+" : "") + pct(propTotal-propTotal_prev,propTotal_prev)+"% vs "+prevLabel;
  document.getElementById("kpi-prop-eff").textContent     = pct(propTotal,propDemandTotal)+"% efficiency";

  document.getElementById("kpi-water-full").textContent   = fmtFull(waterTotal);
  document.getElementById("kpi-water-short").textContent  = fmt(waterTotal);
  document.getElementById("kpi-water-demand").textContent = fmtFull(waterDemandTotal);
  document.getElementById("kpi-water-yoy").textContent    = (waterTotal > waterTotal_prev ? "+" : "") + pct(waterTotal-waterTotal_prev,waterTotal_prev)+"% vs "+prevLabel;
  document.getElementById("kpi-water-eff").textContent    = pct(waterTotal,waterDemandTotal)+"% efficiency";

  document.getElementById("kpi-misc-full").textContent    = fmtFull(miscTotal);
  document.getElementById("kpi-misc-short").textContent   = fmt(miscTotal);
  document.getElementById("kpi-misc-yoy").textContent     = (miscTotal > miscTotal_prev ? "+" : "") + pct(miscTotal-miscTotal_prev,miscTotal_prev)+"% vs "+prevLabel;
  document.getElementById("kpi-misc-eff").textContent     = pct(miscOnline, miscTotal)+"% collected digitally";

  document.getElementById("kpi-digital-full").textContent = fmtFull(totalDigital);
  document.getElementById("kpi-digital-short").textContent= fmt(totalDigital);
  document.getElementById("kpi-digital-pct").textContent  = pct(totalDigital,grandTotal)+"% of total";

  document.getElementById("kpi-out-full").textContent     = fmtFull(totalOutstanding);
  document.getElementById("kpi-out-short").textContent    = fmt(totalOutstanding);
  document.getElementById("kpi-out-pct").textContent      = pct(totalOutstanding,grandDemand)+"% of demand";
}
function makeStatStrip(id, pills) {
  var el = document.getElementById(id);
  if(!el) return;
  el.innerHTML = pills.map(function(p){
    return '<div class="stat-pill"><div class="stat-pill-label">'+p.label+'</div><div class="stat-pill-value">'+p.value+'</div>'+(p.sub?'<div class="stat-pill-sub">'+p.sub+'</div>':'')+'</div>';
  }).join('');
}
function refreshStatStrips(fy) {
  var pl = fy === "2025-26" ? "FY 2024-25" : "FY 2023-24";
  makeStatStrip("propStatStrip",[
    {label:"Total Demand",  value:fmtFull(propDemandTotal), sub:fmt(propDemandTotal)},
    {label:"Collected",     value:fmtFull(propTotal),       sub:fmt(propTotal)},
    {label:"Outstanding",   value:fmtFull(propOutstanding), sub:fmt(propOutstanding)},
    {label:"Efficiency",    value:pct(propTotal,propDemandTotal)+"%"},
    {label:"Online",        value:fmtFull(propOnline),      sub:pct(propOnline,propTotal)+"% of coll."},
    {label:"Cash",          value:fmtFull(sum(propColl.cash))},
    {label:"Cheque",        value:fmtFull(sum(propColl.cheque))},
    {label:"vs "+pl,        value:(propTotal>propTotal_prev?"+":"")+pct(propTotal-propTotal_prev,propTotal_prev)+"%"}
  ]);
  makeStatStrip("waterStatStrip",[
    {label:"Total Demand",  value:fmtFull(waterDemandTotal), sub:fmt(waterDemandTotal)},
    {label:"Collected",     value:fmtFull(waterTotal),       sub:fmt(waterTotal)},
    {label:"Outstanding",   value:fmtFull(waterOutstanding), sub:fmt(waterOutstanding)},
    {label:"Efficiency",    value:pct(waterTotal,waterDemandTotal)+"%"},
    {label:"Online",        value:fmtFull(waterOnline),      sub:pct(waterOnline,waterTotal)+"% of coll."},
    {label:"Cash",          value:fmtFull(sum(waterColl.cash))},
    {label:"Cheque",        value:fmtFull(sum(waterColl.cheque))},
    {label:"vs "+pl,        value:(waterTotal>waterTotal_prev?"+":"")+pct(waterTotal-waterTotal_prev,waterTotal_prev)+"%"}
  ]);
}
function buildMiscSection(key) {
  var s=miscServices[key], tot=sum(s.all), dem=sum(s.demand), out=dem-tot;
  var on=sum(s.online), ca=sum(s.cash), ch=sum(s.cheque);
  var prevFYData = activeFY==="2025-26" ? FY_DATA["2024-25"] : null;
  var prevTot = prevFYData ? sum(prevFYData.misc[key].all) : Math.round(tot*0.83);
  var pl = activeFY==="2025-26" ? "FY 2024-25" : "FY 2023-24";
  var el = document.getElementById(key);
  el.innerHTML =
    '<div class="section-header"><h2>'+s.icon+' '+s.label+'</h2><div class="section-meta">Head Office | FY '+activeFY+'</div></div>'
    +'<p class="section-note">Collected centrally at Head Office. No fixed demand — revenue varies by usage of service.</p>'
    +'<div class="misc-head-cards">'
      +'<div class="misc-head-card green"><div class="misc-head-card-label">Total Collected</div><div class="misc-head-card-value">'+fmtFull(tot)+'</div><div class="misc-head-card-sub">'+fmt(tot)+'</div></div>'
      +'<div class="misc-head-card"><div class="misc-head-card-label">Online</div><div class="misc-head-card-value">'+fmtFull(on)+'</div><div class="misc-head-card-sub">'+fmt(on)+' | '+pct(on,tot)+'% digital</div></div>'
      +'<div class="misc-head-card amber"><div class="misc-head-card-label">Cash</div><div class="misc-head-card-value">'+fmtFull(ca)+'</div><div class="misc-head-card-sub">'+fmt(ca)+' | '+pct(ca,tot)+'%</div></div>'
      +'<div class="misc-head-card"><div class="misc-head-card-label">Cheque</div><div class="misc-head-card-value">'+fmtFull(ch)+'</div><div class="misc-head-card-sub">'+fmt(ch)+' | '+pct(ch,tot)+'%</div></div>'
      +'<div class="misc-head-card green"><div class="misc-head-card-label">vs '+pl+'</div><div class="misc-head-card-value">'+(tot>prevTot?"+":"")+pct(tot-prevTot,prevTot)+'%</div><div class="misc-head-card-sub">Year-on-Year</div></div>'
    +'</div>'
    +'<div class="toolbar"><div class="mode-filter" id="'+key+'ModeFilter">'
      +'<span class="mode-label">Mode:</span>'
      +'<button class="mode-btn active" onclick="setMode(\''+key+'\',\'all\',this)">All</button>'
      +'<button class="mode-btn online" onclick="setMode(\''+key+'\',\'online\',this)">Online</button>'
      +'<button class="mode-btn cash" onclick="setMode(\''+key+'\',\'cash\',this)">Cash</button>'
      +'<button class="mode-btn cheque" onclick="setMode(\''+key+'\',\'cheque\',this)">Cheque</button>'
    +'</div></div>'
    +'<div class="grid">'
      +'<div class="chart-box full-width h300"><canvas id="'+key+'BarChart"></canvas></div>'
      +'<div class="chart-box h250"><canvas id="'+key+'ModePie"></canvas></div>'
      +'<div class="chart-box h250"><canvas id="'+key+'YoYChart"></canvas></div>'
    +'</div>';
}
function buildAllMiscSections(){ Object.keys(miscServices).forEach(buildMiscSection); }
buildAllMiscSections();
/* ===== CHART HELPERS ===== */
var charts = {};
function buildBarDS(dem, coll, mode) {
  var colors={all:'rgba(40,167,100,.85)',online:'rgba(26,111,168,.85)',cash:'rgba(26,170,92,.85)',cheque:'rgba(201,138,0,.9)'};
  var labels={all:'Collection (All)',online:'Online',cash:'Cash',cheque:'Cheque'};
  return [{label:'Demand (Rs.L)',data:dem,backgroundColor:'rgba(180,190,200,.55)'},{label:labels[mode]+' (Rs.L)',data:coll,backgroundColor:colors[mode]}];
}
var barOpts=function(t){return{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top'},title:{display:true,text:t,font:{size:13}}},scales:{x:{stacked:false},y:{beginAtZero:true,title:{display:true,text:'Rs. Lakhs'}}}};};
var pieOpts=function(t){return{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom'},title:{display:true,text:t,font:{size:12}}}};};
var lineOpts=function(t){return{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top'},title:{display:true,text:t,font:{size:13}}},scales:{y:{beginAtZero:true,title:{display:true,text:'Rs. Lakhs'}}}};};

function setMode(section, mode, btn) {
  var container = document.getElementById(section+'ModeFilter');
  container.querySelectorAll('.mode-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  var s = miscServices[section] || null;
  var dem  = s ? s.demand : (section==='property' ? propDemand : waterDemand);
  var coll = s ? s        : (section==='property' ? propColl   : waterColl);
  charts[section].data.datasets = buildBarDS(dem, coll[mode], mode);
  charts[section].update();
}

function getPrevFYLabel() { return activeFY==="2025-26" ? "FY 2024-25" : "FY 2023-24"; }
function getCurrFYLabel() { return "FY "+activeFY; }

function getPrevMiscAll(key) {
  var prevFYData = activeFY==="2025-26" ? FY_DATA["2024-25"] : null;
  return prevFYData ? prevFYData.misc[key].all : miscServices[key].all.map(function(v){ return Math.round(v*0.83); });
}
function getPrevPropMoM() { return propMoM_prev; }
function getPrevWaterMoM() { return waterMoM_prev; }
/* ===== OUTSTANDING SECTION ===== */
function buildOutstandingCharts() {
  // Zone-wise outstanding: property + water per zone
  var propOut  = propDemand.map(function(v,i){ return v - propColl.all[i]; });
  var waterOut = waterDemand.map(function(v,i){ return v - waterColl.all[i]; });

  // Misc outstanding per head
  var miscHeadLabels = [], miscHeadOut = [], miscHeadColors = [];
  Object.keys(miscServices).forEach(function(k){
    var s = miscServices[k];
    miscHeadLabels.push(s.label);
    miscHeadOut.push(sum(s.all));   // collection total, not outstanding
    miscHeadColors.push(s.color);
  });

  // Stat strip
  makeStatStrip('outStatStrip', [
    {label:'Property Outstanding',  value: fmtFull(propOutstanding),  sub: fmt(propOutstanding)},
    {label:'Water Outstanding',     value: fmtFull(waterOutstanding), sub: fmt(waterOutstanding)},
    {label:'Total Outstanding',     value: fmtFull(totalOutstanding), sub: fmt(totalOutstanding)},
    {label:'% of Demand',           value: pct(totalOutstanding, grandDemand)+'%'},
    {label:'Note',                  value: 'Misc excluded', sub: 'No fixed demand'}
  ]);

  // Zone bar: property + water outstanding side by side
  if(charts.outZoneBar) charts.outZoneBar.destroy();
  charts.outZoneBar = new Chart(document.getElementById('outZoneBar'), {
    type: 'bar',
    data: {
      labels: WARDS,
      datasets: [
        { label: 'Property Outstanding (Rs.L)', data: propOut,  backgroundColor: 'rgba(192,32,46,.8)' },
        { label: 'Water Outstanding (Rs.L)',    data: waterOut, backgroundColor: 'rgba(201,138,0,.8)' }
      ]
    },
    options: barOpts('Zone-wise Outstanding — Property & Water (' + getCurrFYLabel() + ')')
  });

  // Misc collection per head (not outstanding — no fixed demand)
  if(charts.outHeadBar) charts.outHeadBar.destroy();
  charts.outHeadBar = new Chart(document.getElementById('outHeadBar'), {
    type: 'bar',
    data: {
      labels: miscHeadLabels,
      datasets: [{ label: 'Collected (Rs.L)', data: miscHeadOut, backgroundColor: miscHeadColors }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, title: { display: true, text: 'Misc Collection by Service Head — (No fixed demand, usage-based)', font: { size: 13 } } },
      scales: { y: { beginAtZero: true, title: { display: true, text: 'Rs. Lakhs' } } }
    }
  });

  // Overall pie
  if(charts.outPie) charts.outPie.destroy();
  charts.outPie = new Chart(document.getElementById('outPie'), {
    type: 'doughnut',
    data: {
      labels: ['Property', 'Water'],
      datasets: [{ data: [propOutstanding, waterOutstanding], backgroundColor: ['#c0202e', '#c98a00'] }]
    },
    options: pieOpts('Outstanding Split — Property vs Water (Rs.L)')
  });
}

/* ===== CREATE ALL CHARTS ===== */
function createCharts() {
  var miscMonthly = MONTHS.map(function(m,i){
    var t=0; Object.keys(miscServices).forEach(function(k){ t+=miscServices[k].all[i]; }); return t;
  });
  var miscLabels=[],miscVals=[],miscColors=['#5a3db8','#0d4f8a','#0a6b3a','#7a5200','#1a7fc4','#c0202e','#c0202e','#c98a00'];
  Object.keys(miscServices).forEach(function(k){ miscLabels.push(miscServices[k].label); miscVals.push(sum(miscServices[k].all)); });

  charts.overviewZone = new Chart(document.getElementById('overviewZoneChart'),{type:'bar',data:{labels:WARDS,datasets:[
    {label:'Prop Demand',data:propDemand,backgroundColor:'rgba(13,79,138,.7)'},
    {label:'Prop Collected',data:propColl.all,backgroundColor:'rgba(26,170,92,.8)'},
    {label:'Water Demand',data:waterDemand,backgroundColor:'rgba(23,162,184,.5)'},
    {label:'Water Collected',data:waterColl.all,backgroundColor:'rgba(0,188,140,.5)'}
  ]},options:barOpts('Demand vs Collection by Zone (Property & Water) — '+getCurrFYLabel())});

  charts.overviewTrend = new Chart(document.getElementById('overviewMonthlyTrend'),{type:'line',data:{labels:MONTHS,datasets:[
    {label:'Property',data:propMoM,borderColor:'#1a7fc4',backgroundColor:'rgba(26,127,196,.1)',fill:true,tension:.4},
    {label:'Water',data:waterMoM,borderColor:'#1aaa5c',backgroundColor:'rgba(26,170,92,.1)',fill:true,tension:.4},
    {label:'Misc',data:miscMonthly,borderColor:'#c98a00',backgroundColor:'rgba(201,138,0,.1)',fill:true,tension:.4}
  ]},options:lineOpts('Monthly Collection Trend — '+getCurrFYLabel()+' (Rs. Lakhs)')});

  charts.overviewMisc = new Chart(document.getElementById('overviewMiscBreakdown'),{type:'doughnut',data:{labels:miscLabels,datasets:[{data:miscVals,backgroundColor:miscColors}]},options:pieOpts('Misc Revenue — Head-wise Breakdown (Rs. Lakhs) — '+getCurrFYLabel())});

  charts.overviewYoY = new Chart(document.getElementById('overviewYoY'),{type:'bar',data:{labels:MONTHS,datasets:[
    {label:getPrevFYLabel(),data:propMoM_prev.map(function(v,i){return v+waterMoM_prev[i];}),backgroundColor:'rgba(180,190,200,.6)'},
    {label:getCurrFYLabel(),data:propMoM.map(function(v,i){return v+waterMoM[i];}),backgroundColor:'rgba(26,127,196,.8)'}
  ]},options:barOpts('Year-on-Year Comparison — Property + Water (Rs. Lakhs)')});

  charts.property = new Chart(document.getElementById('propertyDemandCollectionChart'),{type:'bar',data:{labels:WARDS,datasets:buildBarDS(propDemand,propColl.all,'all')},options:barOpts('Property Tax: Demand vs Collection per Zone — '+getCurrFYLabel())});
  charts.propPie = new Chart(document.getElementById('propertyPie'),{type:'doughnut',data:{labels:['Online','Cash','Cheque','Outstanding'],datasets:[{data:[propOnline,sum(propColl.cash),sum(propColl.cheque),propOutstanding],backgroundColor:['#1a7fc4','#1aaa5c','#c98a00','#c0202e']}]},options:pieOpts('Property — Payment Mode Split (Rs.L) — '+getCurrFYLabel())});
  charts.propOut = new Chart(document.getElementById('outstandingChart'),{type:'bar',data:{labels:WARDS,datasets:[{label:'Outstanding (Rs.L)',data:propDemand.map(function(v,i){return v-propColl.all[i];}),backgroundColor:'rgba(192,32,46,.7)'}]},options:barOpts('Property — Outstanding per Zone')});
  charts.propMoM = new Chart(document.getElementById('propertyMoM'),{type:'line',data:{labels:MONTHS,datasets:[
    {label:getCurrFYLabel(),data:propMoM,borderColor:'#1a7fc4',backgroundColor:'rgba(26,127,196,.1)',fill:true,tension:.4},
    {label:getPrevFYLabel(),data:getPrevPropMoM(),borderColor:'#aaa',backgroundColor:'rgba(180,180,180,.1)',fill:true,tension:.4,borderDash:[4,4]}
  ]},options:lineOpts('Property — Month-on-Month Collection (Rs.L)')});
  charts.propYoY = new Chart(document.getElementById('propertyYoY'),{type:'bar',data:{labels:MONTHS,datasets:[
    {label:getPrevFYLabel(),data:getPrevPropMoM(),backgroundColor:'rgba(180,190,200,.6)'},
    {label:getCurrFYLabel(),data:propMoM,backgroundColor:'rgba(26,127,196,.8)'}
  ]},options:barOpts('Property — Year-on-Year Monthly (Rs.L)')});

  charts.water = new Chart(document.getElementById('waterDemandCollectionChart'),{type:'bar',data:{labels:WARDS,datasets:buildBarDS(waterDemand,waterColl.all,'all')},options:barOpts('Water Charges: Demand vs Collection per Zone — '+getCurrFYLabel())});
  charts.waterPie = new Chart(document.getElementById('waterPie'),{type:'doughnut',data:{labels:['Online','Cash','Cheque','Outstanding'],datasets:[{data:[waterOnline,sum(waterColl.cash),sum(waterColl.cheque),waterOutstanding],backgroundColor:['#1a7fc4','#1aaa5c','#c98a00','#c0202e']}]},options:pieOpts('Water — Payment Mode Split (Rs.L) — '+getCurrFYLabel())});
  charts.waterMoM = new Chart(document.getElementById('waterMoM'),{type:'line',data:{labels:MONTHS,datasets:[
    {label:getCurrFYLabel(),data:waterMoM,borderColor:'#1aaa5c',backgroundColor:'rgba(26,170,92,.1)',fill:true,tension:.4},
    {label:getPrevFYLabel(),data:getPrevWaterMoM(),borderColor:'#aaa',backgroundColor:'rgba(180,180,180,.1)',fill:true,tension:.4,borderDash:[4,4]}
  ]},options:lineOpts('Water — Month-on-Month Collection (Rs.L)')});
  charts.waterYoY = new Chart(document.getElementById('waterYoY'),{type:'bar',data:{labels:MONTHS,datasets:[
    {label:getPrevFYLabel(),data:getPrevWaterMoM(),backgroundColor:'rgba(180,190,200,.6)'},
    {label:getCurrFYLabel(),data:waterMoM,backgroundColor:'rgba(26,170,92,.8)'}
  ]},options:barOpts('Water — Year-on-Year Monthly (Rs.L)')});

  Object.keys(miscServices).forEach(function(key){
    var s=miscServices[key], tot=sum(s.all), dem=sum(s.demand), on=sum(s.online), ca=sum(s.cash), ch=sum(s.cheque);
    var prev=getPrevMiscAll(key);
    charts[key] = new Chart(document.getElementById(key+'BarChart'),{type:'bar',data:{labels:MONTHS,datasets:[
      {label:'Online (Rs.L)',  data:s.online, backgroundColor:'rgba(26,127,196,.85)', stack:'a'},
      {label:'Cash (Rs.L)',    data:s.cash,   backgroundColor:'rgba(26,170,92,.85)',  stack:'a'},
      {label:'Cheque (Rs.L)',  data:s.cheque, backgroundColor:'rgba(201,138,0,.9)',   stack:'a'}
    ]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top'},title:{display:true,text:s.label+' — Monthly Collection by Mode (Head Office) — '+getCurrFYLabel()}},scales:{x:{stacked:true},y:{stacked:true,beginAtZero:true,title:{display:true,text:'Rs. Lakhs'}}}}});
    charts[key+'Pie'] = new Chart(document.getElementById(key+'ModePie'),{type:'doughnut',data:{labels:['Online','Cash','Cheque','Outstanding'],datasets:[{data:[on,ca,ch,dem-tot],backgroundColor:['#1a7fc4','#1aaa5c','#c98a00','#c0202e']}]},options:pieOpts(s.label+' — Payment Mode Split (Rs.L)')});
    charts[key+'YoY'] = new Chart(document.getElementById(key+'YoYChart'),{type:'bar',data:{labels:MONTHS,datasets:[
      {label:getPrevFYLabel(),data:prev,backgroundColor:'rgba(180,190,200,.6)'},
      {label:getCurrFYLabel(),data:s.all,backgroundColor:s.color+'cc'}
    ]},options:barOpts(s.label+' — Year-on-Year Monthly (Rs.L)')});
  });

  var rtsRec=[45,50,42,55,48,60,52,65,58,70,62,75], rtsRes=[40,45,38,50,44,55,48,60,53,65,57,70];
  var rtsPend=rtsRec.map(function(v,i){return v-rtsRes[i];});
  charts.rts = new Chart(document.getElementById('rtsMonthlyChart'),{type:'bar',data:{labels:MONTHS,datasets:[
    {label:'Received',data:rtsRec,backgroundColor:'rgba(26,127,196,.7)'},
    {label:'Resolved (RTS)',data:rtsRes,backgroundColor:'rgba(26,170,92,.8)'},
    {label:'Pending',data:rtsPend,backgroundColor:'rgba(192,32,46,.7)'}
  ]},options:barOpts('RTS — Monthly Applications — '+getCurrFYLabel())});
  charts.rtsStatus = new Chart(document.getElementById('rtsStatusPie'),{type:'doughnut',data:{labels:['Resolved','Pending','Delayed'],datasets:[{data:[sum(rtsRes),sum(rtsPend),12],backgroundColor:['#1aaa5c','#c98a00','#c0202e']}]},options:pieOpts('RTS — Overall Status')});
  charts.rtsService = new Chart(document.getElementById('rtsServiceBar'),{type:'bar',data:{labels:Object.keys(miscServices).map(function(k){return miscServices[k].label;}),datasets:[{label:'RTS Compliance %',data:[92,88,95,85,90,87,93,89],backgroundColor:'rgba(26,127,196,.8)'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top'},title:{display:true,text:'RTS Compliance % by Service'}},scales:{y:{min:70,max:100,title:{display:true,text:'%'}}}}});

  var digProp=propMoM.map(function(v){return Math.round(v*.5);}), digWater=waterMoM.map(function(v){return Math.round(v*.45);});
  var digMisc=MONTHS.map(function(m,i){var t=0;Object.keys(miscServices).forEach(function(k){t+=miscServices[k].online[i];});return t;});
  charts.digital = new Chart(document.getElementById('digitalMonthlyChart'),{type:'line',data:{labels:MONTHS,datasets:[
    {label:'Property Online',data:digProp,borderColor:'#1a7fc4',backgroundColor:'rgba(26,127,196,.1)',fill:true,tension:.4},
    {label:'Water Online',data:digWater,borderColor:'#1aaa5c',backgroundColor:'rgba(26,170,92,.1)',fill:true,tension:.4},
    {label:'Misc Online',data:digMisc,borderColor:'#c98a00',backgroundColor:'rgba(201,138,0,.1)',fill:true,tension:.4}
  ]},options:lineOpts('Digital Collections — Monthly Trend — '+getCurrFYLabel()+' (Rs. Lakhs)')});
  charts.digitalMode = new Chart(document.getElementById('digitalModePie'),{type:'doughnut',data:{labels:['Online Portal','UPI/QR','NEFT/RTGS'],datasets:[{data:[Math.round(totalDigital*.45),Math.round(totalDigital*.35),Math.round(totalDigital*.2)],backgroundColor:['#1a7fc4','#5a3db8','#1aaa5c']}]},options:pieOpts('Digital Mode Split (Rs.L)')});
  var digHeadLabels=['Property','Water'].concat(Object.keys(miscServices).map(function(k){return miscServices[k].label;}));
  var digHeadVals=[propOnline,waterOnline].concat(Object.keys(miscServices).map(function(k){return sum(miscServices[k].online);}));
  charts.digitalHead = new Chart(document.getElementById('digitalHeadBar'),{type:'bar',data:{labels:digHeadLabels,datasets:[{label:'Online Collection (Rs.L)',data:digHeadVals,backgroundColor:'rgba(26,127,196,.8)'}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top'},title:{display:true,text:'Digital Collection by Revenue Head (Rs.L)'}},scales:{y:{beginAtZero:true}}}});
  var digCurr=digProp.map(function(v,i){return v+digWater[i]+digMisc[i];}), digPrev=digCurr.map(function(v){return Math.round(v*.8);});
  charts.digitalYoY = new Chart(document.getElementById('digitalYoY'),{type:'bar',data:{labels:MONTHS,datasets:[
    {label:getPrevFYLabel(),data:digPrev,backgroundColor:'rgba(180,190,200,.6)'},
    {label:getCurrFYLabel(),data:digCurr,backgroundColor:'rgba(26,127,196,.8)'}
  ]},options:barOpts('Digital Collections — Year-on-Year (Rs.L)')});

  /* --- OUTSTANDING --- */
  buildOutstandingCharts();
}
createCharts();

/* ===== SWITCH FY ===== */
function switchFY(fy, btn) {
  if(fy === activeFY) return;
  activeFY = fy;
  document.querySelectorAll('.fy-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  loadFYData(fy);
  updateKPIs(fy);
  refreshStatStrips(fy);
  buildAllMiscSections();
  Object.keys(charts).forEach(function(k){ if(charts[k]) charts[k].destroy(); });
  charts = {};
  createCharts();
  buildOutstandingCharts();
  displayTable();
}

/* ===== INITIAL RENDER ===== */
updateKPIs("2025-26");
refreshStatStrips("2025-26");

/* ===== PROPERTY TABLE ===== */
var tableData = [];
var modes = ['Online','Cash','Cheque'];
for(var i=1; i<=100; i++){
  var ward = WARDS[i % 10];
  var dem  = Math.round(Math.random()*40000 + 10000);
  var coll = Math.round(dem * (0.6 + Math.random()*0.35));
  tableData.push({
    id:'P'+String(i).padStart(3,'0'),
    owner:'Owner '+i,
    ward: ward,
    demand: dem,
    collection: coll,
    mode: modes[i % 3],
    status: coll >= dem ? 'Paid' : 'Pending'
  });
}

var currentPage = 1, rowsPerPage = 10;

function displayTable() {
  var tbody = document.querySelector('#dataTable tbody');
  if(!tbody) return;
  tbody.innerHTML = '';
  var ward = document.getElementById('wardFilter').value;
  var filtered = tableData.filter(function(d){ return ward === 'all' || d.ward === ward; });
  var start = (currentPage-1)*rowsPerPage;
  filtered.slice(start, start+rowsPerPage).forEach(function(r){
    tbody.innerHTML += '<tr>'
      +'<td>'+r.id+'</td>'
      +'<td>'+r.owner+'</td>'
      +'<td>'+r.ward+'</td>'
      +'<td>\u20b9'+r.demand.toLocaleString()+'</td>'
      +'<td>\u20b9'+r.collection.toLocaleString()+'</td>'
      +'<td>'+r.mode+'</td>'
      +'<td><span class="badge-'+(r.status==='Paid'?'paid':'pending')+'">'+r.status+'</span></td>'
      +'</tr>';
  });
  var pages = Math.ceil(filtered.length/rowsPerPage);
  var pag = document.getElementById('pagination');
  if(!pag) return;
  pag.innerHTML = '';
  for(var p=1; p<=pages; p++){
    pag.innerHTML += '<button onclick="goPage('+p+')"'+(p===currentPage?' style="background:#0d2137"':'')+'>'+p+'</button>';
  }
}

function goPage(p){ currentPage = p; displayTable(); }
function applyFilters(){ currentPage = 1; displayTable(); }
displayTable();
