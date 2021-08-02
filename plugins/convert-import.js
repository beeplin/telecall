const acorn = require('acorn')

function parseImportString(string) {
  const stringMatch = string
    .replace(/\/\/.*?\n/gu, '\n')
    .replace(/\/\*.*?\*\//gu, '')
    .replace(/\n/gu, '')
    .trim()
    .match(/^(.*?)\{(.*?)\}(.*?)$/u)
  const [, match1, named, match2] = stringMatch ?? [null, string, '', '']
  const unnamed = `${match1} ${match2}`.split(',').map((s) => s.trim())
  const allName = {
    local: unnamed
      .find((s) => s.includes('*'))
      ?.split(' as ')?.[1]
      ?.trim(),
    imported: '*',
  }
  const defaultName = {
    local: unnamed.find((s) => s && !s.includes('*')),
    imported: 'default',
  }
  const namedName = named.split(',').map((part) => {
    const [imported, local = imported] = part.split(' as ').map((n) => n.trim())
    return imported ? { local, imported } : null
  })
  return [allName, defaultName, ...namedName].filter((i) => i?.local)
}

function convertImportByRegex(code) {
  // NOTE does not work for `import` in strings
  return code.replace(
    /(?<pre>\s+)import(?<string>[\s{].*?[\s}])from\s*(?<quote>['"`])(?<path>.*?)\k<quote>(?<post>\s*[\n;])/gsu,
    // eslint-disable-next-line max-params
    (_, pre, string, __, path, post) => {
      const names = parseImportString(string)
      const replaced = buildReplacedString(path, names)
      return pre + replaced + post
    },
  )
}

function parstImportAst(node) {
  if (node.type !== 'ImportDeclaration')
    throw new Error('node should be import declaration')
  return {
    path: node.source.value,
    names: node.specifiers.map(({ type, imported, local }) => ({
      local: local.name,
      imported:
        type === 'ImportNamespaceSpecifier'
          ? '*'
          : type === 'ImportDefaultSpecifier'
          ? 'default'
          : imported.name,
    })),
  }
}

function buildReplacedString(path, names) {
  return names.reduce((acc, { local, imported }) => {
    return imported === '*'
      ? `${acc}const ${local} = new Proxy({}, { get: function(t, p) { return { path: '${path}', name: p }}}); `
      : `${acc}const ${local} = { path: '${path}', name: '${imported}' }; `
  }, '')
}

function convertImportByAst(code) {
  return acorn
    .parse(code, { sourceType: 'module' })
    .body.filter((node) => node.type === 'ImportDeclaration')
    .reverse()
    .reduce((acc, node) => {
      const { path, names } = parstImportAst(node)
      const replaced = buildReplacedString(path, names)
      return acc.slice(0, node.start) + replaced + acc.slice(node.end)
    }, code)
}

module.exports = {
  parseImportString,
  convertImportByRegex,
  parstImportAst,
  convertImportByAst,
}
