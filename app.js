import { loadCatalog as loadProductCatalog } from './catalog.js';

const regions = [
  { id: 'rm', name: 'Santiago RM', psh: 4.5 },
  { id: 'val', name: 'Valparaíso', psh: 4.2 },
  { id: 'bio', name: 'Concepción / Biobío', psh: 3.8 },
  { id: 'ant', name: 'Antofagasta', psh: 6.1 },
  { id: 'lc', name: 'La Serena / Coquimbo', psh: 4.7 },
  { id: 'puq', name: 'Puerto Montt', psh: 3.4 }
];

const loadCatalog = [
  { id: 'fridge', name: 'Refrigerador eficiente', power: 160, hours: 12, selected: true },
  { id: 'router', name: 'Router', power: 25, hours: 24, selected: true },
  { id: 'lights', name: 'Luces LED (4 ambientes)', power: 80, hours: 6, selected: true },
  { id: 'laptop', name: 'Notebook + monitor', power: 120, hours: 8 },
  { id: 'desktop', name: 'PC escritorio + monitor', power: 220, hours: 6 },
  { id: 'tv', name: 'TV + streaming box', power: 110, hours: 4 },
  { id: 'medical', name: 'CPAP / equipo médico', power: 90, hours: 8 },
  { id: 'pos', name: 'POS + caja + iluminación', power: 210, hours: 10 },
  { id: 'cctv', name: 'Cámaras + DVR', power: 95, hours: 24 },
  { id: 'portable-fridge', name: 'Cooler eléctrico 12V', power: 60, hours: 24 },
  { id: 'camp-lights', name: 'Luces LED campamento', power: 40, hours: 6 },
  { id: 'drone-charger', name: 'Cargador de drone/cámaras', power: 90, hours: 2 },
  { id: 'radio-comm', name: 'Radio comunicaciones / VHF', power: 35, hours: 5 },
  { id: 'phones', name: 'Cargadores de celulares (4)', power: 60, hours: 3, selected: true },
  { id: 'starlink', name: 'Starlink / antena satelital', power: 110, hours: 6 }
];

const scenarioPresets = [
  {
    id: 'outdoor-go',
    name: 'Outdoor GO · 600 W',
    description: 'Campamento sin cooler: luces, celulares, drones y radios ligeras.',
    useCase: 'outdoor',
    preferredKitId: 'kit-go',
    image: 'images/bg/600w1.png',
    loads: [
      { id: 'camp-lights', power: 35, hours: 4 },
      { id: 'phones', power: 45, hours: 3 },
      { id: 'drone-charger', power: 90, hours: 2 },
      { id: 'radio-comm', power: 30, hours: 3 }
    ],
    autonomyDays: 0.8,
    outdoorHours: 5
  },
  {
    id: 'outdoor-go-plus',
    name: 'Outdoor GO+ · 1.0 kW',
    description: 'Incluye cooler 12V, iluminación y conectividad Starlink en ruta.',
    useCase: 'outdoor',
    preferredKitId: 'kit-go-plus',
    image: 'images/bg/600w1.png',
    loads: [
      { id: 'portable-fridge', power: 60, hours: 5 },
      { id: 'camp-lights', power: 40, hours: 4 },
      { id: 'drone-charger', power: 90, hours: 2 },
      { id: 'starlink', power: 110, hours: 2 }
    ],
    autonomyDays: 0.8,
    outdoorHours: 8
  },
  {
    id: 'home-2000w',
    name: 'Hogar 2.0 kW · Respaldo total',
    description: 'Mantiene nevera, red, iluminación y puestos de trabajo por 12-15 h silenciosos.',
    useCase: 'residential',
    preferredKitId: 'kit-home',
    image: 'images/bg/2000w1.png',
    loads: [
      { id: 'fridge', power: 140, hours: 6 },
      { id: 'router', power: 25, hours: 18 },
      { id: 'lights', power: 70, hours: 4 },
      { id: 'laptop', power: 90, hours: 3 }
    ],
    autonomyDays: 0.8,
    image: 'images/bg/2000w1.png',
    imageAlt: 'Estación portátil 2.0 kW en escritorio doméstico'
  },
  {
    id: 'ops-3200w',
    name: 'Operación 3.2 kW · Pyme continua',
    description: 'Alimenta POS, CCTV, Starlink y vitrina luminosa por 15 h sin ruidos.',
    useCase: 'commercial',
    preferredKitId: 'kit-pro',
    image: 'images/bg/3200w1.png',
    loads: [
      { id: 'pos', power: 180, hours: 5 },
      { id: 'router', power: 25, hours: 24 },
      { id: 'cctv', power: 95, hours: 8 },
      { id: 'lights', power: 140, hours: 3 },
      { id: 'starlink', power: 110, hours: 3 }
    ],
    autonomyDays: 0.45,
    image: 'images/bg/3200w1.png',
    imageAlt: 'Planta móvil 3.2 kW junto a herramientas y laptop'
  },
  {
    id: 'resilience-4000w',
    name: 'Crítico 4.0 kW · Operación 24/7',
    description: 'Soporta equipos médicos, nevera comercial y monitoreo 12-14 h con cero emisiones.',
    useCase: 'commercial',
    preferredKitId: 'kit-max',
    image: 'images/bg/4000w1.png',
    loads: [
      { id: 'medical', power: 120, hours: 12 },
      { id: 'fridge', power: 180, hours: 8 },
      { id: 'router', power: 25, hours: 20 },
      { id: 'cctv', power: 95, hours: 10 },
      { id: 'lights', power: 140, hours: 5 }
    ],
    autonomyDays: 0.55,
    image: 'images/bg/4000w1.png',
    imageAlt: 'Estación 4.0 kW en sala crítica con paneles solares'
  }
];

const scenarioMap = new Map(scenarioPresets.map((scenario) => [scenario.id, scenario]));
const kits = [
  {
    id: 'kit-go',
    name: 'Kit GO · Outdoor portátil',
    capacityWh: 672,
    inverterW: 600,
    acChargeW: 480,
    solarInputW: 200,
    price: 349000,
    expansion: 'Entrada MC4 200 W · 10-30 V',
    weightKg: 9.5,
    notes: 'Batería LiFePO₄ de 672 Wh, 600 W continuos (1.2 kW pico) y carga AC 480 W.',
    image: 'images/bg/600w1.png',
    imageAlt: 'Estación de energía portátil GO vista frontal',
    datasheet: 'fichasfinales/SINGO%20600%20W.pdf',
    usageTip: 'Ideal para escapadas de fin de semana y mantener tus dispositivos siempre cargados.'
  },
  {
    id: 'kit-go-plus',
    name: 'Kit GO+ · Outdoor XL',
    capacityWh: 1008,
    inverterW: 1200,
    acChargeW: 800,
    solarInputW: 200,
    price: 599000,
    expansion: 'Entrada MC4 200 W · 10-30 V',
    weightKg: 11.1,
    notes: 'Batería LiFePO₄ de 1.0 kWh, inversor 1 kW continuo (2 kW pico) y doble USB-C 100 W.',
    image: 'images/bg/600w1.png',
    imageAlt: 'Estación de energía portátil GO vista frontal',
    datasheet: 'fichasfinales/SINGO%201000%20W.pdf',
    usageTip: 'Perfecto para trabajo remoto en ruta con Starlink y mayor autonomía.'
  },
  {
    id: 'kit-home',
    name: 'Kit Home · Hogar esencial',
    capacityWh: 2048,
    inverterW: 2400,
    acChargeW: 1800,
    solarInputW: 500,
    price: null,
    quoteOnly: true,
    expansion: 'Escalable a 5.1 kWh con módulo adicional',
    weightKg: 20,
    notes: 'Batería LiFePO₄ de 2.0 kWh, inversor 2.4 kW (4.8 kW pico), carga AC 1.8 kW y PV 500 W.',
    image: 'images/bg/2000w1.png',
    imageScale: 1.25,
    datasheet: 'fichasfinales/SINGO%202000%20W.pdf',
    imageAlt: 'Estación portátil Singo 2000 Plus vista frontal',
    usageTip: 'Tu respaldo esencial para cortes de luz en casa, manteniendo refrigerador y wifi.'
  },
  {
    id: 'kit-pro',
    name: 'Kit Pro · Operación flexible',
    capacityWh: 2048,
    inverterW: 3200,
    acChargeW: 1800,
    solarInputW: 1000,
    price: null,
    quoteOnly: true,
    expansion: 'Modular hasta 7.6 kWh',
    weightKg: 28,
    notes: '3.2 kW continuos (6.4 kW pico) con batería LiFePO₄ 2.0 kWh y entrada PV 1.0 kW (12-80 V).',
    image: 'images/bg/3200w1.png',
    imageScale: 1.15,
    datasheet: 'fichasfinales/SINGO%203200%20W.pdf',
    imageAlt: 'Estación P3200 con salidas frontales',
    usageTip: 'Potencia profesional para pymes y respaldo crítico de larga duración.'
  },
  {
    id: 'kit-max',
    name: 'Kit Max · Potencia 24/7',
    capacityWh: 5120,
    inverterW: 4000,
    acChargeW: 3600,
    solarInputW: 3000,
    price: null,
    quoteOnly: true,
    expansion: 'Escalable hasta 10 kWh con packs adicionales',
    weightKg: 36,
    notes: '4.0 kW continuos (8 kW pico), batería 5.1 kWh y doble MPPT: 3.0 kW HV + 600 W LV.',
    image: 'images/bg/4000w1.png',
    imageScale: 1.2,
    datasheet: 'fichasfinales/SINGO%204000%20W.pdf',
    imageAlt: 'Unidad SH4000 lista para respaldo continuo',
    usageTip: 'Máxima independencia energética para operaciones 24/7 y alto consumo.'
  }
];

