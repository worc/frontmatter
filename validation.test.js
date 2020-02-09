import validateFrontmatterLine, { BEGINNING_OF_LIST, KEY_VALUE_PAIR, LIST_ITEM } from './validation'

describe('errors', () => {
  test('throw an error if a line starts with a colon', () => {
    const testLine = ': and then some more stuff'
    const testFrontmatter = {
      line: testLine,
      index: 0,
      array: [testLine],
      nextLine: undefined,
    }

    expect(() => validateFrontmatterLine(testFrontmatter)).toThrow()
  })

  test('throw an error if a line has no colon and does not start with a dash', () => {
    const testLine = 'no colon and a dash - but not at the beginning'
    const testFrontmatter = {
      line: testLine,
      index: 0,
      array: [testLine],
      nextLine: undefined,
    }

    expect(() => validateFrontmatterLine(testFrontmatter)).toThrow()
  })

  test('throw an error if starting a list, but the next line is not a list item', () => {
    const testLine = 'start of a new list:'
    const testNextLine = 'badly formatted list item (does not start with a dash)'
    const testFrontmatter = {
      line: testLine,
      index: 0,
      array: [testLine, testNextLine],
      nextLine: testNextLine,
    }

    expect(() => validateFrontmatterLine(testFrontmatter).toThrow())
  })

  test('throw an error if a list item does not have a list starter as one of its previous lines', () => {
    const testLine = '- a valid list item'
    const testPreviousLine = 'an invalid list starter'
    const testFrontmatter = {
      line: testLine,
      index: 1,
      array: [testPreviousLine, testLine],
      nextLine: undefined,
    }

    expect(() => validateFrontmatterLine(testFrontmatter).toThrow())
  })
})

describe('valid frontmatter', () => {
  test('key value pairs separated by a colon are valid', () => {
    const testLine = 'key: value'
    const testFrontmatter = {
      line: testLine,
      index: 0,
      array: [testLine],
      nextLine: undefined,
    }

    expect(validateFrontmatterLine(testFrontmatter)).toBe(KEY_VALUE_PAIR)
  })

  test('beginning of a list followed by a list item is valid', () => {
    const testLine = 'beginning of a list:'
    const nextLine = '- a list item'
    const testFrontmatter = {
      line: testLine,
      index: 0,
      array: [testLine, nextLine],
      nextLine,
    }

    expect(validateFrontmatterLine(testFrontmatter)).toBe(BEGINNING_OF_LIST)
  })

  test('a list item in the middle of a list, with a previous list starter, is valid', () => {
    const testLine = '- list item'
    const firstListItem = '- first list item'
    const nextLine = '- another list item'
    const listStarter = 'beginning of a list:'
    const testFrontmatter = {
      line: testLine,
      index: 1,
      array: [listStarter, firstListItem, testLine, nextLine],
      nextLine,
    }

    expect(validateFrontmatterLine(testFrontmatter)).toBe(LIST_ITEM)
  })

  test('a list item can contain extra dashes', () => {
    const testLine = '- list item - with some - dashes - one'
    const nextLine = '- list item two'
    const testFrontmatter = {
      line: testLine,
      index: 1,
      array: ['a list:', testLine, nextLine],
      nextLine,
    }

    expect(validateFrontmatterLine(testFrontmatter)).toBe(LIST_ITEM)
  })

  test('a list item can contain a colon', () => {
    const testLine = '- list : with some colons'
    const testFrontmatter = {
      line: testLine,
      index: 1,
      array: ['a list:', testLine],
      nextLine: undefined,
    }

    expect(validateFrontmatterLine(testFrontmatter)).toBe(LIST_ITEM)
  })

  test('a list item can end with a colon', () => {
    const testLine = '- list : with some colons:'
    const testFrontmatter = {
      line: testLine,
      index: 1,
      array: ['a list:', testLine],
      nextLine: undefined,
    }

    expect(validateFrontmatterLine(testFrontmatter)).toBe(LIST_ITEM)
  })
})
