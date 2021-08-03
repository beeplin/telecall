import { createSourceFile, ScriptTarget, SyntaxKind } from 'typescript'
import { getRelativePath } from './utils'

// import { convertTele, isTele } from './utils'
const { createFilter } = require('@rollup/pluginutils')

const POST = '?telecall'

export default function telecall(options) {
  const filter = createFilter(options.include, options.exclude)

  return {
    name: 'telecall',
    async resolveId(source, importer) {
      const original = source?.endsWith(POST) ? source.slice(0, -POST.length) : source
      const { id } = (await this.resolve(original, importer, { skipSelf: true })) ?? {}
      const res = filter(id) || importer?.endsWith(POST) ? id + POST : null
      const importerPath = this.getModuleInfo(importer).meta?.telecall?.path
      const info = this.getModuleInfo(res)
      info.meta = { telecall: { path: importerPath ?? getRelativePath(id, options) } }
      // console.log(11111, { source, importer, id, res, info })
      return res
    },

    async transform(code, id) {
      if (!id?.endsWith(POST)) return null
      console.log(333, this.getModuleInfo(id))
      const fullPath = id.slice(0, -POST.length)
      const ast = createSourceFile(id, code, ScriptTarget.Latest)
      console.log(222, fullPath, code)
      const {path} = this.getModuleInfo(id).meta.telecall
      const names = ast.statements
        .map((n) =>
          n.kind === SyntaxKind.FunctionDeclaration &&
          n.modifiers?.some((m) => m.kind === SyntaxKind.ExportKeyword)
            ? n.name.escapedText
            : n.kind === SyntaxKind.ExportDeclaration && n.exportClause
            ? n.exportClause.elements?.map((e) => e.name.escapedText) ??
              n.exportClause.name.escapedText
            : n.kind === SyntaxKind.ExportAssignment
            ? 'default'
            : [],
        )
        .flatMap((n) => n)
      const namedExports = names.reduce((acc, name) => {
        const prefix = name === 'default' ? 'default' : `const ${name} =`
        return `${acc}export ${prefix} { path: '${path}', name: '${name}' };\n`
      }, '\n')
      const allExports = ast.statements
        .filter((n) => n.kind === SyntaxKind.ExportDeclaration && !n.exportClause)
        .map((node) => code.slice(node.pos, node.end))
        .reduce((acc, statement) => `${acc}${statement};\n`, '\n')
      console.log(444, { namedExports, allExports })
      return namedExports + allExports
    },
  }
}
