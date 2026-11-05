import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { getMarkdown, getFile } from '~/utils/library';
import { useMarkedParse } from '~/hooks/useMarkedParse';
import { useViewPortIn } from './useViewPortIn';
import { cacheUrl, listenErrorUpdateCache } from '~/stores/cache';
import { getDom } from '~/utils/dom';

export function useRenderMarkdown(selector) {
  const route = useRoute();
  const { viewPortIn } = useViewPortIn();
  const { markedParse } = useMarkedParse();
  const elements = ref();
  const isLoading = ref(false);
  const pathString = ref('');
  const directory = ref('');
  const title = ref('');

  const loadImageEnd = (el, elp, url) => {
    elp.setAttribute('data-src', url);
    el.src = url;
  };

  const loadImage = (el, elp, src, beforeHook) => {
    const cacheTargetUrl =
      cacheUrl.value[`/hymnal-library/${pathString.value}/${src}`];
    if (cacheTargetUrl) {
      if (beforeHook) beforeHook(cacheTargetUrl);
      loadImageEnd(el, elp, cacheTargetUrl);
    } else {
      getFile(`/hymnal-library/${pathString.value}/${src}`).then(
        ({ raw_url }) => {
          if (beforeHook) beforeHook(raw_url);
          loadImageEnd(el, elp, raw_url);
          cacheUrl.value[`/hymnal-library/${pathString.value}/${src}`] =
            raw_url;
        },
      );
    }
    listenErrorUpdateCache(el, `/hymnal-library/${pathString.value}/${src}`);
  };

  onMounted(() => {
    isLoading.value = false;
    pathString.value = route.query.path;
    const pathArray = pathString.value.split('/');
    title.value = pathArray[pathArray.length - 1];
    let observer = null;
    getMarkdown(pathString.value).then(content => {
      directory.value = pathString.value.replace(title.value, '');
      const html = markedParse({
        title: title.value,
        content,
      });
      elements.value = html;
      isLoading.value = true;
      observer = viewPortIn(html.querySelectorAll('img, video'), entry => {
        const el = entry.target;
        const elp = el.nodeName === 'VIDEO' ? el : el.parentNode;
        const src =
          el.nodeName === 'VIDEO'
            ? elp.getAttribute('data-src')
            : elp.getAttribute('target-src');
        if (!/(http:\/\/|https:\/\/|:\/\/)/.test(src)) {
          if (el.nodeName === 'VIDEO') {
            const { href } = new URL(
              `https://mfbt5siz.cn-nb1.rainapp.top/d/hymnal-library/${pathString.value}/${src}`,
            );
            el.src = href;
          } else {
            loadImage(el, elp, src);
          }
        }
        observer.unobserve(el);
      });
      for (const el of html.querySelectorAll('audio')) {
        const src = el.getAttribute('data-src');
        const lazyMedia = () => {
          el.removeEventListener('play', lazyMedia);
          el.src = '';
          el.src = '/resources/silent.mp3';
          const { href } = new URL(
            `https://mfbt5siz.cn-nb1.rainapp.top/d/hymnal-library/${pathString.value}/${src}`,
          );
          el.src = href;
          el.play();
        };
        if (!/(http:\/\/|https:\/\/|:\/\/)/.test(src)) {
          el.addEventListener('play', lazyMedia);
        }
      }
      document.querySelector(selector).appendChild(html);
      Fancybox.bind('[data-fancybox="gallery"]', {
        on: {
          'Carousel.change': fancybox => {
            const slide = fancybox.getSlide();
            if (slide.thumbSrc === '/resources/transparent.png') {
              loadImage(
                slide.thumbEl,
                slide.triggerEl,
                slide.triggerEl.getAttribute('target-src'),
                url => {
                  const imgLoadHandler = () => {
                    const naturalWidth = slide.thumbEl.naturalWidth;
                    const naturalHeight = slide.thumbEl.naturalHeight;
                    getDom(slide.el, '.f-panzoom__wrapper').then($wrapper => {
                      $wrapper.style.aspectRatio = `${naturalWidth / naturalHeight} / 1`;
                      $wrapper.width = naturalWidth;
                      $wrapper.height = naturalHeight;
                      const $imgLazyloaded =
                        $wrapper.querySelector('img.is-lazyloaded');
                      $imgLazyloaded.width = naturalWidth;
                      $imgLazyloaded.height = naturalHeight;
                      $imgLazyloaded.src = url;
                      const $fViewport = $wrapper.querySelector(
                        '.f-panzoom__viewport',
                      );
                      $fViewport.style.height = `${(naturalHeight / naturalWidth) * $fViewport.style.width.replace('px', '')}px`;
                      $fViewport.querySelector('img').src = url;
                      document.querySelector(
                        `.fancybox__dialog .f-thumbs .f-thumbs__slide[index="${slide.index}"] img`,
                      ).src = url;
                    });
                    slide.thumbSrc = url;
                    slide.thumbEl.removeEventListener('load', imgLoadHandler);
                  };
                  slide.thumbEl.addEventListener('load', imgLoadHandler);
                  observer.unobserve(slide.thumbEl);
                },
              );
            }
          },
        },
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
