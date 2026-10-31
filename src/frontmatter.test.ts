import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import frontmatter from './frontmatter.ts'

describe('errors', () => {
  test('throw an error if content does not start with three dashes', () => {
    const badContent = 'here is some content that doesn\'t start with a dash'
    const oneDash = '- also not valid content here --- body '
    const twoDashes = '-- also also not valid --- more body'

    assert.throws(() => frontmatter({content: badContent}))
    assert.throws(() => frontmatter({content: oneDash}))
    assert.throws(() => frontmatter({content: twoDashes}))
  })
})


const testContent = `
---
  author: stxalq
  tags:
    - end of the world
    - survival
    - glamping
  title: 5 Ways to Up Your Water Intake (Seriously)
  subtitle: de-ionization and hard boiling are so last century
  
---
  
  here is a pretend markdown paragraph. lorem ipsum all day baby. just do this thing until there's text to handle.
  
  add some confusing symbols like :::::::::: and ------------ and all that to really make sure the parser isn't going to fuck up.
  
  #### bangs for fun
`

describe('valid content', () => {
  test('parsing content to a frontmatter object', () => {
    assert.deepEqual(frontmatter({content: testContent}), {
      frontmatter: {
        author: 'stxalq',
        tags: [
          'end of the world',
          'survival',
          'glamping',
        ],
        title: '5 Ways to Up Your Water Intake (Seriously)',
        subtitle: 'de-ionization and hard boiling are so last century',
      },
      body: 'here is a pretend markdown paragraph. lorem ipsum all day baby. just do this thing until there\'s text to handle.\n  \n  add some confusing symbols like :::::::::: and ------------ and all that to really make sure the parser isn\'t going to fuck up.\n  \n  #### bangs for fun',
    })
  })
})

describe('delimiters', () => {
  test('a markdown horizontal rule in the body stays in the body', () => {
    const content = '---\ntitle: hr test\n---\n\nabove the rule\n\n---\n\nbelow the rule\n'

    assert.deepEqual(frontmatter({ content }), {
      frontmatter: { title: 'hr test' },
      body: 'above the rule\n\n---\n\nbelow the rule',
    })
  })

  test('CRLF line endings parse the same as LF', () => {
    const content = '---\r\ntitle: crlf\r\ntags:\r\n  - a\r\n---\r\nbody text\r\n'

    assert.deepEqual(frontmatter({ content }), {
      frontmatter: { title: 'crlf', tags: ['a'] },
      body: 'body text',
    })
  })

  test('blank lines around the frontmatter (the recipes repo shape) are fine', () => {
    const content = '---\n\noriginal date: October 2023\nlast update: March 2026\n\n---\n\n# tom kha gai\n'

    assert.deepEqual(frontmatter({ content }), {
      frontmatter: { 'original date': 'October 2023', 'last update': 'March 2026' },
      body: '# tom kha gai',
    })
  })

  test('empty frontmatter gives an empty object', () => {
    assert.deepEqual(frontmatter({ content: '---\n---\nbody' }), { frontmatter: {}, body: 'body' })
  })

  test('a missing closing delimiter throws a clear error instead of crashing', () => {
    assert.throws(() => frontmatter({ content: '---\ntitle: never closed\nbody' }), /closing/)
  })

  test('four dashes is not a delimiter', () => {
    assert.throws(() => frontmatter({ content: '----\ntitle: x\n----\nbody' }))
  })
})
