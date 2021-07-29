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
  const code = await getBundledCommonJsCode(fullPath)
  const paris = getExportedKeyValuePairs(code)
  const keys = getExportedKeys(paris)
  const content = getConvertedContent(keys, relativePath)
  debugGetTeleContent(content, fullPath)
  return content
}

function getRelativePath(fullPath, options) {
  return normalizePath(
    path.relative(options.root, path.relative(process.cwd(), fullPath)),
  )
}

async function getBundledCommonJsCode(fullPath) {
  // use esbuild to transpile and bundle so that `exports * from ...` also works
  const output = await build({
    entryPoints: [fullPath],
    bundle: true,
    format: 'cjs',
    write: false,
  })
  const code = output.outputFiles[0].text
  return code
}

function getExportedKeyValuePairs(code) {
  // find the `__export(exports, {...})` part in the commonjs code bundled by esbuild
  const match = /__export\(exports, \{\s+(.*?)\s+\}\);/su.exec(code)
  const text = match?.[1]
  if (!text) throw new Error('Error when parsing esbuild bundle to get exported names')
  return text
}

function getExportedKeys(text) {
  return text.split(',\n').map((line) => line.split(':')[0].trim())
}

function getConvertedContent(keys, relativePath) {
  return keys.reduce((acc, key) => {
    const prefix = key === 'default' ? 'default' : `const ${key} =`
    return `${acc}export ${prefix} { path: '${relativePath}', name: '${key}' };\n`
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
