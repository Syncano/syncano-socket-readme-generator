#!/usr/bin/env ./node_modules/.bin/babel-node
import readline from 'readline'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'
import renderMarkdownDocs from './mdUtils'

try {
  const yml = yaml.load(fs.readFileSync(path.resolve(process.argv[2]), 'utf8'))
  const md = renderMarkdownDocs(yml)
  const outputFilePath = path.resolve(path.dirname(process.argv[2]), 'README.md')
  const rl = readline.createInterface(process.stdin, process.stdout)

  rl.on('line', (line) => {
    const yes = ['Y', 'y', 'Yes', 'YES']

    if (yes.indexOf(line.trim()) > -1) {
      fs.writeFileSync(outputFilePath, md, 'utf-8')
      console.log('README.md updated')
      return process.exit(0)
    }

    console.log('README.md was not updated.')
    return process.exit(0)
  })

  const prefix = '> '
  const message = `README.md file already exists in the current dir.
Do you want to overwrite the existing file? [Y/n]`

  if (fs.existsSync(outputFilePath)) {
    console.log(prefix + message)
    rl.setPrompt(prefix, prefix.length)
    rl.prompt()
  } else {
    fs.writeFileSync(outputFilePath, md, 'utf-8')
    console.log('README.md created')
    process.exit(0)
  }
} catch (e) {
  console.log(e)
  throw e
}

