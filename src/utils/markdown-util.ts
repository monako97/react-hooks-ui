/* eslint-disable no-unused-vars */
import marked from 'marked-completed';
import { entityToString } from './document';
import '../lib/prism.js';
import '../lib/inline-color';
import '../lib/line-numbers';
import '../lib/diff-highlight';

marked.setOptions({
  highlight: function (code: string, lang: string) {
    const LANGUAGE_REGEX = /^diff-([\w-]+)/i;

    if (window.Prism.languages[lang]) {
      return window.Prism.highlight(code, window.Prism.languages[lang], lang);
    } else if (LANGUAGE_REGEX.test(lang)) {
      window.Prism.languages[lang] = window.Prism.languages.diff;
      return window.Prism.highlight(code, window.Prism.languages[lang], lang);
    }
    return window.Prism.highlight(code, window.Prism.languages.markup, 'markup');
  },
  headerPrefix: '# ',
  langLineNumber: true,
  langToolbar: ['copy'],
  breaks: true,
  pedantic: false,
  smartLists: true,
  smartypants: true,
  xhtml: true
});

/**
 * Markdown to Html
 * @param {string} text Markdown文本
 * @param {MarkedOptions} option MarkedOptions
 * @returns {string} Html文本
 */
export const markdownUtil = (text: string, option: marked.MarkedOptions = {}): string => {
  return marked(text, option);
};

interface MarkedImageListType {
  ids: number;
  intro: string;
  src: string;
}
/**
 * 提取md图片src
 * @param {string} text HTML string
 * @returns {MarkedImageListType[]} 链接list
 */
export const getMarkedImgList = (text: string): MarkedImageListType[] | null => {
  if (!text) return null;
  let imageList = text.match(/role=('|")dialog('|") src=('|")(.*?) alt=('|")(.*?)('|")/g);
  const imageArr = [];

  if (imageList) {
    for (let i = 0, len = imageList.length; i < len; i++) {
      let params: URLSearchParams | null = new URLSearchParams(
        entityToString(
          imageList[i].replace(/('|")/g, '').replace(/ src=/, '&src=').replace(/ alt=/, '&alt=')
        )
      );

      imageArr.push({
        ids: i,
        intro: params.get('alt') || '',
        src: params.get('src') || ''
      });
      params = null;
    }
  }
  imageList = null;
  return imageArr;
};
