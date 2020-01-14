import validateFrontmatterLine from './validation'

function removeEmptyLines () {

}

console.log('hello world')

const testString = `
frontmatter: of some kind
some more front matter: this one has lots to say

some front matter with: trailing spaces            
       leading spaces: and still some frontmatter

---

and now content

content
content

ok but what if

---

there were lots of splits?

---
`

console.log(testString.split('---', 2))

const parsed = {}

parsed.content = testString.split('---', 2)[1]

console.log(parsed)

const unparsedFrontmatter = testString.split('---', 2)[0]

console.log(unparsedFrontmatter)

const parsedFrontmatter = {}

const frontMatterLines = unparsedFrontmatter.split(/\n/g)

console.log(frontMatterLines)

const frontMatterBlankLinesRemoved = frontMatterLines.filter(line => line.length > 0).map(line => line.trim())

console.log(frontMatterBlankLinesRemoved)

