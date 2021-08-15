import path from 'path'
import { createSourceFile as getTsAst, ScriptTarget, SyntaxKind as K } from 'typescript'

const SEP = '?telecall='

export default function telecall(opts) {
  return {
    name: 'telecall',

    async resolveId(source, importer) {
      const [importerPath, existingModulePath] = importer?.split(SEP) ?? ''
      const resolved = await this.resolve(source, importerPath, { skipSelf: true })
      const id = resolved?.id
      const modulePath =
        existingModulePath ??
        Object.keys(opts).find((key) => {
          const absPath = path.resolve(process.cwd(), key).replace(/\\/gu, '/')
          return id.startsWith(absPath)
        })
      const result = modulePath ? id + SEP + modulePath : id
      return result
    },

    // async load(id) {
    //   const [filePath, telecallPath] = id.split(SEP)
    //   if (!telecallPath) return null
    //   return convertTsToExportsByEsbuildAndRegex_SLOW_UNSAFE(filePath, telecallPath)
    // },

    transform(code, id) {
      const [filePath, modulePath] = id.split(SEP)
      if (!modulePath) return null
      const endpoint = opts[modulePath]
      return convertTsToExportsByTsAst(filePath, code, endpoint)
    },
  }
}

function convertTsToExportsByTsAst(filePath, code, endpoint) {
  const ast = getTsAst(filePath, code, ScriptTarget.Latest)
  const allExports = getAllExportsFromTsAstAndCode(ast, code)
  const methods = getExportedNamesFromTsAst(ast)
  const namedExports = convertMethodsToNamedExports(methods, endpoint)
  return namedExports + allExports
}

function getAllExportsFromTsAstAndCode(ast, code) {
  return ast.statements
    .filter((s) => s.kind === K.ExportDeclaration && !s.exportClause)
    .map((s) => code.slice(s.pos, s.end))
    .reduce((acc, str) => `${acc}${str};\n`, '\n')
}

function getExportedNamesFromTsAst(ast) {
  return ast.statements.flatMap((s) =>
    s.kind === K.FunctionDeclaration &&
    s.modifiers?.some((m) => m.kind === K.ExportKeyword)
      ? s.name.escapedText
      : s.kind === K.ExportDeclaration && s.exportClause
      ? s.exportClause.elements?.map((e) => e.name.escapedText) ??
        s.exportClause.name.escapedText
      : s.kind === K.ExportAssignment
      ? 'default'
      : [],
  )
}

function convertMethodsToNamedExports(methods, endpoint) {
  return methods.reduce((acc, method) => {
    const prefix = method === 'default' ? 'default' : `const ${method} =`
    return `${acc}export ${prefix} __telecall__('${endpoint}', '${method}');\n`
  }, '')
}

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
