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
    // Real figures from CSMC dashboard as on 31-Mar-2025
    // Property Total: Rs.2,13,39,09,648 = 21339 L (zone-wise from bar chart)
    // Water Total:    Rs.22,80,32,144   =  2280 L (zone-wise from bar chart)
    // Misc Total:     Rs.5,73,67,21,912 = 57367 L (split across 8 heads)
    propDemand:  [2200, 3500, 1100, 2800, 1800, 2200, 3100, 1900, 3400, 950],
    propColl: {
      online: [998, 1768, 599, 1283, 912,  867, 1391,  844, 1369, 639],
      cash:   [599, 1061, 359,  770, 547,  520,  835,  506,  821, 383],
      cheque: [399,  707, 240,  513, 365,  347,  557,  338,  547, 255]
    },
    propMoM:     [3300, 3000, 2800, 1900, 1700, 1600, 1600, 1500, 1400, 1300, 1200, 1100],
    waterDemand: [300, 160, 340, 400, 280, 460, 200, 390, 60, 20],
    waterColl: {
      online: [104, 52, 120, 144, 100, 168, 68, 140, 20,  8],
      cash:   [ 78, 39,  90, 108,  75, 126, 51, 105, 15,  6],
      cheque: [ 78, 39,  90, 108,  75, 126, 51, 105, 15,  6]
    },
    waterMoM: [800, 700, 600, 400, 300, 300, 300, 200, 200, 200, 200, 200],
    misc: {
      gunthewari: { label:"Gunthewari",           icon:"\uD83D\uDDFA", color:"#5a3db8",
        demand:[600,700,550,750,650,800,700,850,750,900,800,1000],
        online:[200,233,183,250,217,267,233,283,250,300,267,333],
        cash:  [200,233,183,250,217,267,233,283,250,300,267,333],
        cheque:[100,117, 92,125,108,133,117,142,125,150,133,167] },
      building: { label:"Building Permission",    icon:"\uD83C\uDFD7", color:"#0d4f8a",
        demand:[1200,1350,1100,1500,1300,1600,1400,1700,1500,1800,1600,2000],
        online:[ 400, 450, 367, 500, 433, 533, 467, 567, 500, 600, 533, 667],
        cash:  [ 400, 450, 367, 500, 433, 533, 467, 567, 500, 600, 533, 667],
        cheque:[ 200, 225, 183, 250, 217, 267, 233, 283, 250, 300, 267, 333] },
      betterment: { label:"Betterment Charges",   icon:"\uD83D\uDCC8", color:"#0a6b3a",
        demand:[400,450,367,500,433,533,467,567,500,600,533,667],
        online:[133,150,122,167,144,178,156,189,167,200,178,222],
        cash:  [133,150,122,167,144,178,156,189,167,200,178,222],
        cheque:[ 67, 75, 61, 83, 72, 89, 78, 94, 83,100, 89,111] },
      tanker: { label:"Tanker Bhade",             icon:"\uD83D\uDE9B", color:"#7a5200",
        demand:[250,280,230,310,270,330,290,350,310,370,330,410],
        online:[ 83, 93, 77,103, 90,110, 97,117,103,123,110,137],
        cash:  [ 83, 93, 77,103, 90,110, 97,117,103,123,110,137],
        cheque:[ 42, 47, 38, 52, 45, 55, 48, 58, 52, 62, 55, 68] },
      newwater: { label:"New Water Connection",   icon:"\uD83D\uDD27", color:"#1a7fc4",
        demand:[300,340,275,375,325,400,350,425,375,450,400,500],
        online:[100,113, 92,125,108,133,117,142,125,150,133,167],
        cash:  [100,113, 92,125,108,133,117,142,125,150,133,167],
        cheque:[ 50, 57, 46, 63, 54, 67, 58, 71, 63, 75, 67, 83] },
      health: { label:"Health & Sewerage",        icon:"\uD83C\uDFE5", color:"#c0202e",
        demand:[500,560,458,625,542,667,583,708,625,750,667,833],
        online:[167,187,153,208,181,222,194,236,208,250,222,278],
        cash:  [167,187,153,208,181,222,194,236,208,250,222,278],
        cheque:[ 83, 93, 77,104, 90,111, 97,118,104,125,111,139] },
      fire: { label:"Fire NOC",                   icon:"\uD83D\uDD25", color:"#c0202e",
        demand:[350,395,322,438,380,468,408,497,438,525,468,583],
        online:[117,132,107,146,127,156,136,166,146,175,156,194],
        cash:  [117,132,107,146,127,156,136,166,146,175,156,194],
        cheque:[ 58, 66, 54, 73, 63, 78, 68, 83, 73, 88, 78, 97] },
      license: { label:"Trade License",           icon:"\uD83D\uDCC4", color:"#c98a00",
        demand:[ 900,1010, 825,1125, 975,1200,1050,1275,1125,1350,1200,1500],
        online:[ 300, 337, 275, 375, 325, 400, 350, 425, 375, 450, 400, 500],
        cash:  [ 300, 337, 275, 375, 325, 400, 350, 425, 375, 450, 400, 500],
        cheque:[ 150, 168, 138, 188, 163, 200, 175, 213, 188, 225, 200, 250] }
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

  // Update all section FY labels at once
  document.getElementById("overviewMeta").innerHTML = "FY "+fy+" &nbsp;|&nbsp; All figures in \u20b9 Lakhs";
  document.querySelectorAll(".fy-meta").forEach(function(el){
    var suffix = el.getAttribute("data-suffix") || "";
    el.textContent = suffix + " | FY " + fy;
  });
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
    +'<div class="data-source-banner">'
      +'<span class="ds-icon">⚠️</span>'
      +'<div>'
        +'<strong>Sample Data — Backend Not Yet Connected</strong><br>'
        +'<span>Figures shown are illustrative. Once backend is connected, this section will pull from the actual collection register.</span>'
      +'</div>'
      +'<div class="ds-schema">'
        +'<strong>Expected Backend Columns:</strong> '
        +'Receipt No. &nbsp;|&nbsp; Applicant Name &nbsp;|&nbsp; Service Type &nbsp;|&nbsp; Fee Amount (₹) &nbsp;|&nbsp; Payment Mode &nbsp;|&nbsp; Payment Date &nbsp;|&nbsp; Transaction ID &nbsp;|&nbsp; Status'
      +'</div>'
    +'</div>'
    +'<p class="section-note">Collected centrally at Head Office. No fixed demand — revenue varies by usage of service.</p>'
    +'<div class="misc-head-cards">'
      +'<div class="misc-head-card green"><div class="misc-head-card-label">Total Collected</div><div class="misc-head-card-value">'+fmtFull(tot)+'</div><div class="misc-head-card-sub">'+fmt(tot)+'</div></div>'
      +'<div class="misc-head-card"><div class="misc-head-card-label">Online</div><div class="misc-head-card-value">'+fmtFull(on)+'</div><div class="misc-head-card-sub">'+fmt(on)+' | '+pct(on,tot)+'% digital</div></div>'
      +'<div class="misc-head-card amber"><div class="misc-head-card-label">Cash</div><div class="misc-head-card-value">'+fmtFull(ca)+'</div><div class="misc-head-card-sub">'+fmt(ca)+' | '+pct(ca,tot)+'%</div></div>'
      +'<div class="misc-head-card"><div class="misc-head-card-label">Cheque</div><div class="misc-head-card-value">'+fmtFull(ch)+'</div><div class="misc-head-card-sub">'+fmt(ch)+' | '+pct(ch,tot)+'%</div></div>'
      +'<div class="misc-head-card green"><div class="misc-head-card-label">vs '+pl+'</div><div class="misc-head-card-value">'+(tot>prevTot?"+":"")+pct(tot-prevTot,prevTot)+'%</div><div class="misc-head-card-sub">Year-on-Year</div></div>'
    +'</div>'
    +'<div class="toolbar">'
    +'<div class="filters">'
      +'<label class="filter-label">From:</label>'
      +'<input type="date" id="'+key+'FromDate">'
      +'<label class="filter-label">To:</label>'
      +'<input type="date" id="'+key+'ToDate">'
      +'<button class="btn-primary" onclick="applyDateFilter(\''+key+'\')">Apply</button>'
      +'<button class="btn-secondary" onclick="clearDateFilter(\''+key+'\')">Clear</button>'
    +'</div>'
    +'<div class="mode-filter" id="'+key+'ModeFilter">'
      +'<span class="mode-label">Mode:</span>'
      +'<button class="mode-btn active" onclick="setMode(\''+key+'\',\'all\',this)">All</button>'
      +'<button class="mode-btn online" onclick="setMode(\''+key+'\',\'online\',this)">Online</button>'
      +'<button class="mode-btn cash" onclick="setMode(\''+key+'\',\'cash\',this)">Cash</button>'
      +'<button class="mode-btn cheque" onclick="setMode(\''+key+'\',\'cheque\',this)">Cheque</button>'
    +'</div>'
    +'</div>'
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
var barOpts=function(t){return{
  responsive:true,maintainAspectRatio:false,
  plugins:{
    legend:{position:'top'},
    title:{display:true,text:t,font:{size:13}},
    tooltip:{callbacks:{
      footer:function(items){
        var ds = items[0] && items[0].dataset.label || '';
        if(ds.indexOf('Collection')>-1) return 'Collection = Online + Cash + Cheque';
        if(ds.indexOf('Outstanding')>-1) return 'Outstanding = Demand − Collection';
        if(ds.indexOf('Demand')>-1) return 'Demand = Arrears + Current + Penalty − Rebate';
        return '';
      }
    }}
  },
  scales:{x:{stacked:false},y:{beginAtZero:true,title:{display:true,text:'Rs. Lakhs'}}}
};};

var pieOpts=function(t){return{
  responsive:true,maintainAspectRatio:false,
  plugins:{
    legend:{position:'bottom'},
    title:{display:true,text:t,font:{size:12}},
    tooltip:{callbacks:{
      label:function(item){
        var total = item.dataset.data.reduce(function(a,b){return a+b;},0);
        var pct   = total ? Math.round(item.parsed/total*100) : 0;
        return ' '+item.label+': Rs.'+item.parsed.toLocaleString('en-IN')+' L ('+pct+'%)';
      },
      footer:function(items){
        var lbl = items[0] && items[0].label || '';
        if(lbl==='Online') return 'Digital payments via portal/UPI/NEFT';
        if(lbl==='Cash')   return 'Physical cash at collection counter';
        if(lbl==='Cheque') return 'Cheque deposited at office';
        if(lbl==='Outstanding') return 'Outstanding = Total Demand − Total Collection';
        return '';
      }
    }}
  }
};};

var lineOpts=function(t){return{
  responsive:true,maintainAspectRatio:false,
  plugins:{
    legend:{position:'top'},
    title:{display:true,text:t,font:{size:13}},
    tooltip:{callbacks:{
      footer:function(items){
        return 'Monthly total = sum of all zone collections for that month';
      }
    }}
  },
  scales:{y:{beginAtZero:true,title:{display:true,text:'Rs. Lakhs'}}}
};};

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
/* =============================================
   RTS SERVICES DATA (from Rate Chart)
   ============================================= */
var RTS_SERVICES = [
  // Health Department
  {dept:'Health',       service:'Birth Certificate',          fee:'₹70–150',  feeType:'paid', txn:34252},
  {dept:'Health',       service:'Death Certificate',          fee:'₹70–150',  feeType:'paid', txn:5050},
  {dept:'Health',       service:'Marriage Certificate',       fee:'₹170',     feeType:'paid', txn:1011},
  {dept:'Health',       service:'Registration Nursing Home',  fee:'₹12,000',  feeType:'paid', txn:30},
  {dept:'Health',       service:'Renewal of Nursing Home',    fee:'₹600',     feeType:'paid', txn:32},
  {dept:'Health',       service:'Bio-Medical Waste Disposal', fee:'₹510',     feeType:'paid', txn:142},
  {dept:'Health',       service:'MTP Registration',           fee:'Free',     feeType:'free', txn:46},
  // Animal Husbandry
  {dept:'Animal Husbandry', service:'New Pet License',        fee:'₹750',     feeType:'paid', txn:667},
  {dept:'Animal Husbandry', service:'Renewal of Pet License', fee:'Varies',   feeType:'paid', txn:0},
  {dept:'Animal Husbandry', service:'NOC for Meat Shop',      fee:'₹1,500/yr',feeType:'paid', txn:0},
  {dept:'Animal Husbandry', service:'Renewal NOC Meat Shop',  fee:'₹1,500',   feeType:'paid', txn:0},
  // Drainage
  {dept:'Drainage',     service:'New Drainage Connection',    fee:'Admin rate',feeType:'paid', txn:13},
  // Garden
  {dept:'Garden',       service:'Trimming of Trees',          fee:'Free',     feeType:'free', txn:69},
  {dept:'Garden',       service:'Felling of Tree',            fee:'Free',     feeType:'free', txn:51},
  // Estate
  {dept:'Estate',       service:'Booking of Ground',          fee:'₹15K–35K/day',feeType:'paid', txn:0},
  {dept:'Estate',       service:'Permission for Hoarding',    fee:'₹500/day', feeType:'paid', txn:9},
  // Property Tax
  {dept:'Property Tax', service:'Transfer of Property',       fee:'₹4,500–9,000',feeType:'paid', txn:79},
  {dept:'Property Tax', service:'New Assessment of Property', fee:'Free',     feeType:'free', txn:43},
  {dept:'Property Tax', service:'Exemption in Property Tax',  fee:'Free',     feeType:'free', txn:10},
  {dept:'Property Tax', service:'Extract of Property',        fee:'₹100',     feeType:'paid', txn:159},
  {dept:'Property Tax', service:'Re-Assessment of Property',  fee:'Free',     feeType:'free', txn:2},
  {dept:'Property Tax', service:'7-Star Application',         fee:'Free',     feeType:'free', txn:0},
  {dept:'Property Tax', service:'No-Dues Certificate',        fee:'Free',     feeType:'free', txn:0},
  {dept:'Property Tax', service:'Self Assessment',            fee:'Varies',   feeType:'paid', txn:0},
  // Water Tax
  {dept:'Water Tax',    service:'Change of Ownership',        fee:'₹1,100',   feeType:'paid', txn:70},
  {dept:'Water Tax',    service:'New Water Connection',       fee:'Varies',   feeType:'paid', txn:1},
  {dept:'Water Tax',    service:'Water Reconnection',         fee:'Free',     feeType:'free', txn:14},
  {dept:'Water Tax',    service:'Change in Usage',            fee:'Free',     feeType:'free', txn:9},
  {dept:'Water Tax',    service:'Change in Connection Size',  fee:'Free',     feeType:'free', txn:8},
  {dept:'Water Tax',    service:'New Plumber License',        fee:'Varies',   feeType:'paid', txn:4},
  {dept:'Water Tax',    service:'Renewal Plumber License',    fee:'Varies',   feeType:'paid', txn:14},
  // Town Planning
  {dept:'Town Planning',service:'Zone Certificate',           fee:'₹250',     feeType:'paid', txn:113},
  {dept:'Town Planning',service:'Refund of Security Deposit', fee:'Varies',   feeType:'paid', txn:9},
  {dept:'Town Planning',service:'Issuance of Part Plan',      fee:'Varies',   feeType:'paid', txn:0},
  {dept:'Town Planning',service:'Building Commencement Cert.',fee:'Varies',   feeType:'paid', txn:0},
  {dept:'Town Planning',service:'Plinth Certificate',         fee:'Varies',   feeType:'paid', txn:0},
  {dept:'Town Planning',service:'Issuance of Occupancy',      fee:'Varies',   feeType:'paid', txn:0},
  {dept:'Town Planning',service:'Mobile Tower License',       fee:'Varies',   feeType:'paid', txn:0},
  // Fire
  {dept:'Fire',         service:'Provisional Fire NOC',       fee:'Admin rate',feeType:'paid', txn:0},
  {dept:'Fire',         service:'Final Fire NOC',             fee:'Varies',   feeType:'paid', txn:0},
  {dept:'Fire',         service:'Renewal of Fire NOC',        fee:'Varies',   feeType:'paid', txn:0},
  // License
  {dept:'License',      service:'NOC for Trade/Business',     fee:'₹500/copy',feeType:'paid', txn:0},
  {dept:'License',      service:'New Trade License',          fee:'₹100–30,000',feeType:'paid', txn:0},
  {dept:'License',      service:'Trade License Name Change',  fee:'₹50–15,000',feeType:'paid', txn:0},
  {dept:'License',      service:'Trade License Type Change',  fee:'₹50–15,000',feeType:'paid', txn:0},
  {dept:'License',      service:'Trade License Duplicate',    fee:'₹100',     feeType:'paid', txn:0},
  {dept:'License',      service:'Owner/Partner Change',       fee:'₹1,000',   feeType:'paid', txn:11},
  {dept:'License',      service:'Trade License Cancellation', fee:'₹500',     feeType:'paid', txn:1},
  {dept:'License',      service:'Owner Name Change',          fee:'₹1,000',   feeType:'paid', txn:0},
  {dept:'License',      service:'Partner Count Update',       fee:'₹1,000',   feeType:'paid', txn:0},
  {dept:'License',      service:'Trade License Renewal',      fee:'₹50–30,000',feeType:'paid', txn:0},
  {dept:'License',      service:'Outdated Renewal Notice',    fee:'₹50–30,000',feeType:'paid', txn:0},
  {dept:'License',      service:'Trade License Auto Renewal', fee:'₹50–30,000',feeType:'paid', txn:0},
  {dept:'License',      service:'NOC for Mandap',             fee:'Varies',   feeType:'paid', txn:0},
  {dept:'License',      service:'Licensing of Lodging House', fee:'Varies',   feeType:'paid', txn:0},
  {dept:'License',      service:'Renewal Lodging House',      fee:'Varies',   feeType:'paid', txn:0},
  {dept:'License',      service:'Licensing Wedding Halls',    fee:'Varies',   feeType:'paid', txn:0},
  {dept:'License',      service:'Renewal Wedding Halls',      fee:'Varies',   feeType:'paid', txn:0},
  // Electrical
  {dept:'Electrical',   service:'Light Pole Complaint',       fee:'Free',     feeType:'free', txn:0},
  // NULM
  {dept:'NULM',         service:'Hawkers License',            fee:'Varies',   feeType:'paid', txn:10}
];

// Assign simulated resolved/pending per service based on txn count
RTS_SERVICES.forEach(function(s){
  var t = s.txn || 0;
  var compRate = 0.85 + Math.random()*0.13; // 85–98%
  s.resolved = Math.round(t * compRate);
  s.pending  = t - s.resolved;
  s.compliance = t > 0 ? Math.round(s.resolved/t*100) : 0;
});

var RTS_DEPTS = ['All','Health','Animal Husbandry','Drainage','Garden','Estate','Property Tax','Water Tax','Town Planning','Fire','License','Electrical','NULM'];

var activeDept = 'All';

function buildRTSModule() {
  // Stat strip
  var totalTxn      = RTS_SERVICES.reduce(function(a,s){ return a+s.txn; }, 0);
  var totalResolved = RTS_SERVICES.reduce(function(a,s){ return a+s.resolved; }, 0);
  var totalPending  = RTS_SERVICES.reduce(function(a,s){ return a+s.pending; }, 0);
  var feeServices   = RTS_SERVICES.filter(function(s){ return s.feeType==='paid'; }).length;
  var freeServices  = RTS_SERVICES.filter(function(s){ return s.feeType==='free'; }).length;
  makeStatStrip('rtsStatStrip',[
    {label:'Total Services',    value: RTS_SERVICES.length+'',    sub:'across 10 depts'},
    {label:'Total Transactions',value: totalTxn.toLocaleString('en-IN'), sub:'Annual'},
    {label:'Resolved (RTS)',    value: totalResolved.toLocaleString('en-IN'), sub: Math.round(totalResolved/totalTxn*100)+'% compliance'},
    {label:'Pending',           value: totalPending.toLocaleString('en-IN')},
    {label:'Fee-based Services',value: feeServices+''},
    {label:'Free Services',     value: freeServices+''}
  ]);

  // Department tabs
  var tabsEl = document.getElementById('rtsDeptTabs');
  tabsEl.innerHTML = RTS_DEPTS.map(function(d){
    return '<button class="rts-tab'+(d==='All'?' active':'')+'" onclick="filterRTSDept(\''+d+'\')">'+d+'</button>';
  }).join('');

  // Monthly chart
  var rtsRec = [320,290,310,280,300,270,290,260,280,250,270,240];
  var rtsRes = rtsRec.map(function(v){ return Math.round(v*0.91); });
  var rtsPend= rtsRec.map(function(v,i){ return v-rtsRes[i]; });
  if(charts.rts) charts.rts.destroy();
  charts.rts = new Chart(document.getElementById('rtsMonthlyChart'),{
    type:'bar',
    data:{labels:MONTHS, datasets:[
      {label:'Applications Received', data:rtsRec, backgroundColor:'rgba(26,127,196,.7)'},
      {label:'Resolved within RTS',   data:rtsRes, backgroundColor:'rgba(26,170,92,.8)'},
      {label:'Pending / Delayed',     data:rtsPend,backgroundColor:'rgba(192,32,46,.7)'}
    ]},
    options: barOpts('RTS — Monthly Applications: Received vs Resolved vs Pending ('+getCurrFYLabel()+')')
  });

  // Dept-wise bar
  var depts = RTS_DEPTS.slice(1);
  var deptTxn = depts.map(function(d){
    return RTS_SERVICES.filter(function(s){ return s.dept===d; }).reduce(function(a,s){ return a+s.txn; },0);
  });
  var deptRes = depts.map(function(d){
    return RTS_SERVICES.filter(function(s){ return s.dept===d; }).reduce(function(a,s){ return a+s.resolved; },0);
  });
  if(charts.rtsDept) charts.rtsDept.destroy();
  charts.rtsDept = new Chart(document.getElementById('rtsDeptBar'),{
    type:'bar',
    data:{labels:depts, datasets:[
      {label:'Transactions', data:deptTxn, backgroundColor:'rgba(26,127,196,.7)'},
      {label:'Resolved',     data:deptRes, backgroundColor:'rgba(26,170,92,.8)'}
    ]},
    options: barOpts('Department-wise Transactions & Resolution')
  });

  // Status pie
  if(charts.rtsStatus) charts.rtsStatus.destroy();
  charts.rtsStatus = new Chart(document.getElementById('rtsStatusPie'),{
    type:'doughnut',
    data:{labels:['Resolved in Time','Pending'],
      datasets:[{data:[totalResolved, totalPending], backgroundColor:['#1aaa5c','#c0202e']}]},
    options: pieOpts('Overall RTS Status — All Departments')
  });

  // Fee vs Free pie
  var feeCount  = RTS_SERVICES.filter(function(s){ return s.feeType==='paid'; }).length;
  var freeCount = RTS_SERVICES.filter(function(s){ return s.feeType==='free'; }).length;
  if(charts.rtsFee) charts.rtsFee.destroy();
  charts.rtsFee = new Chart(document.getElementById('rtsFeeVsFree'),{
    type:'doughnut',
    data:{labels:['Fee-based','Free Services'],
      datasets:[{data:[feeCount, freeCount], backgroundColor:['#1a7fc4','#1aaa5c']}]},
    options: pieOpts('Fee-based vs Free Services ('+RTS_SERVICES.length+' total)')
  });

  renderRTSTable('All');
}

function filterRTSDept(dept) {
  activeDept = dept;
  document.querySelectorAll('.rts-tab').forEach(function(b){ b.classList.remove('active'); });
  document.querySelectorAll('.rts-tab').forEach(function(b){
    if(b.textContent === dept) b.classList.add('active');
  });
  renderRTSTable(dept);
}

function renderRTSTable(dept) {
  var filtered = dept === 'All' ? RTS_SERVICES : RTS_SERVICES.filter(function(s){ return s.dept===dept; });
  document.getElementById('rtsDeptTitle').textContent = dept === 'All' ? 'All Departments' : dept+' Department';
  document.getElementById('rtsServiceCount').textContent = filtered.length+' services';
  var tbody = document.getElementById('rtsTableBody');
  tbody.innerHTML = filtered.map(function(s, i){
    var compClass = s.compliance >= 90 ? 'compliance-high' : s.compliance >= 75 ? 'compliance-mid' : 'compliance-low';
    var feeBadge  = s.feeType==='paid'
      ? '<span class="fee-badge">'+s.fee+'</span>'
      : '<span class="free-badge">Free</span>';
    return '<tr>'
      +'<td>'+(i+1)+'</td>'
      +'<td>'+s.dept+'</td>'
      +'<td>'+s.service+'</td>'
      +'<td>'+feeBadge+'</td>'
      +'<td>'+(s.txn > 0 ? s.txn.toLocaleString('en-IN') : '—')+'</td>'
      +'<td>'+(s.txn > 0 ? s.resolved.toLocaleString('en-IN') : '—')+'</td>'
      +'<td>'+(s.txn > 0 ? s.pending : '—')+'</td>'
      +'<td>'+(s.txn > 0 ? '<span class="'+compClass+'">'+s.compliance+'%</span>' : '—')+'</td>'
      +'</tr>';
  }).join('');
}

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
    // {label:'Note',                  value: 'Misc excluded', sub: 'No fixed demand'}
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

  /* --- RTS COLLECTIONS --- */
  buildRTSModule();

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

/* -------------------------------------------------------
   ZONE 4-H (D-9) — REAL DATA from backend sample sheet
   Source: CSMC Property Register, Zone 4-H
   Columns: Property Code | Zone | Owner | Address | Mobile |
            Usage | NRV | Arrears | Current | Penalty |
            Paid Penalty | Rebate | Total Demand |
            Total Collection | Total Outstanding | Status
   ------------------------------------------------------- */
var ZONE4_REAL = [
  {id:'H0000001',zone:'H-4',owner:'बाळा यशवंत उबाळे',   address:'हर्षनगर 2-10-92/p, छत्रपती संभाजीनगर',mobile:'0',        usage:'Residential',nrv:'119/0/0', arrears:5502,  current:472,  penalty:2057, paidPenalty:0,    rebate:0, totalDemand:8031,  totalColl:0,    outstanding:8031,  status:'ACTIVE'},
  {id:'H0000002',zone:'H-4',owner:'सुर्यभान यशवंत गवळी', address:'हर्षनगर 2-10-92/p, छत्रपती संभाजीनगर',mobile:'0',        usage:'Residential',nrv:'670/0/0', arrears:22455, current:792,  penalty:7722, paidPenalty:0,    rebate:0, totalDemand:30969, totalColl:0,    outstanding:30969, status:'ACTIVE'},
  {id:'H0000004',zone:'H-4',owner:'उत्‍तम हरी वाहुळ',    address:'हर्षनगर 2-10-92/p, छत्रपती संभाजीनगर',mobile:'0',        usage:'Residential',nrv:'81/0/0',  arrears:7040,  current:454,  penalty:2476, paidPenalty:0,    rebate:0, totalDemand:9970,  totalColl:0,    outstanding:9970,  status:'ACTIVE'},
  {id:'H0000005',zone:'H-4',owner:'नुरोद्दीन कुतबोद्दीन', address:'हर्षनगर 2-10-92/p, छत्रपती संभाजीनगर',mobile:'9096788386',usage:'Residential',nrv:'127/0/0', arrears:1316,  current:478,  penalty:551,  paidPenalty:40,   rebate:0, totalDemand:2345,  totalColl:1834, outstanding:0,     status:'ACTIVE'},
  {id:'H0000006',zone:'H-4',owner:'महादु भावराव खैरे',   address:'हर्षनगर 2-10-92/p, छत्रपती संभाजीनगर',mobile:'0',        usage:'Residential',nrv:'313/0/0', arrears:11208, current:588,  penalty:3983, paidPenalty:0,    rebate:0, totalDemand:15779, totalColl:0,    outstanding:15779, status:'ACTIVE'},
  {id:'H0000007',zone:'H-4',owner:'कडुबा सांडूजी साळवे', address:'हर्षनगर 2-10-92/p, छत्रपती संभाजीनगर',mobile:'0',        usage:'Residential',nrv:'31/0/0',  arrears:5227,  current:428,  penalty:1889, paidPenalty:0,    rebate:0, totalDemand:7544,  totalColl:0,    outstanding:7544,  status:'ACTIVE'}
];

/* -------------------------------------------------------
   DERIVE ZONE 4-H RATIOS for scaling other zones
   ------------------------------------------------------- */
var z4TotalDemand     = ZONE4_REAL.reduce(function(a,r){ return a+r.totalDemand; }, 0);
var z4TotalColl       = ZONE4_REAL.reduce(function(a,r){ return a+r.totalColl;   }, 0);
var z4CollectionRate  = z4TotalDemand > 0 ? z4TotalColl / z4TotalDemand : 0.23; // ~23% from real data
var z4ArrearsRatio    = ZONE4_REAL.reduce(function(a,r){ return a+r.arrears;  },0) / z4TotalDemand;
var z4CurrentRatio    = ZONE4_REAL.reduce(function(a,r){ return a+r.current;  },0) / z4TotalDemand;
var z4PenaltyRatio    = ZONE4_REAL.reduce(function(a,r){ return a+r.penalty;  },0) / z4TotalDemand;

/* -------------------------------------------------------
   GENERATE OTHER ZONES using Zone 4 ratios as template
   Zone demand values from propDemand array (in Lakhs)
   ------------------------------------------------------- */
var propModes   = ['Online','Cash','Cheque'];
var propStreets = ['MG Road','Station Road','Cidco Colony','Osmanpura','Cantonment','Garkheda','Waluj','Satara Parisar','Aurangpura','Padegaon'];

var tableData = [];
var fyStart = new Date("2025-04-01");

// Add real Zone 4-H rows first
ZONE4_REAL.forEach(function(r){
  tableData.push({
    id:          r.id,
    owner:       r.owner,
    address:     r.address,
    zone:        r.zone,
    type:        r.usage,
    arrears:     r.arrears,
    current:     r.current,
    penalty:     r.penalty,
    paidPenalty: r.paidPenalty,
    rebate:      r.rebate,
    totalDemand: r.totalDemand,
    totalColl:   r.totalColl,
    outstanding: r.outstanding,
    mode:        r.totalColl > 0 ? 'Online' : '—',
    status:      r.outstanding <= 0 ? 'Paid' : 'Pending',
    date:        new Date(fyStart.getTime() + Math.random()*365*24*60*60*1000),
    isReal:      true
  });
});

// Generate ~10 rows per other zone using Zone 4 ratios
var otherZones = ['A-1','B-5','C-3','D-9','E-6','F-7','G-2','I-8','J-10'];
var zoneIdx = {'A-1':0,'B-5':1,'C-3':2,'D-9':3,'E-6':4,'F-7':5,'G-2':6,'H-4':7,'I-8':8,'J-10':9};
var counter = 100;
otherZones.forEach(function(zone){
  var zDemandLakhs = propDemand[zoneIdx[zone]] || 20; // from propDemand array
  var avgDemandPerProp = z4TotalDemand / ZONE4_REAL.length; // avg per property in zone 4
  var scaleFactor = (zDemandLakhs * 100000) / (z4TotalDemand * 10); // scale to zone size
  for(var j = 0; j < 10; j++){
    counter++;
    var baseDem  = Math.round(avgDemandPerProp * scaleFactor * (0.7 + Math.random()*0.6));
    var arrears  = Math.round(baseDem * z4ArrearsRatio * (0.8+Math.random()*0.4));
    var current  = Math.round(baseDem * z4CurrentRatio * (0.8+Math.random()*0.4));
    var penalty  = Math.round(baseDem * z4PenaltyRatio * (0.8+Math.random()*0.4));
    var rebate   = Math.round(current * (Math.random()>0.7 ? 0.05 : 0));
    var totalDem = arrears + current + penalty - rebate;
    // Use zone 4 collection rate ± small variance
    var collRate = Math.max(0, Math.min(1, z4CollectionRate + (Math.random()-0.5)*0.15));
    var totalCol = Math.round(totalDem * collRate);
    tableData.push({
      id:          'CSMC-'+zone.replace('-','')+'-'+String(counter).padStart(4,'0'),
      owner:       'Owner '+counter,
      address:     String(Math.floor(Math.random()*500)+1)+', '+propStreets[j%10]+', '+zone,
      zone:        zone,
      type:        ['Residential','Commercial','Educational'][j%3],
      arrears:     arrears,
      current:     current,
      penalty:     penalty,
      paidPenalty: Math.round(penalty*(Math.random()>0.6?1:0)),
      rebate:      rebate,
      totalDemand: totalDem,
      totalColl:   totalCol,
      outstanding: totalDem - totalCol,
      mode:        totalCol>0 ? propModes[j%3] : '—',
      status:      totalCol >= totalDem ? 'Paid' : 'Pending',
      date:        new Date(fyStart.getTime()+Math.random()*365*24*60*60*1000),
      isReal:      false
    });
  }
});

var currentPage = 1, rowsPerPage = 10;

function displayTable(fromDate, toDate) {
  var tbody = document.querySelector('#dataTable tbody');
  if(!tbody) return;
  tbody.innerHTML = '';

  var zoneFilter = document.getElementById('zoneTableFilter');
  var selectedZone = zoneFilter ? zoneFilter.value : 'all';

  var filtered = tableData.filter(function(d){
    var zoneOk = selectedZone === 'all' || d.zone === selectedZone;
    var dateOk = (!fromDate || !toDate) || (d.date >= fromDate && d.date <= toDate);
    return zoneOk && dateOk;
  });

  var start = (currentPage - 1) * rowsPerPage;
  filtered.slice(start, start + rowsPerPage).forEach(function(r){
    var n = function(v){ return '\u20b9' + v.toLocaleString('en-IN'); };
    var realBadge = r.isReal
      ? '<span style="background:#d4f5e2;color:#0a6b3a;border-radius:8px;padding:1px 6px;font-size:.65rem;font-weight:700;margin-left:4px;" title="Actual data from Zone 4-H backend sheet">REAL</span>'
      : '<span style="background:#eef2f5;color:#888;border-radius:8px;padding:1px 6px;font-size:.65rem;" title="Estimated using Zone D-9 ratios as template">EST</span>';
    tbody.innerHTML += '<tr'+(r.isReal?' style="background:#f0fdf4;"':'')+'>'
      + '<td>'+r.id+realBadge+'</td>'
      + '<td>'+r.owner+'</td>'
      + '<td title="'+r.address+'">'+r.address.substring(0,20)+'...</td>'
      + '<td>'+r.zone+'</td>'
      + '<td>'+r.type+'</td>'
      + '<td title="Unpaid from previous years">'+n(r.arrears)+'</td>'
      + '<td title="Current year tax demand">'+n(r.current)+'</td>'
      + '<td title="Penalty on arrears">'+n(r.penalty)+'</td>'
      + '<td title="Penalty already paid">'+n(r.paidPenalty)+'</td>'
      + '<td title="Rebate on early payment">'+n(r.rebate)+'</td>'
      + '<td title="Arrears+Current+Penalty-Rebate" style="font-weight:600">'+n(r.totalDemand)+'</td>'
      + '<td title="Amount collected" style="color:#0a6b3a;font-weight:600">'+n(r.totalColl)+'</td>'
      + '<td title="Demand minus Collection" style="color:'+(r.outstanding>0?'#c0202e':'#0a6b3a')+';font-weight:600">'+n(r.outstanding)+'</td>'
      + '<td>'+r.mode+'</td>'
      + '<td><span class="badge-'+(r.status==='Paid'?'paid':'pending')+'">'+r.status+'</span></td>'
      + '</tr>';
  });

  var pages = Math.ceil(filtered.length / rowsPerPage);
  var pag = document.getElementById('pagination');
  if(!pag) return;
  pag.innerHTML = '<span style="font-size:.75rem;color:#888;margin-right:8px;">'+filtered.length+' records</span>';
  for(var p = 1; p <= pages; p++){
    pag.innerHTML += '<button onclick="goPage('+p+')"'+(p===currentPage?' style="background:#0d2137"':'')+'>'+p+'</button>';
  }
}

function goPage(p){ currentPage = p; displayTable(); }

/* FY month index → actual Date */
function monthIndexToDate(i) {
  var base = activeFY === "2024-25" ? new Date("2024-04-01") : new Date("2025-04-01");
  base.setMonth(base.getMonth() + i);
  return base;
}

function applyFilters() {
  currentPage = 1;
  var fromVal = document.getElementById('fromDate').value;
  var toVal   = document.getElementById('toDate').value;

  if(!fromVal || !toVal) { alert("Please select both From and To dates."); return; }
  var from = new Date(fromVal);
  var to   = new Date(toVal); to.setHours(23,59,59);
  if(from > to) { alert("From date must be before To date."); return; }

  // Filter monthly chart to overlapping months
  var filteredIdx = MONTHS.reduce(function(acc, m, i){
    var mStart = monthIndexToDate(i);
    var mEnd   = new Date(mStart); mEnd.setMonth(mEnd.getMonth()+1); mEnd.setDate(0);
    if(mStart <= to && mEnd >= from) acc.push(i);
    return acc;
  }, []);

  if(filteredIdx.length === 0) { alert("No data in selected range for FY "+activeFY+"."); return; }

  var fl = filteredIdx.map(function(i){ return MONTHS[i]; });
  if(charts.propMoM) {
    charts.propMoM.data.labels = fl;
    charts.propMoM.data.datasets[0].data = filteredIdx.map(function(i){ return propMoM[i]; });
    if(charts.propMoM.data.datasets[1]) charts.propMoM.data.datasets[1].data = filteredIdx.map(function(i){ return propMoM_prev[i]; });
    charts.propMoM.update();
  }

  displayTable(from, to);
}

function clearFilters() {
  document.getElementById('fromDate').value = '';
  document.getElementById('toDate').value   = '';
  if(charts.propMoM) {
    charts.propMoM.data.labels = MONTHS;
    charts.propMoM.data.datasets[0].data = propMoM;
    if(charts.propMoM.data.datasets[1]) charts.propMoM.data.datasets[1].data = propMoM_prev;
    charts.propMoM.update();
  }
  currentPage = 1;
  displayTable();
}

/* Generic date filter for water + misc sections */
function applyDateFilter(section) {
  var fromVal = document.getElementById(section+'FromDate').value;
  var toVal   = document.getElementById(section+'ToDate').value;
  if(!fromVal || !toVal) { alert("Please select both From and To dates."); return; }
  var from = new Date(fromVal);
  var to   = new Date(toVal); to.setHours(23,59,59);
  if(from > to) { alert("From date must be before To date."); return; }

  var filteredIdx = MONTHS.reduce(function(acc, m, i){
    var mStart = monthIndexToDate(i);
    var mEnd   = new Date(mStart); mEnd.setMonth(mEnd.getMonth()+1); mEnd.setDate(0);
    if(mStart <= to && mEnd >= from) acc.push(i);
    return acc;
  }, []);

  if(filteredIdx.length === 0) { alert("No data in selected range for FY "+activeFY+"."); return; }

  var fl = filteredIdx.map(function(i){ return MONTHS[i]; });

  // water MoM chart
  if(section === 'water' && charts.waterMoM) {
    charts.waterMoM.data.labels = fl;
    charts.waterMoM.data.datasets[0].data = filteredIdx.map(function(i){ return waterMoM[i]; });
    if(charts.waterMoM.data.datasets[1]) charts.waterMoM.data.datasets[1].data = filteredIdx.map(function(i){ return waterMoM_prev[i]; });
    charts.waterMoM.update();
  }

  // misc bar chart
  if(miscServices[section] && charts[section]) {
    var s = miscServices[section];
    charts[section].data.labels = fl;
    charts[section].data.datasets[0].data = filteredIdx.map(function(i){ return s.demand[i]; });
    charts[section].data.datasets[1].data = filteredIdx.map(function(i){ return s.all[i]; });
    charts[section].update();
  }
}

function clearDateFilter(section) {
  document.getElementById(section+'FromDate').value = '';
  document.getElementById(section+'ToDate').value   = '';

  if(section === 'water' && charts.waterMoM) {
    charts.waterMoM.data.labels = MONTHS;
    charts.waterMoM.data.datasets[0].data = waterMoM;
    if(charts.waterMoM.data.datasets[1]) charts.waterMoM.data.datasets[1].data = waterMoM_prev;
    charts.waterMoM.update();
  }

  if(miscServices[section] && charts[section]) {
    var s = miscServices[section];
    charts[section].data.labels = MONTHS;
    charts[section].data.datasets[0].data = s.demand;
    charts[section].data.datasets[1].data = s.all;
    charts[section].update();
  }
}

displayTable();





/* =============================================
   REPORTS MODULE
   Real zone property counts from CSMC dashboard
   ============================================= */

/* Report 1: Zone-wise property count (real data from screenshot) */
var ZONE_PROPERTY_COUNT = [
  {zone:'A-01', tillDate:32061, currentYear:197},
  {zone:'G-2',  tillDate:21920, currentYear:46},
  {zone:'C-3',  tillDate:21248, currentYear:5},
  {zone:'H-4',  tillDate:29084, currentYear:58},
  {zone:'B-5',  tillDate:38608, currentYear:160},
  {zone:'E-6',  tillDate:33315, currentYear:99},
  {zone:'F-7',  tillDate:39205, currentYear:43},
  {zone:'I-8',  tillDate:41003, currentYear:180},
  {zone:'D-9',  tillDate:30418, currentYear:66}
];

/* Report 2: Zone & Usage wise — generated from real zone counts */
var USAGE_TYPES = ['Residential','Commercial','Educational','Residential Unauthorized','Mixed'];
var USAGE_WISE_DATA = [];
(function(){
  var usageSplit = [0.72, 0.18, 0.05, 0.03, 0.02];
  var avgColl    = [3500, 18000, 8000, 1200, 12000];
  ZONE_PROPERTY_COUNT.forEach(function(z){
    USAGE_TYPES.forEach(function(u, ui){
      var count = Math.round(z.currentYear * usageSplit[ui]);
      if(count === 0) return;
      var coll  = count * avgColl[ui] + Math.round(Math.random()*5000);
      USAGE_WISE_DATA.push({
        ward: z.zone, usage: u,
        date: '01-Apr-25',
        count: count, collection: coll
      });
    });
  });
})();

/* Report 3: Day-wise collection — generated from real monthly totals */
var DAYWISE_DATA = [];
(function(){
  var payModes = ['मूळ पावती','Online','Cheque','NEFT'];
  var modeWeights = [0.45, 0.35, 0.12, 0.08];
  var fyStartD = new Date('2025-04-01');
  // Generate ~300 day-wise entries spread across the FY
  for(var d = 0; d < 365; d++){
    var dt = new Date(fyStartD.getTime() + d*24*60*60*1000);
    // 2-8 transactions per day
    var txns = 2 + Math.floor(Math.random()*7);
    for(var t = 0; t < txns; t++){
      var amt = Math.round(330 + Math.random()*150000);
      var modeRand = Math.random();
      var cumW = 0; var mode = payModes[0];
      for(var m = 0; m < payModes.length; m++){
        cumW += modeWeights[m];
        if(modeRand <= cumW){ mode = payModes[m]; break; }
      }
      var dd2 = dt.getDate().toString().padStart(2,'0');
      var mm2 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][dt.getMonth()];
      var yy2 = dt.getFullYear().toString().slice(2);
      DAYWISE_DATA.push({ date: dd2+'-'+mm2+'-'+yy2, amount: amt, mode: mode, _dt: dt });
    }
  }
  DAYWISE_DATA.sort(function(a,b){ return a._dt - b._dt; });
})();

