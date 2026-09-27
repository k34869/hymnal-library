/**
 * 不重复随机数生成
 * @param {number} min 最小数
 * @param {number} max 最大数
 * @param {number} count 个数
 * @return {Array} 生成结果
 */
export function uniqueRandoms(min, max, count) {
  if (min > max) throw new Error('min 必须 <= max');
  const rangeSize = max - min + 1;
  if (count > rangeSize)
    throw new Error(
      `无法生成 ${count} 个不重复随机数，因为范围大小只有 ${rangeSize}`,
    );

  const arr = Array.from({ length: rangeSize }, (_, i) => min + i);

  for (let i = rangeSize - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.slice(0, count);
}

/**
 * 通过字符串创建 Element
 * @param {string} string 元素字符串
 * @return {Element} 元素
 */
export function $(string) {
  const container = document.createElement('div');
  container.innerHTML = string;
  return container;
}

/**
 * 版本号对比
 * @param {string} v1 版本1
 * @param {string} v2 版本2
 * @return {number} (1: v1 > v2), (0: v1 = v2), (-1: v1 < v2)
 */
export function compareVersion(v1, v2) {
  const a1 = v1.split('.').map(Number);
  const a2 = v2.split('.').map(Number);

  const len = Math.max(a1.length, a2.length);

  for (let i = 0; i < len; i++) {
    const n1 = a1[i] ?? 0;
    const n2 = a2[i] ?? 0;

    if (n1 > n2) return 1;
    if (n1 < n2) return -1;
  }

  return 0;
}

/**
 * 数据持久化
 * @param {any} initialValue 初始值
 * @param {string} [key='localState'] localStorage 存储 key
 * @return {Proxy} 持久化数据( 通过 .value 访问 )
 */
export function persVer(initialValue, key = 'localState') {
  // 1️⃣ 初始化：优先从 localStorage 读取
  const saved = localStorage.getItem(key);
  let state = saved ? JSON.parse(saved) : initialValue;

  // 2️⃣ 持久化函数
  const persist = () => {
    localStorage.setItem(key, JSON.stringify(state));
  };

  // 3️⃣ 深度代理（核心）
  const deepProxy = target => {
    if (typeof target !== 'object' || target === null) return target;

    return new Proxy(target, {
      get(obj, prop) {
        const value = obj[prop];
        // 递归代理，保证深层对象也能监听
        return deepProxy(value);
      },

      set(obj, prop, value) {
        obj[prop] = value;
        persist(); // 每次修改自动存储
        return true;
      },

      deleteProperty(obj, prop) {
        delete obj[prop];
        persist();
        return true;
      },
    });
  };

  // 4️⃣ 对外暴露一个 value 属性（模仿 Vue ref）
  const wrapper = {
    get value() {
      return deepProxy(state);
    },
    set value(v) {
      state = v;
      persist();
    },
  };

  return wrapper;
}
