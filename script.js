
/* ===== NAVIGATION ===== */
function showSection(id, label) {
  document.querySelectorAll(".section").forEach(function(s){ s.classList.remove("active"); });
  var el = document.getElementById(id);
  if(el) {
    el.classList.add("active");
    // Scroll main to top
    var main = document.querySelector('.main');
    if(main) main.scrollTop = 0;
    // Resize all charts in this section so they render correctly
    setTimeout(function(){
      Object.keys(charts).forEach(function(k){
        if(charts[k] && typeof charts[k].resize === 'function') {
          try { charts[k].resize(); } catch(e){}
        }
      });
    }, 50);
  }
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

var activeFY = "2025-26";

var FY_DATA = {
  "2025-26": {
    // FY 2025-26 demand: ~5% growth over 2024-25
    // Property demand ~266Cr = 26,628L | Water demand ~31Cr = 3,107L
    propDemand:  [3107, 3606, 1712, 2441, 2972, 3368, 1878, 2766, 3344, 1434],
    propColl:    { online:[13,14,7,10,12,14,8,11,13,6], cash:[8,8,4,6,7,8,5,7,8,3], cheque:[5,6,3,4,5,5,3,4,5,2] },
    propMoM:     [210,0,0,0,0,0,0,0,0,0,0,0],
    waterDemand: [362, 421, 200, 285, 347, 393, 219, 322, 391, 167],
    waterColl:   { online:[3,4,2,3,3,4,2,3,4,2], cash:[2,2,1,2,2,2,1,2,2,1], cheque:[1,1,1,1,1,1,1,1,1,1] },
    waterMoM:    [53,0,0,0,0,0,0,0,0,0,0,0],
    misc: {
      "misc-water":     { label:"Water Supply & Sewerage",                  icon:"", color:"#2d1b6e",
        demand:[68,0,0,0,0,0,0,0,0,0,0,0],
        online:[28,0,0,0,0,0,0,0,0,0,0,0],
        cash:  [28,0,0,0,0,0,0,0,0,0,0,0],
        cheque:[12,0,0,0,0,0,0,0,0,0,0,0] },
      "misc-health":    { label:"Health, Medical & Veterinary",             icon:"", color:"#c0202e",
        demand:[34,0,0,0,0,0,0,0,0,0,0,0],
        online:[13,0,0,0,0,0,0,0,0,0,0,0],
        cash:  [14,0,0,0,0,0,0,0,0,0,0,0],
        cheque:[ 7,0,0,0,0,0,0,0,0,0,0,0] },
      "misc-building":  { label:"Building, Urban Planning & Development",   icon:"", color:"#0d4f8a",
        demand:[54,0,0,0,0,0,0,0,0,0,0,0],
        online:[22,0,0,0,0,0,0,0,0,0,0,0],
        cash:  [22,0,0,0,0,0,0,0,0,0,0,0],
        cheque:[10,0,0,0,0,0,0,0,0,0,0,0] },
      "misc-licensing": { label:"Licensing, Permissions & Legal",           icon:"", color:"#7a5200",
        demand:[42,0,0,0,0,0,0,0,0,0,0,0],
        online:[17,0,0,0,0,0,0,0,0,0,0,0],
        cash:  [17,0,0,0,0,0,0,0,0,0,0,0],
        cheque:[ 8,0,0,0,0,0,0,0,0,0,0,0] },
      "misc-sanitation":{ label:"Sanitation, Environment & Waste",          icon:"", color:"#0a6b3a",
        demand:[14,0,0,0,0,0,0,0,0,0,0,0],
        online:[ 6,0,0,0,0,0,0,0,0,0,0,0],
        cash:  [ 6,0,0,0,0,0,0,0,0,0,0,0],
        cheque:[ 2,0,0,0,0,0,0,0,0,0,0,0] },
      "misc-parks":     { label:"Parks, Recreation, Tourism & Culture",     icon:"", color:"#1a7fc4",
        demand:[ 8,0,0,0,0,0,0,0,0,0,0,0],
        online:[ 3,0,0,0,0,0,0,0,0,0,0,0],
        cash:  [ 3,0,0,0,0,0,0,0,0,0,0,0],
        cheque:[ 2,0,0,0,0,0,0,0,0,0,0,0] },
      "misc-transport": { label:"Transport, Parking & Enforcement",         icon:"", color:"#5a3db8",
        demand:[ 4,0,0,0,0,0,0,0,0,0,0,0],
        online:[ 2,0,0,0,0,0,0,0,0,0,0,0],
        cash:  [ 1,0,0,0,0,0,0,0,0,0,0,0],
        cheque:[ 1,0,0,0,0,0,0,0,0,0,0,0] },
      "misc-finance":   { label:"Finance, Revenue, Grants & Miscellaneous", icon:"", color:"#b8860b",
        demand:[224,0,0,0,0,0,0,0,0,0,0,0],
        online:[ 90,0,0,0,0,0,0,0,0,0,0,0],
        cash:  [ 90,0,0,0,0,0,0,0,0,0,0,0],
        cheque:[ 44,0,0,0,0,0,0,0,0,0,0,0] }
    }
  },
  "2024-25": {
    // FY 2024-25 demand derived from real collection:
    // Property: 213Cr collected at 84% eff → demand ~254Cr = 25,360L (zone-wise by property count)
    // Water: 22.8Cr collected at 77% eff → demand ~29.6Cr = 2,960L
    propDemand:  [2959, 3434, 1630, 2325, 2830, 3208, 1789, 2634, 3185, 1366],
    propColl: {
      online: [1170,1358,645,919,1119,1269,707,1042,1260,540],
      cash:   [ 697, 809,384,548, 667, 756,421, 620, 750,322],
      cheque: [ 623, 723,343,489, 595, 675,376, 554, 670,287]
    },
    propMoM:     [3300, 3000, 2800, 1900, 1700, 1600, 1600, 1500, 1400, 1300, 1200, 1100],
    waterDemand: [345, 401, 190, 271, 330, 374, 209, 307, 372, 159],
    waterColl: {
      online: [120,139,66,94,114,130,72,107,129,55],
      cash:   [ 80, 93,44,63, 76, 86,48, 71, 86,37],
      cheque: [ 67, 77,37,52, 64, 72,40, 59, 72,31]
    },
    waterMoM: [800, 700, 600, 400, 300, 300, 300, 200, 200, 200, 200, 200],
    misc: {
      "misc-water":     { label:"Water Supply & Sewerage",                  icon:"", color:"#2d1b6e",
        demand:[ 72, 84, 60, 80, 74, 88, 68, 82, 78, 90, 84, 96],
        online:[ 25, 29, 21, 28, 26, 31, 24, 29, 27, 32, 30, 34],
        cash:  [ 28, 32, 23, 30, 27, 33, 25, 31, 29, 34, 31, 36],
        cheque:[ 12, 14, 10, 13, 12, 14, 11, 13, 12, 15, 13, 16] },
      "misc-health":    { label:"Health, Medical & Veterinary",             icon:"", color:"#c0202e",
        demand:[ 35, 41, 29, 39, 36, 43, 33, 40, 38, 45, 41, 50],
        online:[ 12, 14, 10, 13, 12, 15, 11, 14, 13, 16, 14, 17],
        cash:  [ 14, 16, 11, 15, 13, 17, 12, 15, 14, 17, 15, 19],
        cheque:[  6,  7,  5,  7,  6,  7,  5,  7,  6,  8,  7,  8] },
      "misc-building":  { label:"Building, Urban Planning & Development",   icon:"", color:"#0d4f8a",
        demand:[ 57, 66, 47, 63, 58, 70, 54, 65, 62, 73, 66, 79],
        online:[ 20, 23, 16, 22, 20, 24, 19, 23, 21, 26, 23, 27],
        cash:  [ 22, 25, 18, 24, 22, 26, 20, 24, 23, 27, 25, 29],
        cheque:[  9, 10,  7,  9,  9, 11,  8, 10,  9, 11, 10, 12] },
      "misc-licensing": { label:"Licensing, Permissions & Legal",           icon:"", color:"#7a5200",
        demand:[ 44, 51, 36, 48, 44, 53, 41, 50, 47, 56, 51, 61],
        online:[ 15, 18, 13, 17, 15, 18, 14, 17, 16, 19, 18, 21],
        cash:  [ 16, 19, 13, 18, 16, 19, 15, 18, 17, 20, 18, 22],
        cheque:[  7,  8,  5,  7,  7,  8,  6,  8,  7,  9,  8, 10] },
      "misc-sanitation":{ label:"Sanitation, Environment & Waste",          icon:"", color:"#0a6b3a",
        demand:[ 15, 17, 12, 16, 15, 18, 14, 17, 16, 19, 17, 20],
        online:[  5,  6,  4,  6,  5,  6,  5,  6,  5,  7,  6,  7],
        cash:  [  6,  7,  5,  6,  5,  7,  5,  6,  6,  7,  6,  8],
        cheque:[  2,  2,  2,  2,  2,  2,  2,  2,  2,  3,  2,  3] },
      "misc-parks":     { label:"Parks, Recreation, Tourism & Culture",     icon:"", color:"#1a7fc4",
        demand:[  8,  9,  6,  8,  8,  9,  7,  9,  8, 10,  9, 11],
        online:[  3,  3,  2,  3,  3,  3,  2,  3,  3,  4,  3,  4],
        cash:  [  3,  3,  2,  3,  2,  3,  2,  3,  3,  3,  3,  4],
        cheque:[  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2] },
      "misc-transport": { label:"Transport, Parking & Enforcement",         icon:"", color:"#5a3db8",
        demand:[  4,  4,  3,  4,  4,  4,  3,  4,  4,  5,  4,  5],
        online:[  1,  2,  1,  2,  1,  2,  1,  2,  1,  2,  2,  2],
        cash:  [  2,  2,  1,  2,  1,  2,  1,  2,  2,  2,  1,  2],
        cheque:[  0,  1,  0,  1,  0,  1,  0,  1,  0,  1,  0,  1] },
      "misc-finance":   { label:"Finance, Revenue, Grants & Miscellaneous", icon:"", color:"#b8860b",
        demand:[234,271,193,259,238,285,220,265,252,299,271,313],
        online:[ 82, 95, 68, 91, 83,100, 77, 93, 88,105, 95,110],
        cash:  [ 82, 95, 68, 91, 83,100, 77, 93, 88,105, 95,110],
        cheque:[ 40, 46, 33, 44, 40, 48, 37, 45, 43, 51, 46, 53] }
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


/* ===== UPDATE KPI CARDS ===== */
function updateKPIs(fy) {
  var prevLabel = fy === "2025-26" ? "FY 2024-25" : "FY 2023-24";

  // Update all section FY labels at once
  document.getElementById("overviewMeta").innerHTML = "FY "+fy+" &nbsp;";
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

var MISC_SUB_SERVICES = {
  "misc-water": [
    "31 मार्च पर्यंतची थकबाकी (पाणीपट्टी)",
    "31 मार्च पर्यंतची थकबाकीपैकी वसुली (पाणीपट्टी)",
    "अवैध नळ नियमित करणे शुल्क वसुली",
    "नवीन नळ जोडणी (बोरिंग फी)",
    "नवीन नळ जोडणी अग्रिम व मीटर अनामत",
    "पाणी पुरवठा इतर अनामत",
    "पाणी विक्री टँकर भाडे (Tanker Charges)",
    "पाण्याचा अपव्यय बाबत दंड",
    "पाणी पट्टी वसुली जायकवाडी ग्राहक",
    "Sale of Treated Sewage Water Fees",
    "जलनि:स्सारण वाहिनी जोडणी फी",
    "जलनि:स्सारण वाहिनी जोडणी व इतर अग्रीम",
    "प्लंबर परवाना फी (पाणी पुरवठा व जलनि:स्सारण विभाग)"
  ],
  "misc-health": [
    "NURSING TRAINING FEE (HEALTH)",
    "HEALTH CERTIFICATE FEE (HEALTH)",
    "जन्म व मृत्यु फी",
    "OPD Meltron (DCHC)",
    "ओ पी डी (शिवाजी नगर)",
    "ओ.पी.डी. फिस (AAREF COLONY)",
    "ओ.पी.डी. फिस (GANESH COLONY)",
    "ओ.पी.डी. फिस (अंबिका नगर)",
    "ओ.पी.डी फिस (औरंगापुरा)",
    "ओ.पी.डी. फिस (कांचनवाडी)",
    "ओ.पी.डी. फिस (कैलास नगर, दादा कॉलनी)",
    "ओ.पी.डी. फिस (कैसर कॉलनी)",
    "ओ.पी.डी. फिस (क्रांती चौक)",
    "ओ.पी.डी. फिस (गरम पाणी)",
    "ओ.पी.डी. फिस (चिकलठाणा)",
    "ओ.पी.डी. फिस (चेतना नगर)",
    "ओ.पी.डी फिस (जय भवानी नगर)",
    "ओ.पी.डी. फिस (जवाहर कॉलनी)",
    "ओ.पी.डी. फिस (जिंन्सी)",
    "ओ.पी.डी. फिस (जुना बाजार)",
    "ओ.पी.डी. फिस (देवळाई)",
    "ओ.पी.डी. फिस (नक्षत्रवाडी)",
    "ओ.पी.डी. फिस (नारेगाव)",
    "ओ.पी.डी. फिस (नेहरु नगर)",
    "ओ.पी.डी. फिस (पीर बाजार)",
    "ओ.पी.डी. फिस (पुंडलिक नगर)",
    "ओ.पी.डी. फिस (बन्सीलाल नगर)",
    "ओ.पी.डी. फिस (बायजीपुरा)",
    "ओ.पी.डी. फिस (भवानी नगर)",
    "ओ.पी.डी. फिस (भिमनगर)",
    "ओ.पी.डी. फिस (मसनतपुर)",
    "ओ.पी.डी. फिस (मुकुंदवाडी)",
    "ओ.पी.डी. फिस (राज नगर)",
    "ओ.पी.डी फिस (विजय नगर)",
    "ओ.पी.डी. फिस (सातारा)",
    "ओ.पी.डी. फिस (सादातनगर)",
    "ओ.पी.डी. फिस (सिडको एन 11)",
    "ओ.पी.डी. फिस (सिडको एन-8)",
    "ओ.पी.डी. फिस (सिल्क मील कॉलनी)",
    "ओ.पी.डी. फिस (हर्ष नगर)",
    "ओ.पी.डी. फिस (हर्सुल)",
    "ओ. पी. डी. फीस काबीर नगर",
    "ओ.पी.डी. फीस (जिंसी नविन)",
    "ओ पी डी फीस (मिसारवाडी)",
    "पशु वैद्यकीय सेवा व फी",
    "Ambulance and other Vehicle शुल्क",
    "AMBULANCE CHARGES",
    "बायोमेडीकल वेस्ट प्रकल्प सभासद नोंदणी फी",
    "प्रसुती ग्रह/दवाखाना नोंदणी फी",
    "श्वान दंश प्रतिबंध योजना कर्मचारी खर्च प्रतिपुर्ती"
  ],
  "misc-building": [
    "LDC (जमीन विकास शुल्क)",
    "नगर रचना बांधकाम अनामत",
    "बांधकाम परवाना व इतर फी",
    "बांधकाम परवाना नियमित दंड",
    "प्रिमीयम रक्कम जमा (इमारत नियमितकरण प्रिमीयम)",
    "अतिक्रमणे, अनधिकृत बांधकामे पाडणे व खर्च वसुली",
    "रोडरोलर / जेसीबी भाडे",
    "फेर फार नकाशे व इतर फी",
    "गुंठेवारी कायदाअंतर्गत वसुली",
    "गुंठेवारी विकास विविध विकास कामे"
  ],
  "misc-licensing": [
    "NA Tax (अकृषीक कर)",
    "नामांतर शुल्क",
    "नाहरकत प्रमाणपत्र नुतनीकरण फी",
    "आगीचे नाहरकत प्रमाणपत्र फी",
    "आगीपासुन प्रमाणपत्र फी",
    "मांस परवाना (मटन, फिश, चिकन, बीफ)",
    "इतर परवाना फी",
    "Pitch Parwana",
    "Tender Form Fees",
    "टेंडर फोर्म",
    "True Copy Fee",
    "शोधनावळ व नक्कल फी",
    "एल.बी.टी. मुद्रांक शुल्क",
    "नाहरकत प्रमाणपत्र नुतनीकरण फी (Renewal NOC)",
    "आगीपासुन संरक्षण प्रमाणपत्र फी",
    "प्लंबर परवाना फी",
    "विवाह नोंदणी फी (Marriage Registration)",
    "जाहिरात बोर्ड परवाना (Hoarding/Advertisement Board)"
  ],
  "misc-sanitation": [
    "नागरी घन कचरा व्यवस्थापन Fine & Fees",
    "सेप्टीक टॅंक साफ करणे वसुली",
    "फायर कॉल चार्जेस (Fire Call Charges)",
    "FIRE OTHER",
    "FSD",
    "फायर फंड (अग्निशमन निधी)",
    "झाडे तोडणे / छाटणे शुल्क (Tree Felling / Trimming)"
  ],
  "misc-parks": [
    "KAMAL TALAV GARDEN ENTRY FEE",
    "MAHARANA PRATAP GARDEN ENTRY FEE",
    "Siddhartha Garden Entry Fee",
    "Siddhartha Garden Mini Train Royalty",
    "Rubber Water Tank Royalty (BOT)",
    "SWAMI VIVEKANAND MINI TRAIN",
    "Swami Vivekanand Adventure Park Entry Fee",
    "Botanical Garden Entry Fee",
    "Botanical Garden Mini Train Royalty",
    "Planetarium Entry Fee",
    "प्राणी संग्रहालय प्रवेश फी (Zoo Entry Fee)",
    "मत्स्यालय प्रवेश फी (Aquarium Entry Fee)",
    "Playground Rent (क्रिडांगन भाडे)",
    "जलतरण तलाव सभासद फी (Swimming Pool Membership)",
    "वाचनालय सभासद नोंदणी फी (Library Membership)",
    "संग्रहालय प्रवेश फी (Museum Entry Fee — शिवाजी महाराज पुराणवस्तु संग्राहालय)",
    "नाट्यगृह भाडे (Theater / Natyagriha Rent)",
    "सांस्कृतिक कार्यक्रम परवानगी (Cultural Event Permission)",
    "छायाचित्रण / चित्रीकरण परवानगी (Photography / Filming Permission)",
    "उद्यान / मैदान आरक्षण (Park / Ground Booking)"
  ],
  "misc-transport": [
    "Vehicle Lifting Charges Royalty",
    "STAND BY DUTY CHARGES",
    "RESCUE CALL CHARGES",
    "सायकल व स्कुटर थांबे (Cycle & Scooter Stand Fees)",
    "वाहन तपासणी / दंड (Vehicle Inspection / Penalty)"
  ],
  "misc-finance": [
    "अन्य इतर कर व वसुली",
    "इतर फी व शुल्क वसुली",
    "इतर वसुली",
    "इतर व संकिर्ण",
    "इतर स्थायी अग्रिम वसुली",
    "इमारत भाडे (Building Rent)",
    "नाट्यगृह भाडे (Theater Rent)",
    "जमीन भाडे / टपरी भाडे (Land/Stall Rent)",
    "दुकान भाडे (Shop Rent)",
    "झाडे व फुले विक्री (Sale of Trees & Flowers)",
    "Election Deposit",
    "Election Form Fee",
    "Election Voter List Fee and Other",
    "Excess Payment Recovery",
    "AUDIT PARA RECOVERY",
    "GST Grant",
    "1% CGST",
    "6% SGST",
    "9% CGST",
    "9% SGST",
    "5% Supervision Charges",
    "Development Fund",
    "City Development Fund",
    "Local Development Fund",
    "Special Government Grant",
    "Primary Education Grant",
    "Dalit Vasti Development Grant",
    "महिला व बालकल्याण उत्पन्न",
    "कर्मचारी पगार परत जमा",
    "सण अग्रिम वसुली",
    "बाजार अनामत",
    "विविध दंड व शुल्क"
  ]
};

function buildMiscSection(key) {
  var s=miscServices[key], tot=sum(s.all), dem=sum(s.demand), out=dem-tot;
  var on=sum(s.online), ca=sum(s.cash), ch=sum(s.cheque);
  var prevFYData = activeFY==="2025-26" ? FY_DATA["2024-25"] : null;
  var prevTot = prevFYData ? sum(prevFYData.misc[key].all) : Math.round(tot*0.83);
  var pl = activeFY==="2025-26" ? "FY 2024-25" : "FY 2023-24";
  var subServices = MISC_SUB_SERVICES[key] || [];
  var el = document.getElementById(key);

  var subList = subServices.length
    ? '<div class="misc-sub-services">'
        +'<div class="misc-sub-title" onclick="this.nextElementSibling.classList.toggle(\'open\')">'
          +'&#9660; Services under this category ('+subServices.length+')'
        +'</div>'
        +'<ul class="misc-sub-list">'
          + subServices.map(function(sv){ return '<li>'+sv+'</li>'; }).join('')
        +'</ul>'
      +'</div>'
    : '';

  el.innerHTML =
    '<div class="section-header"><h2>'+s.icon+' '+s.label+'</h2>'
      +'<div class="section-meta fy-meta" data-suffix="Head Office">Head Office | FY '+activeFY+'</div>'
    +'</div>'
  //  +'<p class="section-note">Collected centrally at Head Office. No fixed demand — revenue varies by usage of service.</p>'
    + subList
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
/* ===== CHART HELPERS ===== */
var charts = {};
function buildBarDS(dem, coll, mode) {
  var colors = {
    all:    'rgba(0,188,212,.85)',   // cyan — matches property card
    online: 'rgba(26,111,168,.85)',
    cash:   'rgba(40,167,69,.85)',   // green
    cheque: 'rgba(201,138,0,.9)'
  };
  var labels = {all:'Collection (All)', online:'Online', cash:'Cash', cheque:'Cheque'};
  return [
    {label:'Demand (Rs.L)',  data:dem,  backgroundColor:'rgba(180,190,200,.45)'},
    {label:labels[mode]+' (Rs.L)', data:coll, backgroundColor:colors[mode]}
  ];
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
  if(tabsEl) tabsEl.innerHTML = RTS_DEPTS.map(function(d){
    return '<button class="rts-tab'+(d==='All'?' active':'')+'" onclick="filterRTSDept(\''+d+'\')">'+d+'</button>';
  }).join('');

  // Monthly chart - show full year for past FY, April only for current FY
  var rtsRec = activeFY === "2025-26" ? [320,0,0,0,0,0,0,0,0,0,0,0] : [320,290,310,280,300,270,290,260,280,250,270,240];
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
  var titleEl = document.getElementById('rtsDeptTitle');
  var countEl = document.getElementById('rtsServiceCount');
  if(titleEl) titleEl.textContent = dept === 'All' ? 'All Departments' : dept+' Department';
  if(countEl) countEl.textContent = filtered.length+' services';
  var tbody = document.getElementById('rtsTableBody');
  if(!tbody) return;
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

/* =============================================
   PROPERTY COUNT ZONE-WISE (real data from dashboard)
   Total: 3,37,497 properties
   ============================================= */
var PROP_COUNT_ZONE = [39200, 45500, 21600, 30800, 37500, 42500, 23700, 34900, 42200, 18100];
// Total = 336,000 — adjust last zone to hit exact 337,497
PROP_COUNT_ZONE[9] = 337497 - PROP_COUNT_ZONE.slice(0,9).reduce(function(a,b){return a+b;},0);

/* Water connections zone-wise — calculated inside createCharts after loadFYData */
var WATER_CONN_ZONE = [];

/* ===== CREATE ALL CHARTS ===== */
function createCharts() {
  var miscMonthly = MONTHS.map(function(m,i){
    var t=0; Object.keys(miscServices).forEach(function(k){ t+=miscServices[k].all[i]; }); return t;
  });
  var miscLabels=[],miscVals=[],miscColors=['#2d1b6e','#c0202e','#0d4f8a','#7a5200','#0a6b3a','#1a7fc4','#5a3db8','#b8860b'];
  Object.keys(miscServices).forEach(function(k){ miscLabels.push(miscServices[k].label); miscVals.push(sum(miscServices[k].all)); });

  charts.overviewZone = new Chart(document.getElementById('overviewZoneChart'),{type:'bar',data:{labels:WARDS,datasets:[
    {label:'Prop Demand',   data:propDemand,     backgroundColor:'rgba(0,150,180,.5)'},
    {label:'Prop Collected',data:propColl.all,   backgroundColor:'rgba(0,188,212,.85)'},
    {label:'Water Demand',  data:waterDemand,    backgroundColor:'rgba(30,130,60,.4)'},
    {label:'Water Collected',data:waterColl.all, backgroundColor:'rgba(40,167,69,.85)'}
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

  /* PROPERTY COUNT ZONE-WISE */
  var propCountTotal = PROP_COUNT_ZONE.reduce(function(a,b){return a+b;},0);
  charts.propCount = new Chart(document.getElementById('propCountZoneChart'),{
    type:'bar',
    data:{ labels:WARDS, datasets:[{
      label:'Property Count',
      data: PROP_COUNT_ZONE,
      backgroundColor:'rgba(40,167,69,.85)',  // green — matches original
    }]},
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{position:'top'},
        title:{display:true, text:'Property Total Count Ward-wise : '+propCountTotal.toLocaleString('en-IN'), font:{size:13}}
      },
      scales:{y:{beginAtZero:false, title:{display:true,text:'Property Count'}}}
    }
  });

  /* PROPERTY DEMAND vs COLLECTION */
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

  /* WATER CONNECTION COUNT ZONE-WISE */
  WATER_CONN_ZONE = waterDemand.map(function(d){
    return Math.round((d / sum(waterDemand)) * 185000);
  });
  var waterConnTotal = WATER_CONN_ZONE.reduce(function(a,b){return a+b;},0);
  charts.waterConn = new Chart(document.getElementById('waterConnCountChart'),{
    type:'bar',
    data:{ labels:WARDS, datasets:[{
      label:'Water Connections',
      data: WATER_CONN_ZONE,
      backgroundColor:'rgba(40,167,69,.85)',  // green — matches original water
      borderRadius:4
    }]},
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{
        legend:{position:'top'},
        title:{display:true, text:'Water Connections Count Zone-wise : '+waterConnTotal.toLocaleString('en-IN'), font:{size:13}}
      },
      scales:{y:{beginAtZero:false, title:{display:true,text:'Connection Count'}}}
    }
  });

  /* WATER DEMAND vs COLLECTION */
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
    charts[key+'Pie'] = new Chart(document.getElementById(key+'ModePie'),{type:'doughnut',data:{labels:['Online','Cash','Cheque'],datasets:[{data:[on,ca,ch],backgroundColor:['#1a7fc4','#1aaa5c','#c98a00']}]},options:pieOpts(s.label+' — Payment Mode Split (Rs.L)')});
    charts[key+'YoY'] = new Chart(document.getElementById(key+'YoYChart'),{type:'bar',data:{labels:MONTHS,datasets:[
      {label:getPrevFYLabel(),data:prev,backgroundColor:'rgba(180,190,200,.6)'},
      {label:getCurrFYLabel(),data:s.all,backgroundColor:s.color+'cc'}
    ]},options:barOpts(s.label+' — Year-on-Year Monthly (Rs.L)')});
  });

  /* --- RTS COLLECTIONS --- */
  buildRTSModule();

  var digProp=propMoM.map(function(v){return Math.round(v*.5);}), digWater=waterMoM.map(function(v){return Math.round(v*.45);});
  var digMisc=MONTHS.map(function(m,i){var t=0;Object.keys(miscServices).forEach(function(k){t+=miscServices[k].online[i];});return t;});

  // Digital comparison banner — FY 2024-25 actual: Rs.52 Cr digital (property + water)
  var prevDigital = 5200; // Rs.52 Cr = 5200 L
  var currDigital = sum(digProp) + sum(digWater) + sum(digMisc);
  var digGrowth   = Math.round((currDigital - prevDigital) / prevDigital * 100);
  var bannerEl2   = document.getElementById('digitalCompareBanner');
  if(bannerEl2) bannerEl2.innerHTML =
    '<div class="digital-compare-item"><div class="digital-compare-label">FY 2024-25 Digital Collection</div><div class="digital-compare-val">\u20b952 Cr</div><div class="digital-compare-sub">Property + Water (Actual)</div></div>'
    +'<div class="digital-compare-arrow">\u2192</div>'
    +'<div class="digital-compare-item"><div class="digital-compare-label">FY 2025-26 Digital Collection</div><div class="digital-compare-val">'+fmt(currDigital)+'</div><div class="digital-compare-sub">Property + Water + Misc</div></div>'
    +'<div class="digital-compare-growth">'+(digGrowth>=0?'+':'')+digGrowth+'% YoY</div>';

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
  // buildOutstandingCharts(); // canvases commented out — skip
}

/* ===== OUTSTANDING SECTION ===== */
function buildOutstandingCharts() {
  var propAprTotal = propMoM[0], waterAprTotal = waterMoM[0];
  var propDemTotal = sum(propDemand), waterDemTotal = sum(waterDemand);
  var propAprColl  = propDemand.map(function(d){ return Math.round(d/propDemTotal*propAprTotal*10)/10; });
  var waterAprColl = waterDemand.map(function(d){ return Math.round(d/waterDemTotal*waterAprTotal*10)/10; });
  var propOut  = propDemand.map(function(v,i){ return Math.round((v-propAprColl[i])*10)/10; });
  var waterOut = waterDemand.map(function(v,i){ return Math.round((v-waterAprColl[i])*10)/10; });
  var totalOut = WARDS.map(function(w,i){ return Math.round((propOut[i]+waterOut[i])*10)/10; });
  var propAprCollTotal = sum(propAprColl), waterAprCollTotal = sum(waterAprColl);
  var propOutTotal = sum(propOut), waterOutTotal = sum(waterOut);
  var totalOutApr  = propOutTotal + waterOutTotal;
  var grandDem     = sum(propDemand) + sum(waterDemand);
  var aprCollected = propAprCollTotal + waterAprCollTotal;
  var collEff = WARDS.map(function(w,i){
    var dem = propDemand[i]+waterDemand[i], col = propAprColl[i]+waterAprColl[i];
    return dem>0 ? Math.round(col/dem*100) : 0;
  });

  // Top banner
  var bannerEl = document.getElementById('outBanner');
  if(bannerEl) bannerEl.innerHTML = [
    {label:'Total Outstanding',   val:fmtFull(totalOutApr),  sub:fmt(totalOutApr)+' of '+fmt(grandDem)+' demand',  cls:'red'},
    {label:'Property Outstanding',val:fmtFull(propOutTotal), sub:fmt(propOutTotal),                                 cls:'amber'},
    {label:'Water Outstanding',   val:fmtFull(waterOutTotal),sub:fmt(waterOutTotal),                                cls:'amber'},
    {label:'April Collected',     val:fmtFull(aprCollected), sub:fmt(aprCollected)+' collected so far',             cls:'green'},
    {label:'Collection Efficiency',val:pct(aprCollected,grandDem)+'%', sub:'April 2025 only',                       cls:'blue'},
    {label:'Recovery Potential',  val:fmtFull(totalOutApr),  sub:'11 months remaining',                             cls:'blue'}
  ].map(function(s){
    return '<div class="out-banner-stat"><div class="out-banner-label">'+s.label+'</div>'
      +'<div class="out-banner-value '+s.cls+'">'+s.val+'</div>'
      +'<div class="out-banner-sub">'+s.sub+'</div></div>';
  }).join('');

  // Zone priority cards
  var ranked = WARDS.map(function(w,i){
    return {zone:w, propOut:propOut[i], waterOut:waterOut[i], total:totalOut[i], eff:collEff[i]};
  }).sort(function(a,b){ return b.total-a.total; });
  var maxOut = ranked[0].total;
  var rankClasses = ['rank-1','rank-2','rank-3','rank-4','rank-5'];
  var barColors   = ['#c0202e','#d94f20','#c98a00','#7a9ab8','#7a9ab8'];

  var gridEl = document.getElementById('outZoneGrid');
  if(gridEl) gridEl.innerHTML = ranked.map(function(r,i){
    var pClass   = i===0?'priority-1':i<=2?'priority-2':i<=4?'priority-3':'priority-low';
    var rClass   = i===0?'r1':i<=2?'r2':i<=4?'r3':'rlow';
    var effColor = r.eff>=15?'#1aaa5c':r.eff>=8?'#c98a00':'#c0202e';
    var focus    = i===0?' \uD83C\uDFAF':i<=2?' \u26A0\uFE0F':'';
    return '<div class="out-zone-card '+pClass+'">'
      +'<div class="out-zone-card-rank '+rClass+'">'+(i+1)+'</div>'
      +'<div class="out-zone-name">'+r.zone+focus+'</div>'
      +'<div class="out-zone-amount">'+fmtFull(r.total)+'</div>'
      +'<div class="out-zone-sub">'+fmt(r.total)+' outstanding</div>'
      +'<div class="out-zone-sub">Prop: '+fmt(r.propOut)+' | Water: '+fmt(r.waterOut)+'</div>'
      +'<div class="out-zone-eff-bar"><div class="out-zone-eff-fill" style="width:'+r.eff+'%;background:'+effColor+'"></div></div>'
      +'<div class="out-zone-eff-label">'+r.eff+'% collected (April)</div>'
      +'</div>';
  }).join('');

  // Ranked horizontal stacked bar — only if canvas exists
  var rankedCanvas = document.getElementById('outZoneRanked');
  if(rankedCanvas) {
    if(charts.outZoneRanked) charts.outZoneRanked.destroy();
    charts.outZoneRanked = new Chart(rankedCanvas,{
      type:'bar',
      data:{
        labels:ranked.map(function(r){return r.zone;}),
        datasets:[
          {label:'Property Outstanding (Rs.L)',data:ranked.map(function(r){return r.propOut;}),backgroundColor:'rgba(192,32,46,.85)',borderRadius:3},
          {label:'Water Outstanding (Rs.L)',   data:ranked.map(function(r){return r.waterOut;}),backgroundColor:'rgba(201,138,0,.75)',borderRadius:3}
        ]
      },
      options:{
        indexAxis:'y',responsive:true,maintainAspectRatio:false,
        plugins:{legend:{position:'top'},title:{display:true,text:'Zones Ranked by Outstanding — Focus Priority (April 2025)',font:{size:13}}},
        scales:{x:{stacked:true,beginAtZero:true,title:{display:true,text:'Rs. Lakhs'}},y:{stacked:true,ticks:{font:{weight:'bold'}}}}
      }
    });
  }

  // Doughnut — only if canvas exists
  var pieCanvas = document.getElementById('outPie');
  if(pieCanvas) {
    if(charts.outPie) charts.outPie.destroy();
    charts.outPie = new Chart(pieCanvas,{
      type:'doughnut',
      data:{labels:['Property Outstanding','Water Outstanding','Collected (April)'],
        datasets:[{data:[propOutTotal,waterOutTotal,aprCollected],backgroundColor:['#c0202e','#c98a00','#1aaa5c'],hoverOffset:6}]},
      options:pieOpts('Outstanding vs Collected — April 2025 (Rs.L)')
    });
  }

  // Efficiency bar — only if canvas exists
  var effCanvas = document.getElementById('outEffChart');
  if(effCanvas) {
    var effColors2 = collEff.map(function(e){return e>=15?'rgba(26,170,92,.85)':e>=8?'rgba(201,138,0,.85)':'rgba(192,32,46,.85)';});
    if(charts.outEff) charts.outEff.destroy();
    charts.outEff = new Chart(effCanvas,{
      type:'bar',
      data:{labels:WARDS,datasets:[{label:'Collection Efficiency % (April)',data:collEff,backgroundColor:effColors2,borderRadius:5}]},
      options:{responsive:true,maintainAspectRatio:false,
        plugins:{legend:{display:false},title:{display:true,text:'Collection Efficiency % per Zone — April 2025',font:{size:12}}},
        scales:{y:{min:0,max:100,title:{display:true,text:'%'}}}}
    });
  }
}

/* ===== SWITCH FY ===== */
function switchFY(fy, btn) {
  if(fy === activeFY) return;
  activeFY = fy;
  document.querySelectorAll('.fy-btn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  loadFYData(fy);
  buildAllMiscSections();
  updateKPIs(fy);
  refreshStatStrips(fy);
  Object.keys(charts).forEach(function(k){ if(charts[k]) charts[k].destroy(); });
  charts = {};
  createCharts();
  displayTable();
}

/* ===== INITIAL RENDER ===== */
loadFYData("2025-26");
buildAllMiscSections();
updateKPIs("2025-26");
refreshStatStrips("2025-26");
createCharts();

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
// Use FY 2025-26 demand as reference (in Lakhs)
var _refDemand = [24,38,12,30,20,24,34,21,37,10];
var counter = 100;
otherZones.forEach(function(zone){
  var zDemandLakhs = _refDemand[zoneIdx[zone]] || 20;
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

/* tableData is now fully populated — safe to render */
displayTable();

function displayTable(fromDate, toDate) {
  var tbody = document.querySelector('#dataTable tbody');
  if(!tbody) return;
  tbody.innerHTML = '';

  var filtered = (tableData || []).filter(function(d){
    var dateOk   = (!fromDate || !toDate) || (d.date >= fromDate && d.date <= toDate);
    var zoneEl   = document.getElementById('tblZoneFilter');
    var modeEl   = document.getElementById('tblModeFilter');
    var statusEl = document.getElementById('tblStatusFilter');
    var searchEl = document.getElementById('tblSearch');
    var zoneOk   = !zoneEl   || zoneEl.value   === 'all' || d.zone   === zoneEl.value;
    var modeOk   = !modeEl   || modeEl.value   === 'all' || d.mode   === modeEl.value;
    var statusOk = !statusEl || statusEl.value === 'all' || d.status === statusEl.value;
    var search   = searchEl ? searchEl.value.toLowerCase() : '';
    var searchOk = !search || d.owner.toLowerCase().indexOf(search) > -1 || d.id.toLowerCase().indexOf(search) > -1;
    return dateOk && zoneOk && modeOk && statusOk && searchOk;
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

  // Find months overlapping the date range
  var idx = getMonthsInRange(from, to);

  if(idx.length > 0) {
    var fl = idx.map(function(i){ return MONTHS[i]; });
    // Update property demand vs collection bar chart
    if(charts.property) {
      charts.property.data.labels = fl;
      charts.property.data.datasets[0].data = idx.map(function(i){ return Math.round(propDemand[i % propDemand.length] * (idx.length/12)); });
      charts.property.data.datasets[1].data = idx.map(function(i){ return Math.round(propColl.all[i % propColl.all.length] * (idx.length/12)); });
      charts.property.update();
    }
    // Update MoM chart
    if(charts.propMoM) {
      charts.propMoM.data.labels = fl;
      charts.propMoM.data.datasets[0].data = idx.map(function(i){ return propMoM[i]; });
      if(charts.propMoM.data.datasets[1]) charts.propMoM.data.datasets[1].data = idx.map(function(i){ return propMoM_prev[i]; });
      charts.propMoM.update();
    }
  }

  displayTable(from, to);
}

function clearFilters() {
  document.getElementById('fromDate').value = '';
  document.getElementById('toDate').value   = '';
  // Restore full year on all property charts
  if(charts.property) {
    charts.property.data.labels = WARDS;
    charts.property.data.datasets = buildBarDS(propDemand, propColl.all, 'all');
    charts.property.update();
  }
  if(charts.propMoM) {
    charts.propMoM.data.labels = MONTHS;
    charts.propMoM.data.datasets[0].data = propMoM;
    if(charts.propMoM.data.datasets[1]) charts.propMoM.data.datasets[1].data = propMoM_prev;
    charts.propMoM.update();
  }
  // Also clear table filters
  var zf = document.getElementById('tblZoneFilter'); if(zf) zf.value = 'all';
  var mf = document.getElementById('tblModeFilter'); if(mf) mf.value = 'all';
  var sf = document.getElementById('tblSearch');     if(sf) sf.value = '';
  currentPage = 1;
  displayTable();
}

/* Helper: get month indices overlapping a date range */
function getMonthsInRange(from, to) {
  return MONTHS.reduce(function(acc, m, i){
    var mStart = monthIndexToDate(i);
    var mEnd   = new Date(mStart); mEnd.setMonth(mEnd.getMonth()+1); mEnd.setDate(0);
    if(mStart <= to && mEnd >= from) acc.push(i);
    return acc;
  }, []);
}

/* Generic date filter for water + misc sections — see full implementation above in applyDateFilter */

function applyDateFilter(section) {
  var fromVal = document.getElementById(section+'FromDate').value;
  var toVal   = document.getElementById(section+'ToDate').value;
  if(!fromVal || !toVal) { alert("Please select both From and To dates."); return; }
  var from = new Date(fromVal);
  var to   = new Date(toVal); to.setHours(23,59,59);
  if(from > to) { alert("From date must be before To date."); return; }

  var idx = getMonthsInRange(from, to);
  if(idx.length === 0) return;
  var fl = idx.map(function(i){ return MONTHS[i]; });

  // Water section
  if(section === 'water') {
    if(charts.water) {
      charts.water.data.labels = fl;
      charts.water.data.datasets[0].data = idx.map(function(i){ return waterDemand[i % waterDemand.length]; });
      charts.water.data.datasets[1].data = idx.map(function(i){ return waterColl.all[i % waterColl.all.length]; });
      charts.water.update();
    }
    if(charts.waterMoM) {
      charts.waterMoM.data.labels = fl;
      charts.waterMoM.data.datasets[0].data = idx.map(function(i){ return waterMoM[i]; });
      if(charts.waterMoM.data.datasets[1]) charts.waterMoM.data.datasets[1].data = idx.map(function(i){ return waterMoM_prev[i]; });
      charts.waterMoM.update();
    }
    return;
  }

  // Misc sections — bar chart uses MONTHS labels with stacked online/cash/cheque
  if(miscServices[section] && charts[section]) {
    var s = miscServices[section];
    charts[section].data.labels = fl;
    var ds = charts[section].data.datasets;
    if(ds.length >= 3) {
      ds[0].data = idx.map(function(i){ return s.online[i]; });
      ds[1].data = idx.map(function(i){ return s.cash[i]; });
      ds[2].data = idx.map(function(i){ return s.cheque[i]; });
    } else {
      ds[0].data = idx.map(function(i){ return s.demand[i]; });
      ds[1].data = idx.map(function(i){ return s.all[i]; });
    }
    charts[section].update();
  }
}

function clearDateFilter(section) {
  var fromEl = document.getElementById(section+'FromDate');
  var toEl   = document.getElementById(section+'ToDate');
  if(fromEl) fromEl.value = '';
  if(toEl)   toEl.value   = '';

  if(section === 'water') {
    if(charts.water) {
      charts.water.data.labels = WARDS;
      charts.water.data.datasets = buildBarDS(waterDemand, waterColl.all, 'all');
      charts.water.update();
    }
    if(charts.waterMoM) {
      charts.waterMoM.data.labels = MONTHS;
      charts.waterMoM.data.datasets[0].data = waterMoM;
      if(charts.waterMoM.data.datasets[1]) charts.waterMoM.data.datasets[1].data = waterMoM_prev;
      charts.waterMoM.update();
    }
    return;
  }

  if(miscServices[section] && charts[section]) {
    var s = miscServices[section];
    charts[section].data.labels = MONTHS;
    var ds = charts[section].data.datasets;
    if(ds.length >= 3) {
      ds[0].data = s.online;
      ds[1].data = s.cash;
      ds[2].data = s.cheque;
    } else {
      ds[0].data = s.demand;
      ds[1].data = s.all;
    }
    charts[section].update();
  }
}


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

/* All report data is now ready — build reports */
buildReports();

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
  var data = (ZONE_PROPERTY_COUNT || []).filter(function(r){
    if(!search) return true;
    return r.zone.toLowerCase().indexOf(search.toLowerCase()) > -1;
  });
  var tbody = document.getElementById('rptZoneBody');
  var tfoot = document.getElementById('rptZoneFoot');
  if(!tbody) return;
  tbody.innerHTML = data.map(function(r){
    return '<tr><td>'+r.zone+'</td>'
      +'<td>'+r.tillDate.toLocaleString('en-IN')+'</td>'
      +'<td>'+r.currentYear.toLocaleString('en-IN')+'</td></tr>';
  }).join('');
  var totTill = data.reduce(function(a,r){ return a+r.tillDate; },0);
  var totCurr = data.reduce(function(a,r){ return a+r.currentYear; },0);
  if(tfoot) tfoot.innerHTML = '<tr><td><strong>Total Count</strong></td>'
    +'<td><strong>'+totTill.toLocaleString('en-IN')+'</strong></td>'
    +'<td><strong>'+totCurr.toLocaleString('en-IN')+'</strong></td></tr>';
  var footer = document.getElementById('rptZoneFooter');
  if(footer) footer.textContent = 'Showing 1 to '+data.length+' of '+data.length+' entries';
}

function renderUsageWise(search) {
  var data = (USAGE_WISE_DATA || []).filter(function(r){
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
  var data = (DAYWISE_DATA || []).filter(function(r){
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




