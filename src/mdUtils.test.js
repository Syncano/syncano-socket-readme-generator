/* global test, expect */

const {
  renderNewLines,
  removeNewLines,
  parseEndpointParams,
  renderDelimiterRow,
  renderHeading,
  addTableColumn,
  renderTable,
  createTableColumns,
  renderFencedCodeBlock,
  renderMimeType,
  renderExampleHeading,
  renderEndpointExample,
  renderEndpointExamples
} = require('./mdUtils')

test('renderNewLines returns an empty string with no params passed', () => {
  expect(renderNewLines()).toBe('');
});

test('renderNewLines returns an n of new line (\\n) characters', () => {
  expect(renderNewLines(1)).toBe('\n');
});

test('removeNewLines replaces each new line character with a space in a string', () => {
  expect(removeNewLines('\r\n\n')).toBe('  ')
})

test('removeNewLines returns the param if it is not a string', () => {
  expect(removeNewLines(2)).toBe(2)
})

const row = ['Name', 'Required', 'Description', 'Info']
const delimiter = ['----', '--------', '-----------', '----']

test('renderDelimiterRow returns a md table row delimiter', () => {
  expect(renderDelimiterRow(row)).toEqual(delimiter)
})

test('renderHeading returns an ATX heading of n depth with a double new line', () => {
  expect(renderHeading(2)('Heading')).toEqual('## Heading\n\n')
})

test('addTableColumn adds a capitalized entry to an array if entry is not persent', () => {
  expect(addTableColumn('thing', ['new'])).toEqual(['new', 'thing'])
})

test('addTableColumn does not add an entry to an array if entry is present', () => {
  expect(addTableColumn('thing', ['new', 'thing'])).toEqual(['new', 'thing'])
})

const classObj = { 0: ['Eat', 'Drink'], 1: ['Tide pods', 'Gasoline'] }
const mdTable = `| Eat | Drink
| --- | -----
| Tide pods | Gasoline\n\n`

test('renderTable renders gfm table from an object', () => {
  expect(renderTable(classObj)).toEqual(mdTable)
})

const params = {
  username: {
    type: 'string',
    description: 'Username of user',
    example: 'you@domain.com'
  },
  token: {
    type: 'string',
    example: 'cb21fac8c7dda8fcd0129b0adb0254dea5c8e'
  }
}

const expectedOutputParams = {
  0: ['name', 'type', 'description', 'example'],
  1: ['username', 'string', 'Username of user', 'you@domain.com'],
  2: ['token', 'string', '', 'cb21fac8c7dda8fcd0129b0adb0254dea5c8e']
}

test('createTableColumns returns a list of unique keys from an object', () => {
  expect(createTableColumns(params)).toEqual(expectedOutputParams[0])
})

test('parseEndpointParams returns an object of enumerated keys, with params arrays as values', () => {
  expect(parseEndpointParams(params)).toEqual(expectedOutputParams);
});

test('renderFencedCodeBlock returns a gfm fenced code block', () => {
  expect(renderFencedCodeBlock('behind a fence')).toBe('```\nbehind a fence```')
})

test('renderMimeType properly formats response mimetype property', () => {
  expect(renderMimeType({ mimetype: 'application/json' })).toBe('mimetype: `application/json`')
})

test('renderExampleHeading returns a md heading for a response example from an empty object', () => {
  expect(renderExampleHeading({})).toBe('##### Result\n\n')
})

test(`renderExampleHeading returns a md heading for a response example
  from an object with description and exitCode`, () => {
    expect(renderExampleHeading({ description: 'success', exit_code: 200 })).toBe('##### success `200`\n\n')
  })

test(`renderExampleHeading returns a md heading for a response example
  from an object with description`, () => {
    expect(renderExampleHeading({ description: 'success' })).toBe('##### success\n\n')
  })

test(`renderExampleHeading returns a md heading for a response example
  from an object with description`, () => {
    expect(renderExampleHeading({ exit_code: 200 })).toBe('##### `200`\n\n')
  })

const examples = [
  {
    exit_code: 200,
    description: 'Success',
    example: '{\n  "collectionArn": "12345",\n  "statusCode": 200\n}\n'
  },
  {
    exit_code: 400,
    description: 'Failed',
    example: '{\n  "statusCode": 400,\n  "code": "Exception",\n  "message":"Already exists."\n}\n'
  }
]

const parsedExample = `##### Success \`200\`

\`\`\`
{
  "collectionArn": "12345",
  "statusCode": 200
}
\`\`\`
`

test('renderEndpointExample returns a md parsed example', () => {
  expect(renderEndpointExample(examples[0])).toEqual(parsedExample)
})

test('renderEndpointExamples returns a md parsed examples', () => {
  expect(renderEndpointExamples(examples)).toContain(parsedExample)
})

