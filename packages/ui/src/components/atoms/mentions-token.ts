export interface Token {
  start: number;
  end: number;
  prefix: string;
  query: string;
}

export function findToken(
  text: string,
  start: number,
  end: number,
  prefixes: readonly string[],
): Token | null {
  if (start < 0 || end < start || end > text.length) {
    return null;
  }

  let boundary = start;

  while (boundary > 0 && !/\s/u.test(text[boundary - 1]!)) {
    boundary -= 1;
  }

  const beforeCaret = text.slice(boundary, start);
  const prefix = prefixes
    .filter(candidate => candidate.length > 0 && !/\s/u.test(candidate))
    .sort((a, b) => b.length - a.length)
    .find(candidate => beforeCaret.startsWith(candidate));

  if (!prefix) {
    return null;
  }

  let tokenEnd = start;

  while (tokenEnd < text.length && !/\s/u.test(text[tokenEnd]!)) {
    tokenEnd += 1;
  }

  if (end > tokenEnd) {
    return null;
  }

  return {
    start: boundary,
    end: tokenEnd,
    prefix,
    query: beforeCaret.slice(prefix.length),
  };
}

export function insertToken(text: string, token: Token, value: string) {
  const mention = token.prefix + value;
  const tail = text.slice(token.end);
  const separator = tail.length === 0 || !/^\s/u.test(tail) ? ' ' : '';

  return {
    value: text.slice(0, token.start) + mention + separator + tail,
    caret: token.start + mention.length + separator.length,
  };
}