const kitMap = new Map(kits.map((kit) => [kit.id, kit]));
const pvCarouselImages = [
  'images/PV/200W-1-1024x683.webp',
  'images/PV/200W-2-1024x683.webp',
  'images/PV/200W-4-2048x1366.webp',
  'images/PV/200W-5-2048x1366.webp',
  'images/PV/200W-6-2048x1366.webp'
];
const fallbackKitImage = 'images/bg/600w1.png';
let lastKitCards = [];
let cartPopupVisible = false;

const constants = {
  dod: 0.8,
  inverterEff: 0.92,
  solarDerating: 0.78,
  panelW: 410,
  portablePanelW: 200,
  chargeEff: 0.9,
  panelPrice: 200000,
  deviceChargeEff: 0.85
};
const panelProduct = { id: 'panel-200w', name: 'Panel plegable 200 W', price: constants.panelPrice };
const deviceProfiles = [
  { id: 'iphone17promax', name: 'iPhone 17 Pro Max', energyWh: 18 },
  { id: 'iphone16promax', name: 'iPhone 16 Pro Max', energyWh: 17 },
  { id: 'galaxy-s24-ultra', name: 'Samsung Galaxy S24 Ultra', energyWh: 20 },
  { id: 'macbook-pro-16', name: 'MacBook Pro 16" M3 Max', energyWh: 100 },
  { id: 'macbook-air-13', name: 'MacBook Air 13" M3', energyWh: 60 },
  { id: 'ipad-pro-13', name: 'iPad Pro 13" M4', energyWh: 40 },
  { id: 'dji-mavic-3', name: 'Batería drone DJI Mavic 3 Pro', energyWh: 77 },
  { id: 'nintendo-switch-oled', name: 'Nintendo Switch OLED', energyWh: 16 },
  { id: 'bose-soundlink', name: 'Parlante Bluetooth Bose SoundLink', energyWh: 12 },
  { id: 'led-kit-film', name: 'Kit luces LED filmación 150 W', energyWh: 150 }
];

const state = {
  locationId: regions[0].id,
  panelCount: 0,
  daysAutonomy: 1,
  outageFrequency: 2,
  outageDuration: 6,
  recommendedKitId: null,
  manualKitSelection: false,
  scenarioPreferredKitId: null,
  useCase: 'residential',
  outdoorHoursPerDay: 8,
  cartPreviewVisible: false,
  pvCarouselIndex: 0,
  totals: {
    totalWh: 0,
    peakW: 0,
    batteryRequiredWh: 0,
    inverterRequiredW: 0,
    averageLoadW: 0,
    outdoorWh: 0
  }
};

let catalogData = [];

const refs = {
  location: document.getElementById('location'),
  useCase: document.getElementById('useCase'),
  autonomy: document.getElementById('autonomy'),
  autonomyValue: document.getElementById('autonomyValue'),
  loadList: document.getElementById('loadList'),
  addLoad: document.getElementById('addLoad'),
  calculate: document.getElementById('calculate'),
  outageFrequency: document.getElementById('outageFrequency'),
  outageDuration: document.getElementById('outageDuration'),
  totalWh: document.getElementById('totalWh'),
  totalW: document.getElementById('totalW'),
  batteryRequired: document.getElementById('batteryRequired'),
  inverterRequired: document.getElementById('inverterRequired'),
  gridCharge: document.getElementById('gridCharge'),
  solarCharge: document.getElementById('solarCharge'),
  outdoorWh: document.getElementById('outdoorWh'),
  resilienceScore: document.getElementById('resilienceScore'),
  scoreMessage: document.getElementById('scoreMessage'),
  kitCards: document.getElementById('kitCards'),
  scenarioList: document.getElementById('scenarioList'),
  panelCount: document.getElementById('panelCount'),
  panelCountValue: document.getElementById('panelCountValue'),
  panelCountTitle: document.getElementById('panelCountTitle'),
  loadsModule: document.getElementById('loadsModule'),
  socTimeline: document.getElementById('socTimeline'),
  blackoutNote: document.getElementById('blackoutNote'),
  batteryBenefits: document.getElementById('batteryBenefits'),
  generatorDrawbacks: document.getElementById('generatorDrawbacks'),
  whatsappLink: document.getElementById('whatsappLink'),
  outdoorHours: document.getElementById('outdoorHours'),
  outdoorHoursValue: document.getElementById('outdoorHoursValue'),
  outdoorHoursField: document.getElementById('outdoorHoursField'),
  highlight: document.getElementById('plannerHighlight'),
  highlightName: document.getElementById('highlightName'),
  highlightCopy: document.getElementById('highlightCopy'),
  highlightAutonomy: document.getElementById('highlightAutonomy'),
  highlightAC: document.getElementById('highlightAC'),
  highlightSolar: document.getElementById('highlightSolar'),
  highlightImage: document.getElementById('highlightImage'),
  highlightCTA: document.getElementById('highlightCTA'),
  highlightBadge: document.getElementById('highlightBadge'),
  highlightPanelButton: document.getElementById('highlightPanelButton'),
  highlightBuy: document.getElementById('highlightBuy'),
  highlightPrice: document.getElementById('highlightPrice'),
  highlightPower: document.getElementById('highlightPower'),
  highlightCapacity: document.getElementById('highlightCapacity'),
  highlightDevices: document.getElementById('highlightDevices'),
  highlightDevicesList: document.querySelector('#highlightDevices ul'),
  navCartButton: document.getElementById('navCartButton'),
  navCartBadge: document.getElementById('navCartBadge'),
  cartPopup: document.getElementById('cartPopup'),
  cartPopupDetails: document.getElementById('cartPopupDetails'),
  cartPopupCheckout: document.getElementById('cartPopupCheckout'),
  cartPopupClose: document.getElementById('cartPopupClose'),
  panelCarouselImage: document.getElementById('panelCarouselImage'),
  panelCarouselDots: document.getElementById('panelCarouselDots'),
  panelCarouselPrev: document.getElementById('panelCarouselPrev'),
  panelCarouselNext: document.getElementById('panelCarouselNext'),
  addPanelToCart: document.getElementById('addPanelToCart'),
  cartShortcut: document.getElementById('cartShortcut'),
  cartShortcutLabel: document.getElementById('cartShortcutLabel'),
  cartShortcutBadge: document.getElementById('cartShortcutBadge')
};

const loadTemplate = document.getElementById('loadTemplate');

async function hydrateCatalog() {
  try {
    catalogData = await loadProductCatalog();
    applyCatalogOverrides();
  } catch (error) {
    console.warn('No se pudo sincronizar el catálogo de productos', error);
    catalogData = [];
  }
}

function applyCatalogOverrides() {
  if (!Array.isArray(catalogData) || catalogData.length === 0) return;
  catalogData.forEach((product) => {
    if (!product || !product.id) return;
    if (product.id === panelProduct.id) {
      if (typeof product.price_clp === 'number') {
        panelProduct.price = product.price_clp;
        constants.panelPrice = product.price_clp;
      }
      if (product.name) {
        panelProduct.name = product.name;
      }
    }
    const kit = kitMap.get(product.id);
    if (kit) {
      if (Array.isArray(product.images) && product.images[0]) {
        kit.image = product.images[0];
      }
      if (product.datasheet) {
        kit.datasheet = product.datasheet;
      }
      if (typeof product.price_clp === 'number') {
        kit.price = product.price_clp;
        kit.quoteOnly = false;
      } else {
        kit.price = null;
        kit.quoteOnly = true;
      }
    }
  });
}

async function init() {
  await hydrateCatalog();
  populateLocations();
  renderLoads(loadCatalog);
  renderScenarios();
  renderGeneratorFacts();
  attachEvents();
  updateUseCaseUI();
  if (refs.outdoorHoursValue) {
    refs.outdoorHoursValue.textContent = state.outdoorHoursPerDay;
  }
  if (refs.outdoorHours) {
    refs.outdoorHours.value = state.outdoorHoursPerDay;
  }
  setupPanelCarousel();
  updatePanelCountDisplay();
  attachHeroChipHandlers();
  setupPanelAddButton();
  setupCartPopup();
  document.getElementById('year').textContent = new Date().getFullYear();
  calculateAndRender();
}

function populateLocations() {
  regions.forEach((region) => {
    const option = document.createElement('option');
    option.value = region.id;
    option.textContent = `${region.name} · ${region.psh.toFixed(1)} h sol`;
    refs.location.appendChild(option);
  });
  refs.location.value = state.locationId;
}

function renderLoads(loads) {
  refs.loadList.innerHTML = '';
  loads.forEach((load) => {
    const node = createLoadItem(load);
    refs.loadList.appendChild(node);
  });
}

function createLoadItem(load) {
  const { id, name, power, hours, selected = false, custom = false } = load;
  const element = loadTemplate.content.firstElementChild.cloneNode(true);
  const generatedId = id || generateLoadId();
  element.dataset.id = generatedId;
  const select = element.querySelector('.load-select');
  const nameInput = element.querySelector('.load-name');
  const powerInput = element.querySelector('.load-power');
  const hoursInput = element.querySelector('.load-hours');

  select.checked = selected;
  nameInput.value = name;
  if (!custom) {
    nameInput.readOnly = true;
  } else {
    nameInput.readOnly = false;
    nameInput.classList.add('editable');
  }
  powerInput.value = power;
  hoursInput.value = hours;

  select.addEventListener('change', calculateAndRender);
  powerInput.addEventListener('input', onLoadValueChange);
  hoursInput.addEventListener('input', onLoadValueChange);
  nameInput.addEventListener('input', onLoadValueChange);

  return element;
}

function generateLoadId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `custom-${crypto.randomUUID()}`;
  }
  return `custom-${Math.random().toString(36).slice(2, 10)}`;
}

