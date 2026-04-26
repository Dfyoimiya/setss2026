import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchIndex } from '@/data/searchIndex';
import { useLanguage } from './useLanguage';

export interface SearchResult {
  item: typeof searchIndex[number];
  score: number;
  highlights: string[]; // 匹配到的高亮片段
}

export function useGlobalSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  /**
   * 执行搜索，返回按相关性排序的结果列表
   */
  const search = useCallback((query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const q = query.toLowerCase().trim();
    const qWords = q.split(/\s+/).filter((w) => w.length > 0);
    const results: SearchResult[] = [];

    for (const item of searchIndex) {
      let score = 0;
      const highlights: string[] = [];

      const title = item.title[lang].toLowerCase();
      const content = item.content[lang].toLowerCase();
      const allKeywords = item.keywords.join(' ').toLowerCase();

      // 1. 精确标题匹配（权重最高）
      if (title.includes(q)) {
        score += 20;
        highlights.push(item.title[lang]);
      } else {
        // 标题分词匹配
        for (const word of qWords) {
          if (word.length >= 2 && title.includes(word)) {
            score += 8;
          }
        }
      }

      // 2. 内容精确匹配
      if (content.includes(q)) {
        score += 10;
        // 提取匹配上下文
        const idx = content.indexOf(q);
        const start = Math.max(0, idx - 30);
        const end = Math.min(content.length, idx + q.length + 40);
        let excerpt = item.content[lang].slice(start, end);
        if (start > 0) excerpt = '…' + excerpt;
        if (end < content.length) excerpt = excerpt + '…';
        highlights.push(excerpt);
      }

      // 3. 内容分词匹配
      for (const word of qWords) {
        if (word.length >= 2 && content.includes(word)) {
          score += 4;
          if (highlights.length < 2) {
            const idx = content.indexOf(word);
            const start = Math.max(0, idx - 25);
            const end = Math.min(content.length, idx + word.length + 35);
            let excerpt = item.content[lang].slice(start, end);
            if (start > 0) excerpt = '…' + excerpt;
            if (end < content.length) excerpt = excerpt + '…';
            if (!highlights.includes(excerpt)) highlights.push(excerpt);
          }
        }
      }

      // 4. 关键词匹配
      for (const kw of item.keywords) {
        const kwLow = kw.toLowerCase();
        if (kwLow.includes(q) || q.includes(kwLow)) {
          score += 6;
          if (!highlights.includes(kw)) highlights.push(kw);
        }
        for (const word of qWords) {
          if (word.length >= 2 && kwLow.includes(word)) {
            score += 3;
          }
        }
      }

      // 5. 全文本模糊匹配（字符覆盖率）
      const allText = `${title} ${content} ${allKeywords}`;
      const qChars = [...new Set(q.split(''))];
      const matchCount = qChars.filter((c) => allText.includes(c)).length;
      if (matchCount >= qChars.length * 0.6) {
        score += 1;
      }

      // 6. 多词同时命中加分
      const matchedWords = qWords.filter(
        (w) => w.length >= 2 && (title.includes(w) || content.includes(w) || allKeywords.includes(w))
      );
      if (matchedWords.length >= 2) {
        score += matchedWords.length * 2;
      }

      if (score > 0) {
        results.push({ item, score, highlights: highlights.slice(0, 2) });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, 8);
  }, [lang]);

  /**
   * 获取搜索结果的类型标签与图标颜色
   */
  const getResultMeta = useCallback((type: string) => {
    switch (type) {
      case 'person':
        return { label: 'Speaker', labelZh: '讲者', color: '#1a365d', bg: '#1a365d10' };
      case 'topic':
        return { label: 'Course', labelZh: '课程', color: '#2d5a4a', bg: '#2d5a4a10' };
      case 'hotel':
        return { label: 'Hotel', labelZh: '酒店', color: '#7a5c20', bg: '#7a5c2010' };
      case 'transport':
        return { label: 'Transport', labelZh: '交通', color: '#5c4033', bg: '#5c403310' };
      default:
        return { label: 'Page', labelZh: '页面', color: '#8a8680', bg: '#8a868010' };
    }
  }, []);

  /**
   * 获取结果所在页面名称
   */
  const getPageLabel = useCallback((page: string) => {
    const map: Record<string, { en: string; zh: string }> = {
      '/': { en: 'Home', zh: '首页' },
      '/courses': { en: 'Courses', zh: '课程' },
      '/committee': { en: 'Committee', zh: '组委会' },
      '/registration': { en: 'Registration', zh: '注册' },
      '/previous-editions': { en: 'History', zh: '往届' },
      '/transportation': { en: 'Transport', zh: '交通' },
      '/accommodation': { en: 'Hotels', zh: '住宿' },
    };
    return map[page] || { en: page, zh: page };
  }, []);

  /**
   * 跳转到搜索结果对应位置
   */
  const goToResult = useCallback((result: SearchResult) => {
    const { item } = result;
    const isSamePage = location.pathname === item.page;

    if (isSamePage) {
      // 同页滚动
      const el = document.getElementById(item.sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // 跨页跳转，携带锚点参数
      navigate(`${item.page}?scrollTo=${item.sectionId}`);
    }
  }, [location.pathname, navigate]);

  return { search, goToResult, getResultMeta, getPageLabel };
}

/**
   * 在文本中高亮匹配的关键词（返回 React 可用的数组，这里返回标注后的字符串数组）
   */
export function highlightMatches(text: string, query: string): string {
  if (!query.trim()) return text;
  const q = query.toLowerCase().trim();
  const qWords = q.split(/\s+/).filter((w) => w.length >= 2);

  let result = text;
  const markers: { start: number; end: number }[] = [];

  // 收集所有匹配区间
  for (const word of [q, ...qWords]) {
    if (!word) continue;
    let pos = result.toLowerCase().indexOf(word);
    while (pos !== -1) {
      markers.push({ start: pos, end: pos + word.length });
      pos = result.toLowerCase().indexOf(word, pos + 1);
    }
  }

  // 合并重叠区间
  markers.sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [];
  for (const m of markers) {
    const last = merged[merged.length - 1];
    if (last && m.start <= last.end) {
      last.end = Math.max(last.end, m.end);
    } else {
      merged.push({ ...m });
    }
  }

  // 构建带标记的字符串
  let highlighted = '';
  let lastEnd = 0;
  for (const m of merged) {
    highlighted += result.slice(lastEnd, m.start);
    highlighted += `<<HL>>${result.slice(m.start, m.end)}<</HL>>`;
    lastEnd = m.end;
  }
  highlighted += result.slice(lastEnd);

  return highlighted;
}