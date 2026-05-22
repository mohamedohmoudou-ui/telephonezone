// تطبيق Dark Mode في كل الصفحات
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark');
}
// إخفاء Welcome Screen إيلا كان دخل من قبل
window.addEventListener('DOMContentLoaded', () => {
  if (sessionStorage.getItem('visited')) {
    const ws = document.getElementById('welcomeScreen');
    if (ws) ws.remove(); // إزالة فورية بلا انيماشن
    
    const savedScroll = localStorage.getItem('scrollPosition');
    if (savedScroll !== null) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll), behavior: 'instant' });
        localStorage.removeItem('scrollPosition');
      }, 100);
    }
  }
});
let currentLang = 'en';
let cart = [];
 
function enterSite() {
  sessionStorage.setItem('visited', 'true'); // ← زيد هاد السطر
  const ws = document.getElementById('welcomeScreen');
  ws.style.transition = 'opacity .6s ease';
  ws.style.opacity = '0';
  setTimeout(() => ws.remove(), 600);
}
 
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.background = window.scrollY > 30
    ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.92)';
});
 
function toggleMenu() {
  const menu = document.getElementById("menuDropdown");
  if (menu) menu.classList.toggle("show");
  const navLinks = document.getElementById('navLinks');
  if (navLinks) navLinks.classList.toggle('open');
}
 
function toggleLangMenu() {
  document.getElementById('langMenu').classList.toggle('open');
}
 
document.addEventListener('click', function(e) {
  const sw = document.querySelector('.lang-switcher');
  if (sw && !sw.contains(e.target)) document.getElementById('langMenu').classList.remove('open');
});
 
function setLang(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-ar]').forEach(el => { if(el.dataset[lang]) el.textContent = el.dataset[lang]; });
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;
  const flags = { ar:'🇲🇦 AR', fr:'🇫🇷 FR', en:'🇬🇧 EN' };
  document.querySelector('.lang-selected').innerHTML = flags[lang] + ' <span>▾</span>';
  document.getElementById('langMenu').classList.remove('open');
  const ph = {
    ar:{ search:'البحث عن منتجات...', name:'👤 الاسم الكامل', phone:'📞 رقم الهاتف', city:'🏙️ المدينة', address:'📍 العنوان' },
    fr:{ search:'Rechercher...', name:'👤 Nom complet', phone:'📞 Téléphone', city:'🏙️ Ville', address:'📍 Adresse' },
    en:{ search:'Search products...', name:'👤 Full Name', phone:'📞 Phone Number', city:'🏙️ City', address:'📍 Address' }
  };
  const p = ph[lang];
  const fields = { searchInput:'search', clientName:'name', clientPhone:'phone', clientCity:'city', clientAddress:'address' };
  Object.entries(fields).forEach(([id, key]) => { const el=document.getElementById(id); if(el) el.placeholder=p[key]; });
  updateCartUI();
}
 
function openCart() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}
function closeCart() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}
 
function addToCart(name, price, image) {
  const existing = cart.find(i => i.name === name);
  if (existing) { existing.qty += 1; } else { cart.push({ name, price, image, qty:1 }); }
  updateCartUI();
  openCart();
  const btn = document.querySelector('.cart-btn');
  btn.classList.add('shake');
  setTimeout(() => btn.classList.remove('shake'), 400);
}
 
function removeFromCart(name) {
  cart = cart.filter(i => i.name !== name);
  updateCartUI();
}
 
function buildWaText(name, phone, city, address) {
  const items = cart.map(i => `• ${i.name} x${i.qty} — ${(i.price*i.qty).toFixed(2)} MAD`).join('\n');
  const total = cart.reduce((s,i) => s+i.price*i.qty, 0).toFixed(2);
  return `مرحبا! 📱 *طلب جديد*\n` +
    (name    ? `👤 الاسم: ${name}\n` : '') +
    (phone   ? `📞 الهاتف: ${phone}\n` : '') +
    (city    ? `🏙️ المدينة: ${city}\n` : '') +
    (address ? `📍 العنوان: ${address}\n` : '') +
    `\n📦 *المنتجات:*\n${items}\n\n💰 *المجموع: ${total} MAD*`;
}
 