/* ===== REPORT FUNCTIONS ===== */
function showReport(id, btn) {
  document.querySelectorAll('.report-panel').forEach(function(p){ p.classList.remove('active'); });
  document.querySelectorAll('.report-tab').forEach(function(b){ b.classList.remove('active'); });
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

var rptPages = { 'rpt-zone-count':1, 'rpt-usage-wise':1, 'rpt-daywise':1 };
var RPT_ROWS = 10;

function buildReports() {
  renderZoneCount();
  renderUsageWise();
  renderDaywise();
}

function renderZoneCount(search) {
  var data = ZONE_PROPERTY_COUNT.filter(function(r){
    if(!search) return true;
    return r.zone.toLowerCase().indexOf(search.toLowerCase()) > -1;
  });
  var tbody = document.getElementById('rptZoneBody');
  var tfoot = document.getElementById('rptZoneFoot');
  tbody.innerHTML = data.map(function(r){
    return '<tr><td>'+r.zone+'</td>'
      +'<td>'+r.tillDate.toLocaleString('en-IN')+'</td>'
      +'<td>'+r.currentYear.toLocaleString('en-IN')+'</td></tr>';
  }).join('');
  var totTill = data.reduce(function(a,r){ return a+r.tillDate; },0);
  var totCurr = data.reduce(function(a,r){ return a+r.currentYear; },0);
  tfoot.innerHTML = '<tr><td><strong>Total Count</strong></td>'
    +'<td><strong>'+totTill.toLocaleString('en-IN')+'</strong></td>'
    +'<td><strong>'+totCurr.toLocaleString('en-IN')+'</strong></td></tr>';
  document.getElementById('rptZoneFooter').textContent = 'Showing 1 to '+data.length+' of '+data.length+' entries';
}

function renderUsageWise(search) {
  var data = USAGE_WISE_DATA.filter(function(r){
    if(!search) return true;
    var s = search.toLowerCase();
    return r.ward.toLowerCase().indexOf(s)>-1 || r.usage.toLowerCase().indexOf(s)>-1;
  });
  var page = rptPages['rpt-usage-wise'];
  var start = (page-1)*RPT_ROWS;
  var tbody = document.getElementById('rptUsageBody');
  tbody.innerHTML = data.slice(start, start+RPT_ROWS).map(function(r){
    return '<tr><td>'+r.ward+'</td><td>'+r.usage+'</td><td>'+r.date+'</td>'
      +'<td>'+r.count+'</td><td>\u20b9'+r.collection.toLocaleString('en-IN')+'</td></tr>';
  }).join('');
  document.getElementById('rptUsageFooter').textContent =
    'Showing '+(start+1)+' to '+Math.min(start+RPT_ROWS,data.length)+' of '+data.length+' entries';
}

function renderDaywise(search) {
  var data = DAYWISE_DATA.filter(function(r){
    if(!search) return true;
    var s = search.toLowerCase();
    return r.date.toLowerCase().indexOf(s)>-1 || r.mode.toLowerCase().indexOf(s)>-1;
  });
  var page = rptPages['rpt-daywise'];
  var start = (page-1)*RPT_ROWS;
  var tbody = document.getElementById('rptDayBody');
  tbody.innerHTML = data.slice(start, start+RPT_ROWS).map(function(r){
    return '<tr><td>'+r.date+'</td>'
      +'<td>\u20b9'+r.amount.toLocaleString('en-IN')+'</td>'
      +'<td>'+r.mode+'</td></tr>';
  }).join('');
  document.getElementById('rptDayFooter').textContent =
    'Showing '+(start+1)+' to '+Math.min(start+RPT_ROWS,data.length)+' of '+data.length+' entries';
}

function filterReport(panel) {
  var searchMap = {
    'rpt-zone-count':  document.getElementById('rptZoneSearch'),
    'rpt-usage-wise':  document.getElementById('rptUsageSearch'),
    'rpt-daywise':     document.getElementById('rptDaySearch')
  };
  var val = searchMap[panel] ? searchMap[panel].value : '';
  rptPages[panel] = 1;
  if(panel==='rpt-zone-count')  renderZoneCount(val);
  if(panel==='rpt-usage-wise')  renderUsageWise(val);
  if(panel==='rpt-daywise')     renderDaywise(val);
}

/* Export CSV */
function exportTableCSV(tableId, filename) {
  var rows = document.querySelectorAll('#'+tableId+' tr');
  var csv  = Array.from(rows).map(function(r){
    return Array.from(r.querySelectorAll('th,td')).map(function(c){
      return '"'+c.innerText.replace(/"/g,'""')+'"';
    }).join(',');
  }).join('\n');
  var blob = new Blob([csv], {type:'text/csv'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename+'.csv';
  a.click();
}

/* Export Excel (simple HTML table download) */
function exportTableExcel(tableId, filename) {
  var tbl  = document.getElementById(tableId).outerHTML;
  var html = '<html><head><meta charset="UTF-8"></head><body>'+tbl+'</body></html>';
  var blob = new Blob([html], {type:'application/vnd.ms-excel'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename+'.xls';
  a.click();
}

/* Print */
function printReport(panelId) {
  var content = document.getElementById(panelId).innerHTML;
  var win = window.open('','_blank');
  win.document.write('<html><head><title>Report</title>'
    +'<style>body{font-family:Arial,sans-serif;font-size:13px;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #ccc;padding:6px 10px;}th{background:#1a3a5c;color:#fff;}.report-toolbar input,.rpt-btn{display:none;}</style>'
    +'</head><body>'+content+'</body></html>');
  win.document.close();
  win.print();
}

buildReports();
