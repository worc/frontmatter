import frontmatter from './frontmatter'

describe('errors', () => {
  test('throw an error if content does not start with three dashes', () => {
    const badContent = 'here is some content that doesn\'t start with a dash'
    const oneDash = '- also not valid content here --- body '
    const twoDashes = '-- also also not valid --- more body'

    expect(() => frontmatter({content: badContent})).toThrow()
    expect(() => frontmatter({content: oneDash})).toThrow()
    expect(() => frontmatter({content: twoDashes})).toThrow()
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
    expect(frontmatter({content: testContent})).toMatchObject({
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
