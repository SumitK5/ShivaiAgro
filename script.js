/* ── PRODUCT DATA ─────────────────────────────── */
const PRODUCTS = [
  {id:1,name:'Dehydrated Ginger',cat:['spice'],catLabel:['Spice'],
   img:'assets/images/ginger-flakes.jpg',
   desc:'Premium sun-cabinet dried ginger sourced directly from Marathwada. Highly dynamic pungency profiles with natural volatile oil retention.',
   specs:{Moisture:'≤ 4%',Forms:'Slices · Granules · Powder',Colour:'Pale Buff','Shelf life':'18 months'},
   tags:['Export grade','Farm-traced','No sulfites']},
  {id:2,name:'Dehydrated Green Chilli',cat:['spice'],catLabel:['Spice'],
   img:'assets/images/Dehydrated-Green-Chilli-Flakes.jpg',
   desc:'Fresh local green chillies rapidly processed to protect high capsicum and natural heat. Perfect for global blending lines and instant seasonings.',
   specs:{Moisture:'≤ 4%',Forms:'Flakes · Powder',Colour:'Olive Green','Shelf life':'18 months'},
   tags:['High capsicum','No colouring','Clean label']},
  {id:3,name:'Dehydrated Tomato',cat:['vegetable', 'Fruit'],catLabel:['Vegetable'],
   img:'assets/images/Savory-Dehydrated-Tomato-flakes.jpg',
   desc:'Lycopene-rich processing using fresh vine tomatoes from Latur. Retains optimal tang, colour and organic aroma through precise low-temperature drying.',
   specs:{Moisture:'≤ 4%',Forms:'Diced · Flakes · Powder',Colour:'Deep Red','Shelf life':'24 months'},
   tags:['Lycopene-rich','No additives','Bulk available']},
  {id:4,name:'Dehydrated Carrot',cat:['vegetable'],catLabel:['Vegetable'],
   img:'assets/images/Dehydrated-carrot-square.jpg',
   desc:'Sweet orange Nantes-variety carrots, cleaned and custom-diced. Excellent rehydration ratio ideal for instant soups, ready meals and baby food.',
   specs:{Moisture:'≤ 5%',Forms:'Diced · Strips · Powder',Colour:'Bright Orange','Shelf life':'18 months'},
   tags:['Beta-carotene','Clean label','Rehydration 1:4']},
  {id:5,name:'Dehydrated Onion',cat:['vegetable','spice'],catLabel:['Vegetable'],
   img:'assets/images/dehydrated-red-onion-flakes-364-HD.jpg',
   desc:'Nasik-region onions harvested at peak maturity. High natural sweetness and signature pungency maintained through rapid cabinet dehydration.',
   specs:{Moisture:'≤ 4%',Forms:'Granules · Rings · Powder',Colour:'Creamy White','Shelf life':'24 months'},
   tags:['No additives','Chef quality','High pungency']},
  {id:6,name:'Dehydrated Beetroot',cat:['vegetable'],catLabel:['Vegetable'],
   img:'assets/images/bete-vulgaris-freshly-harvested-and-sliced-beets-flakes.jpg',
   desc:'Pure Beetroot Flake dehydration retaining vital Betalain complexes without artificial bleaching. Natural pink-red colour is your assurance of purity.',
   specs:{Moisture:'≤ 4%',Forms:'Flakes · Granules · Powder',Colour:'Natural Pink-Red','Shelf life':'24 months'},
   tags:['Betalain locked','Zero bleach','Export grade']},
  {id:7,name:'Dehydrated Spinach',cat:['leaf'],catLabel:['Leaves & Greens'],
   img:'assets/images/dehydrated_spinach.jpg',
   desc:'Mineral-dense baby spinach processed below 55°C to sustain chlorophyll, iron and leaf structure. Rehydrates to near-fresh appearance.',
   specs:{Moisture:'≤ 5%',Forms:'Whole · Crushed · Powder',Colour:'Emerald Green','Shelf life':'18 months'},
   tags:['Nutrient-dense','Low-temp dried','Natural colour']},
];

/* ── B2B INQUIRY STATE (Cart / Basket) ───────────────── */
let sampleBasket = [];
let activeCategory = 'all';
let searchQuery = '';

/* ── TOAST CUSTOM NOTIFICATION SYSTEM ──────────────── */
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ── NAVIGATION ROUTER ──────────────────────────────── */
function go(id) {
  document.body.setAttribute('data-page', id);
  document.querySelectorAll('.page').forEach(p => {
    p.style.display = 'none';
    p.classList.remove('active');
  });
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  
  const page = document.getElementById('page-' + id);
  if (page) {
    page.style.display = 'block';
    page.classList.add('active');
  }
  
  const link = document.querySelector(`.nav-link[onclick*="'${id}'"]`);
  if (link) link.classList.add('active');
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (id === 'products') {
    document.getElementById('catalog-search').value = '';
    searchQuery = '';
    renderProducts();
  } else if (id === 'enquire') {
    renderBasketUI();
  }
  setTimeout(() => observeReveal(), 50);
}