function onLoadValueChange() {
  // Ensure the checkbox follows data entry so the item counts automatically
  const item = this.closest('.load-item');
  const checkbox = item?.querySelector('.load-select');
  if (checkbox && !checkbox.checked) {
    checkbox.checked = true;
  }
  calculateAndRender();
}

function renderScenarios() {
  refs.scenarioList.innerHTML = '';
  scenarioPresets.forEach((scenario) => {
    const card = document.createElement('article');
    card.className = 'scenario-card';
    const kitDetails = scenario.preferredKitId ? kitMap.get(scenario.preferredKitId) : null;
    const imageSrc = scenario.image || kitDetails?.image;
    const imageMarkup = imageSrc
      ? `<figure class="scenario-card__media"><img src="${imageSrc}" alt="${scenario.name}"></figure>`
      : '';
    const specsMarkup = kitDetails
      ? `
        <div class="scenario-card__specs">
          <span><strong>${formatPower(kitDetails.inverterW)}</strong> potencia</span>
          <span><strong>${formatEnergy(kitDetails.capacityWh)}</strong> energía</span>
        </div>
      `
      : '';
    card.innerHTML = `
      ${imageMarkup}
      <div class="badge">${scenario.autonomyDays} días objetivo</div>
      <h3>${scenario.name}</h3>
      ${specsMarkup}
      <p>${scenario.description}</p>
      <button class="primary" type="button" data-scenario="${scenario.id}">Usar este escenario</button>
    `;
    const button = card.querySelector('button');
    button.addEventListener('click', () => {
      applyScenario(scenario, true);
      button.blur();
    });
    refs.scenarioList.appendChild(card);
  });
}

function applyScenarioById(id, shouldScroll = false) {
  const scenario = scenarioMap.get(id);
  if (scenario) {
    applyScenario(scenario, shouldScroll);
  }
}

function applyScenario(scenario, shouldScroll = false) {
  state.daysAutonomy = scenario.autonomyDays;
  state.manualKitSelection = false;
  state.recommendedKitId = null;
  state.scenarioPreferredKitId = scenario.preferredKitId || null;
  state.useCase = scenario.useCase || 'residential';
  refs.autonomy.value = scenario.autonomyDays;
  refs.autonomyValue.textContent = scenario.autonomyDays.toFixed(1);
  if (refs.useCase) {
    refs.useCase.value = state.useCase;
  }
  if (state.useCase === 'outdoor' && typeof scenario.outdoorHours === 'number') {
    state.outdoorHoursPerDay = scenario.outdoorHours;
  }
  if (refs.outdoorHours) {
    refs.outdoorHours.value = state.outdoorHoursPerDay;
  }
  if (refs.outdoorHoursValue) {
    refs.outdoorHoursValue.textContent = state.outdoorHoursPerDay;
  }
  updateUseCaseUI();

  const list = Array.from(refs.loadList.querySelectorAll('.load-item'));
  const usedIds = new Set();

  // Reset loads to unchecked before applying scenario data
  list.forEach((item) => {
    const checkbox = item.querySelector('.load-select');
    checkbox.checked = false;
  });

  scenario.loads.forEach((load) => {
    const match = list.find((item) => item.dataset.id === load.id);
    if (match) {
      const checkbox = match.querySelector('.load-select');
      const powerInput = match.querySelector('.load-power');
      const hoursInput = match.querySelector('.load-hours');
      checkbox.checked = true;
      powerInput.value = load.power;
      hoursInput.value = load.hours;
      usedIds.add(match.dataset.id);
    } else {
      // Add custom load if not existing in catalog
      const newLoad = createLoadItem({
        id: load.id,
        name: loadCatalog.find((l) => l.id === load.id)?.name || 'Carga personalizada',
        power: load.power,
        hours: load.hours,
        selected: true,
        custom: true
      });
      refs.loadList.appendChild(newLoad);
      usedIds.add(load.id);
    }
  });

  // Ensure only the scenario loads quedan seleccionadas
  Array.from(refs.loadList.querySelectorAll('.load-item')).forEach((item) => {
    const checkbox = item.querySelector('.load-select');
    checkbox.checked = usedIds.has(item.dataset.id);
  });

  calculateAndRender();
  if (shouldScroll) {
    scheduleScrollToHighlight();
  }
}

function attachEvents() {
  refs.location.addEventListener('change', () => {
    state.locationId = refs.location.value;
    calculateAndRender();
  });

  if (refs.useCase) {
    refs.useCase.addEventListener('change', () => {
      state.useCase = refs.useCase.value;
      state.manualKitSelection = false;
      state.scenarioPreferredKitId = null;
      updateUseCaseUI();
      calculateAndRender();
    });
  }

  refs.autonomy.addEventListener('input', () => {
    state.daysAutonomy = parseFloat(refs.autonomy.value);
    refs.autonomyValue.textContent = state.daysAutonomy.toFixed(1);
  });

  refs.autonomy.addEventListener('change', calculateAndRender);

  if (refs.outdoorHours) {
    refs.outdoorHours.addEventListener('input', () => {
      state.outdoorHoursPerDay = parseInt(refs.outdoorHours.value, 10);
      if (refs.outdoorHoursValue) {
        refs.outdoorHoursValue.textContent = state.outdoorHoursPerDay;
      }
    });
    refs.outdoorHours.addEventListener('change', calculateAndRender);
  }

  if (refs.highlightPanelButton) {
    refs.highlightPanelButton.addEventListener('click', () => {
      const suggested = parseInt(refs.highlight?.dataset.suggestedPanels || '0', 10);
      if (!Number.isFinite(suggested) || suggested < 0) return;
      state.panelCount = suggested;
      state.cartPreviewVisible = true;
      if (refs.panelCount) {
        refs.panelCount.value = suggested;
        refs.panelCount.dispatchEvent(new Event('input'));
      }
      calculateAndRender();
      updateCartShortcut();
    });
  }

  if (refs.highlightBuy) {
    refs.highlightBuy.addEventListener('click', (event) => {
      const mode = refs.highlightBuy.dataset.mode || 'checkout';
      if (mode === 'disabled') {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      if (mode === 'quote') {
        const url = refs.whatsappLink?.href || 'https://wa.me/56900000000';
        window.open(url, '_blank');
        return;
      }
      state.cartPreviewVisible = true;
      updateCartShortcut();
      redirectToCheckout('_blank');
    });
  }

  if (refs.panelCount) {
    refs.panelCount.addEventListener('input', () => {
      const parsed = parseInt(refs.panelCount.value, 10);
      state.panelCount = Number.isNaN(parsed) ? 0 : parsed;
      updatePanelCountDisplay();
      updateSolarOutputs();
      updatePanelRecoveryNote(getSelectedLoads());
      if (Number.isFinite(state.panelCount) && state.panelCount > 0) {
        state.cartPreviewVisible = true;
      }
      updateCartShortcut();
    });
  }

  refs.calculate.addEventListener('click', calculateAndRender);

  refs.addLoad.addEventListener('click', (event) => {
    event.preventDefault();
    const newLoad = createLoadItem({
      id: `custom-${Date.now()}`,
      name: 'Nueva carga',
      power: 100,
      hours: 1,
      selected: true,
      custom: true
    });
    const nameInput = newLoad.querySelector('.load-name');
    refs.loadList.appendChild(newLoad);
    nameInput.focus();
    calculateAndRender();
  });

  refs.outageFrequency.addEventListener('input', () => {
    state.outageFrequency = parseFloat(refs.outageFrequency.value) || 0;
  });
  refs.outageFrequency.addEventListener('change', calculateAndRender);

  refs.outageDuration.addEventListener('input', () => {
    state.outageDuration = parseFloat(refs.outageDuration.value) || 0;
  });
  refs.outageDuration.addEventListener('change', calculateAndRender);
}

function updateUseCaseUI() {
  if (!refs.outdoorHoursField) return;
  if (state.useCase === 'outdoor') {
    refs.outdoorHoursField.classList.remove('hidden');
  } else {
    refs.outdoorHoursField.classList.add('hidden');
  }
  if (refs.panelCountTitle) {
    refs.panelCountTitle.textContent = 'Paneles plegables conectados (200 W)';
  }
}

function getSelectedLoads() {
  const items = Array.from(refs.loadList.querySelectorAll('.load-item'));
  return items
    .map((item) => {
      const checkbox = item.querySelector('.load-select');
      const nameInput = item.querySelector('.load-name');
      const powerInput = item.querySelector('.load-power');
      const hoursInput = item.querySelector('.load-hours');
      const selected = checkbox.checked;
      const power = parseFloat(powerInput.value) || 0;
      const hours = parseFloat(hoursInput.value) || 0;
      return {
        id: item.dataset.id,
        name: nameInput.value.trim() || 'Carga',
        power,
        hours,
        selected
      };
    })
    .filter((load) => load.selected && load.power > 0 && load.hours > 0);
}

function calculateTotals(selectedLoads) {
  const totalWh = selectedLoads.reduce((acc, load) => acc + load.power * load.hours, 0);
  const peakW = selectedLoads.reduce((acc, load) => acc + load.power, 0);
  const outdoorWh = selectedLoads.reduce((acc, load) => {
    const outdoorHours = Math.min(load.hours, state.outdoorHoursPerDay);
    return acc + load.power * outdoorHours;
  }, 0);
  const sumHours = selectedLoads.reduce((acc, load) => acc + load.hours, 0);
  const energyBaseWh = state.useCase === 'outdoor' && outdoorWh > 0 ? outdoorWh : totalWh;
  const effectiveHours = state.useCase === 'outdoor'
    ? Math.min(state.outdoorHoursPerDay, 24)
    : Math.min(sumHours, 24);
  const averageLoadW = effectiveHours > 0 ? energyBaseWh / effectiveHours : 0;
  const batteryRequiredWh = energyBaseWh > 0
    ? (energyBaseWh * state.daysAutonomy) / (constants.dod * constants.inverterEff)
    : 0;
  const inverterRequiredW = peakW > 0 ? peakW * 1.25 : 0;
  return {
    totalWh,
    peakW,
    batteryRequiredWh,
    inverterRequiredW,
    averageLoadW,
    outdoorWh
  };
}

function calculateAndRender() {
  const selectedLoads = getSelectedLoads();
  state.totals = calculateTotals(selectedLoads);
  updateSummary();
  renderKitCards();
  updateSolarOutputs();
  updateResilience();
  updateComparison();
  updateWhatsApp(selectedLoads);
  if (refs.socTimeline) {
    renderBlackout(selectedLoads);
  }
  updatePanelRecoveryNote(selectedLoads);
  updateCartShortcut();
}

function formatEnergy(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} kWh`;
  }
  return `${Math.round(value)} Wh`;
}

function formatPower(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} kW`;
  }
  return `${Math.round(value)} W`;
}

