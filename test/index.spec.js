const CSV = require('../src')
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
  type: 'custom'
}]

describe('CSV', () => {
  test('should create correct CSV instance', () => {
    const csv = new CSV({
      schema
    })

    expect(csv).toHaveProperty('schema', schema)
    expect(csv).toHaveProperty('encoding', 'utf8')
    expect(csv).toHaveProperty('blob', null)
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
    const str = csv.parse(items)
    expect(str).toEqual('"xxx","yyy","zzz","aaa","bbb","ccc"\n"xxx","true","2","Mon Jan 01 2018 00:00:00 GMT+0800 (CST)","bbb","ccc"')
    expect(csv.toString()).toEqual('"xxx","yyy","zzz","aaa","bbb","ccc"\n"xxx","true","2","Mon Jan 01 2018 00:00:00 GMT+0800 (CST)","bbb","ccc"')
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
    const str = csv.parse(items)
    expect(str).toEqual('"xxx","true","2","Mon Jan 01 2018 00:00:00 GMT+0800 (CST)","bbb","ccc"')
    expect(csv.toString()).toEqual('"xxx","true","2","Mon Jan 01 2018 00:00:00 GMT+0800 (CST)","bbb","ccc"')
  })

  test('should parse correct', (done) => {
    const csv = new CSV({
      schema
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

  test('should covert correct if directly call convert', () => {
    const csv = new CSV({
      schema
    })
    const items = require('./data.json')
    const str = csv.parse(items)
    expect(str).toEqual('"xxx","yyy","zzz","aaa","bbb","ccc"\n"xxx","true","2","Mon Jan 01 2018 00:00:00 GMT+0800 (CST)","bbb","ccc"')
    expect(csv.toString()).toEqual('"xxx","yyy","zzz","aaa","bbb","ccc"\n"xxx","true","2","Mon Jan 01 2018 00:00:00 GMT+0800 (CST)","bbb","ccc"')
  })

  test('should return dataURL', () => {
    const csv = new CSV({
      schema
    })
    expect(csv.getDataURL).toThrowError('No data')
  })
})
