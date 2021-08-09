import { createFilter, normalizePath } from '@rollup/pluginutils'
import { relative } from 'path'
import { createSourceFile as getTsAst, ScriptTarget, SyntaxKind as K } from 'typescript'

const SEP = '?telecall:'

export default function telecall(opts) {
  return {
    name: 'telecall',

    async resolveId(source, importer) {
      const [importerPath, targetPath, _targetName] = importer?.split(SEP) ?? ''
      const resolved = await this.resolve(source, importerPath, { skipSelf: true })
      const id = resolved?.id
      const targetName =
        _targetName ??
        Object.keys(opts).find((name) => {
          const { include, exclude } = opts[name]
          const isTelecall = createFilter(include, exclude)
          return isTelecall(id)
        })
      if (!targetPath && !targetName) return id
      return (
        id +
        SEP +
        (targetPath ?? getRelativePath(id, opts[targetName].root)) +
        SEP +
        targetName
      )
    },

    // async load(id) {
    //   const [filePath, telecallPath] = id.split(SEP)
    //   if (!telecallPath) return null
    //   return convertTsToExportsByEsbuildAndRegex_SLOW_UNSAFE(filePath, telecallPath)
    // },

    transform(code, id) {
      const [filePath, targetPath, targetName] = id.split(SEP)
      if (!targetPath) return null
      const { endpoint, persistence } = opts[targetName]
      return convertTsToExportsByTsAst(
        filePath,
        code,
        targetPath,
        endpoint,
        persistence,
      )
    },
  }
}

// eslint-disable-next-line max-params
function convertTsToExportsByTsAst(filePath, code, targetPath, endpoint, persistence) {
  const ast = getTsAst(filePath, code, ScriptTarget.Latest)
  const allExports = getAllExportsFromTsAstAndCode(ast, code)
  const names = getExportedNamesFromTsAst(ast)
  const namedExports = convertNamesToNamedExports(
    names,
    targetPath,
    endpoint,
    persistence,
  )
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

// eslint-disable-next-line max-params
function convertNamesToNamedExports(names, targetPath, endpoint, persistence) {
  return names.reduce((acc, name) => {
    const prefix = name === 'default' ? 'default' : `const ${name} =`
    return `${acc}
      export ${prefix} {  
        endpoint: '${endpoint}', 
        path: '${targetPath}', 
        name: '${name}', 
        persistence: '${persistence}' 
      };
    `
  }, '')
}

function getRelativePath(absPath, root) {
  return normalizePath(
    relative(root, relative(process.cwd(), absPath.replace(/\.ts$/, '.js'))),
  )
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
