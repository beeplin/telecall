const { parseImport } = require('../convert-import')

describe('convertImport', () => {
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
