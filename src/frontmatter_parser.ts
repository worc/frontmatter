import validateFrontmatterLine, { BEGINNING_OF_LIST, KEY_VALUE_PAIR, LIST_ITEM } from './validation.ts'

export type Frontmatter = Record<string, string | Array<string>>

export default function parseFrontmatter ({ frontmatter: frontmatterString }: { frontmatter: string }): Frontmatter {
  const parsedFrontmatter: Frontmatter = {}
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

  // lists are built up in a local array and assigned by name, so a list item can never land on a string value
  let currentList: Array<string> = []
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
      const listName = parsedFrontmatterLine.line.split(':', 2)[0].trim()
      currentList = []
      parsedFrontmatter[listName] = currentList
    }

    if (parsedFrontmatterLine.type === LIST_ITEM) {
      const value = parsedFrontmatterLine.line
        .split('-')
        .slice(1)
        .join('-')
        .trim()

      currentList.push(value)
    }
  })

  return parsedFrontmatter
}