function formatHours(value) {
  if (!isFinite(value) || value <= 0) return '-';
  if (value >= 24) {
    const days = value / 24;
    return `${days.toFixed(1)} días`;
  }
  return `${value.toFixed(1)} h`;
}

function formatDays(value) {
  if (!isFinite(value) || value <= 0) return '-';
  if (value >= 1) {
    return `${value.toFixed(1)} días`;
  }
  return `${(value * 24).toFixed(1)} h`;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(value);
}

function updateSummary() {
  const { totalWh, peakW, batteryRequiredWh, inverterRequiredW, outdoorWh } = state.totals;
  refs.totalWh.textContent = formatEnergy(totalWh);
  refs.totalW.textContent = formatPower(peakW);
  refs.batteryRequired.textContent = formatEnergy(batteryRequiredWh);
  refs.inverterRequired.textContent = formatPower(inverterRequiredW);
  refs.outdoorWh.textContent = state.useCase === 'outdoor'
    ? formatEnergy(outdoorWh)
    : 'Solo aplica en modo Outdoor';

  const kit = getRecommendedKit();
  if (kit) {
    const acHours = kit.capacityWh / (kit.acChargeW * constants.chargeEff);
    refs.gridCharge.textContent = acHours ? `${acHours.toFixed(1)} h` : '-';
  } else {
    refs.gridCharge.textContent = '-';
  }
}

function renderKitCards() {
  refs.kitCards.innerHTML = '';
  const { batteryRequiredWh, inverterRequiredW, peakW } = state.totals;
  const autonomyTarget = state.useCase === 'outdoor'
    ? Math.max(state.outdoorHoursPerDay * state.daysAutonomy, 8)
    : state.daysAutonomy * 24;
  const region = regions.find((r) => r.id === state.locationId);
  let outdoorRecommended = null;
  if (state.useCase === 'outdoor' && !state.manualKitSelection) {
    const energyNeedWh = batteryRequiredWh;
    const powerNeedW = inverterRequiredW;
    outdoorRecommended = [...kits]
      .sort((a, b) => a.capacityWh - b.capacityWh)
      .find((kit) => {
        const meetsEnergy = energyNeedWh <= 0 || kit.capacityWh >= energyNeedWh;
        const meetsPower = powerNeedW <= 0 || kit.inverterW >= powerNeedW;
        return meetsEnergy && meetsPower;
      }) || null;
  }
  const cards = kits.map((kit) => {
    const coverage = batteryRequiredWh > 0 ? kit.capacityWh / batteryRequiredWh : 0;
    const inverterMargin = inverterRequiredW > 0 ? kit.inverterW / inverterRequiredW : 0;
    const autonomyHours = peakW > 0 ? kit.capacityWh / peakW : 0;
    const selectedPanels = Number.isFinite(state.panelCount) && state.panelCount > 0
      ? Math.round(state.panelCount)
      : 0;
    const baseRecommendation = 1;
    const recommendedPanels = Math.max(1, baseRecommendation);
    const panelWatt = getPanelWatt();
    const solarDailyRecovery = selectedPanels > 0 && region
      ? (selectedPanels * panelWatt * constants.solarDerating * region.psh)
      : 0;
    const rechargeDays = solarDailyRecovery > 0 ? kit.capacityWh / solarDailyRecovery : 0;
    const outdoorAutonomyDays = state.totals.outdoorWh > 0 ? kit.capacityWh / state.totals.outdoorWh : 0;
    return {
      kit,
      coverage,
      inverterMargin,
      autonomyHours,
      rechargeDays,
      selectedPanels,
      recommendedPanels,
      outdoorAutonomyDays
    };
  });

  const scenarioPreferredEntry = state.scenarioPreferredKitId
    ? cards.find((entry) => entry.kit.id === state.scenarioPreferredKitId)
    : null;
  const sorted = cards.sort((a, b) => {
    if (state.useCase === 'outdoor') {
      const outdoorCoeff = state.totals.outdoorWh > 0 ? state.totals.outdoorWh : peakW;
      const outdoorAutonomyHoursA = outdoorCoeff > 0 ? a.kit.capacityWh / outdoorCoeff : 0;
      const outdoorAutonomyHoursB = outdoorCoeff > 0 ? b.kit.capacityWh / outdoorCoeff : 0;
      const energyNeedWh = batteryRequiredWh;
      const powerNeedW = inverterRequiredW;
      const meetsEnergyA = energyNeedWh <= 0 ? true : a.kit.capacityWh >= energyNeedWh;
      const meetsEnergyB = energyNeedWh <= 0 ? true : b.kit.capacityWh >= energyNeedWh;
      if (meetsEnergyA !== meetsEnergyB) return meetsEnergyA ? -1 : 1;
      const meetsPowerA = powerNeedW <= 0 ? true : a.kit.inverterW >= powerNeedW;
      const meetsPowerB = powerNeedW <= 0 ? true : b.kit.inverterW >= powerNeedW;
      if (meetsPowerA !== meetsPowerB) return meetsPowerA ? -1 : 1;
      if (meetsEnergyA && meetsEnergyB && energyNeedWh > 0) {
        const marginA = a.kit.capacityWh - energyNeedWh;
        const marginB = b.kit.capacityWh - energyNeedWh;
        if ((marginA >= 0) !== (marginB >= 0)) return marginA >= 0 ? -1 : 1;
        if (marginA >= 0 && marginB >= 0 && marginA !== marginB) {
          return marginA - marginB;
        }
      }
      const deltaA = Math.abs(outdoorAutonomyHoursA - autonomyTarget);
      const deltaB = Math.abs(outdoorAutonomyHoursB - autonomyTarget);
      if (deltaA !== deltaB) return deltaA - deltaB;
      return a.kit.capacityWh - b.kit.capacityWh;
    }
    return b.coverage - a.coverage || b.inverterMargin - a.inverterMargin;
  });
  const topKit = sorted[0]?.kit;

  if (batteryRequiredWh <= 0) {
    state.recommendedKitId = null;
  }

  if (!state.manualKitSelection && batteryRequiredWh > 0) {
    if (scenarioPreferredEntry && scenarioPreferredEntry.coverage >= 1 && scenarioPreferredEntry.inverterMargin >= 1) {
      state.recommendedKitId = scenarioPreferredEntry.kit.id;
    } else if (state.useCase === 'outdoor' && outdoorRecommended) {
      state.recommendedKitId = outdoorRecommended.id;
    } else if (topKit) {
      state.recommendedKitId = topKit.id;
    }
  }

  const recommendedEntry = sorted.find(({ kit }) => kit.id === state.recommendedKitId) || sorted[0];

  if (!recommendedEntry || batteryRequiredWh <= 0) {
    const placeholder = document.createElement('article');
    placeholder.className = 'kit-card placeholder-card';
    placeholder.innerHTML = '<p>Configura tus cargas para ver el detalle del kit recomendado.</p>';
    refs.kitCards.appendChild(placeholder);
    lastKitCards = [];
    updatePlannerHighlight([]);
    return;
  }

  const {
    kit,
    coverage,
    inverterMargin,
    autonomyHours,
    rechargeDays,
    selectedPanels,
    recommendedPanels,
    outdoorAutonomyDays
  } = recommendedEntry;

  const card = document.createElement('article');
  card.className = 'kit-card active';
  const priceLabel = kit.quoteOnly ? 'Pedir cotización' : `${formatCurrency(kit.price)} IVA incluido`;

  const mediaStyle = kit.imageScale ? ` style="--kit-image-scale:${kit.imageScale};"` : '';
  const media = kit.image
    ? `<figure class="kit-card__media"${mediaStyle}><img src="${kit.image}" alt="${kit.imageAlt || kit.name}"></figure>`
    : '<div class="kit-card__media placeholder">Visual disponible pronto</div>';
  card.innerHTML = `
    <span class="badge">Recomendado</span>
    <div class="kit-card__top">
      ${media}
      <div class="kit-card__summary">
        <h3>${kit.name}</h3>
        <p class="meta">${kit.expansion}</p>
        <p class="kit-card__price">${priceLabel}</p>
      </div>
    </div>
    <div class="kit-metrics">
      <div>Capacidad: <strong>${formatEnergy(kit.capacityWh)}</strong></div>
      <div>Inversor: <strong>${formatPower(kit.inverterW)}</strong></div>
      <div>Margen energía: <strong>${(coverage * 100).toFixed(0)}%</strong></div>
      <div>Margen potencia: <strong>${(inverterMargin * 100).toFixed(0)}%</strong></div>
      <div>Autonomía estimada: <strong>${formatHours(autonomyHours)}</strong></div>
      <div>Recarga AC: <strong>${formatHours(kit.capacityWh / (kit.acChargeW * constants.chargeEff))}</strong></div>
      <div>Recuperación solar (${describePanels(selectedPanels)}): <strong>${formatHours(rechargeDays * 24)}</strong></div>
      <div>Modo outdoor (${state.outdoorHoursPerDay} h/día): <strong>${formatDays(outdoorAutonomyDays)}</strong></div>
    </div>
    <p class="kit-card__note">${kit.notes}</p>
    ${kit.usageTip ? `<p class="kit-card__tip"><strong>Tip:</strong> ${kit.usageTip}</p>` : ''}
  `;

  const actions = document.createElement('div');
  actions.className = 'kit-card__actions';

  const buyButton = document.createElement('button');
  buyButton.className = 'buy';
  buyButton.type = 'button';
  buyButton.textContent = kit.quoteOnly ? 'Pedir cotización' : 'Comprar ahora';
  buyButton.dataset.mode = kit.quoteOnly ? 'quote' : 'checkout';
  buyButton.addEventListener('click', () => {
    if (kit.quoteOnly) {
      const url = refs.whatsappLink?.href || 'https://wa.me/56900000000';
      window.open(url, '_blank');
      return;
    }
    state.cartPreviewVisible = true;
    updateCartShortcut();
    redirectToCheckout('_blank');
  });
  actions.appendChild(buyButton);

  const applyPanelsButton = document.createElement('button');
  applyPanelsButton.className = 'ghost';
  applyPanelsButton.type = 'button';
  const suggestedCount = Math.max(1, recommendedPanels);
  if (!Number.isFinite(suggestedCount) || suggestedCount <= 0) {
    applyPanelsButton.textContent = 'Sin panel adicional necesario';
    applyPanelsButton.disabled = true;
  } else {
    const currentPanels = state.panelCount;
    applyPanelsButton.textContent = currentPanels === suggestedCount
      ? 'Panel recomendado aplicado'
      : `Agregar ${describePanels(suggestedCount)} (opcional)`;
    applyPanelsButton.disabled = currentPanels === suggestedCount;
    applyPanelsButton.addEventListener('click', () => {
      state.panelCount = suggestedCount;
      state.cartPreviewVisible = true;
      if (refs.panelCount) {
        refs.panelCount.value = suggestedCount;
        refs.panelCount.dispatchEvent(new Event('input'));
      }
      calculateAndRender();
      updateCartShortcut();
    });
  }
  actions.appendChild(applyPanelsButton);
  if (kit.datasheet) {
    const datasheetLink = document.createElement('a');
    datasheetLink.className = 'ghost';
    datasheetLink.href = kit.datasheet;
    datasheetLink.target = '_blank';
    datasheetLink.rel = 'noopener';
    datasheetLink.textContent = 'Ver datasheet';
    actions.appendChild(datasheetLink);
  }

  const devicesNode = buildDeviceUsageNode(kit);
  if (devicesNode) {
    card.appendChild(devicesNode);
  }

  card.appendChild(actions);
  refs.kitCards.appendChild(card);

  lastKitCards = [recommendedEntry];
  updatePlannerHighlight([recommendedEntry]);
}

