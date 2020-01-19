import validateFrontmatterLine, { BEGINNING_OF_LIST, KEY_VALUE_PAIR, LIST_ITEM } from './validation'

/**
 *
 * @param {string} frontmatterString
 * @returns {{}}
 */
export default function parseFrontmatter ({ frontmatter: frontmatterString }) {
  const parsedFrontmatter = {}
  const frontMatterBlankLinesRemoved = frontmatterString
    .split(/\n/g)
    .map(line => line.trim())
    .filter(line => line.length > 0)

  const parsedFrontmatterList = frontMatterBlankLinesRemoved.map((line, index, array) => {
    const type = validateFrontmatterLine({
      line,
      index,
      array,
      nextLine: array[index + 1],
    })

    return {
      type,
      line,
    }
  })

  let currentList = ''
  parsedFrontmatterList.forEach(parsedFrontmatterLine => {
    if (parsedFrontmatterLine.type === KEY_VALUE_PAIR) {
      const key = parsedFrontmatterLine.line.split(':', 2)[0].trim()
      const value = parsedFrontmatterLine.line
        .split(':')
        .slice(1)
        .join(':')
        .trim()

      parsedFrontmatter[key] = value
    }

    if (parsedFrontmatterLine.type === BEGINNING_OF_LIST) {
      currentList = parsedFrontmatterLine.line.split(':', 2)[0].trim()
      parsedFrontmatter[currentList] = []
    }

    if (parsedFrontmatterLine.type === LIST_ITEM) {
      const value = parsedFrontmatterLine.line
        .split('-')
        .slice(1)
        .join('-')
        .trim()

      parsedFrontmatter[currentList].push(value)
    }
  })

  return parsedFrontmatter
}
