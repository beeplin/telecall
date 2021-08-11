const path = require('path')
const template = require('@babel/template')

module.exports = () => ({
  visitor: {
    ImportDeclaration(p, { file, opts }) {
      const targetFullPath = path
        .resolve(path.dirname(file.opts.filename), p.node.source.value)
        .replace(/\\/gu, '/')
      const targetName = Object.keys(opts).find((name) => {
        const { targetPath } = opts[name]
        const absPath = path.resolve(process.cwd(), targetPath).replace(/\\/gu, '/')
        return targetFullPath.startsWith(absPath)
      })
      if (!targetName) return
      const opt = opts[targetName]
      const consts = convertImportNodeToConstsString(p.node, opt)
      p.replaceWithMultiple(template.statements.ast(consts))
    },
  },
})

function convertImportNodeToConstsString(node, opt) {
  const names = getNamesFromEstreeNode(node)
  const consts = buildConstsFromNamesAndPath(names, opt)
  return consts
}

function getNamesFromEstreeNode(node) {
  return node.specifiers.map(({ type, imported, local }) => ({
    local: local.name,
    imported:
      type === 'ImportNamespaceSpecifier'
        ? '*'
        : type === 'ImportDefaultSpecifier'
        ? 'default'
        : imported.name,
  }))
}

function buildConstsFromNamesAndPath(names, opt) {
  const { endpoint, persistence } = opt
  const part = `endpoint: '${endpoint}'${
    persistence ? `, persistence: '${persistence}'` : ''
  }`
  return names.reduce((acc, { local, imported }) => {
    return imported === '*'
      ? `${acc}const ${local} = new Proxy({}, { get: function(t, p) { return { ${part}, method: p }}}); `
      : `${acc}const ${local} = { ${part}, method: '${imported}' }; `
  }, '')
}

// function getRelativePath(absPath, root) {
//   return normalizePath(path.relative(root, path.relative(process.cwd(), absPath)))
// }

// function convertImportsCodeToConstsStringByRegex_UNSAFE(code) {
//   // NOTE does not work for `import` in strings
//   return code.replace(
//     /(?<pre>\s+)import(?<clause>[\s{].*?[\s}])from\s*(?<quote>['"`])(?<path>.*?)\k<quote>(?<post>\s*[\n;])/gsu,
//     // eslint-disable-next-line max-params
//     (_, pre, clause, __, path, post) => {
//       const names = parseImportClauseToNames(clause)
//       const consts = buildConstsFromNamesAndPath(path, names)
//       return pre + consts + post
//     },
//   )
// }

// function parseImportClauseToNames(string) {
//   const stringMatch = string
//     .replace(/\/\/.*?\n/gu, '\n')
//     .replace(/\/\*.*?\*\//gu, '')
//     .replace(/\n/gu, '')
//     .trim()
//     .match(/^(.*?)\{(.*?)\}(.*?)$/u)
//   const [, match1, named, match2] = stringMatch ?? [null, string, '', '']
//   const unnamed = `${match1} ${match2}`.split(',').map((s) => s.trim())
//   const allName = {
//     local: unnamed
//       .find((s) => s.includes('*'))
//       ?.split(' as ')?.[1]
//       ?.trim(),
//     imported: '*',
//   }
//   const defaultName = {
//     local: unnamed.find((s) => s && !s.includes('*')),
//     imported: 'default',
//   }
//   const namedName = named.split(',').map((part) => {
//     const [imported, local = imported] = part.split(' as ').map((n) => n.trim())
//     return imported ? { local, imported } : null
//   })
//   return [allName, defaultName, ...namedName].filter((i) => i?.local)
// }

// describe('parseImportClauseToNames', () => {
//     it('a', () => {
//       expect(parseImportClauseToNames('a')).toStrictEqual([{ local: 'a', imported: 'default' }])
//     })

//     it('aaa', () => {
//       expect(parseImportClauseToNames('aaa')).toStrictEqual([
//         { local: 'aaa', imported: 'default' },
//       ])
//     })

//     it('_aaa_', () => {
//       expect(parseImportClauseToNames('   aaa   ')).toStrictEqual([
//         { local: 'aaa', imported: 'default' },
//       ])
//     })

//     it('{ a }', () => {
//       expect(parseImportClauseToNames(' { a } ')).toStrictEqual([{ local: 'a', imported: 'a' }])
//     })

//     it('{ a as b }', () => {
//       expect(parseImportClauseToNames(' { a as b } ')).toStrictEqual([
//         { local: 'b', imported: 'a' },
//       ])
//     })

//     it('{a as b}', () => {
//       expect(parseImportClauseToNames('{a as b}')).toStrictEqual([{ local: 'b', imported: 'a' }])
//     })

//     it('{a    as   b  }', () => {
//       expect(parseImportClauseToNames('    {a    as   b  } ')).toStrictEqual([
//         { local: 'b', imported: 'a' },
//       ])
//     })

//     it('{ a as b,c,d as eee }', () => {
//       expect(parseImportClauseToNames(' { a as b,c,d as eee } ')).toStrictEqual([
//         { local: 'b', imported: 'a' },
//         { local: 'c', imported: 'c' },
//         { local: 'eee', imported: 'd' },
//       ])
//     })

//     it('def, { a as b,c,d as eee }', () => {
//       expect(parseImportClauseToNames(' def, { a as b,c,d as eee } ')).toStrictEqual([
//         { local: 'def', imported: 'default' },
//         { local: 'b', imported: 'a' },
//         { local: 'c', imported: 'c' },
//         { local: 'eee', imported: 'd' },
//       ])
//     })

//     it('{ a as b,c,d as eee }, def', () => {
//       expect(parseImportClauseToNames(' { a as b,c,d as eee }, def ')).toStrictEqual([
//         { local: 'def', imported: 'default' },
//         { local: 'b', imported: 'a' },
//         { local: 'c', imported: 'c' },
//         { local: 'eee', imported: 'd' },
//       ])
//     })

//     it('* as aaa', () => {
//       expect(parseImportClauseToNames(' * as aaa ')).toStrictEqual([
//         { local: 'aaa', imported: '*' },
//       ])
//     })

//     it('* as aaa, def', () => {
//       expect(parseImportClauseToNames(' * as aaa, def ')).toStrictEqual([
//         { local: 'aaa', imported: '*' },
//         { local: 'def', imported: 'default' },
//       ])
//     })

//     it('* as aaa, { a as b,c,d as eee }, def', () => {
//       expect(parseImportClauseToNames(' * as aaa, { a as b,c,d as eee }, def ')).toStrictEqual([
//         { local: 'aaa', imported: '*' },
//         { local: 'def', imported: 'default' },
//         { local: 'b', imported: 'a' },
//         { local: 'c', imported: 'c' },
//         { local: 'eee', imported: 'd' },
//       ])
//     })

//     it('{ a as b,c,d as eee }, def, * as aaa', () => {
//       expect(parseImportClauseToNames(' { a as b,c,d as eee }, def, * as aaa   ')).toStrictEqual(
//         [
//           { local: 'aaa', imported: '*' },
//           { local: 'def', imported: 'default' },
//           { local: 'b', imported: 'a' },
//           { local: 'c', imported: 'c' },
//           { local: 'eee', imported: 'd' },
//         ],
//       )
//     })
//   })
