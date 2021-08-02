/* eslint-disable no-eval */
const { parseImport, convertImport } = require('../convert-import')

describe('parseImport', () => {
  it('import a from "path"', () => {
    expect(parseImport('import a from "path"')).toStrictEqual({
      path: 'path',
      names: [{ local: 'a', imported: 'default' }],
    })
  })

  it('import   aaa   from   "path"_', () => {
    expect(parseImport('import   aaa   from   "path" ')).toStrictEqual({
      path: 'path',
      names: [{ local: 'aaa', imported: 'default' }],
    })
  })

  it('import   aaa   from"path"_', () => {
    expect(parseImport('import   aaa   from"path" ')).toStrictEqual({
      path: 'path',
      names: [{ local: 'aaa', imported: 'default' }],
    })
  })

  it('import { a } from "path"', () => {
    expect(parseImport('import { a } from "path"')).toStrictEqual({
      path: 'path',
      names: [{ local: 'a', imported: 'a' }],
    })
  })

  it('import { a as b } from "path"', () => {
    expect(parseImport('import { a as b } from "path"')).toStrictEqual({
      path: 'path',
      names: [{ local: 'b', imported: 'a' }],
    })
  })

  it('import{a as b}from"path"', () => {
    expect(parseImport('import{a as b}from"path"')).toStrictEqual({
      path: 'path',
      names: [{ local: 'b', imported: 'a' }],
    })
  })

  it('import    {a    as   b  }   from    "path"', () => {
    expect(parseImport('import    {a    as   b  }   from    "path"')).toStrictEqual({
      path: 'path',
      names: [{ local: 'b', imported: 'a' }],
    })
  })

  it('import { a as b,c,d as eee } from "path"', () => {
    expect(parseImport('import { a as b,c,d as eee } from "path"')).toStrictEqual({
      path: 'path',
      names: [
        { local: 'b', imported: 'a' },
        { local: 'c', imported: 'c' },
        { local: 'eee', imported: 'd' },
      ],
    })
  })

  it('import def, { a as b,c,d as eee } from "path"', () => {
    expect(parseImport('import def, { a as b,c,d as eee } from "path"')).toStrictEqual({
      path: 'path',
      names: [
        { local: 'def', imported: 'default' },
        { local: 'b', imported: 'a' },
        { local: 'c', imported: 'c' },
        { local: 'eee', imported: 'd' },
      ],
    })
  })

  it('import { a as b,c,d as eee }, def from "path"', () => {
    expect(parseImport('import { a as b,c,d as eee }, def from "path"')).toStrictEqual({
      path: 'path',
      names: [
        { local: 'def', imported: 'default' },
        { local: 'b', imported: 'a' },
        { local: 'c', imported: 'c' },
        { local: 'eee', imported: 'd' },
      ],
    })
  })

  it('import * as aaa from "path"', () => {
    expect(parseImport('import * as aaa from "path"')).toStrictEqual({
      path: 'path',
      names: [{ local: 'aaa', imported: '*' }],
    })
  })

  it('import * as aaa, def from "path"', () => {
    expect(parseImport('import * as aaa, def from "path"')).toStrictEqual({
      path: 'path',
      names: [
        { local: 'aaa', imported: '*' },
        { local: 'def', imported: 'default' },
      ],
    })
  })

  it('import * as aaa, { a as b,c,d as eee }, def from "path"', () => {
    expect(
      parseImport('import * as aaa, { a as b,c,d as eee }, def from "path"'),
    ).toStrictEqual({
      path: 'path',
      names: [
        { local: 'aaa', imported: '*' },
        { local: 'def', imported: 'default' },
        { local: 'b', imported: 'a' },
        { local: 'c', imported: 'c' },
        { local: 'eee', imported: 'd' },
      ],
    })
  })

  it('import { a as b,c,d as eee }, def, * as aaa   from "path"', () => {
    expect(
      parseImport('import { a as b,c,d as eee }, def, * as aaa   from "path"'),
    ).toStrictEqual({
      path: 'path',
      names: [
        { local: 'aaa', imported: '*' },
        { local: 'def', imported: 'default' },
        { local: 'b', imported: 'a' },
        { local: 'c', imported: 'c' },
        { local: 'eee', imported: 'd' },
      ],
    })
  })
})

