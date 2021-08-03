import { createFilter, normalizePath } from '@rollup/pluginutils'
import { relative } from 'path'
import { createSourceFile, ScriptTarget, SyntaxKind } from 'typescript'

const SEP = '?telecallPath='

export default function telecall(options) {
  const isTelecall = createFilter(options.include, options.exclude)

  return {
    name: 'telecall',
    async resolveId(source, importer) {
      const [sourcePath] = source.split(SEP)
      const [importerPath, importerTelecallPath] = importer?.split(SEP) ?? ''
      const resolved = await this.resolve(sourcePath, importerPath, { skipSelf: true })
      const id = resolved?.id
      return importerTelecallPath || isTelecall(id)
        ? id + SEP + (importerTelecallPath ?? getRelativePath(id, options.root))
        : id
    },

    async transform(code, id) {
      const [filePath, telecallPath] = id.split(SEP)
      if (!telecallPath) return null
      const ast = createSourceFile(filePath, code, ScriptTarget.Latest)
      const names = ast.statements.flatMap((s) =>
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
      const namedExports = names.reduce((acc, name) => {
        const prefix = name === 'default' ? 'default' : `const ${name} =`
        return `${acc}export ${prefix} { path: '${telecallPath}', name: '${name}' };\n`
      }, '\n')
      const allExports = ast.statements
        .filter((s) => s.kind === SyntaxKind.ExportDeclaration && !s.exportClause)
        .map((s) => code.slice(s.pos, s.end))
        .reduce((acc, str) => `${acc}${str};\n`, '\n')
      return namedExports + allExports
    },
  }
}

export function getRelativePath(fullPath, root) {
  return normalizePath(relative(root, relative(process.cwd(), fullPath)))
}