function updateCartUI() {
  const container = document.getElementById('cartItems');
  const totalEl   = document.getElementById('cartTotal');
  const countEl   = document.querySelector('.cart-count');
  const waBtn     = document.getElementById('btnWaOrder');
 
  let total=0, count=0;
  cart.forEach(i => { total+=i.price*i.qty; count+=i.qty; });
 
  if(countEl){ countEl.textContent=count; countEl.style.display=count>0?'flex':'none'; }
  if(totalEl) totalEl.textContent = total.toFixed(2)+' MAD';
  if(waBtn) waBtn.href = `https://wa.me/212637904920?text=${encodeURIComponent(buildWaText('','','',''))}`;
  if(!container) return;
 
  if(cart.length===0){
    const msg={ar:'سلتك فارغة 🛍️',fr:'Panier vide 🛍️',en:'Your cart is empty 🛍️'};
    container.innerHTML=`<p class="cart-empty">${msg[currentLang]}</p>`;
    return;
  }
 
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/60'" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${(item.price*item.qty).toFixed(2)} MAD ${item.qty>1?`<span style="color:#aaa;font-size:.75rem">(x${item.qty})</span>`:''}</p>
      </div>
      <button class="remove-item" onclick="removeFromCart('${item.name}')">🗑️</button>
    </div>
  `).join('');
}
 
function updateWaConfirmBtn(n,p,c,a) {
  const btn = document.getElementById('waConfirmBtn');
  if(btn) btn.href=`https://wa.me/212637904920?text=${encodeURIComponent(buildWaText(n,p,c,a))}`;
}
 
['clientName','clientPhone','clientCity','clientAddress'].forEach(id => {
  const el = document.getElementById(id);
  if(el) el.addEventListener('input', () => {
    updateWaConfirmBtn(
      document.getElementById('clientName').value,
      document.getElementById('clientPhone').value,
      document.getElementById('clientCity').value,
      document.getElementById('clientAddress').value
    );
  });
});
 
function openOrderPopup() {
  if(cart.length===0){ alert('Cart is empty! Add products first.'); return; }
  document.getElementById('orderSummary').innerHTML = cart.map(i =>
    `<div class="order-summary-item"><span>${i.name}${i.qty>1?` (x${i.qty})`:''}</span><span>${(i.price*i.qty).toFixed(2)} MAD</span></div>`
  ).join('');
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  document.getElementById('popupTotal').textContent = total.toFixed(2)+' MAD';
  updateWaConfirmBtn('','','','');
  document.getElementById('orderPopup').classList.add('open');
  document.getElementById('orderOverlay').classList.add('open');
  closeCart();
  setTimeout(initPayPalButton, 300);
}
 
function closeOrderPopup() {
  document.getElementById('orderPopup').classList.remove('open');
  document.getElementById('orderOverlay').classList.remove('open');
}
 
function confirmOrder() {
  const name    = document.getElementById('clientName').value.trim();
  const phone   = document.getElementById('clientPhone').value.trim();
  const city    = document.getElementById('clientCity').value.trim();
  const address = document.getElementById('clientAddress').value.trim();
 
  if(!name||!phone||!city||!address){ alert('⚠️ Fill all fields!'); return; }
  if(phone.length<9){ alert('⚠️ Phone number too short!'); return; }
 
  const items = cart.map(i=>`${i.name} x${i.qty} — ${(i.price*i.qty).toFixed(2)} MAD`).join(', ');
  const total = cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);
  const btn   = document.querySelector('.btn-confirm');
  btn.textContent='⏳ Sending...'; btn.disabled=true;
 
  fetch('https://formspree.io/f/mredgrwr',{
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({name,phone,city,address,items,total:total+' MAD'})
  })
  .then(res => {
    if(res.ok){
      closeOrderPopup();
      document.getElementById('successMsg').innerHTML=
        `Thank you <strong>${name}</strong>! 🎉<br>We'll contact you at <strong>${phone}</strong><br>Delivery to <strong>${city}</strong><br><br>Total: <strong style="color:var(--blue)">${total} MAD</strong>`;
      document.getElementById('successPopup').classList.add('open');
      document.getElementById('successOverlay').classList.add('open');
      cart=[]; updateCartUI();
      ['clientName','clientPhone','clientCity','clientAddress'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
    } else { alert('❌ Error! Try again.'); }
    btn.textContent='✅ Confirm Order'; btn.disabled=false;
  })
  .catch(()=>{ alert('❌ Error! Try again.'); btn.textContent='✅ Confirm Order'; btn.disabled=false; });
}
 
