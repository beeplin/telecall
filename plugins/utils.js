const path = require('path')
const { createFilter, normalizePath } = require('@rollup/pluginutils')
const debug = require('debug')
const { build } = require('esbuild')

module.exports = { isTele, convertTele, getRelativePath }

const debugIsTele = debug(isTele.name)
const debugGetTeleContent = debug(convertTele.name)

function isTele(fullPath, options) {
  const result = createFilter(options.include, options.exclude)(fullPath)
  debugIsTele(result, fullPath)
  return result
}

async function convertTele(fullPath, options) {
  const relativePath = getRelativePath(fullPath, options)
  const exportedNames = await getExportedNames(fullPath)
  const content = getContent(exportedNames, relativePath)
  debugGetTeleContent(content, fullPath)
  return content
}

function getRelativePath(fullPath, options) {
  return normalizePath(
    path.relative(options.root, path.relative(process.cwd(), fullPath)),
  )
}

async function getExportedNames(fullPath) {
  // use esbuild to transpile and bundle so that `exports * from ...` also works
  const output = await build({
    entryPoints: [fullPath],
    bundle: true,
    format: 'cjs',
    write: false,
  })
  const code = output.outputFiles[0].text
  // find the `__export(exports, {...})` part in the bundle
  const match = /__export\(exports, \{\s+(.*?)\s+\}\);/su.exec(code)
  const text = match?.[1]
  if (!text) throw new Error('Error when parsing esbuild bundle to get exported names')
  // get the keys of `exports` in the bundle
  const names = text.split(',\n').map((line) => line.split(':')[0].trim())
  return names
}

function getContent(exportedNames, relativePath) {
  return exportedNames.reduce((acc, name) => {
    const prefix = name === 'default' ? 'default' : `const ${name} =`
    return `${acc}export ${prefix} { path: '${relativePath}', name: '${name}' };\n`
  }, '\n')
}

// // eval not safe. don't use this.
// function getExportedNamesFromCode(code ) {
//   exports = {} // re-init exports
//   console.log(code)
//   eval(code)
//   const names = Object.keys(exports)
//   exports = module.exports // recover exports
//   return names
// }