describe('convertImport', () => {
  it('single import', () => {
    const converted = convertImport(`
    import { a as b,c,d as eee }, def, * as aaa   from "path"
    module.exports = {b, c, eee, def, aaa}
    `)
    eval(converted)

    expect(module.exports).toMatchObject({
      b: { path: 'path', name: 'a' },
      c: { path: 'path', name: 'c' },
      eee: { path: 'path', name: 'd' },
      def: { path: 'path', name: 'default' },
    })
    expect(module.exports.aaa.xxx).toStrictEqual({ path: 'path', name: 'xxx' })
    expect(module.exports.aaa.yy).toStrictEqual({ path: 'path', name: 'yy' })
    expect(module.exports.aaa.a).toStrictEqual({ path: 'path', name: 'a' })
    expect(module.exports.aaa.d).toStrictEqual({ path: 'path', name: 'd' })
  })

  it('multiple imports', () => {
    const converted = convertImport(`
    const bbb = 1
    import { a as b,c,d as eee }, def, * as aaa   from "path"
    import a2, {b2, c as c2}, * as d2  from "path2"
    module.exports = {b, c, eee, def, aaa, a2, b2, c2, d2}
    `)
    eval(converted)

    expect(module.exports).toMatchObject({
      b: { path: 'path', name: 'a' },
      c: { path: 'path', name: 'c' },
      eee: { path: 'path', name: 'd' },
      def: { path: 'path', name: 'default' },
      a2: { path: 'path2', name: 'default' },
      b2: { path: 'path2', name: 'b2' },
      c2: { path: 'path2', name: 'c' },
    })
    expect(module.exports.aaa.xxx).toStrictEqual({ path: 'path', name: 'xxx' })
    expect(module.exports.aaa.yy).toStrictEqual({ path: 'path', name: 'yy' })
    expect(module.exports.aaa.a).toStrictEqual({ path: 'path', name: 'a' })
    expect(module.exports.aaa.d).toStrictEqual({ path: 'path', name: 'd' })
    expect(module.exports.d2.d).toStrictEqual({ path: 'path2', name: 'd' })
    expect(module.exports.d2.abcd).toStrictEqual({ path: 'path2', name: 'abcd' })
  })

  it('multiple imports with semicolons', () => {
    const converted = convertImport(`
    const bbb = 1
    import { a as b,c,d as eee }, def, * as aaa   from "path"; import a2, {b2, c as c2}, * as d2  from "path2"
    const ccc = 1
    import { a as b3,c3,d as eee3 }, def3, * as aaa3   from "path3"; const ddd = 1; import a4, {b4, c as c4}, * as d4  from "path4"
    module.exports = {b, c, eee, def, aaa, a2, b2, c2, d2, b3, c3, eee3, def3, aaa3, a4, b4, c4, d4}
    `)
    eval(converted)

    expect(module.exports).toMatchObject({
      b: { path: 'path', name: 'a' },
      c: { path: 'path', name: 'c' },
      eee: { path: 'path', name: 'd' },
      def: { path: 'path', name: 'default' },
      a2: { path: 'path2', name: 'default' },
      b2: { path: 'path2', name: 'b2' },
      c2: { path: 'path2', name: 'c' },
      b3: { path: 'path3', name: 'a' },
      c3: { path: 'path3', name: 'c3' },
      eee3: { path: 'path3', name: 'd' },
      def3: { path: 'path3', name: 'default' },
      a4: { path: 'path4', name: 'default' },
      b4: { path: 'path4', name: 'b4' },
      c4: { path: 'path4', name: 'c' },
    })
    expect(module.exports.aaa.xxx).toStrictEqual({ path: 'path', name: 'xxx' })
    expect(module.exports.aaa.yy).toStrictEqual({ path: 'path', name: 'yy' })
    expect(module.exports.aaa.a).toStrictEqual({ path: 'path', name: 'a' })
    expect(module.exports.aaa.d).toStrictEqual({ path: 'path', name: 'd' })
    expect(module.exports.d2.d).toStrictEqual({ path: 'path2', name: 'd' })
    expect(module.exports.d2.abcd).toStrictEqual({ path: 'path2', name: 'abcd' })
    expect(module.exports.aaa3.xxx).toStrictEqual({ path: 'path3', name: 'xxx' })
    expect(module.exports.aaa3.yy).toStrictEqual({ path: 'path3', name: 'yy' })
    expect(module.exports.aaa3.a).toStrictEqual({ path: 'path3', name: 'a' })
    expect(module.exports.aaa3.d).toStrictEqual({ path: 'path3', name: 'd' })
    expect(module.exports.d4.d).toStrictEqual({ path: 'path4', name: 'd' })
    expect(module.exports.d4.abcd).toStrictEqual({ path: 'path4', name: 'abcd' })
  })

  it.skip('multiple imports with semicolons and imports in strings', () => {
    const converted = convertImport(`
    const bbb = 1
    const fake = 'import { a as b,c,d as eee }, def, * as aaa   from "path"; import a2, {b2, c as c2}, * as d2  from "path2"'
    import { a as b,c,d as eee }, def, * as aaa   from "path"; import a2, {b2, c as c2}, * as d2  from "path2"
    const ccc = 1
    import { a as b3,c3,d as eee3 }, def3, * as aaa3   from "path3"; const ddd = 1; import a4, {b4, c as c4}, * as d4  from "path4"
    module.exports = {b, c, eee, def, aaa, a2, b2, c2, d2, b3, c3, eee3, def3, aaa3, a4, b4, c4, d4}
    `)
    console.log(
      '🚀 ~ file: convert-import.test.js ~ line 187 ~ it ~ converted',
      converted,
    )
    eval(converted)

    expect(module.exports).toMatchObject({
      b: { path: 'path', name: 'a' },
      c: { path: 'path', name: 'c' },
      eee: { path: 'path', name: 'd' },
      def: { path: 'path', name: 'default' },
      a2: { path: 'path2', name: 'default' },
      b2: { path: 'path2', name: 'b2' },
      c2: { path: 'path2', name: 'c' },
      b3: { path: 'path3', name: 'a' },
      c3: { path: 'path3', name: 'c3' },
      eee3: { path: 'path3', name: 'd' },
      def3: { path: 'path3', name: 'default' },
      a4: { path: 'path4', name: 'default' },
      b4: { path: 'path4', name: 'b4' },
      c4: { path: 'path4', name: 'c' },
    })
    expect(module.exports.aaa.xxx).toStrictEqual({ path: 'path', name: 'xxx' })
    expect(module.exports.aaa.yy).toStrictEqual({ path: 'path', name: 'yy' })
    expect(module.exports.aaa.a).toStrictEqual({ path: 'path', name: 'a' })
    expect(module.exports.aaa.d).toStrictEqual({ path: 'path', name: 'd' })
    expect(module.exports.d2.d).toStrictEqual({ path: 'path2', name: 'd' })
    expect(module.exports.d2.abcd).toStrictEqual({ path: 'path2', name: 'abcd' })
    expect(module.exports.aaa3.xxx).toStrictEqual({ path: 'path3', name: 'xxx' })
    expect(module.exports.aaa3.yy).toStrictEqual({ path: 'path3', name: 'yy' })
    expect(module.exports.aaa3.a).toStrictEqual({ path: 'path3', name: 'a' })
    expect(module.exports.aaa3.d).toStrictEqual({ path: 'path3', name: 'd' })
    expect(module.exports.d4.d).toStrictEqual({ path: 'path4', name: 'd' })
    expect(module.exports.d4.abcd).toStrictEqual({ path: 'path4', name: 'abcd' })
  })
})
