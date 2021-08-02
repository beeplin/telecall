/* eslint-disable no-eval */

const {
  parseImportString,
  convertImportByRegex,
  convertImportByAst,
} = require('../convert-import')

describe('parseImportString', () => {
  it('a', () => {
    expect(parseImportString('a')).toStrictEqual([{ local: 'a', imported: 'default' }])
  })

  it('aaa', () => {
    expect(parseImportString('aaa')).toStrictEqual([
      { local: 'aaa', imported: 'default' },
    ])
  })

  it('_aaa_', () => {
    expect(parseImportString('   aaa   ')).toStrictEqual([
      { local: 'aaa', imported: 'default' },
    ])
  })

  it('{ a }', () => {
    expect(parseImportString(' { a } ')).toStrictEqual([{ local: 'a', imported: 'a' }])
  })

  it('{ a as b }', () => {
    expect(parseImportString(' { a as b } ')).toStrictEqual([
      { local: 'b', imported: 'a' },
    ])
  })

  it('{a as b}', () => {
    expect(parseImportString('{a as b}')).toStrictEqual([{ local: 'b', imported: 'a' }])
  })

  it('{a    as   b  }', () => {
    expect(parseImportString('    {a    as   b  } ')).toStrictEqual([
      { local: 'b', imported: 'a' },
    ])
  })

  it('{ a as b,c,d as eee }', () => {
    expect(parseImportString(' { a as b,c,d as eee } ')).toStrictEqual([
      { local: 'b', imported: 'a' },
      { local: 'c', imported: 'c' },
      { local: 'eee', imported: 'd' },
    ])
  })

  it('def, { a as b,c,d as eee }', () => {
    expect(parseImportString(' def, { a as b,c,d as eee } ')).toStrictEqual([
      { local: 'def', imported: 'default' },
      { local: 'b', imported: 'a' },
      { local: 'c', imported: 'c' },
      { local: 'eee', imported: 'd' },
    ])
  })

  it('{ a as b,c,d as eee }, def', () => {
    expect(parseImportString(' { a as b,c,d as eee }, def ')).toStrictEqual([
      { local: 'def', imported: 'default' },
      { local: 'b', imported: 'a' },
      { local: 'c', imported: 'c' },
      { local: 'eee', imported: 'd' },
    ])
  })

  it('* as aaa', () => {
    expect(parseImportString(' * as aaa ')).toStrictEqual([
      { local: 'aaa', imported: '*' },
    ])
  })

  it('* as aaa, def', () => {
    expect(parseImportString(' * as aaa, def ')).toStrictEqual([
      { local: 'aaa', imported: '*' },
      { local: 'def', imported: 'default' },
    ])
  })

  it('* as aaa, { a as b,c,d as eee }, def', () => {
    expect(parseImportString(' * as aaa, { a as b,c,d as eee }, def ')).toStrictEqual([
      { local: 'aaa', imported: '*' },
      { local: 'def', imported: 'default' },
      { local: 'b', imported: 'a' },
      { local: 'c', imported: 'c' },
      { local: 'eee', imported: 'd' },
    ])
  })

  it('{ a as b,c,d as eee }, def, * as aaa', () => {
    expect(parseImportString(' { a as b,c,d as eee }, def, * as aaa   ')).toStrictEqual(
      [
        { local: 'aaa', imported: '*' },
        { local: 'def', imported: 'default' },
        { local: 'b', imported: 'a' },
        { local: 'c', imported: 'c' },
        { local: 'eee', imported: 'd' },
      ],
    )
  })
})

describe('convertImportByRegex', () => {
  it('single import', () => {
    const converted = convertImportByRegex(`
    import{ a as b,c,d as eee},def,* as aaa from"path"
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
    const converted = convertImportByRegex(`
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

  it('multiple imports with semicolons and line breaks', () => {
    const converted = convertImportByRegex(`
    const bbb = 1
    import { a as b,c,d as eee }, def, * as aaa   from "path"; import a2, {b2, c as c2}, * as d2  from "path2"
    const ccc = 1
    import { 
      a as b3,
      c3,
      d as eee3 
    }, def3, * as aaa3   from "path3"; const ddd = 1; import a4, {b4, c as c4}, 
    * as d4  from "path4"
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

  it('multiple imports with semicolons and comments', () => {
    const converted = convertImportByRegex(`
    const bbb = 1
    import { a as b,c,d as eee }, def, * as aaa   from "path"; import a2, {b2, c as c2}, * as d2  from "path2"
    // import { a as b,c,d as eee }, def, * as aaa   from "path"; import a2, {b2, c as c2}, * as d2  from "path2"
    const ccc = 1
    import { 
      a as b3,
      // test
      c3,
      /* aaa */
      d as eee3 
    }, def3, * as aaa3   from "path3"; const ddd = 1; import a4, {b4, c as c4}, 
    * as d4  from "path4"
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
})

describe('convertImportByAst', () => {
  it('single import', () => {
    const converted = convertImportByAst(`
    import def,{a as b,c,d as eee} from "path"
    import * as aaa from 'path'
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
    const converted = convertImportByAst(`
    const bbb = 1
    import def,{a as b,c,d as eee} from "path"
    import * as aaa from 'path'
    import a2, {b2, c as c2}   from "path2"
    import  * as d2  from "path2"
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

  it('multiple imports with semicolons and line breaks', () => {
    const converted = convertImportByAst(`
    const bbb = 1
    import def, { a as b,c,d as eee }  from "path"; import a2, {b2, c as c2}  from "path2"
    import * as aaa   from "path"; import * as d2  from "path2"
    const ccc = 1
    import def3, { 
      a as b3,
      c3,
      d as eee3 
    }  from "path3"; import * as aaa3   from "path3"; const ddd = 1; import a4, {b4, c as c4} 
     from "path4"
    import * as d4  from "path4"
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

  it('multiple imports with semicolons and comments', () => {
    const converted = convertImportByAst(`
    const bbb = 1
    // comment
    import def, { a as b,c,d as eee }  from "path"; import a2, {b2, c as c2}  from "path2"
    import * as aaa /* comment */  from "path"; import * as d2  from "path2"
    const ccc = 1
    import def3, { 
      a as b3,
      c3, /* comment */
      d as eee3 
      // comment
    }  from "path3"; import * as aaa3   from "path3"; const ddd = 1; import a4, {b4, c as c4} 
     from "path4"
    import * as d4  from "path4"
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

  it('multiple imports with semicolons and imports in strings', () => {
    const converted = convertImportByAst(`
    const bbb = 1
    // comment
    const string = \`import def, { a as b,c,d as eee }  from "path"; import a2, {b2, c as c2}  from "path2"\`
    import def, { a as b,c,d as eee }  from "path"; import a2, {b2, c as c2}  from "path2"
    import * as aaa /* comment */  from "path"; import * as d2  from "path2"
    const ccc = 1
    import def3, { 
      a as b3,
      c3, /* comment */
      d as eee3 
      // comment
    }  from "path3"; import * as aaa3   from "path3"; const ddd = 1; import a4, {b4, c as c4} 
     from "path4"
    import * as d4  from "path4"
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
