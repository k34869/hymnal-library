import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getMarkdownWeb, getFile } from '~/utils/library';
import { useMarkedParse } from '~/hooks/useMarkedParse';
import { useViewPortIn } from './useViewPortIn';
import { cacheUrl, listenErrorUpdateCache } from '~/stores/cache';

export function useRenderMarkdownWeb(selector) {
  const { viewPortIn } = useViewPortIn();
  const { markedParse } = useMarkedParse();
  const elements = ref();
  const isLoading = ref(false);
  const pathString = ref('');
  const directory = ref('');
  const title = ref('');

  const loadImage = (el, elp, url) => {
    elp.setAttribute('data-src', url);
    elp.classList.remove('skeleton');
    el.setAttribute('src', url);
    el.classList.remove('hidden');
  };

  onMounted(() => {
    isLoading.value = false;
    pathString.value = decodeURIComponent(location.hash).replace('#/', '');
    if (pathString.value === '') {
      location.href = 'https://hymnal.timeic.top/home.html';
      return;
    }
    const pathArray = pathString.value.split('/');
    title.value = pathArray[pathArray.length - 1];
    getMarkdownWeb(pathString.value).then(content => {
      document.title = `${title.value} - ${pathArray[0]}`;
      directory.value = pathString.value.replace(title.value, '');
      const html = markedParse({
        title: title.value,
        content,
      });
      elements.value = html;
      isLoading.value = true;
      viewPortIn(html.querySelectorAll('img, video'), (entry, observer) => {
        const el = entry.target;
        const elp = el.nodeName === 'VIDEO' ? el : el.parentNode;
        const src = elp.getAttribute('data-src');
        if (!/(http:\/\/|https:\/\/|:\/\/)/.test(src)) {
          if (el.nodeName === 'VIDEO') {
            const { href } = new URL(
              `https://mfbt5siz.cn-nb1.rainapp.top/d/hymnal-library/${pathString.value}/${src}`,
            );
            el.setAttribute('src', href);
          } else {
            if (cacheUrl.value[`/hymnal-library/${pathString.value}/${src}`]) {
              loadImage(
                el,
                elp,
                cacheUrl.value[`/hymnal-library/${pathString.value}/${src}`],
              );
            } else {
              getFile(`/hymnal-library/${pathString.value}/${src}`).then(
                ({ raw_url }) => {
                  loadImage(el, elp, raw_url);
                  cacheUrl.value[`/hymnal-library/${pathString.value}/${src}`] =
                    raw_url;
                },
              );
            }
            listenErrorUpdateCache(
              el,
              `/hymnal-library/${pathString.value}/${src}`,
            );
          }
        }
        observer.unobserve(entry.target);
      });
      for (const el of html.querySelectorAll('audio')) {
        const src = el.getAttribute('data-src');
        const lazyMedia = () => {
          el.removeEventListener('play', lazyMedia);
          el.setAttribute('src', '');
          el.setAttribute('src', '/resources/silent.mp3');
          const { href } = new URL(
            `https://mfbt5siz.cn-nb1.rainapp.top/d/hymnal-library/${pathString.value}/${src}`,
          );
          el.setAttribute('src', href);
          el.play();
        };
        if (!/(http:\/\/|https:\/\/|:\/\/)/.test(src)) {
          el.addEventListener('play', lazyMedia);
        }
      }
      document.querySelector(selector).appendChild(html);
      Fancybox.bind('[data-fancybox="gallery"]', {
        placeFocusBack: false,
        Carousel: {
          Thumbs: true,
          Toolbar: {
            display: {
              left: [],
              middle: [],
              right: [],
            },
          },
          Zoomable: {
            Panzoom: {
              mouseMoveFactor: 1.1,
            },
          },
        },
      });
    });
  });

  onBeforeUnmount(() => {
    if (isLoading.value) {
      for (const el of elements.value.querySelectorAll('video, audio')) {
        el.pause();
        el.src = '';
        el.load();
        el.remove();
      }
      elements.value.remove();
      elements.value = null;
      Fancybox.unbind('[data-fancybox="gallery"]');
      directory.value = '';
      title.value = '';
    }
  });

  return {
    elements,
    isLoading,
    pathString,
    directory,
    title,
  };
}
