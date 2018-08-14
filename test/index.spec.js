const CSV = require('../src').default
const fs = require('fs')
const path = require('path')

const schema = [{
  key: 'xxx'
}, {
  key: 'yyy',
  type: 'boolean'
}, {
  key: 'zzz',
  type: 'number'
}, {
  key: 'aaa',
  type: 'date'
}, {
  key: 'bbb',
  type: 'string'
}, {
  key: 'ccc',
  type: 'custom',
  formatter: {
    csv: (value, key) => {
      return 'cc'
    },
    json: (value, key) => {
      return 'c'
    }
  }
}]

describe('CSV', () => {
  test('should create correct CSV instance', () => {
    const csv = new CSV({
      schema
    })

    expect(csv).toHaveProperty('schema', schema)
    expect(csv).toHaveProperty('encoding', 'utf8')
    expect(csv).toHaveProperty('buffer', null)
    expect(csv).toHaveProperty('data', '')
    expect(csv).toHaveProperty('withHeader', true)
  })

  test('should throw error if encoding not support', () => {
    const create = () => {
      return new CSV({
        schema,
        encoding: 'xxx'
      })
    }

    expect(create).toThrowError('Encoding Error: xxx is not supported')
  })

  test('should throw error if schema is invalid', () => {
    const create = () => {
      return new CSV({
        schema: [{key: ''}]
      })
    }

    expect(create).toThrowError('Invalid schema presented')
  })

  test('findSchemaByKey should work as expect', () => {
    const csv = new CSV({
      schema
    })

    const schema1 = csv.findSchemaByKey('xxx')
    const schema2 = csv.findSchemaByKey('x')

    expect(schema1).toBe(schema[0])
    expect(schema2).toEqual({
      key: 'x',
      label: 'x',
      type: 'string'
    })
  })

  test('should convert correct', () => {
    const csv = new CSV({
      schema
    })
    const items = require('./data.json')
    csv.parse(items)
    expect(csv.toString()).toEqual('"xxx","yyy","zzz","aaa","bbb","ccc"\n"xxx","false","2","Mon Jan 01 2018","bbb","cc"')
  })

  test('should convert correct with no header', () => {
    const csv = new CSV({
      schema: [{
        key: 'xxx',
        type: 'string'
      }, {
        key: 'yyy',
        type: 'boolean'
      }, {
        key: 'zzz',
        type: 'number'
      }, {
        key: 'aaa',
        type: 'date'
      }, {
        key: 'bbb',
        type: 'string'
      }, {
        key: 'ccc'
      }],
      withHeader: false
    })
    const items = require('./data.json')
    csv.parse(items)
    expect(csv.toString()).toEqual('"xxx","false","2","Mon Jan 01 2018","bbb","ccc"')
  })

  test('should parse correct', (done) => {
    const csv = new CSV({
      schema: [{
        key: 'xxx',
        type: 'string'
      }, {
        key: 'yyy',
        type: 'boolean'
      }, {
        key: 'zzz',
        type: 'number'
      }, {
        key: 'aaa',
        type: 'date'
      }, {
        key: 'bbb',
        type: 'string'
      }, {
        key: 'ccc'
      }],
      withHeader: true
    })
    expect(csv.toJSON()).toEqual([])

    fs.readFile(path.resolve(__dirname, './data.csv'), (err, data) => {
      if (err) {
        throw err
      }

      csv.parse(data)
      const originData = require('./data.json')
      originData[0].aaa = new Date(originData[0].aaa)
      expect(csv.toJSON()).toEqual(originData)
      done()
    })
  })

  test('should parse correct', (done) => {
    const csv = new CSV({
      schema
    })
    expect(csv.toJSON()).toEqual([])

    fs.readFile(path.resolve(__dirname, './data2.csv'), (err, data) => {
      if (err) {
        throw err
      }

      csv.parse(data)
      const originData = require('./data2.json')
      originData[0].aaa = new Date(originData[0].aaa)
      expect(csv.toJSON()).toEqual(originData)
      done()
    })
  })

  test('should parse correct if value is not boolean but type is boolean', (done) => {
    const csv = new CSV({
      schema
    })
    expect(csv.toJSON()).toEqual([])

    fs.readFile(path.resolve(__dirname, './data3.csv'), (err, data) => {
      if (err) {
        throw err
      }

      csv.parse(data)
      const originData = require('./data3.json')
      originData[0].aaa = new Date(originData[0].aaa)
      expect(csv.toJSON()).toEqual(originData)
      done()
    })
  })

  test('should parse correct if csv file has no header', (done) => {
    const csv = new CSV({
      schema,
      withHeader: false
    })
    expect(csv.toJSON()).toEqual([])

    fs.readFile(path.resolve(__dirname, './data-no-header.csv'), (err, data) => {
      if (err) {
        throw err
      }

      csv.parse(data)
      const originData = require('./data3.json')
      originData[0].aaa = new Date(originData[0].aaa)
      expect(csv.toJSON()).toEqual(originData)
      done()
    })
  })

  test('should throw error is parse failed', () => {
    const csv = new CSV({
      schema
    })

    const parse = () => {
      csv.parse({})
    }

    expect(parse).toThrowError('Parse failed, please check input data')
  })

  test('should convert correct if directly call convert', () => {
    const csv = new CSV({
      schema
    })
    const items = require('./data.json')
    csv.convert(items)
    expect(csv.toString()).toEqual('"xxx","yyy","zzz","aaa","bbb","ccc"\n"xxx","false","2","Mon Jan 01 2018","bbb","cc"')
  })

  test('should return url in getDataURL', () => {
    const csv = new CSV({
      schema
    })
    expect(csv.getDataURL()).toBe('')
    const items = require('./data.json')
    csv.parse(items)
    expect(csv.getDataURL()).toBeDefined()
  })
})
