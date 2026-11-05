import { marked } from 'marked';
import { $ } from '~/utils/utils';

export function useMarkedParse() {
  const setRenderer = () => {
    const renderer = {
      image({ href, text, title }) {
        let url = href;
        return `<a data-fancybox="gallery" target-src="${url}" data-src="/resources/transparent.png" ${
          title ? 'title="' + title + '"' : ''
        }><img src="/resources/transparent.png" alt="${text}" class="image" /></a>`;
      },
    };

    marked.use({ renderer });
  };

  const markedParse = (options = {}) => {
    const { title, content } = options;
    setRenderer();
    const titleContent = `<h2 class="title">${title}</h2>`;
    const html = marked.parse(content);
    const elements = $(titleContent + html);
    for (const el of elements.querySelectorAll('audio, video')) {
      const src = el.getAttribute('src');
      el.setAttribute('data-src', src);
      el.setAttribute('controlsList', 'nodownload');
      el.setAttribute(
        'src',
        el.nodeName === 'AUDIO' ? '/resources/silent.mp3' : '',
      );
    }
    return elements;
  };

  return { markedParse };
}