function updatePlannerHighlight(cards) {
  if (!refs.highlight) return;
  const container = refs.highlight;
  const entry = cards.find(({ kit }) => kit.id === state.recommendedKitId);
  const hasLoads = state.totals.totalWh > 0;
  let suggestedPanels = 0;
  if (!entry || !hasLoads) {
    container.classList.add('planner__highlight--empty');
    container.dataset.suggestedPanels = '0';
    if (refs.highlightName) {
      refs.highlightName.textContent = 'Selecciona un escenario para comenzar';
      refs.highlightCopy.textContent = 'Te mostraremos el kit ideal con autonomía, recarga y beneficios clave.';
      refs.highlightAutonomy.textContent = '-';
      refs.highlightAC.textContent = '-';
      refs.highlightSolar.textContent = '-';
      if (refs.highlightPrice) {
        refs.highlightPrice.textContent = 'Precio: -';
      }
      if (refs.highlightPower) {
        refs.highlightPower.textContent = '-';
      }
      if (refs.highlightCapacity) {
        refs.highlightCapacity.textContent = '-';
      }
      refs.highlightImage.src = fallbackKitImage;
      refs.highlightImage.alt = 'Kit portátil EntropyEnergy';
      refs.highlightImage.style.setProperty('--highlight-scale', '1');
    }
    if (refs.highlightPanelButton) {
      refs.highlightPanelButton.textContent = 'Agregar panel recomendado';
      refs.highlightPanelButton.disabled = true;
    }
    if (refs.highlightBuy) {
      refs.highlightBuy.classList.add('disabled');
      refs.highlightBuy.setAttribute('aria-disabled', 'true');
      refs.highlightBuy.dataset.mode = 'disabled';
      refs.highlightBuy.textContent = 'Comprar kit recomendado';
    }
    if (refs.highlightCTA) {
      refs.highlightCTA.href = '#kitsModule';
      refs.highlightCTA.removeAttribute('target');
      refs.highlightCTA.removeAttribute('rel');
      refs.highlightCTA.textContent = 'Ver detalle del kit';
    }
    if (refs.highlightDevices) {
      refs.highlightDevices.classList.add('hidden');
    }
    if (refs.highlightDevicesList) {
      refs.highlightDevicesList.innerHTML = '';
    }
    return;
  }

  container.classList.remove('planner__highlight--empty');
  const { kit, autonomyHours, rechargeDays, selectedPanels, recommendedPanels } = entry;
  const autonomyText = formatHours(autonomyHours);
  const acChargeText = formatHours(kit.capacityWh / (kit.acChargeW * constants.chargeEff));
  const hasAppliedPanels = selectedPanels > 0;
  const solarHoursText = hasAppliedPanels && rechargeDays > 0
    ? formatHours(rechargeDays * 24)
    : 'Sin panel';

  if (refs.highlightName) {
    refs.highlightName.textContent = kit.name;
    refs.highlightCopy.textContent = state.useCase === 'outdoor'
      ? 'Listo para tus salidas: energía silenciosa para luces, comunicaciones y recarga.'
      : 'Mantén tus cargas esenciales activas con autonomía y recarga inteligente.';
    refs.highlightAutonomy.textContent = autonomyText;
    refs.highlightAC.textContent = acChargeText;
    refs.highlightSolar.textContent = solarHoursText;
    if (refs.highlightPrice) {
      refs.highlightPrice.textContent = kit.quoteOnly
        ? 'Precio: pedir cotización'
        : `Precio: ${formatCurrency(kit.price)}`;
    }
    if (refs.highlightPower) {
      refs.highlightPower.textContent = formatPower(kit.inverterW);
    }
    if (refs.highlightCapacity) {
      refs.highlightCapacity.textContent = formatEnergy(kit.capacityWh);
    }
    refs.highlightImage.src = kit.image || fallbackKitImage;
    refs.highlightImage.alt = kit.imageAlt || kit.name;
    refs.highlightImage.style.setProperty('--highlight-scale', (kit.imageScale || 1).toString());
    if (refs.highlightCTA) {
      if (kit.datasheet) {
        refs.highlightCTA.href = kit.datasheet;
        refs.highlightCTA.textContent = 'Ver datasheet';
        refs.highlightCTA.target = '_blank';
        refs.highlightCTA.rel = 'noopener';
      } else {
        refs.highlightCTA.href = '#kitsModule';
        refs.highlightCTA.textContent = 'Ver detalle del kit';
        refs.highlightCTA.removeAttribute('target');
        refs.highlightCTA.removeAttribute('rel');
      }
    }
    refs.highlightBadge.textContent = 'Recomendado';

    const basePanels = Math.max(1, recommendedPanels);
    suggestedPanels = basePanels;
    const solarLabel = refs.highlightSolar.closest('div').querySelector('small');
    if (solarLabel) {
      const displayPanels = selectedPanels > 0 ? selectedPanels : basePanels;
      solarLabel.textContent = `Recuperación solar diaria (${describePanels(displayPanels)})`;
    }
  }
  if (suggestedPanels <= 0) {
    suggestedPanels = 1;
  }
  container.dataset.suggestedPanels = String(suggestedPanels);

  if (refs.highlightPanelButton) {
    if (suggestedPanels <= 0) {
      refs.highlightPanelButton.textContent = 'Sin panel adicional necesario';
      refs.highlightPanelButton.disabled = true;
    } else {
      const currentPanels = state.panelCount;
      refs.highlightPanelButton.textContent = currentPanels === suggestedPanels
        ? 'Panel recomendado aplicado'
        : `Agregar ${describePanels(suggestedPanels)} (opcional)`;
      refs.highlightPanelButton.disabled = currentPanels === suggestedPanels;
    }
  }
  if (refs.highlightBuy) {
    refs.highlightBuy.textContent = kit.quoteOnly ? 'Pedir cotización' : `Comprar ${kit.name}`;
    refs.highlightBuy.dataset.mode = kit.quoteOnly ? 'quote' : 'checkout';
    refs.highlightBuy.classList.remove('disabled');
    refs.highlightBuy.removeAttribute('aria-disabled');
  }

  const highlightDeviceNode = refs.highlightDevices;
  const highlightDeviceList = refs.highlightDevicesList;
  if (highlightDeviceNode && highlightDeviceList) {
    const summaries = getDeviceChargeSummary(kit, 6);
    highlightDeviceList.innerHTML = '';
    if (summaries.length === 0) {
      highlightDeviceNode.classList.add('hidden');
    } else {
      summaries.forEach(({ name, label }) => {
        const item = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = label;
        item.appendChild(strong);
        item.append(` ${name}`);
        highlightDeviceList.appendChild(item);
      });
      highlightDeviceNode.classList.remove('hidden');
    }
  }
}

function getRecommendedKit() {
  if (!state.recommendedKitId) return null;
  return kits.find((kit) => kit.id === state.recommendedKitId) || null;
}

