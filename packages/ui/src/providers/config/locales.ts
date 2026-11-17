import { ko } from 'date-fns/locale';

import type { ResolvedLocale } from './types';

// The default locale. Every component falls back to it for any text the
// nearest Config's `locale` leaves out.
export const enUS: ResolvedLocale = {
  close: 'Close',
  clear: 'Clear',
  backToTop: 'Back to top',
  loading: 'Loading',
  expand: 'Expand',
  collapse: 'Collapse',
  back: 'Back',
  ok: 'OK',
  cancel: 'Cancel',
  retry: 'Retry',
  loadFailed: 'Failed to load',
  preview: 'Preview',
  search: 'Search',
  searchPlaceholder: 'Search...',
  noData: 'No data',
  noResults: 'No results found.',
  Anchor: { label: 'On this page' },
  AutoComplete: { empty: 'No suggestions' },
  Breadcrumb: { label: 'Breadcrumb', expand: 'Show path' },
  Cascader: {
    placeholder: 'Choose a path',
    clear: 'Clear selection',
    empty: 'No options',
  },
  DatePicker: { placeholder: 'Pick a date', time: 'Time' },
  InputNumber: { decrease: 'Decrease value', increase: 'Increase value' },
  Mentions: { loading: 'Loading suggestions…', empty: 'No suggestions' },
  Pagination: {
    navigation: 'Pagination',
    page: 'Page {page}',
    previous: 'Previous page',
    next: 'Next page',
    first: 'First page',
    last: 'Last page',
    pageSize: 'Items per page',
    pageSizeOption: '{size} / page',
    jump: 'Jump to page',
    go: 'Go',
  },
  Popconfirm: {
    confirm: 'Confirm',
    error: 'Unable to complete the action. Please try again.',
  },
  RichTextEditor: {
    placeholder: 'Enter text...',
    link: 'Link',
    undo: 'Undo',
    redo: 'Redo',
    bold: 'Bold',
    italic: 'Italic',
    underline: 'Underline',
    strikethrough: 'Strikethrough',
    inlineCode: 'Inline code',
    bulletList: 'Bullet list',
    orderedList: 'Ordered list',
    blockquote: 'Blockquote',
    codeBlock: 'Code block',
    horizontalRule: 'Horizontal rule',
    style: 'Style',
    paragraph: 'Paragraph',
    heading: 'Heading {level}',
    fontSize: 'Size',
    apply: 'Apply',
  },
  Select: { placeholder: 'Select options' },
  Steps: { label: 'Progress' },
  Tabs: { list: 'Tabs' },
  TimePicker: { clear: 'Clear time' },
  Tour: {
    previous: 'Previous',
    next: 'Next',
    finish: 'Finish',
    close: 'Close tour',
    progress: 'Step {current} of {total}',
  },
  Transfer: {
    moveToChosen: 'Move to chosen',
    moveToAvailable: 'Move to available',
    selectAll: 'Select all visible items',
    empty: 'No items',
    count: '{visible} of {total} items, {selected} selected',
  },
  Tree: { label: 'Tree', empty: 'No nodes' },
  TreeSelect: {
    placeholder: 'Choose a node',
    popup: 'Choose a node',
    empty: 'No nodes',
  },
  Upload: {
    hint: 'Click or drag a file to upload',
    hintMultiple: 'Click or drag files to upload',
    remove: 'Remove {name}',
  },
};

// Korean, including the date-fns locale for DatePicker's formatted date.
export const koKR: ResolvedLocale = {
  close: '닫기',
  clear: '지우기',
  backToTop: '맨 위로',
  loading: '로딩 중',
  expand: '펼치기',
  collapse: '접기',
  back: '뒤로가기',
  ok: '확인',
  cancel: '취소',
  retry: '다시 시도',
  loadFailed: '불러오지 못함',
  preview: '미리보기',
  search: '검색',
  searchPlaceholder: '검색...',
  noData: '데이터 없음',
  noResults: '검색 결과가 없습니다.',
  Anchor: { label: '이 페이지의 목차' },
  AutoComplete: { empty: '추천 항목 없음' },
  Breadcrumb: { label: '이동 경로', expand: '경로 보기' },
  Cascader: {
    placeholder: '경로 선택',
    clear: '선택 지우기',
    empty: '옵션 없음',
  },
  DatePicker: { placeholder: '날짜 선택', time: '시간', dateLocale: ko },
  InputNumber: { decrease: '값 줄이기', increase: '값 늘리기' },
  Mentions: { loading: '추천 항목을 불러오는 중…', empty: '추천 항목 없음' },
  Pagination: {
    navigation: '페이지 탐색',
    page: '{page}페이지',
    previous: '이전 페이지',
    next: '다음 페이지',
    first: '첫 페이지',
    last: '마지막 페이지',
    pageSize: '페이지당 항목 수',
    pageSizeOption: '{size}개 / 페이지',
    jump: '페이지로 이동',
    go: '이동',
  },
  Popconfirm: {
    confirm: '확인',
    error: '작업을 완료하지 못했습니다. 다시 시도해 주세요.',
  },
  RichTextEditor: {
    placeholder: '내용을 입력하세요...',
    link: '링크',
    undo: '실행 취소',
    redo: '다시 실행',
    bold: '굵게',
    italic: '기울임꼴',
    underline: '밑줄',
    strikethrough: '취소선',
    inlineCode: '인라인 코드',
    bulletList: '글머리 기호 목록',
    orderedList: '번호 매기기 목록',
    blockquote: '인용',
    codeBlock: '코드 블록',
    horizontalRule: '가로줄',
    style: '스타일',
    paragraph: '본문',
    heading: '제목 {level}',
    fontSize: '크기',
    apply: '적용',
  },
  Select: { placeholder: '옵션 선택' },
  Steps: { label: '진행 단계' },
  Tabs: { list: '탭' },
  TimePicker: { clear: '시간 지우기' },
  Tour: {
    previous: '이전',
    next: '다음',
    finish: '완료',
    close: '투어 닫기',
    progress: '{total}단계 중 {current}단계',
  },
  Transfer: {
    moveToChosen: '선택 목록으로 이동',
    moveToAvailable: '선택 가능 목록으로 이동',
    selectAll: '보이는 항목 모두 선택',
    empty: '항목 없음',
    count: '전체 {total}개 중 {visible}개 표시, {selected}개 선택',
  },
  Tree: { label: '트리', empty: '노드 없음' },
  TreeSelect: {
    placeholder: '노드 선택',
    popup: '노드 선택',
    empty: '노드 없음',
  },
  Upload: {
    hint: '클릭하거나 파일을 끌어 놓아 업로드',
    hintMultiple: '클릭하거나 파일들을 끌어 놓아 업로드',
    remove: '{name} 삭제',
  },
};

// Fills `{key}` placeholders in a locale string.
export const formatLocale = (
  template: string,
  values: Record<string, string | number>,
) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );

// Merges one locale over another, group by group, so a partial group keeps
// the keys it leaves out.
export const mergeLocale = <T extends object>(base: T, override: object): T => {
  const merged = { ...base } as Record<string, unknown>;

  for (const [key, value] of Object.entries(override)) {
    const current = merged[key];

    if (value === undefined) {
      continue;
    }

    merged[key] =
      value &&
      typeof value === 'object' &&
      current &&
      typeof current === 'object' &&
      key !== 'dateLocale'
        ? { ...current, ...value }
        : value;
  }

  return merged as T;
};
