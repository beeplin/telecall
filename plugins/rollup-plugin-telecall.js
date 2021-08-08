import { createFilter, normalizePath } from '@rollup/pluginutils'
import { relative } from 'path'
import { createSourceFile as getTsAst, ScriptTarget, SyntaxKind as K } from 'typescript'

const SEP = '?telecallPath='

export default function telecall(opts) {
  const isTelecall = createFilter(opts.include, opts.exclude)

  return {
    name: 'telecall',

    async resolveId(source, importer) {
      const [importerPath, targetPath] = importer?.split(SEP) ?? ''
      const resolved = await this.resolve(source, importerPath, { skipSelf: true })
      const id = resolved?.id
      return targetPath || isTelecall(id)
        ? id + SEP + (targetPath ?? getRelativePath(id, opts))
        : id
    },

    // async load(id) {
    //   const [filePath, telecallPath] = id.split(SEP)
    //   if (!telecallPath) return null
    //   return convertTsToExportsByEsbuildAndRegex_SLOW_UNSAFE(filePath, telecallPath)
    // },

    transform(code, id) {
      const [filePath, targetPath] = id.split(SEP)
      if (!targetPath) return null
      return convertTsToExportsByTsAst(filePath, code, targetPath, opts)
    },
  }
}

// eslint-disable-next-line max-params
function convertTsToExportsByTsAst(filePath, code, targetPath, opts) {
  const ast = getTsAst(filePath, code, ScriptTarget.Latest)
  const allExports = getAllExportsFromTsAstAndCode(ast, code)
  const names = getExportedNamesFromTsAst(ast)
  const namedExports = convertNamesToNamedExports(names, targetPath, opts)
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

function convertNamesToNamedExports(names, targetPath, opts) {
  return names.reduce((acc, name) => {
    const prefix = name === 'default' ? 'default' : `const ${name} =`
    return `${acc}
      export ${prefix} {  
        endpoint: '${opts.endpoint}', 
        path: '${targetPath}', 
        name: '${name}', 
        persistence: '${opts.persistence}' 
      };
    `
  }, '')
}

function getRelativePath(absPath, opts) {
  return normalizePath(relative(opts.root, relative(process.cwd(), absPath)))
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