function updateSolarOutputs() {
  if (refs.panelCountValue) {
    refs.panelCountValue.textContent = describePanels(state.panelCount);
  }
  if (!refs.solarCharge) return;
  const region = regions.find((r) => r.id === state.locationId);
  const kit = getRecommendedKit();
  if (!region || !kit) {
    refs.solarCharge.textContent = '-';
    return;
  }
  updatePanelCountDisplay();
  const panels = state.panelCount;
  if (panels === 0) {
    refs.solarCharge.textContent = state.useCase === 'outdoor'
      ? 'Agrega paneles plegables para estimar la recarga solar.'
      : 'Agrega paneles solares para estimar la recarga.';
    return;
  }
  const panelWatt = getPanelWatt();
  const solarDailyRecovery = panels * panelWatt * constants.solarDerating * region.psh;
  const rechargeDays = kit.capacityWh / solarDailyRecovery;
  if (rechargeDays <= 0) {
    refs.solarCharge.textContent = '-';
  } else {
    const hoursEquivalent = rechargeDays * 24;
    refs.solarCharge.textContent = `${hoursEquivalent.toFixed(1)} h sol (≈ ${rechargeDays.toFixed(2)} días) con ${describePanels(panels)}`;
  }

  updatePlannerHighlight(lastKitCards);
}

function updatePanelRecoveryNote(selectedLoads) {
  if (!refs.blackoutNote) return;
  const kit = getRecommendedKit();
  if (!kit || selectedLoads.length === 0) {
    refs.blackoutNote.textContent = 'Selecciona un escenario o personaliza tus cargas para estimar la recuperación diaria.';
    return;
  }
  if (state.panelCount === 0) {
    refs.blackoutNote.textContent = 'Sin panel plegable 200 W dependes de recargar desde la red o tu vehículo.';
    return;
  }
  const region = getRegion();
  const panelWatt = getPanelWatt();
  const dailyRecovery = (state.panelCount * panelWatt * constants.solarDerating * region.psh) / kit.capacityWh * 100;
  const clamped = Math.min(100, dailyRecovery);
  const portableLabel = describePortablePanels(state.panelCount);
  refs.blackoutNote.textContent = `Con ${portableLabel} recuperas ≈ ${clamped.toFixed(0)}% de la batería por día.`;
  if (state.useCase === 'outdoor') {
    refs.blackoutNote.textContent += ' Ajusta tus horas outdoor para prever la autonomía diaria.';
  }
}

function attachHeroChipHandlers() {
  const chips = document.querySelectorAll('.hero-chip[data-scenario]');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const scenarioId = chip.dataset.scenario;
      if (scenarioId) {
        applyScenarioById(scenarioId, true);
      }
    });
  });

  const panelLink = document.querySelector('.hero-chip--link[href="#panelAccessory"]');
  if (panelLink) {
    panelLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('panelAccessory');
      if (target) {
        const nav = document.querySelector('.site-nav');
        const navOffset = nav ? nav.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
}

function updateResilience() {
  const kit = getRecommendedKit();
  const { batteryRequiredWh, inverterRequiredW } = state.totals;
  if (!kit || batteryRequiredWh === 0) {
    refs.resilienceScore.textContent = '-';
    refs.scoreMessage.textContent = 'Completa las cargas para calcular tu resiliencia.';
    return;
  }
  const coverage = kit.capacityWh / batteryRequiredWh;
  const inverterMargin = inverterRequiredW > 0 ? kit.inverterW / inverterRequiredW : 0;
  const outageFactor = state.useCase === 'outdoor'
    ? 1
    : Math.min((state.outageFrequency * state.outageDuration) / 48, 1.2);
  const panelBoost = state.panelCount > 0 ? Math.min(state.panelCount / 4, 1) : 0;
  let score = 35 * Math.min(coverage, 1.4) + 25 * Math.min(inverterMargin, 1.2) + 20 * panelBoost + 20 * Math.min(state.daysAutonomy / 3, 1);
  score -= 10 * (1 - Math.min(coverage, 1));
  score += 10 * outageFactor;
  score = Math.max(5, Math.min(100, Math.round(score)));
  refs.resilienceScore.textContent = score;

  let message = '';
  if (state.useCase === 'outdoor') {
    if (score >= 85) {
      message = 'Listo para expediciones largas: capacidad sobrada y buena recarga solar portátil.';
    } else if (score >= 65) {
      message = 'Cubres tus jornadas outdoor. Suma un panel plegable extra para más tiempo desconectado.';
    } else if (score >= 45) {
      message = 'Para travesías más largas considera un kit de mayor capacidad o reducir horas de consumo.';
    } else {
      message = 'Elige un kit con más Wh o ajusta equipos esenciales para lograr autonomía outdoor.';
    }
  } else if (score >= 85) {
    message = 'Listo para cortes prolongados: excelente margen y recarga solar sólida.';
  } else if (score >= 65) {
    message = 'Buena resiliencia para la mayoría de los cortes. Considera agregar un módulo extra para margen.';
  } else if (score >= 45) {
    message = 'Cubre lo esencial, pero evalúa un kit mayor o más paneles para mejorar el margen.';
  } else {
    message = 'Ajusta la autonomía o selecciona un kit más robusto para un respaldo confiable.';
  }
  refs.scoreMessage.textContent = message;
}

function renderBlackout(selectedLoads) {
  refs.socTimeline.innerHTML = '';
  const kit = getRecommendedKit();
  if (!kit || selectedLoads.length === 0) {
    refs.blackoutNote.textContent = 'Selecciona cargas y un kit para simular un corte.';
    renderBlackoutPlaceholder();
    return;
  }
  const avgW = state.totals.averageLoadW;
  if (avgW <= 0) {
    refs.blackoutNote.textContent = 'Revisa los datos de tus cargas para proyectar la autonomía.';
    renderBlackoutPlaceholder();
    return;
  }
  const panelWatt = getPanelWatt();
  const solarHours = deriveSunHours(state.panelCount);
  const solarWhPerHour = solarHours > 0
    ? (state.panelCount * panelWatt * constants.solarDerating * getRegion().psh) / solarHours
    : 0;
  const rechargeStartHour = 9;
  const rechargeEndHour = rechargeStartHour + solarHours;
  let soc = 100;
  const points = [];
  for (let hour = 0; hour < 24; hour += 1) {
    const consumptionPercent = (avgW / kit.capacityWh) * 100;
    soc -= consumptionPercent;
    if (state.panelCount > 0 && hour >= rechargeStartHour && hour < rechargeEndHour) {
      soc += (solarWhPerHour / kit.capacityWh) * 100;
    }
    soc = Math.max(0, Math.min(100, soc));
    points.push({ hour: hour + 1, soc });
  }

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.classList.add('blackout-chart');

  const polygon = document.createElementNS(svgNS, 'polygon');
  const line = document.createElementNS(svgNS, 'polyline');

  const linePoints = points.map((point) => {
    const x = (point.hour / 24) * 100;
    const y = 100 - point.soc;
    return `${x},${y}`;
  });

  polygon.setAttribute('points', `0,100 ${linePoints.join(' ')} 100,100`);
  polygon.setAttribute('fill', 'rgba(0, 216, 180, 0.18)');

  line.setAttribute('points', linePoints.join(' '));
  line.setAttribute('fill', 'none');
  line.setAttribute('stroke', '#00d8b4');
  line.setAttribute('stroke-width', '2');
  line.setAttribute('stroke-linejoin', 'round');

  svg.appendChild(polygon);
  svg.appendChild(line);
  refs.socTimeline.appendChild(svg);

  const axis = document.createElement('div');
  axis.className = 'blackout__axis';
  [0, 6, 12, 18, 24].forEach((mark) => {
    const label = document.createElement('span');
    label.textContent = `${mark}h`;
    axis.appendChild(label);
  });
  refs.socTimeline.appendChild(axis);

  const solarDailyRecovery = state.panelCount > 0
    ? (state.panelCount * panelWatt * constants.solarDerating * getRegion().psh) / kit.capacityWh * 100
    : 0;
  if (state.panelCount === 0) {
    refs.blackoutNote.textContent = state.useCase === 'outdoor'
      ? 'Sin paneles plegables dependes de recargar desde la red o el vehículo. Agrega paneles para recuperar energía durante el corte.'
      : 'Sin paneles dependes de recargar desde la red. Agrega paneles para recuperar energía durante el corte.';
  } else {
    refs.blackoutNote.textContent = `Con ${describePanels(state.panelCount)} recuperas ≈ ${solarDailyRecovery.toFixed(0)}% de la batería en un día despejado.`;
  }
  if (state.useCase === 'outdoor') {
    refs.blackoutNote.textContent += ' Ajusta tus horas outdoor para ver la autonomía estimada en cada jornada.';
  }
}

function renderBlackoutPlaceholder() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.classList.add('blackout-chart');
  const baseline = document.createElementNS(svgNS, 'line');
  baseline.setAttribute('x1', '0');
  baseline.setAttribute('y1', '100');
  baseline.setAttribute('x2', '100');
  baseline.setAttribute('y2', '100');
  baseline.setAttribute('stroke', 'rgba(0, 216, 180, 0.25)');
  baseline.setAttribute('stroke-width', '1');
  svg.appendChild(baseline);
  refs.socTimeline.appendChild(svg);

  const axis = document.createElement('div');
  axis.className = 'blackout__axis';
  [0, 6, 12, 18, 24].forEach((mark) => {
    const label = document.createElement('span');
    label.textContent = `${mark}h`;
    axis.appendChild(label);
  });
  refs.socTimeline.appendChild(axis);
}

function deriveSunHours(panelCount) {
  if (panelCount === 0) return 0;
  return Math.min(5, Math.max(3, Math.round(getRegion().psh)));
}

function getRegion() {
  return regions.find((r) => r.id === state.locationId) || regions[0];
}

