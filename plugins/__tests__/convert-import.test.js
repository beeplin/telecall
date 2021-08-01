const { convertImport } = require('../convert-import')

describe('convertImport', () => {
  it('import _default from', () => {
    expect(convertImport('import a from "path"')).toStrictEqual([
      { localName: 'a', name: 'default', path: 'path' },
    ])
  })
})
