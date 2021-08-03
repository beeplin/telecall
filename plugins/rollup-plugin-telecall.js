import { createFilter, normalizePath } from '@rollup/pluginutils'
import { relative } from 'path'
import { createSourceFile as getTsAst, ScriptTarget, SyntaxKind } from 'typescript'

const SEP = '?telecallPath='

export default function telecall(options) {
  const isTelecall = createFilter(options.include, options.exclude)

  return {
    name: 'telecall',

    async resolveId(source, importer) {
      const [importerPath, telecallPath] = importer?.split(SEP) ?? ''
      const resolved = await this.resolve(source, importerPath, { skipSelf: true })
      const id = resolved?.id
      return telecallPath || isTelecall(id)
        ? id + SEP + (telecallPath ?? getRelativePath(id, options.root))
        : id
    },

    // async load(id) {
    //   const [filePath, telecallPath] = id.split(SEP)
    //   if (!telecallPath) return null
    //   return convertTsToExportsByEsbuildAndRegex_SLOW_UNSAFE(filePath, telecallPath)
    // },

    transform(code, id) {
      const [filePath, telecallPath] = id.split(SEP)
      if (!telecallPath) return null
      return convertTsToExportsByTsAst(filePath, code, telecallPath)
    },
  }
}

function convertTsToExportsByTsAst(filePath, code, telecallPath) {
  const ast = getTsAst(filePath, code, ScriptTarget.Latest)
  const allExports = getAllExportsFromTsAstAndCode(ast, code)
  const names = getExportedNamesFromTsAst(ast)
  const namedExports = convertNamesToNamedExports(names, telecallPath)
  return namedExports + allExports
}

function getAllExportsFromTsAstAndCode(ast, code) {
  return ast.statements
    .filter((s) => s.kind === SyntaxKind.ExportDeclaration && !s.exportClause)
    .map((s) => code.slice(s.pos, s.end))
    .reduce((acc, str) => `${acc}${str};\n`, '\n')
}

function getExportedNamesFromTsAst(ast) {
  return ast.statements.flatMap((s) =>
    s.kind === SyntaxKind.FunctionDeclaration &&
    s.modifiers?.some((m) => m.kind === SyntaxKind.ExportKeyword)
      ? s.name.escapedText
      : s.kind === SyntaxKind.ExportDeclaration && s.exportClause
      ? s.exportClause.elements?.map((e) => e.name.escapedText) ??
        s.exportClause.name.escapedText
      : s.kind === SyntaxKind.ExportAssignment
      ? 'default'
      : [],
  )
}

function convertNamesToNamedExports(names, telecallPath) {
  return names.reduce((acc, name) => {
    const prefix = name === 'default' ? 'default' : `const ${name} =`
    return `${acc}export ${prefix} { path: '${telecallPath}', name: '${name}' };\n`
  }, '\n')
}

function getRelativePath(absPath, root) {
  return normalizePath(relative(root, relative(process.cwd(), absPath)))
}

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
