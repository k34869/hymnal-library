import { Document } from 'flexsearch';
import { data } from '../assets/json/db.json';

const DB_NAME = 'flexsearch-cache';
const STORE_NAME = 'indexes';
const CACHE_VERSION = '1';

function createIndex() {
  return new Document({
    document: {
      id: 'id',
      index: ['name', 'description'],
      store: ['name', 'description', 'category', 'path', 'type'],
    },
    tokenize: 'full',
    encode: str =>
      str
        .trim()
        .toLowerCase()
        .split(/[\p{Z}\p{S}\p{P}\p{C}]+/u),
    resolution: 9,
  });
}

// IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// 保存单个键值
async function put(key, value) {
  const db = await openDB();

  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(value, key);

    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

// 读取所有缓存
async function getAll() {
  const db = await openDB();

  try {
    const store = db
      .transaction(STORE_NAME, 'readonly')
      .objectStore(STORE_NAME);

    const [keys, values] = await Promise.all([
      requestResult(store.getAllKeys()),
      requestResult(store.getAll()),
    ]);

    return Object.fromEntries(keys.map((key, i) => [key, values[i]]));
  } finally {
    db.close();
  }
}

// 清空缓存
async function clearCache() {
  const db = await openDB();

  try {
    await requestResult(
      db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).clear(),
    );
  } finally {
    db.close();
  }
}

// 导出索引到 IndexedDB
async function saveIndex(index) {
  await clearCache();

  // 保存缓存版本
  await put('__version__', CACHE_VERSION);

  await index.export(async (key, value) => {
    await put(key, value);
  });
}

// 从 IndexedDB 恢复索引
async function loadIndex(index) {
  const cache = await getAll();

  if (cache.__version__ !== CACHE_VERSION) {
    return false;
  }

  const keys = Object.keys(cache).filter(key => key !== '__version__');

  if (!keys.length) {
    return false;
  }

  for (const key of keys) {
    await index.import(key, cache[key]);
  }

  return true;
}

// 初始化搜索
async function initSearch() {
  const index = createIndex();

  try {
    // 优先恢复缓存
    const cached = await loadIndex(index);

    if (cached) {
      console.log('FlexSearch：已恢复 IndexedDB 缓存');
      return index;
    }
  } catch (error) {
    console.warn('索引缓存恢复失败，重新构建', error);
  }

  // 缓存不存在或恢复失败，重新构建
  for (const item of data) {
    index.add(item);
  }

  // 保存索引
  await saveIndex(index);

  console.log('FlexSearch：索引构建完成并已缓存');

  return index;
}

const index = await initSearch();

function search(query, field = ['name', 'description'], isHighlight = true) {
  const maps = {};
  const results = index.search(query, {
    limit: 24,
    enrich: true,
  });

  const reg = new RegExp(`(${query})`, 'gi');
  for (const item of results) {
    if (field.includes(item.field)) {
      for (const e of item.result) {
        if (!maps[e.id]) {
          maps[e.id] = Object.assign({}, e.doc);
        }
        maps[e.id].id = e.id;
        maps[e.id].name = isHighlight
          ? e.doc.name.replace(reg, `<span class="mark">$1</span>`)
          : e.doc.name;
        maps[e.id].description = isHighlight
          ? e.doc.description.replace(reg, `<span class="mark">$1</span>`)
          : e.doc.description;
      }
    }
  }
  return Object.values(maps);
}

export { search, data };
