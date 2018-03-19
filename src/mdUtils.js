import _ from 'lodash'

export const renderNewLines = (n = 0) => `\n`.repeat(n)

export const removeNewLines = (string) => (typeof string === 'string' ?
  string.replace(/\r?\n|\r/g, ' ') :
  string)

export const renderDelimiterRow = (row = []) => row.map((name) => '-'.repeat(name.length))

export const renderHeading = (depth) => (name) => `${'#'.repeat(depth)} ${name}${renderNewLines(2)}`


/**
 Renders a markdown table out of an object with the following format
 @param {object} { '0': [table header], '1': [ first row], '2': [second row] }
 @returns {string} Github Flavored Markdown table
*/
export const renderTable = (tableObj) => {
  const table = Object.values(tableObj)
  const separator = renderDelimiterRow(table[0])
  const fullTable = table.slice()

  fullTable.splice(1, 0, separator)

  return fullTable.map((row) => `| ${row.join(' | ')}`).join('\n') +
         renderNewLines(2)
}

export const addTableColumn = (col, columns) => (columns.indexOf(col) === -1 ?
  [...columns, col] :
  columns);

export const createTableColumns = (params) => {
  let tableColumns = ['name']

  Object.values(params).forEach((param) => {
    Object.keys(param).forEach((key) => {
      tableColumns = addTableColumn(key, tableColumns)
    })
  })

  return tableColumns
}

export const parseEndpointParams = (params) => {
  const tableColumns = createTableColumns(params)
  const emptyRow = _.fill(Array(tableColumns.length - 1), '')
  let rows = { 0: tableColumns }
  let i = 1

  // Iterate through key (name), value (properties) of each endpoint parameter
  Object.entries(params).forEach(([key, value]) => {
    rows = { ...rows, [i]: [key, ...emptyRow] }
    // Push values to the row array at proper index.
    Object.entries(value).forEach(([k, v]) => {
      const idx = tableColumns.indexOf(k)

      rows[i].splice(idx, 1, removeNewLines(v));
    });
    i += 1;
  });

  return rows
}

export const renderFencedCodeBlock = (block) => `\`\`\`\n${block}\`\`\``

export const renderMimeType = ({ mimetype }) => (mimetype ? `mimetype: \`${mimetype}\`` : '')

export const renderExampleHeading = ({ exit_code: exitCode, description }) => {
  if (!exitCode && !description) return renderHeading(5)('Result')
  if (!exitCode) return renderHeading(5)(description)
  if (!description) return renderHeading(5)(`\`${exitCode}\``)

  return renderHeading(5)(`${description} \`${exitCode}\``)
}

export const renderEndpointExample = (example) => [
  renderExampleHeading(example),
  renderFencedCodeBlock(example.example),
  renderNewLines(1)
].join('')

export const renderEndpointExamples = (examples) =>
  examples.map((example) => renderEndpointExample(example)).join('\n')

export const renderEndpoint = ({
  parameters,
  response,
  description,
  name
}) => {
  const mdParams = [renderHeading(4)('Parameters'),
    _.flow(parseEndpointParams, renderTable)(parameters)].join('')
  const mdResponse = [
    renderHeading(4)('Response'),
    renderMimeType(response),
    renderNewLines(2),
    renderEndpointExamples(response.examples)
  ].join('')

  return [
    renderHeading(3)(name),
    description,
    renderNewLines(2),
    mdParams,
    renderNewLines(2),
    mdResponse
  ].join('')
}


export const renderEndpoints = (endpoints) => {
  if (!endpoints) return ''
  // endpoint names are transformed from object keys into properties
  const mappedEndpoints = _.entries(endpoints).map(([key, value]) => ({ name: key, ...value }))

  return renderHeading(2)('Endpoints') +
         _.map(mappedEndpoints, renderEndpoint).join('\n')
}

export const parseClass = (classObj) => {
  let table = { 0: ['Name', 'Type', 'Filtering', 'Ordering'] }

  Object.entries(classObj).forEach(([key,
    {
      name,
      type,
      filter_index = false,
      order_index = false
    }]) => {
    table = {
      ...table,
      [parseInt(key, 10) + 1]: [name, type, filter_index, order_index]
    }
  })

  return table
}

export const renderClasses = (classes) => {
  if (!classes) return ''

  let renderedClasses = renderHeading(2)('Classes')

  Object.entries(classes).forEach(([key, value]) => {
    renderedClasses += renderHeading(3)(`\`${key}\` schema`) +
                       renderTable(parseClass(value))
  })

  return renderedClasses
}

export const parseConfig = (config) => {
  let table = { 0: ['Name', 'Required', 'Description', 'Info'] }
  let i = 1

  Object.entries(config).forEach(([key,
    {
      required = false,
      description,
      long_description
    }]) => {
    table = {
      ...table,
      [i]: [key, required, description, removeNewLines(long_description)]
    }
    i += 1
  })

  return table
}

export const renderConfig = (config) => {
  if (!config) return ''

  return [
    renderHeading(2)('Config'),
    renderTable(parseConfig(config))
  ].join('')
}

export const renderBasicInfo = (
  name = '',
  description = '',
  version = ''
) => [
  renderHeading(1)(name),
  `\`version:\` **${version}**`,
  renderNewLines(2),
  description,
  renderNewLines(2),
  `To install, run:`,
  renderNewLines(2),
  `\`\`\`\nsyncano-cli add ${name}\n\`\`\``,
  renderNewLines(2)
].join('')

const renderMarkdownDocs = ({
  name,
  description,
  version,
  config,
  classes,
  endpoints
}) => [
  renderBasicInfo(name, description, version),
  renderConfig(config),
  renderClasses(classes),
  renderEndpoints(endpoints)
].join('')

export default renderMarkdownDocs
