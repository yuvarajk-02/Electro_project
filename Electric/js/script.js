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
