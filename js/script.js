/* PART 1: MOBILE MENU. Clicking the burger button adds or removes the class "open" on the menu. */
var burger=document.getElementById("burger"),nav=document.getElementById("nav");
function setNav(o){nav.classList.toggle("open",o);burger.setAttribute("aria-expanded",o);burger.setAttribute("aria-label",o?"Close menu":"Open menu")}
burger.addEventListener("click",function(){setNav(!nav.classList.contains("open"))});
nav.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){setNav(false)})});
document.addEventListener("keydown",function(e){if(e.key==="Escape")setNav(false)});
window.addEventListener("resize",function(){if(window.innerWidth>1024)setNav(false)});
/* PART 2: SETTINGS. Your WhatsApp number (country code + number, digits only). */
var WA_NUMBER="916380467953";
// Add real photos: set src to an image address or data URI
/* PART 3: RECENT WORK DATA. One line per picture: c = category, t = caption, src = picture. */
var WORK=[
  {c:"Electrical",   t:"House wiring",            src:"images/wiring_img.jpg"},
  {c:"Electrical",   t:"MCB and panel board",     src:"images/mcb_img.jpg"},
  {c:"Electrical",   t:"Fan and light fitting",   src:"images/fanlight_img.jpg"},
  {c:"Plumbing",     t:"Bathroom pipe fitting",   src:"images/bathpipe_img.jpg"},
  {c:"Plumbing",     t:"Water tank line",         src:"images/watertank_img.jpg"},
  {c:"Construction", t:"Site and finishing work", src:"images/sitework_img.jpg"}
];
/* PART 4: DRAW THE GALLERY. drawGal() builds the picture tiles; the buttons below filter them. */
var cur="All",gal=document.getElementById("gal"),fl=document.getElementById("filters"),lb=document.getElementById("lb");
function drawGal(){
  gal.textContent="";
  WORK.forEach(function(w){
    if(cur!=="All"&&w.c!==cur)return;
    var f=document.createElement("figure");f.className="tile";
    var m;
    if(w.src){m=document.createElement("img");m.src=w.src;m.alt=w.t;m.loading="lazy";f.addEventListener("click",function(){lb.firstChild.src=w.src;lb.classList.add("on")})}
    else{m=document.createElement("div");m.className="ph";m.textContent={Electrical:"⚡",Plumbing:"🚰",Construction:"🏗️"}[w.c];m.setAttribute("aria-label","Photo coming soon")}
    var c=document.createElement("figcaption");c.textContent=w.t;
    var s=document.createElement("span");s.textContent=w.c;c.appendChild(s);
    f.appendChild(m);f.appendChild(c);gal.appendChild(f);
  });
}
["All","Electrical","Plumbing","Construction"].forEach(function(n){
  var b=document.createElement("button");b.textContent=n;b.setAttribute("aria-pressed",n==="All");
  b.addEventListener("click",function(){cur=n;fl.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",x===b)});drawGal()});
  fl.appendChild(b);
});
drawGal();
lb.addEventListener("click",function(){lb.classList.remove("on")});
/* PART 5: SLIDER ARROWS and auto-play (moves every 4 seconds, pauses when you touch it). */
function step(d){var t=gal.firstChild;if(!t)return;var w=t.getBoundingClientRect().width+16;
  if(d>0&&gal.scrollLeft+gal.clientWidth>=gal.scrollWidth-4)gal.scrollTo({left:0});
  else if(d<0&&gal.scrollLeft<4)gal.scrollTo({left:gal.scrollWidth});
  else gal.scrollBy({left:d*w})}
document.getElementById("next").addEventListener("click",function(){step(1)});
document.getElementById("prev").addEventListener("click",function(){step(-1)});
var paused=false,reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
["mouseenter","focusin","touchstart"].forEach(function(ev){gal.addEventListener(ev,function(){paused=true})});
["mouseleave","focusout"].forEach(function(ev){gal.addEventListener(ev,function(){paused=false})});
if(!reduce)setInterval(function(){if(!paused&&!lb.classList.contains("on"))step(1)},4000);
document.addEventListener("keydown",function(e){if(e.key==="Escape")lb.classList.remove("on")});
/* PART 6: WHATSAPP FORM. build() joins the form answers into one message; submit opens WhatsApp. */
var $=function(i){return document.getElementById(i)};
var form=$("form"),bubble=$("bubble"),err=$("err");
function build(){
  var svc=form.querySelector('input[name="svc"]:checked').value;
  var n=$("name").value.trim(),a=$("area").value.trim(),m=$("msg").value.trim();
  var t="Hello AJM Electrical & Plumbing, I need help with: "+svc+".";
  if(m)t+="\nProblem: "+m;
  if(a)t+="\nLocation: "+a;
  if(n)t+="\nName: "+n;
  return t+"\nPlease share a quote and arrival time.";
}
function refresh(){bubble.textContent=build()}
form.addEventListener("input",refresh);refresh();
/* When "Send on WhatsApp" is pressed: check the boxes, then open wa.me with the message. */
form.addEventListener("submit",function(e){
  e.preventDefault();
  if(!$("msg").value.trim()||!$("area").value.trim()){err.textContent="Please add the problem and your area so we can quote accurately.";return}
  err.textContent="";
  window.open("https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(build()),"_blank","noopener");
});
document.querySelectorAll("[data-pick]").forEach(function(a){a.addEventListener("click",function(){$(a.dataset.pick).checked=true;refresh()})});

/* PART 7: CUSTOMER REVIEWS. Reviews are saved in this browser (localStorage) and shown instantly. */
(function(){
  var KEY="ajm_reviews_v2",MAX=100,PAGE=6,shown=PAGE,memory=null,newId=null;
  var WORDS=["","Poor","Fair","Good","Very good","Excellent"];
  var form=document.getElementById("rvForm");
  if(!form)return;
  var list=document.getElementById("rvList"),sum=document.getElementById("rvSummary"),more=document.getElementById("rvMore"),
      err=document.getElementById("rvErr"),txt=document.getElementById("rvText"),
      cnt=document.getElementById("rvCount"),hint=document.getElementById("rvRatingText"),nm=document.getElementById("rvName"),sv=document.getElementById("rvService");

  function valid(r){return r&&typeof r.name==="string"&&typeof r.text==="string"&&r.rating>=1&&r.rating<=5&&r.rating%1===0}
  function load(){
    if(memory)return memory;
    try{var a=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(a)?a.filter(valid):[]}catch(e){return[]}
  }
  function save(a){
    try{localStorage.setItem(KEY,JSON.stringify(a));memory=null;return true}
    catch(e){memory=a;return false}
  }
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
  function stars(n){
    var s=el("span","rv-stars");s.setAttribute("role","img");s.setAttribute("aria-label",n+" out of 5 stars");
    for(var i=1;i<=5;i++){s.appendChild(el("span",i>n?"off":"","\u2605"))}
    return s;
  }
  function fmt(ts){try{return new Date(ts).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}catch(e){return""}}

  function render(){
    var a=load();
    sum.textContent="";list.textContent="";
    if(!a.length){
      sum.appendChild(el("p","rv-empty","No reviews yet. Tap the + button to be the first to review AJM Electrical & Plumbing."));
      more.hidden=true;return;
    }
    var total=0,counts=[0,0,0,0,0,0];
    a.forEach(function(r){total+=r.rating;counts[r.rating]++});
    var avg=total/a.length;
    var left=el("div","rv-avg",avg.toFixed(1));
    left.appendChild(stars(Math.round(avg)));
    left.appendChild(el("small","",a.length+(a.length===1?" review":" reviews")));
    var bars=el("div","rv-bars");
    for(var s=5;s>=1;s--){
      var row=el("div","rv-bar");
      row.appendChild(el("span","",s+"\u2605"));
      var tr=el("span","rv-track"),fl=el("span","rv-fill");
      fl.style.width=Math.round(counts[s]/a.length*100)+"%";
      tr.appendChild(fl);row.appendChild(tr);row.appendChild(el("span","",String(counts[s])));
      bars.appendChild(row);
    }
    sum.appendChild(left);sum.appendChild(bars);

    a.slice(0,shown).forEach(function(r){
      var it=el("article","rv-item"+(r.id===newId?" rv-new":""));
      var head=el("div","rv-head");
      head.appendChild(el("div","rv-av",(r.name.charAt(0)||"?").toUpperCase()));
      var who=el("div","rv-who");
      who.appendChild(el("b","",r.name));
      who.appendChild(el("small","",[r.service,fmt(r.ts)].filter(Boolean).join(" \u00b7 ")));
      head.appendChild(who);head.appendChild(stars(r.rating));
      it.appendChild(head);
      it.appendChild(el("p","",r.text));
      list.appendChild(it);
    });
    more.hidden=a.length<=shown;
  }

  /* Popup review box: the round + button opens it, X / outside click / Esc closes it. */
  var modal=document.getElementById("rvModal"),openBtn=document.getElementById("rvOpen"),toastEl=document.getElementById("rvToast"),tt;
  function openModal(){modal.hidden=false;document.body.style.overflow="hidden";setTimeout(function(){nm.focus()},40)}
  function closeModal(back){modal.hidden=true;document.body.style.overflow="";err.textContent="";if(back!==false)openBtn.focus()}
  function toast(m){toastEl.textContent=m;toastEl.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){toastEl.classList.remove("on")},3500)}
  openBtn.addEventListener("click",openModal);
  modal.addEventListener("click",function(e){if(e.target.hasAttribute("data-close"))closeModal()});
  document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!modal.hidden)closeModal()});

  form.addEventListener("change",function(e){
    if(e.target.name==="rvRating")hint.textContent=WORDS[+e.target.value]+" ("+e.target.value+" of 5)";
  });
  txt.addEventListener("input",function(){cnt.textContent=txt.value.length});
  more.addEventListener("click",function(){shown+=PAGE;render()});

  form.addEventListener("submit",function(e){
    e.preventDefault();
    var pick=form.querySelector('input[name="rvRating"]:checked');
    var name=nm.value.trim().replace(/\s+/g," "),text=txt.value.trim();
    if(!pick){err.textContent="Please tap a star to rate us.";return}
    if(name.length<2){err.textContent="Please enter your name.";nm.focus();return}
    if(text.length<10){err.textContent="Please write at least 10 characters in your review.";txt.focus();return}
    err.textContent="";
    var r={id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:name.slice(0,40),rating:+pick.value,text:text.slice(0,500),service:sv.value,ts:Date.now()};
    var a=load();a.unshift(r);a=a.slice(0,MAX);
    var saved=save(a);
    newId=r.id;form.reset();cnt.textContent="0";hint.textContent="Tap a star to rate";
    closeModal(false);
    toast(saved?"Thank you! Your review is added.":"Thank you! Your review is added, but this browser could not save it for later.");
    render();
    list.scrollIntoView({behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"nearest"});
  });

  window.addEventListener("storage",function(e){if(e.key===KEY){memory=null;render()}});
  render();
})();
