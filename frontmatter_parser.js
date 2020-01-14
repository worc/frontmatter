import validateFrontmatterLine from './validation'

/**
 *
 * @param {string} frontmatter
 */
export default function parseFrontmatter ({ frontmatter }) {
  const frontMatterBlankLinesRemoved = frontmatter
    .split(/\n/g)
    .map(line => line.trim())
    .filter(line => line.length > 0)

  frontMatterBlankLinesRemoved.every((line, index, array) => {
    return validateFrontmatterLine({
      line,
      index,
      array,
      nextLine: array[index + 1],
    })
  })
}