function toggleM() {
  const nm = document.getElementById('nm'), btn = document.getElementById('ham-btn');
  nm.classList.toggle('open');
  btn.classList.toggle('open');
  if (nm.classList.contains('open')) {
    document.body.classList.add('modal-open');
  } else {
    document.body.classList.remove('modal-open');
  }
}

function closeM() {
  document.getElementById('nm').classList.remove('open');
  document.getElementById('ham-btn').classList.remove('open');
  document.body.classList.remove('modal-open');
}

/* ── PRODUCTS RENDERER & SEARCH ────────────────────── */
function renderProducts() {
  const filtered = PRODUCTS.filter(p => {
    const productCats = (p.cat || []).map(cat => String(cat).toLowerCase());
    const currentCat = String(activeCategory || 'all').toLowerCase();
    const matchesCat = currentCat === 'all' || productCats.includes(currentCat);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const countEl = document.getElementById('prod-count-hero');
  if (countEl) countEl.textContent = filtered.length;

  const grid = document.getElementById('prod-grid');
  if (!grid) return;

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--ink-3);">
        <p style="font-size: 18px; margin-bottom: 12px;">No products found matching "${searchQuery}"</p>
        <button class="btn-outline" onclick="resetFilters()">Reset search filters</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="prod-card" onclick="openMod(${p.id})">
      <div class="prod-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
      </div>
      <div class="prod-body">
        <div class="prod-cat-label">${p.catLabel}</div>
        <div class="prod-name">${p.name}</div>
        <div class="prod-desc">${p.desc}</div>
        <div class="prod-tags">
          ${p.tags.map(t => `<span class="prod-tag">${t}</span>`).join('')}
        </div>
        <div class="prod-actions-row">
          <span class="prod-arrow">Specs & Details →</span>
          <button class="add-sample-btn" onclick="quickAddSample(event, ${p.id})">
            + Sample Basket
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function handleSearch(val) {
  searchQuery = val;
  renderProducts();
}

function resetFilters() {
  document.getElementById('catalog-search').value = '';
  searchQuery = '';
  activeCategory = 'all';
  document.querySelectorAll('.cat-pill').forEach(b => {
    b.classList.remove('active');
    if (b.dataset.cat === 'all') b.classList.add('active');
  });
  renderProducts();
}

document.getElementById('cat-bar').addEventListener('click', e => {
  const pill = e.target.closest('.cat-pill');
  if (!pill) return;
  document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
  pill.classList.add('active');
  activeCategory = pill.dataset.cat;
  renderProducts();
});

/* ── B2B BASKET ACTIONS ─────────────────────────────── */
function quickAddSample(e, id) {
  e.stopPropagation(); // Avoid triggering product card click event
  const item = PRODUCTS.find(p => p.id === id);
  if (!item) return;

  const alreadyAdded = sampleBasket.some(b => b.id === id);
  if (alreadyAdded) {
    showToast(`"${item.name}" is already in your sample basket.`, 'error');
    return;
  }

  sampleBasket.push({
    id: item.id,
    name: item.name,
    form: item.specs.Forms.split(' · ')[0] || 'Powder',
    qty: '100g (Standard Sample)'
  });

  updateBasketBadge();
  showToast(`Added "${item.name}" to your sample basket.`);
}

function modalAddSample(id) {
  const item = PRODUCTS.find(p => p.id === id);
  if (!item) return;

  const chosenForm = document.getElementById('modal-spec-form')?.value || 'Powder';
  const chosenQty = document.getElementById('modal-spec-qty')?.value || '100g';

  const alreadyAdded = sampleBasket.some(b => b.id === id);
  if (alreadyAdded) {
    showToast(`"${item.name}" is already in your sample basket.`, 'error');
    closeModDirect();
    return;
  }

  sampleBasket.push({
    id: item.id,
    name: item.name,
    form: chosenForm,
    qty: chosenQty
  });

  updateBasketBadge();
  showToast(`Added "${item.name}" (${chosenForm}) to your sample basket.`);
  closeModDirect();
}

function removeFromBasket(id) {
  sampleBasket = sampleBasket.filter(item => item.id !== id);
  updateBasketBadge();
  renderBasketUI();
  showToast('Removed item from sample basket.', 'success');
}

function updateBasketBadge() {
  const count = sampleBasket.length;
  const badge = document.getElementById('cart-badge');
  const badgeMobile = document.getElementById('cart-badge-mobile');
  
  if (badge) {
    badge.textContent = count;
    badge.className = count > 0 ? 'nav-cta-badge visible' : 'nav-cta-badge';
  }
  if (badgeMobile) {
    badgeMobile.textContent = count;
    badgeMobile.className = count > 0 ? 'nav-cta-badge visible' : 'nav-cta-badge';
  }
}

function renderBasketUI() {
  const container = document.getElementById('basket-items-container');
  const countLabel = document.getElementById('basket-count');
  if (!container) return;

  if (countLabel) {
    countLabel.textContent = `${sampleBasket.length} Item${sampleBasket.length !== 1 ? 's' : ''}`;
  }

  if (sampleBasket.length === 0) {
    container.innerHTML = `
      <div class="basket-empty-state">No products selected. Browse our catalog to request custom cut/form samples.</div>
    `;
    return;
  }

  container.innerHTML = sampleBasket.map(item => `
    <div class="basket-item">
      <div class="basket-item-info">
        <span class="basket-item-name">${item.name}</span>
        <span class="basket-item-meta">${item.form} · Quantity: ${item.qty}</span>
      </div>
      <button class="basket-item-remove" onclick="removeFromBasket(${item.id})">Remove</button>
    </div>
  `).join('');
}

/* ── MODAL COMPONENT ───────────────────────────────── */
function openMod(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const formOptions = p.specs.Forms.split(' · ').map(f => `<option>${f}</option>`).join('');

  document.getElementById('modal-content').innerHTML = `
    <div class="modal-img"><img src="${p.img}" alt="${p.name}"/></div>
    <div class="modal-body">
      <div class="modal-cat">${p.catLabel}</div>
      <div class="modal-name">${p.name}</div>
      <div class="modal-desc">${p.desc}</div>
      <div class="modal-specs">
        ${Object.entries(p.specs).map(([k,v]) => `
          <div class="spec-box">
            <div class="spec-key">${k}</div>
            <div class="spec-val">${v}</div>
          </div>
        `).join('')}
      </div>
      
      <div class="modal-builder-title">Configure Sample Specifications</div>
      <div class="sample-builder-grid">
        <div class="field">
          <label>Desired Cut / Form</label>
          <select id="modal-spec-form">
            ${formOptions}
          </select>
        </div>
        <div class="field">
          <label>Sample Quantity</label>
          <select id="modal-spec-qty">
            <option>100g (Standard)</option>
            <option>250g</option>
            <option>500g</option>
            <option>1kg (Commercial evaluation)</option>
          </select>
        </div>
      </div>

      <div class="modal-cta-group">
        <button class="modal-cta" onclick="modalAddSample(${p.id})">Add to Sample Basket</button>
        <button class="modal-cta-secondary" onclick="enquireProd('${p.name}')">Direct Inquiry</button>
      </div>
    </div>
  `;
  document.getElementById('modal-ov').classList.add('open');
  document.body.classList.add('modal-open');
}

function closeMod(e) {
  if (e.target === document.getElementById('modal-ov')) closeModDirect();
}

function closeModDirect() {
  document.getElementById('modal-ov').classList.remove('open');
  document.body.classList.remove('modal-open');
}

function enquireProd(name) {
  closeModDirect();
  go('enquire');
  setTimeout(() => {
    const s = document.getElementById('fs');
    if (s) {
      for (let o of s.options) {
        if (o.text === name) {
          s.value = o.value;
          break;
        }
      }
    }
  }, 300);
}

/* ── FORM HANDLING ──────────────────────────────────── */
function submitEnquiry() {
  const fn = document.getElementById('fn').value.trim();
  const fe = document.getElementById('fe').value.trim();
  const fc = document.getElementById('fc').value.trim();
  const fp = document.getElementById('fp').value.trim();
  const fr = document.getElementById('fr').value;
  const fs = document.getElementById('fs').value;
  const notesField = document.getElementById('fm');
  
  if (!fn || !fe) {
    showToast('Please enter your Name and Email to proceed.', 'error');
    return;
  }

  let waText = `*New Enquiry from ${fn}*`;
  if (fc) waText += ` (${fc})`;
  waText += `\n\n*Email:* ${fe}`;
  if (fp) waText += `\n*Phone:* ${fp}`;
  if (fr) waText += `\n*Country:* ${fr}`;
  if (fs) waText += `\n*Product:* ${fs}`;

  let basketSummary = "";
  if (sampleBasket.length > 0) {
    basketSummary = "\n\n*Requested Samples:*\n";
    sampleBasket.forEach((item, index) => {
      basketSummary += `${index + 1}. ${item.name} (${item.form}, ${item.qty})\n`;
    });
  }
  
  let notes = notesField.value.trim();
  if (notes || basketSummary) {
    if (notes) {
      waText += `\n\n*Requirements / Notes:*\n${notes}`;
    }
    if (basketSummary) {
      waText += basketSummary;
    }
  }
  
  waText += "\n\n_Enquiry sent from website_";

  // Build the UI summary
  let uiSpecs = [];
  uiSpecs.push({ k: 'Name', v: fn });
  if (fc) uiSpecs.push({ k: 'Company', v: fc });
  uiSpecs.push({ k: 'Email', v: fe });
  if (fp) uiSpecs.push({ k: 'Phone', v: fp });
  if (fr) uiSpecs.push({ k: 'Country', v: fr });
  if (fs) uiSpecs.push({ k: 'Product', v: fs });

  let specsHtml = uiSpecs.map(s => `
    <div class="spec-box">
      <div class="spec-key">${s.k}</div>
      <div class="spec-val" style="word-break: break-word;">${s.v.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    </div>
  `).join('');

  let extraHtml = "";
  if (sampleBasket.length > 0) {
    let bItems = sampleBasket.map((item, i) => `
      <div style="font-size:13px; margin-bottom:8px; padding-bottom:8px; border-bottom:1px solid var(--border);">
        <strong style="color:var(--accent);">${i+1}. ${item.name}</strong><br>
        <span style="color:var(--ink-2);">${item.form} &middot; ${item.qty}</span>
      </div>
    `).join('');
    extraHtml += `
      <div class="spec-key" style="margin-top:24px;">Requested Samples</div>
      <div style="background:var(--bg); border-radius:12px; padding:16px; border:1px solid var(--border); margin-bottom:16px;">
        ${bItems}
      </div>
    `;
  }

  if (notes) {
    extraHtml += `
      <div class="spec-key" style="margin-top:${sampleBasket.length ? '0' : '24px'};">Requirements & Notes</div>
      <div style="background:var(--bg); border-radius:12px; padding:16px; border:1px solid var(--border); margin-bottom:16px; font-size:14px; color:var(--ink-2); white-space:pre-wrap;">${notes.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
    `;
  }

  let summaryHtml = `
    <div class="modal-body">
      <h3 style="margin-bottom:24px;color:var(--accent);font-family:var(--ff-d);font-size:28px;">Enquiry Summary</h3>
      
      <div class="modal-specs">
        ${specsHtml}
      </div>
      
      ${extraHtml}
      
      <div style="display:flex;gap:12px;margin-top:32px;">
        <button class="f-submit" id="wa-send-btn" style="display:flex;align-items:center;justify-content:center;gap:8px;">
          Send via WhatsApp
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>
    </div>
  `;

  document.getElementById('modal-content').innerHTML = summaryHtml;
  document.getElementById('wa-send-btn').onclick = function() {
    confirmWaSend(waText);
  };
  document.getElementById('modal-ov').classList.add('open');
  document.body.classList.add('modal-open');
}

function confirmWaSend(text) {
  closeModDirect();
  
  window.open('https://wa.me/918767425692?text=' + encodeURIComponent(text), '_blank');
  
  document.getElementById('form-wrap').style.display = 'none';
  const successEl = document.getElementById('f-success');
  successEl.classList.add('show-anim');
  
  // Clear fields
  ['fn','fc','fe','fp','fr','fs','fm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  
  sampleBasket = [];
  updateBasketBadge();
}

/* ── INTERSECTION OBSERVER FOR CHIC ANIMATIONS ───────── */
function observeReveal() {
  const els = document.querySelectorAll('.reveal:not(.in),.reveal-left:not(.in),.reveal-right:not(.in),.reveal-scale:not(.in)');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  observeReveal();
  renderProducts();
  const activePage = document.querySelector('.page.active');
  const initialId = activePage ? activePage.id.replace('page-', '') : 'home';
  document.body.setAttribute('data-page', initialId);
});

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

const heroBg = document.getElementById('hero-bg');
window.addEventListener('scroll', () => {
  const page = document.getElementById('page-home');
  if (page && page.classList.contains('active') && heroBg) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.32}px) scale(1.04)`;
  }
}, { passive: true });
// Clear form on load to prevent bfcache retention
window.addEventListener('pageshow', () => {
  ['fn','fc','fe','fp','fr','fs','fm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
});

function resetEnquiryForm() {
  document.getElementById('f-success').classList.remove('show-anim');
  document.getElementById('form-wrap').style.display = 'block';
}