function closeSuccess() {
  document.getElementById('successPopup').classList.remove('open');
  document.getElementById('successOverlay').classList.remove('open');
}
 
// Search
const searchInput  = document.getElementById('searchInput');
const productCards = document.querySelectorAll('.cards-grid .card');
if(searchInput){
  searchInput.addEventListener('keyup', function(){
    const val = this.value.toLowerCase();
    productCards.forEach(card => {
      const txt = (card.querySelector('h3')?.textContent||'') + (card.querySelector('ul')?.textContent||'') + (card.querySelector('.price')?.textContent||'');
      card.style.display = txt.toLowerCase().includes(val) ? '' : 'none';
    });
  });
}
 
// Shake animation
const s = document.createElement('style');
s.textContent=`@keyframes shake{0%,100%{transform:rotate(0)}25%{transform:rotate(-15deg) scale(1.1)}75%{transform:rotate(15deg) scale(1.1)}}.cart-btn.shake{animation:shake .4s ease}`;
document.head.appendChild(s);
 
function initPayPalButton() {
  const container = document.getElementById('paypal-button-container');
  if (!container || typeof paypal === 'undefined') return;
  container.innerHTML = '';
 
  paypal.Buttons({
    style: { layout:'vertical', color:'blue', shape:'pill', label:'pay' },
 
    createOrder: function(data, actions) {
      const total = cart.reduce((s,i) => s + i.price * i.qty, 0).toFixed(2);
      return actions.order.create({
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: total
          }
        }]
      });
    },
 
    onApprove: function(data, actions) {
      return actions.order.capture().then(function(details) {
        closeOrderPopup();
        document.getElementById('successMsg').innerHTML =
          `Merci <strong>${details.payer.name.given_name}</strong>! 🎉<br>
           Paiement confirmé ✅<br>
           ID: <strong>${details.id}</strong>`;
        document.getElementById('successPopup').classList.add('open');
        document.getElementById('successOverlay').classList.add('open');
        cart = [];
        updateCartUI();
      });
    },
 
    onError: function(err) { alert('❌ Erreur PayPal.'); },
    onCancel: function() { alert('⚠️ Paiement annulé.'); }
 
  }).render('#paypal-button-container');
}
 
function goToProduct(name, price, image, f1, f2, f3) {
  localStorage.setItem('scrollPosition', window.scrollY);
  const params = new URLSearchParams({name, price, image, f1, f2, f3});
  window.location.href = 'product.html?' + params.toString();
}
 
function toggleSettings(){
  const menu = document.getElementById("settingsMenu");
  if(menu) menu.style.display = menu.style.display === "block" ? "none" : "block";
}
 
setLang('en');
 let mobileView = false;

function toggleView(){

const body = document.body;
const icon = document.getElementById("viewToggle");

mobileView = !mobileView;

if(mobileView){

body.style.maxWidth = "420px";
body.style.margin = "auto";
body.style.border = "3px solid #111";
body.style.borderRadius = "20px";

icon.className = "fa-solid fa-desktop";

}else{

body.style.maxWidth = "";
body.style.margin = "";
body.style.border = "";

icon.className = "fa-solid fa-mobile-screen-button";

}

}function toggleView(){
  document.body.classList.toggle("mobile-view");
}// ===== SIDEBAR =====
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
  document.body.style.overflow = '';
}