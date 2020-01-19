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

describe('valid frontmatter', () => {
  test('a key-value pair delimited by a colons is trimmed and converted to a javascript object', () => {
    const goodFrontmatter = `
    a simple key: value pair
  `
    const parsedFrontmatter = {
      'a simple key': 'value pair',
    }

    expect(parseFrontmatter({ frontmatter: goodFrontmatter })).toMatchObject(parsedFrontmatter)
  })

  test('a key-value pair is split only on the first colon', () => {
    const goodFrontmatter = `
      key: and value: with: colons
    `
    const parsedFrontmatter = {
      key: 'and value: with: colons',
    }

    expect(parseFrontmatter({ frontmatter: goodFrontmatter })).toMatchObject(parsedFrontmatter)
  })

  test('key-value pairs are trimmed, converted to a javascript object', () => {
    const goodFrontmatter = `
    a simple key: value pair
    and another key: with it's own value     
    one more key      :      for goood luck    
  `
    const parsedFrontmatter = {
      'a simple key': 'value pair',
      'and another key': 'with it\'s own value',
      'one more key': 'for goood luck',
    }

    expect(parseFrontmatter({ frontmatter: goodFrontmatter })).toMatchObject(parsedFrontmatter)
  })

  test('lists are named by the string left of the colon and contain items marked by dashes', () => {
    const goodFrontmatter = `
      a list:
        - list item one
        - list item two
    `

    expect(parseFrontmatter({ frontmatter: goodFrontmatter })).toMatchObject({
      'a list': ['list item one', 'list item two'],
    })
  })

  test('lists parse correctly when list item contains extra dashes', () => {
    const goodFrontmatter = `
      a list:
        - list item - with some - dashes - one
        - list item two
    `

    expect(parseFrontmatter({ frontmatter: goodFrontmatter })).toMatchObject({
      'a list': ['list item - with some - dashes - one', 'list item two'],
    })
  })
})

test('list items can contain colons (but don\'t create nested objects)', () => {
  const goodFrontmatter = `
      a list:
        - list : with some colons
        - testing a list item that ends with a colon:
    `

  expect(parseFrontmatter({ frontmatter: goodFrontmatter })).toMatchObject({
    'a list': ['list : with some colons', 'testing a list item that ends with a colon:'],
  })
})

describe('a realistic frontmatter string', () => {
  const realisticFrontmatter = `
    authors:
      - the smoot
      - stxalq
    date: the year of our lord 2020
    description: we write our own frontmatter parser "because we can"
  `
  const parsedFrontmatter = {
    authors: [
      'the smoot',
      'stxalq',
    ],
    date: 'the year of our lord 2020',
    description: 'we write our own frontmatter parser "because we can"',
  }

  expect(parseFrontmatter({ frontmatter: realisticFrontmatter })).toMatchObject(parsedFrontmatter)
})
