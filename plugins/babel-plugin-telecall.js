// const path = require('path')
// const { isTele, getRelativePath } = require('./utils')

// module.exports = ({ types: t }) => ({
//   visitor: {
//     // eslint-disable-next-line @typescript-eslint/naming-convention
//     ImportDeclaration(p, { file, opts }) {
//       const targetFullPath = path.resolve(
//         path.dirname(file.opts.filename),
//         p.node.source.value,
//       )
//       if (!isTele(targetFullPath, opts)) return
//       const targetPath = getRelativePath(targetFullPath, opts)
//       p.replaceWith(
//         t.variableDeclaration(
//           'const',
//           p.node.specifiers.map((s) =>
//             t.variableDeclarator(
//               t.identifier(s.local.name),
//               t.objectExpression([
//                 t.objectProperty(t.stringLiteral('path'), t.stringLiteral(targetPath)),
//                 t.objectProperty(
//                   t.stringLiteral('name'),
//                   t.stringLiteral(
//                     s.type === 'ImportSpecifier' ? s.imported.name : 'default',
//                   ),
//                 ),
//               ]),
//             ),
//           ),
//         ),
//       )
//     },
//   },
// })
