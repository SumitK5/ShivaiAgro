/* ── PRODUCT DATA ─────────────────────────────── */
const PRODUCTS = [
  {id:1,name:'Dehydrated Ginger',cat:'spice',catLabel:'Spice',
   img:'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
   desc:'Premium sun-cabinet dried ginger sourced directly from Marathwada. Highly dynamic pungency profiles with natural volatile oil retention.',
   specs:{Moisture:'≤ 4%',Forms:'Slices · Granules · Powder',Colour:'Pale Buff','Shelf life':'18 months'},
   tags:['Export grade','Farm-traced','No sulfites']},
  {id:2,name:'Dehydrated Green Chilli',cat:'spice',catLabel:'Spice',
   img:'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
   desc:'Fresh local green chillies rapidly processed to protect high capsicum and natural heat. Perfect for global blending lines and instant seasonings.',
   specs:{Moisture:'≤ 4%',Forms:'Flakes · Powder',Colour:'Olive Green','Shelf life':'18 months'},
   tags:['High capsicum','No colouring','Clean label']},
  {id:3,name:'Dehydrated Tomato',cat:'vegetable',catLabel:'Vegetable',
   img:'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=800&q=80',
   desc:'Lycopene-rich processing using fresh vine tomatoes from Latur. Retains optimal tang, colour and organic aroma through precise low-temperature drying.',
   specs:{Moisture:'≤ 4%',Forms:'Diced · Flakes · Powder',Colour:'Deep Red','Shelf life':'24 months'},
   tags:['Lycopene-rich','No additives','Bulk available']},
  {id:4,name:'Dehydrated Carrot',cat:'vegetable',catLabel:'Vegetable',
   img:'https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?auto=format&fit=crop&w=800&q=80',
   desc:'Sweet orange Nantes-variety carrots, cleaned and custom-diced. Excellent rehydration ratio ideal for instant soups, ready meals and baby food.',
   specs:{Moisture:'≤ 5%',Forms:'Diced · Strips · Powder',Colour:'Bright Orange','Shelf life':'18 months'},
   tags:['Beta-carotene','Clean label','Rehydration 1:4']},
  {id:5,name:'Dehydrated Onion',cat:'vegetable',catLabel:'Vegetable',
   img:'https://images.unsplash.com/photo-1618228473037-9586abad411a?auto=format&fit=crop&w=800&q=80',
   desc:'Nasik-region onions harvested at peak maturity. High natural sweetness and signature pungency maintained through rapid cabinet dehydration.',
   specs:{Moisture:'≤ 4%',Forms:'Granules · Rings · Powder',Colour:'Creamy White','Shelf life':'24 months'},
   tags:['No additives','Chef quality','High pungency']},
  {id:6,name:'Dehydrated Garlic',cat:'spice',catLabel:'Spice',
   img:'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=800&q=80',
   desc:'Pure garlic bulb dehydration retaining vital allicin complexes without artificial bleaching. Natural cream colour is your assurance of purity.',
   specs:{Moisture:'≤ 4%',Forms:'Flakes · Granules · Powder',Colour:'Natural Cream','Shelf life':'24 months'},
   tags:['Allicin locked','Zero bleach','Export grade']},
  {id:7,name:'Dehydrated Spinach',cat:'leaf',catLabel:'Leaves & Greens',
   img:'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
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
    const matchesCat = activeCategory === 'all' || p.cat === activeCategory;
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
  const notesField = document.getElementById('fm');
  
  if (!fn || !fe) {
    showToast('Please enter your Name and Email to proceed.', 'error');
    return;
  }

  // If items are in the basket, append details to the email notes dynamically before sending
  if (sampleBasket.length > 0) {
    let basketSummary = "\n\n--- Sample Basket Items Requested ---\n";
    sampleBasket.forEach((item, index) => {
      basketSummary += `${index + 1}. ${item.name} | Form: ${item.form} | Volume: ${item.qty}\n`;
    });
    notesField.value = notesField.value + basketSummary;
  }

  document.getElementById('form-wrap').style.display = 'none';
  document.getElementById('f-success').style.display = 'block';
  
  showToast('Enquiry successfully dispatched to Shivai Agro procurement desks.', 'success');
  
  // Reset Basket State on success
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