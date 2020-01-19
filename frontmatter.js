import frontmatterParser from './frontmatter_parser'

/**
 *
 * @param {string} content
 * @returns {{frontmatter: {}, body: string}}
 */
export default function frontmatter ({ content }) {
  const startsWithThreeDashes = content.trim().startsWith('---')

  if (!startsWithThreeDashes) {
    throw new Error(`
      Frontmatter content must start with three dashes:
      
      ---
      key: value
      list:
        - item one
        - item two
      ---
    `)
  }

  const splitter = new RegExp(/^---$/m)
  const frontmatterString = content.trim().split(splitter)[1]
  const contentString = content.trim().split(splitter)[2].trim()

  const frontmatter = frontmatterParser({ frontmatter: frontmatterString })
  const body = contentString

  return {
    frontmatter,
    body,
  }
}
