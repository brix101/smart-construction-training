export function pluralize(word: string, count: number) {
  if (count === 1) {
    return word
  }
  // Basic pluralization rules
  if (word.endsWith('y') && !/[aeiou]y$/i.test(word)) {
    return word.slice(0, -1) + 'ies'
  }
  if (
    word.endsWith('s') ||
    word.endsWith('x') ||
    word.endsWith('z') ||
    word.endsWith('ch') ||
    word.endsWith('sh')
  ) {
    return word + 'es'
  }
  return word + 's'
}
