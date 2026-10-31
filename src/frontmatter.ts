import frontmatterParser from './frontmatter_parser.ts'
import type { Frontmatter } from './frontmatter_parser.ts'

export type { Frontmatter }

export interface FrontmatterResult {
  frontmatter: Frontmatter
  body: string
}

const FORMAT_EXAMPLE = `
      ---
      key: value
      list:
        - item one
        - item two
      ---
`

// a delimiter is a line of exactly three dashes (trailing spaces tolerated)
const DELIMITER = /^---[ \t]*$/m

export default function frontmatter ({ content }: { content: string }): FrontmatterResult {
  // normalize windows/old-mac line endings so the delimiter regex sees bare `---` lines
  const normalized = content.replace(/\r\n?/g, '\n').trim()

  const opening = normalized.match(DELIMITER)
  if (opening === null || opening.index !== 0) {
    throw new Error(`
      Frontmatter content must start with three dashes:
      ${FORMAT_EXAMPLE}`)
  }

  const afterOpening = normalized.slice(opening[0].length)
  const closing = afterOpening.match(DELIMITER)
  if (closing === null || closing.index === undefined) {
    throw new Error(`
      Frontmatter is missing its closing three dashes:
      ${FORMAT_EXAMPLE}`)
  }

  // only the first two delimiters are structural: a `---` later in the body (a markdown horizontal rule) stays in the body
  const frontmatterString = afterOpening.slice(0, closing.index)
  const body = afterOpening.slice(closing.index + closing[0].length).trim()

  return {
    frontmatter: frontmatterParser({ frontmatter: frontmatterString }),
    body,
  }
}
