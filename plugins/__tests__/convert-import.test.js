const { convertImport } = require('../convert-import')

describe('convertImport', () => {
  it('import a from "path"', () => {
    expect(convertImport('import a from "path"')).toStrictEqual([
      { localName: 'a', name: 'default', path: 'path' },
    ])
  })

  it('import   aaa   from   "path"_', () => {
    expect(convertImport('import   aaa   from   "path" ')).toStrictEqual([
      { localName: 'aaa', name: 'default', path: 'path' },
    ])
  })

  it('import   aaa   from"path"_', () => {
    expect(convertImport('import   aaa   from"path" ')).toStrictEqual([
      { localName: 'aaa', name: 'default', path: 'path' },
    ])
  })

  it('import { a } from "path"', () => {
    expect(convertImport('import { a } from "path"')).toStrictEqual([
      { localName: 'a', name: 'a', path: 'path' },
    ])
  })

  it('import { a as b } from "path"', () => {
    expect(convertImport('import { a as b } from "path"')).toStrictEqual([
      { localName: 'b', name: 'a', path: 'path' },
    ])
  })

  it('import{a as b}from"path"', () => {
    expect(convertImport('import{a as b}from"path"')).toStrictEqual([
      { localName: 'b', name: 'a', path: 'path' },
    ])
  })

  it('import    {a    as   b  }   from    "path"', () => {
    expect(convertImport('import    {a    as   b  }   from    "path"')).toStrictEqual([
      { localName: 'b', name: 'a', path: 'path' },
    ])
  })

  it('import { a as b,c,d as eee } from "path"', () => {
    expect(convertImport('import { a as b,c,d as eee } from "path"')).toStrictEqual([
      { localName: 'b', name: 'a', path: 'path' },
      { localName: 'c', name: 'c', path: 'path' },
      { localName: 'eee', name: 'd', path: 'path' },
    ])
  })

  it('import def, { a as b,c,d as eee } from "path"', () => {
    expect(
      convertImport('import def, { a as b,c,d as eee } from "path"'),
    ).toStrictEqual([
      { localName: 'def', name: 'default', path: 'path' },
      { localName: 'b', name: 'a', path: 'path' },
      { localName: 'c', name: 'c', path: 'path' },
      { localName: 'eee', name: 'd', path: 'path' },
    ])
  })

  it('import { a as b,c,d as eee }, def from "path"', () => {
    expect(
      convertImport('import { a as b,c,d as eee }, def from "path"'),
    ).toStrictEqual([
      { localName: 'def', name: 'default', path: 'path' },
      { localName: 'b', name: 'a', path: 'path' },
      { localName: 'c', name: 'c', path: 'path' },
      { localName: 'eee', name: 'd', path: 'path' },
    ])
  })

  it('import * as aaa from "path"', () => {
    expect(convertImport('import * as aaa from "path"')).toStrictEqual([
      { localName: 'aaa', name: '*', path: 'path' },
    ])
  })

  it('import * as aaa, { a as b,c,d as eee }, def from "path"', () => {
    expect(
      convertImport('import * as aaa, { a as b,c,d as eee }, def from "path"'),
    ).toStrictEqual([
      { localName: 'aaa', name: '*', path: 'path' },
      { localName: 'def', name: 'default', path: 'path' },
      { localName: 'b', name: 'a', path: 'path' },
      { localName: 'c', name: 'c', path: 'path' },
      { localName: 'eee', name: 'd', path: 'path' },
    ])
  })

  it('import { a as b,c,d as eee }, def, * as aaa   from "path"', () => {
    expect(
      convertImport('import { a as b,c,d as eee }, def, * as aaa   from "path"'),
    ).toStrictEqual([
      { localName: 'aaa', name: '*', path: 'path' },
      { localName: 'def', name: 'default', path: 'path' },
      { localName: 'b', name: 'a', path: 'path' },
      { localName: 'c', name: 'c', path: 'path' },
      { localName: 'eee', name: 'd', path: 'path' },
    ])
  })
})
