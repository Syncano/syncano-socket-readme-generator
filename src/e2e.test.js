/* global test, expect */
const yaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const renderMarkdownDocs = require('./mdUtils').default

const yml = yaml.load(fs.readFileSync(path.resolve('./assets/test.yml'), 'utf8'));
const mdSample = fs.readFileSync(path.resolve('./assets/README.md'), 'utf8')

test('Parsed yml document should be equal to sample md doc', () => {
  expect(renderMarkdownDocs(yml)).toBe(mdSample)
})
