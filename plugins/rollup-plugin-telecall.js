import path from 'path'

const TELECALL_PATH = process.env.TELECALL_TEST ? '../../../src' : 'telecall'

export default function telecall(opts) {
  const id2endpoint = Object.keys(opts).reduce((acc, key) => {
    const relativePath = key.endsWith('.ts') ? key : `${key}.ts`
    const absolutePath = path.resolve(process.cwd(), relativePath).replace(/\\/gu, '/')
    return { ...acc, [absolutePath]: opts[key] }
  }, {})

  return {
    name: 'telecall',

    load(id) {
      const endpoint = id2endpoint[id]
      if (!endpoint) return null
      return {
        code: `
          import __telecall__ from '${TELECALL_PATH}/client'
          export default new Proxy(
            {},
            {
              get(t, p) {
                return __telecall__('${endpoint}', p)
              },
            },
          )`,
        syntheticNamedExports: true,
      }
    },
  }
}

// import { createSourceFile as getTsAst, ScriptTarget, SyntaxKind as K } from 'typescript'

// function convertTsToExportsByTsAst(filePath, code, endpoint) {
//   const ast = getTsAst(filePath, code, ScriptTarget.Latest)
//   const allExports = getAllExportsFromTsAstAndCode(ast, code)
//   const methods = getExportedNamesFromTsAst(ast)
//   const namedExports = convertMethodsToNamedExports(methods, endpoint)
//   return namedExports + allExports
// }

// function getAllExportsFromTsAstAndCode(ast, code) {
//   return ast.statements
//     .filter((s) => s.kind === K.ExportDeclaration && !s.exportClause)
//     .map((s) => code.slice(s.pos, s.end))
//     .reduce((acc, str) => `${acc}${str};\n`, '\n')
// }

// function getExportedNamesFromTsAst(ast) {
//   return ast.statements.flatMap((s) =>
//     s.kind === K.FunctionDeclaration &&
//     s.modifiers?.some((m) => m.kind === K.ExportKeyword)
//       ? s.name.escapedText
//       : s.kind === K.ExportDeclaration && s.exportClause
//       ? s.exportClause.elements?.map((e) => e.name.escapedText) ??
//         s.exportClause.name.escapedText
//       : s.kind === K.ExportAssignment
//       ? 'default'
//       : [],
//   )
// }

// function convertMethodsToNamedExports(methods, endpoint) {
//   return methods.reduce((acc, method) => {
//     const prefix = method === 'default' ? 'default' : `const ${method} =`
//     return `${acc}export ${prefix} __telecall__('${endpoint}', '${method}');\n`
//   }, '')
// }

// function getRelativePath(absPath, root) {
//   return normalizePath(
//     relative(root, relative(process.cwd(), absPath.replace(/\.ts$/u, '.js'))),
//   )
// }

// async function convertTsToExportsByEsbuildAndRegex_SLOW_UNSAFE(fullPath, telecallPath) {
//   const code = await getBundledCommonJsCodeByEsbuild(fullPath)
//   const names = getExportedNamesFromBundledCommonJsCodeByRegex(code)
//   const exports = convertNamesToNamedExports(names, telecallPath)
//   return exports
// }

// async function getBundledCommonJsCodeByEsbuild(filePath) {
//   const output = await require('esbuild').build({
//     entryPoints: [filePath],
//     bundle: true,
//     format: 'cjs',
//     write: false,
//   })
//   const code = output.outputFiles[0].text
//   return code
// }

// function getExportedNamesFromBundledCommonJsCodeByRegex(code) {
//   const match = /__export\(exports, \{\s+(.*?)\s+\}\);/su.exec(code)
//   const text = match?.[1]
//   if (!text) throw new Error('Error when parsing esbuild bundle to get exported names')
//   const names = text.split(',\n').map((line) => line.split(':')[0].trim())
//   return names
// }

// function getExportedNamesFromBundledCommonJsCodeByEval_UNSAFE(code) {
//   exports = {} // re-init exports
//   eval(code)
//   const names = Object.keys(exports)
//   exports = module.exports // recover exports
//   return names
// }
