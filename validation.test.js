import validateFrontmatterLine from './validation'

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
