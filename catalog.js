const STORAGE_KEY = 'entropyEnergy.catalogOverride';
let cachedCatalog = null;

function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (error) {
    // localStorage no disponible
  }
  return null;
}

function parseCatalog(raw) {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
}

async function fetchBaseCatalog() {
  const response = await fetch('data/products.json', { cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`No se pudo cargar data/products.json (estado ${response.status})`);
  }
  return response.json();
}

export async function loadCatalog() {
  if (cachedCatalog) {
    return cachedCatalog;
  }
  const storage = getStorage();
  const override = storage ? parseCatalog(storage.getItem(STORAGE_KEY)) : null;
  if (override) {
    cachedCatalog = override;
    return override;
  }
  const baseCatalog = await fetchBaseCatalog();
  cachedCatalog = baseCatalog;
  return baseCatalog;
}

export function saveCatalog(data) {
  if (!Array.isArray(data)) {
    throw new Error('El catálogo debe ser un arreglo de productos.');
  }
  const storage = getStorage();
  if (!storage) {
    throw new Error('No hay acceso a localStorage en este navegador.');
  }
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
  cachedCatalog = data;
}

export function clearCatalogOverride() {
  const storage = getStorage();
  if (storage) {
    storage.removeItem(STORAGE_KEY);
  }
  cachedCatalog = null;
}

export function getProductById(catalog, id) {
  if (!Array.isArray(catalog)) return null;
  return catalog.find((item) => item.id === id) || null;
}