function getPanelWatt() {
  return constants.portablePanelW;
}

function describePanels(count) {
  if (count <= 0) {
    return 'Sin panel plegable';
  }
  const plural = count === 1 ? '' : 'es';
  const adjective = count === 1 ? 'plegable' : 'plegables';
  return `${count} panel${plural} ${adjective} de ${getPanelWatt()} W`;
}

function describePortablePanels(count) {
  if (count <= 0) {
    return 'Sin panel plegable 200 W';
  }
  const plural = count === 1 ? '' : 'es';
  return `${count} panel${plural} plegable${plural} de ${constants.portablePanelW} W`;
}

function updatePanelCountDisplay() {
  if (!refs.panelCountValue) return;
  const count = state.panelCount;
  refs.panelCountValue.textContent = describePortablePanels(count);
}

function scheduleScrollToHighlight() {
  requestAnimationFrame(() => {
    setTimeout(() => {
      scrollToHighlight();
    }, 40);
  });
}

function scrollToHighlight() {
  const target = document.getElementById('plannerHighlight');
  if (!target) return;
  const nav = document.querySelector('.site-nav');
  const navOffset = nav ? nav.offsetHeight : 0;
  const currentScroll = Number.isFinite(window.scrollY)
    ? window.scrollY
    : window.pageYOffset || document.documentElement.scrollTop || 0;
  const targetPosition = target.getBoundingClientRect().top + currentScroll - navOffset - 16;
  const destination = Math.max(0, targetPosition);
  const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;

  if (supportsSmoothScroll && typeof window.scrollTo === 'function') {
    try {
      window.scrollTo({
        top: destination,
        behavior: 'smooth'
      });
      return;
    } catch (error) {
      // Older browsers (e.g. Safari < 15) throw on scroll options, fallback below.
    }
  }
  window.scrollTo(0, destination);
}

function setupPanelAddButton() {
  if (!refs.addPanelToCart) return;
  refs.addPanelToCart.addEventListener('click', () => addPanelToCart());
}

function addPanelToCart() {
  const currentPanels = Number.isFinite(state.panelCount)
    ? Math.max(0, Math.round(state.panelCount))
    : 0;
  const nextPanels = currentPanels + 1;
  state.panelCount = nextPanels;
  state.cartPreviewVisible = true;
  if (refs.panelCount) {
    refs.panelCount.value = String(nextPanels);
  }
  calculateAndRender();
  if (cartPopupVisible) {
    renderCartPopup();
  } else {
    openCartPopup();
  }
}

function setupCartPopup() {
  if (!refs.navCartButton) return;
  refs.navCartButton.addEventListener('click', (event) => {
    event.preventDefault();
    toggleCartPopup();
  });
  refs.cartPopupClose?.addEventListener('click', closeCartPopup);
  refs.cartPopup?.addEventListener('click', (event) => {
    if (event.target === refs.cartPopup) {
      closeCartPopup();
    }
  });
  if (refs.cartPopupCheckout) {
    refs.cartPopupCheckout.addEventListener('click', () => {
      redirectToCheckout('_self');
      closeCartPopup();
    });
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeCartPopup();
    }
  });
}

function toggleCartPopup() {
  if (cartPopupVisible) {
    closeCartPopup();
  } else {
    openCartPopup();
  }
}

function openCartPopup() {
  if (!refs.cartPopup) {
    window.location.href = 'cart.html';
    return;
  }
  cartPopupVisible = true;
  refs.cartPopup.classList.remove('hidden');
  renderCartPopup();
}

function closeCartPopup() {
  if (!refs.cartPopup) return;
  cartPopupVisible = false;
  refs.cartPopup.classList.add('hidden');
}

function renderCartPopup() {
  if (!refs.cartPopupDetails) return;
  const kit = getRecommendedKit();
  const hasItems = state.cartPreviewVisible || (Number.isFinite(state.panelCount) && state.panelCount > 0);
  if (!kit || !hasItems) {
    refs.cartPopupDetails.innerHTML = '<p class="cart-popup__empty">Tu carrito está vacío. Agrega un kit desde el planner o desde la sección de productos.</p>';
    if (refs.cartPopupCheckout) {
      refs.cartPopupCheckout.disabled = true;
    }
    return;
  }
  const kitHasPrice = !kit.quoteOnly && Number.isFinite(kit.price);
  const kitPriceLabel = kitHasPrice ? formatCurrency(kit.price) : 'Cotizar';
  const panelCount = Number.isFinite(state.panelCount) && state.panelCount > 0
    ? Math.round(state.panelCount)
    : 0;
  const panelSubtotal = panelCount * panelProduct.price;
  const subtotalValue = kitHasPrice || panelSubtotal > 0
    ? (kitHasPrice ? kit.price : 0) + panelSubtotal
    : 0;
  const summaryLabel = kitHasPrice
    ? 'Subtotal'
    : panelCount > 0
      ? 'Subtotal paneles'
      : 'Subtotal';
  const summaryValue = kitHasPrice || panelSubtotal > 0
    ? formatCurrency(subtotalValue)
    : 'Cotizar';
  const panelMarkup = panelCount > 0
    ? `
      <div class="cart-popup__details-item">
        <div class="cart-popup__details-info">
          <strong>${panelProduct.name}</strong>
          <small>${panelCount === 1 ? '1 unidad' : `${panelCount} unidades`} · ${formatCurrency(panelProduct.price)} c/u</small>
        </div>
        <div class="cart-popup__details-actions">
          <span class="cart-popup__price">${formatCurrency(panelSubtotal)}</span>
          <button class="cart-popup__remove" type="button" data-remove="panel">Quitar</button>
        </div>
      </div>
    `
    : '<p class="cart-popup__note">Sin panel adicional</p>';
  refs.cartPopupDetails.innerHTML = `
    <div class="cart-popup__details-item">
      <div class="cart-popup__details-info">
        <strong>${kit.name}</strong>
        ${kit.quoteOnly ? '<small>Precio disponible vía cotización</small>' : ''}
      </div>
      <div class="cart-popup__details-actions">
        <span class="cart-popup__price">${kitPriceLabel}</span>
        <button class="cart-popup__remove" type="button" data-remove="kit">Quitar</button>
      </div>
    </div>
    ${panelMarkup}
    <div class="cart-popup__summary">
      <span>${summaryLabel}</span>
      <strong>${summaryValue}</strong>
    </div>
  `;
  if (refs.cartPopupCheckout) {
    refs.cartPopupCheckout.disabled = false;
  }
  const removeButtons = refs.cartPopupDetails.querySelectorAll('[data-remove]');
  removeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const { remove } = button.dataset;
      if (remove) {
        handleCartRemoval(remove);
      }
    });
  });
}

function handleCartRemoval(type) {
  if (type === 'panel') {
    state.panelCount = 0;
    if (refs.panelCount) {
      refs.panelCount.value = '0';
    }
  } else if (type === 'kit') {
    state.cartPreviewVisible = false;
    state.panelCount = 0;
    if (refs.panelCount) {
      refs.panelCount.value = '0';
    }
  }
  calculateAndRender();
  renderCartPopup();
}

function setupPanelCarousel() {
  if (!refs.panelCarouselImage || !refs.panelCarouselDots) return;
  renderPanelCarouselDots();
  updatePanelCarousel(state.pvCarouselIndex);
  if (refs.panelCarouselPrev) {
    refs.panelCarouselPrev.addEventListener('click', () => shiftPanelCarousel(-1));
  }
  if (refs.panelCarouselNext) {
    refs.panelCarouselNext.addEventListener('click', () => shiftPanelCarousel(1));
  }
}

function renderPanelCarouselDots() {
  if (!refs.panelCarouselDots) return;
  refs.panelCarouselDots.innerHTML = '';
  pvCarouselImages.forEach((image, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    if (index === state.pvCarouselIndex) {
      dot.classList.add('active');
    }
    dot.addEventListener('click', () => updatePanelCarousel(index));
    refs.panelCarouselDots.appendChild(dot);
  });
}

function shiftPanelCarousel(delta) {
  const total = pvCarouselImages.length;
  if (total === 0) return;
  const nextIndex = (state.pvCarouselIndex + delta + total) % total;
  updatePanelCarousel(nextIndex);
}

function updatePanelCarousel(index) {
  if (!refs.panelCarouselImage || !pvCarouselImages[index]) return;
  state.pvCarouselIndex = index;
  refs.panelCarouselImage.src = pvCarouselImages[index];
  refs.panelCarouselImage.alt = `Panel solar plegable 200 W vista ${index + 1}`;
  if (refs.panelCarouselDots) {
    Array.from(refs.panelCarouselDots.children).forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
    });
  }
}

function getDeviceChargeSummary(kit, limit = 8) {
  if (!kit) return [];
  const usableWh = kit.capacityWh * constants.deviceChargeEff;
  return deviceProfiles.slice(0, limit).map((profile) => {
    const ratio = profile.energyWh > 0 ? usableWh / profile.energyWh : 0;
    return {
      name: profile.name,
      label: formatChargeLabel(ratio)
    };
  }).filter((entry) => entry.label);
}

function formatChargeLabel(ratio) {
  if (!Number.isFinite(ratio) || ratio <= 0) return '<1 carga';
  if (ratio >= 2) {
    return `${Math.floor(ratio)} cargas`;
  }
  if (ratio >= 1) {
    const formatted = ratio.toFixed(1).replace(/\.0$/, '');
    return `${formatted} cargas`;
  }
  if (ratio >= 0.6) {
    return '≈1 carga';
  }
  return '<1 carga';
}

