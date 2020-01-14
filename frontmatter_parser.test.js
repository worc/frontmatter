import parseFrontmatter from './frontmatter_parser'

describe('error propagation', () => {
  test('throw an error if the first line starts with a colon', () => {
    const badFrontmatter = `
      : very bad
      and then some good: key value pairing
    `
    expect(() => parseFrontmatter({ frontmatter: badFrontmatter})).toThrow()
  })

  test('throw an error if the second line starts with a colon', () => {
    const badFrontmatter = `
      and then some good: key value pairing
      : very bad
    `
    expect(() => parseFrontmatter({ frontmatter: badFrontmatter})).toThrow()
  })

  test('throw an error if a line has no colon and does not start with a dash', () => {
    const badFrontmatter = `
      some good: key value pairing
      start a list:
        - good list
        - still good
      and then the bad happens
    `
    expect(() => parseFrontmatter({ frontmatter: badFrontmatter})).toThrow()
  })

  test('throw an error if a list is started correctly, but the first list item syntax is incorrect', () => {
    const badFrontmatter = `
      a good list:
        - list item
        - another one
        - great list, bigly best
      start a list:
        and then it goes wrong
        - this list item is okay
    `
    expect(() => parseFrontmatter({ frontmatter: badFrontmatter})).toThrow()
  })

  test('throw an error if a list is started correctly, but the second list item syntax is incorrect', () => {
    const badFrontmatter = `
      a good list:
        - list item
        - another one
        - great list, bigly best
      start a list:
        - this list item is okay
        and then it goes wrong
    `
    expect(() => parseFrontmatter({ frontmatter: badFrontmatter})).toThrow()
  })

  test('throw an error if a list item does not have a starter as one of its previous lines', () => {
    const badFrontmatter = `
      a bad list:
        - list item
        - another one
        and then it goes wrong
    `
    expect(() => parseFrontmatter({ frontmatter: badFrontmatter})).toThrow()
  })
})
