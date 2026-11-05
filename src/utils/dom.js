export async function getDom(
  parentNode = document,
  selector = 'body',
  timeout = 3000,
) {
  return new Promise((resolve, reject) => {
    try {
      let timeBrack, timer;
      timer = setInterval(() => {
        const el = parentNode.querySelector(selector);
        if (el) {
          clearInterval(timer);
          clearTimeout(timeBrack);
          resolve(el);
        }
      }, 50);
      timeBrack = setTimeout(() => {
        clearInterval(timer);
        clearTimeout(timeBrack);
        reject(`'${selector}' DOM find not found`);
      }, timeout);
    } catch (err) {
      reject(err.message);
    }
  });
}
