module.exports = { convertImport }

function convertImport(code) {
  const matches = code.replace(/"/gu, "'").match(/^import(.*?)from\s+'(.*?)'$/u)
  if (!matches) throw new Error('import declaration parsing error')
  const [, vars, path] = matches
  return [{ localName: vars.trim(), name: 'default', path }]
}
