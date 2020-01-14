/**
 *
 * @param {array} previousLines
 */
function anyPreviousLineStartsList ({ previousLines }) {
  // todo, deal with a later list (with bad syntax) seeing an earlier list with proper syntax and incorrectly saying things are a-ok
  return previousLines.some(line => line.endsWith(':'))
}

/**
 *
 * @param {string} line
 * @param {number} index
 * @param {array} array
 * @param {string} [nextLine]
 */
export default function validateFrontmatterLine ({ line, index, array, nextLine }) {
  const startsWithColon = line.startsWith(':')
  const hasColon = line.includes(':')
  const endsWithColon = line.endsWith(':')
  const startsWithDash = line.startsWith('-')
  const nextLineStartsWithDash = nextLine === undefined ? false : nextLine.startsWith('-')
  const previousLines = array.slice(0, index)

  if (startsWithColon) {
    throw new Error(`
      Metadata is missing a key in its key value pair:
      
      ${line}
      
      Metadata should have a key left of the colon:
      
        correct:
          key: value
        
        incorrect:
          : value
    `)
  }

  if (!hasColon && !startsWithDash) {
    throw new Error(`
      Couldn't parse metadata:

      ${line} 

      Metadata must either include a colon separator or start with a dash:

        correct:
          key: value
          - list item
          beginning of a list:

        incorrect:
          key value
          list item
          beginning of list
    `)
  }

  if (endsWithColon && !nextLineStartsWithDash) {
    throw new Error(`
      Couldn't parse metadata list:

      ${line}
        ${nextLine}

      Metadata lists must end with a colon and must be followed by metadata that starts with a dash (indentation doesn't matter):

        correct:
           beginning of list:
           - list item

           beginning of list:
            - indented list item

        incorrect:
            beginning of list:
            list item

            beginning of list:
              indented list item
    `)
  }

  if (startsWithDash && !anyPreviousLineStartsList({ previousLines })) {
    throw new Error(`
      List item is not part of a list:
      
      ${line}
      
      Lists items must follow the beginning of a list. Lists are started by omitting text after the colon (indentation doesn't matter):
      
        correct:
          beginning of list:
          - list item
          - another list item
          
          beginning of list:
            - first indented list item
            - second indented list item
          - an unindented list item mixed in
          
        incorrect:
          beginning of list without a colon
          - list item
    `)
  }

  return true
}
