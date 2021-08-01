module.exports = { convertImport }

// eslint-disable-next-line max-statements
function convertImport(code) {
  const codeMatch = code
    .trim()
    .replace(/"/gu, "'")
    .match(/^import(.*?)from\s*'(.*?)'$/u)
  if (!codeMatch) throw new Error('import declaration parsing error')
  const [, string, path] = codeMatch
  const stringMatch = string.trim().match(/^(.*?)\{(.*?)\}(.*?)$/u)
  const [, match1, namedString, match2] = stringMatch ?? [null, string, '', '']
  const defaultAndAllParts = `${match1} ${match2}`.split(',').map((s) => s.trim())

  const allName = defaultAndAllParts
    .find((s) => s.includes('*'))
    ?.split('as')[1]
    ?.trim()
  const allImport = allName ? { localName: allName, name: '*', path } : null

  const defaultName = defaultAndAllParts.find((s) => s && !s.includes('*'))
  const defaultImport = defaultName
    ? { localName: defaultName, name: 'default', path }
    : null

  const namedParts = namedString.split(',').map((item) => item.trim())
  const namedImports = namedParts.map((part) => {
    const [name, localName = name] = part.split(' as ').map((n) => n.trim())
    return name ? { localName, name, path } : null
  })

  return [allImport, defaultImport, ...namedImports].filter((i) => i)
}
