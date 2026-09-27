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

  const loadImageVideo = (el, elp, url) => {
    if (el.nodeName === 'VIDEO') {
      el.setAttribute('src', url);
      el.removeAttribute('controlsList');
    } else {
      elp.setAttribute('data-src', url);
      elp.classList.remove('skeleton');
      el.setAttribute('src', url);
      el.classList.remove('hidden');
    }
  };

  onMounted(() => {
    isLoading.value = false;
    pathString.value = decodeURIComponent(location.hash).replace('#/', '');
    getMarkdownWeb(pathString.value).then(content => {
      const pathArray = pathString.value.split('/');
      title.value = pathArray[pathArray.length - 1];
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
          if (cacheUrl.value[`/hymnal-library/${pathString.value}/${src}`]) {
            loadImageVideo(
              el,
              elp,
              cacheUrl.value[`/hymnal-library/${pathString.value}/${src}`],
            );
          } else {
            getFile(`/hymnal-library/${pathString.value}/${src}`).then(
              ({ raw_url }) => {
                loadImageVideo(el, elp, raw_url);
                if (el.nodeName !== 'VIDEO') {
                  cacheUrl.value[`/hymnal-library/${pathString.value}/${src}`] =
                    raw_url;
                }
              },
            );
          }
          listenErrorUpdateCache(
            el,
            `/hymnal-library/${pathString.value}/${src}`,
          );
        }
        observer.unobserve(entry.target);
      });
      for (const el of html.querySelectorAll('audio')) {
        const src = el.getAttribute('data-src');
        const lazyMedia = () => {
          el.removeEventListener('play', lazyMedia);
          el.setAttribute('src', '');
          el.setAttribute('src', '/resources/silent.mp3');
          if (!/(http:\/\/|https:\/\/|:\/\/)/.test(src)) {
            getFile(`/hymnal-library/${pathString.value}/${src}`).then(
              ({ raw_url }) => {
                el.setAttribute('src', raw_url);
                el.removeAttribute('controlsList');
                el.play();
              },
            );
          }
        };
        el.addEventListener('play', lazyMedia);
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