function buildDeviceUsageNode(kit) {
  const summaries = getDeviceChargeSummary(kit, 8);
  if (summaries.length === 0) return null;
  const container = document.createElement('div');
  container.className = 'kit-card__devices';
  const title = document.createElement('h4');
  title.textContent = 'Referencias de uso popular';
  container.appendChild(title);
  const list = document.createElement('ul');
  summaries.forEach(({ name, label }) => {
    const item = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = label;
    item.appendChild(strong);
    item.append(` ${name}`);
    list.appendChild(item);
  });
  container.appendChild(list);
  return container;
}

function updatePanelInfoText(description) {
  if (!refs.blackoutPanelInfo) return;
  const textNode = refs.blackoutPanelInfo.querySelector('p');
  if (!textNode) return;
  if (!description || description.toLowerCase().includes('sin panel')) {
    textNode.textContent = 'Arrastra el control para agregar paneles plegables y ver cómo se recupera la batería durante el día.';
  } else {
    textNode.textContent = `Estás configurando ${description}. Mira cómo impacta en la curva de energía.`;
  }
}

function buildCartUrl() {
  const kit = getRecommendedKit();
  if (!kit) return null;
  const panels = Number.isFinite(state.panelCount) && state.panelCount > 0
    ? Math.max(0, Math.round(state.panelCount))
    : 0;
  const suggestedPanels = parseInt(refs.highlight?.dataset.suggestedPanels || '0', 10);
  const url = new URL('cart.html', window.location.href);
  url.searchParams.set('kitId', kit.id);
  url.searchParams.set('panels', panels);
  if (Number.isFinite(suggestedPanels) && suggestedPanels > 0) {
    url.searchParams.set('suggestedPanels', suggestedPanels);
  }
  url.searchParams.set('useCase', state.useCase);
  return url.toString();
}

function redirectToCheckout(target = '_self') {
  const url = buildCartUrl();
  if (!url) return;
  if (target === '_self') {
    window.location.href = url;
    return;
  }
  const opened = window.open(url, target);
  if (!opened) {
    window.location.href = url;
  }
}

function updateCartShortcut() {
  const shortcut = refs.cartShortcut;
  if (!shortcut) return;
  const badge = refs.cartShortcutBadge;
  const labelNode = refs.cartShortcutLabel;
  const updateNavBadge = (count) => {
    if (!refs.navCartBadge) return;
    if (count > 0) {
      refs.navCartBadge.textContent = String(count);
      refs.navCartBadge.classList.remove('hidden');
    } else {
      refs.navCartBadge.classList.add('hidden');
      refs.navCartBadge.textContent = '0';
    }
  };

  const hideShortcut = () => {
    shortcut.classList.add('hidden');
    shortcut.setAttribute('aria-label', 'Ver carrito');
    if (badge) {
      badge.classList.add('hidden');
      badge.textContent = '0';
    }
    if (labelNode) {
      labelNode.textContent = 'Ver carrito';
    }
  };

  const kit = getRecommendedKit();
  if (!kit) {
    updateNavBadge(0);
    hideShortcut();
    state.cartPreviewVisible = false;
    closeCartPopup();
    return;
  }

  const panelCount = Number.isFinite(state.panelCount) && state.panelCount > 0
    ? Math.max(0, Math.round(state.panelCount))
    : 0;
  const shouldShow = state.cartPreviewVisible || panelCount > 0;
  if (!shouldShow) {
    hideShortcut();
    updateNavBadge(0);
    if (cartPopupVisible) {
      renderCartPopup();
    }
    return;
  }
  updateNavBadge(1 + (panelCount > 0 ? 1 : 0));

  const url = buildCartUrl();
  if (!url) {
    hideShortcut();
    return;
  }

  shortcut.href = url;

  if (labelNode) {
    const kitLabel = kit.name;
    const parts = [kitLabel];
    if (panelCount > 0) {
      const panelLabel = panelCount === 1
        ? 'Panel plegable 200 W'
        : `${panelCount} paneles plegables 200 W`;
      parts.push(panelLabel);
    }
    labelNode.textContent = parts.join(' · ');
    const ariaLabel = panelCount > 0
      ? `Ver carrito: ${parts.join(' y ')}`
      : `Ver carrito: ${kitLabel}`;
    shortcut.setAttribute('aria-label', ariaLabel);
  }

  if (badge) {
    const itemCount = 1 + (panelCount > 0 ? 1 : 0);
    badge.textContent = `${itemCount}`;
    badge.classList.remove('hidden');
  }

  shortcut.classList.remove('hidden');
  if (cartPopupVisible) {
    renderCartPopup();
  }
}

function updateComparison() {
  const kit = getRecommendedKit();
  refs.batteryBenefits.innerHTML = '';
  refs.generatorDrawbacks.innerHTML = '';

  if (!kit || state.totals.totalWh === 0) {
    const li = document.createElement('li');
    li.textContent = 'Selecciona un escenario para comparar tu kit con un generador.';
    refs.batteryBenefits.appendChild(li);

    const liGen = document.createElement('li');
    liGen.classList.add('bad');
    liGen.textContent = 'Los generadores requieren combustible, ruido y mantención constante.';
    refs.generatorDrawbacks.appendChild(liGen);
    return;
  }

  const { totalWh, outdoorWh } = state.totals;
  const energyForFuel = state.useCase === 'outdoor' && outdoorWh > 0 ? outdoorWh : totalWh;
  const generatorFuelCost = (energyForFuel / 1000) * 0.35 * 1300 * state.outageFrequency; // simple approximation

  const benefits = [];
  if (state.useCase === 'outdoor') {
    const outdoorAutonomyDays = state.totals.outdoorWh > 0 ? kit.capacityWh / state.totals.outdoorWh : 0;
    benefits.push(`Modo outdoor (${state.outdoorHoursPerDay} h/día): ${formatDays(outdoorAutonomyDays)} antes de recargar.`);
    benefits.push('Funciona en silencio total, ideal para campamentos, vans y zonas protegidas.');
  } else {
    benefits.push(`Autonomía estimada: ${formatHours(state.totals.peakW > 0 ? kit.capacityWh / state.totals.peakW : 0)} con tus cargas críticas.`);
  }
  benefits.push(`Recarga desde red en ${formatHours(kit.capacityWh / (kit.acChargeW * constants.chargeEff))}.`);
  benefits.push(
    state.panelCount > 0
      ? `Recuperas hasta ${(Math.min(100, (state.panelCount * getPanelWatt() * constants.solarDerating * getRegion().psh) / kit.capacityWh * 100)).toFixed(0)}% diarios vía solar.`
      : state.useCase === 'outdoor'
        ? 'Agrega un panel plegable de 200 W para extender tu autonomía fuera de la red.'
        : 'Agrega paneles solares para aprovechar el sol y reducir tu dependencia de la red.'
  );
  benefits.push(`Inversión total: ${formatCurrency(kit.price)} con garantía local.`);
  benefits.push('Sin ruido (0 dB), sin humo y uso interior seguro.');
  benefits.forEach((benefit) => {
    const li = document.createElement('li');
    li.textContent = benefit;
    refs.batteryBenefits.appendChild(li);
  });

  const drawbacks = state.useCase === 'outdoor'
    ? [
      'Un generador portátil equivalente supera los 70 dB y perturba campamentos y áreas protegidas.',
      'Debes transportar bencina y aceite, con riesgo de derrames en tu vehículo.',
      'No puedes usarlo dentro de la carpa o van: emite CO₂ y monóxido.',
      'Requiere mantención frecuente y espacio extra para almacenamiento.'
    ]
    : [
      'Riesgo de ruido >70 dB y emisiones en interiores.',
      `Costo mensual estimado en gasolina: ${formatCurrency(generatorFuelCost)} (suponiendo cortes declarados).`,
      'Mantención periódica (cambios de aceite, filtros) y almacenamiento de combustible.',
      'No puedes usarlo dentro de casa o departamentos.'
    ];
  drawbacks.forEach((drawback) => {
    const li = document.createElement('li');
    li.classList.add('bad');
    li.textContent = drawback;
    refs.generatorDrawbacks.appendChild(li);
  });
}

function updateWhatsApp(selectedLoads) {
  const kit = getRecommendedKit();
  if (!kit) return;
  const region = getRegion();
  const loadList = selectedLoads.map((load) => `• ${load.name}: ${load.power} W x ${load.hours} h`).join('%0A');
  const message = encodeURIComponent(
    `Hola! Quiero cotizar el ${kit.name} de EntropyEnergy.%0A%0A` +
    `Zona: ${region.name} (${region.psh.toFixed(1)} h sol).%0A` +
    `Uso principal: ${state.useCase === 'outdoor' ? 'Outdoor & Expediciones' : 'Hogar / Pyme'}.%0A` +
    (state.useCase === 'outdoor' ? `Horas outdoor por día: ${state.outdoorHoursPerDay}.%0A` : '') +
    `Autonomía objetivo: ${state.daysAutonomy.toFixed(1)} días.%0A` +
    `Paneles considerados: ${describePanels(state.panelCount)}.%0A` +
    `Cargas críticas:%0A${loadList}%0A%0A` +
    `¿Me ayudan a cerrar la compra?`
  );
  refs.whatsappLink.href = `https://wa.me/56900000000?text=${message}`;
}

function renderGeneratorFacts() {
  refs.generatorDrawbacks.innerHTML = '';
}

// Mobile Menu Toggle - Rewritten
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');

if (navToggle && mobileMenu && mobileMenuOverlay) {
  function toggleMenu() {
    const isActive = mobileMenu.classList.contains('active');
    navToggle.classList.toggle('active', !isActive);
    mobileMenu.classList.toggle('active', !isActive);
    mobileMenuOverlay.classList.toggle('active', !isActive);
    document.body.style.overflow = isActive ? '' : 'hidden';
  }

  function closeMenu() {
    navToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMenu);
  mobileMenuOverlay.addEventListener('click', closeMenu);

  mobileMenuLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

init().catch((error) => {
  console.error('No se pudo inicializar el planificador', error);
});
