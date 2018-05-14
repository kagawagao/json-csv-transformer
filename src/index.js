// @flow
import jschardet from 'jschardet'
import iconv from 'iconv-lite'

// skip iconv warning
iconv.skipDecodeWarning = true

/**
 * @desc CSV
 * @export
 * @class CSV
 */
export default class CSV {
  /**
   * @desc schema
   * @type {Array<Schema>}
   * @memberof CSV
   */
  schema: Array<Schema>;
  /**
   * @desc encoding
   * @type {string}
   * @memberof CSV
   */
  encoding: string;
  /**
   * @desc File Blob
   * @type {?Blob}
   * @memberof CSV
   */
  blob: ?Blob;
  /**
   * @desc csv data string
   * @type {?string}
   * @memberof CSV
   */
  data: string;
  /**
   * @desc generate csv with header
   * @type {boolean}
   * @memberof CSV
   */
  withHeader: boolean;
  /**
   * Creates an instance of CSV.
   * @param {CSVOption} option option option
   * @param {Array<Schema>} option.schema schema
   * @param {string} [option.encoding=utf8] encoding
   * @param {boolean} [option.widthHeader=true] with header
   * @memberof CSV
   */
  constructor (option: CSVOption) {
    const { schema, encoding = 'utf8', withHeader = true } = option
    this.checkSchema((schema))
    this.checkEncoding(encoding)
    this.schema = schema
    this.encoding = encoding
    this.blob = null
    this.data = ''
    this.withHeader = !!withHeader
  }

  /**
   * @desc check schema
   * @throws {TypeError} Invalid schema presented
   * @memberof CSV
   */
  checkSchema = (schema: Array<Schema>) => {
    const validSchema = schema.every(item => item.key)
    if (!validSchema) {
      throw new TypeError('Invalid schema presented')
    }
  }

  /**
   * @desc check encoding
   * @param {string} encoding
   * @throws {TypeError} Encoding Not Support
   * @memberof CSV
   */
  checkEncoding = (encoding: string): void => {
    const validEncoding = iconv.encodingExists(encoding)
    if (!validEncoding) {
      throw new TypeError(`Encoding Error: ${encoding} is not supported`)
    }
  }

  /**
   * @desc find schema by key
   * @param {string} key
   * @return {Schema} schema
   * @memberof CSV
   */
  findSchemaByKey = (key: string): Schema => {
    return this.schema.find((item) => item.key === key) || {
      key,
      type: 'string',
      label: key
    }
  }

  /**
   * @desc format value
   * @param {any} value
   * @param {string} key
   * @return {string|number} formated value
   * @memberof CSV
   */
  format = (value: any, key: string): string | number => {
    const schema = this.findSchemaByKey(key)
    switch (schema.type) {
      case 'number':
        return parseFloat(value)
      case 'date':
        return new Date(value).toString()
      case 'boolean':
        return (!!value).toString()
      case 'custom':
      case 'string':
      default:
        return value
    }
  }

  /**
   * @desc encode str to buffer with specific encoding
   * @param {string} str
   * @param {string} encoding
   * @return {Buffer} encoded buffer
   * @memberof CSV
   */
  encode = (str: string, encoding: string = this.encoding): Buffer => {
    this.checkEncoding(encoding)
    return iconv.encode(str, encoding)
  }

  /**
   * @desc decode buffer or string to string with specific encoding
   * @param {Buffer|string} buf
   * @param {string} encoding
   * @return {string} decoded string
   * @memberof CSV
   */
  decode = (buf: Buffer | string, encoding: string = this.encoding): string => {
    this.checkEncoding(encoding)
    return iconv.decode(buf, encoding)
  }

  /**
   * @desc convert json to csv data string
   * @param {Array<Object>} items
   * @param {CustomOption} option
   * @param {string} option.encoding
   * @return {string} csv data string
   * @memberof CSV
   */
  convert = (items: Array<{[x: string]: any}>, option?: CustomOption = {}): string => {
    const encoding = option.encoding
    const columns = this.schema
    const csvArray = []
    const header = []
    const keys = []

    columns.forEach(function (column) {
      keys.push(column.key)
      header.push('"' + (column.label || column.key) + '"')
    })

    if (this.withHeader) {
      csvArray.push(header)
    }

    items.forEach((item) => {
      csvArray.push(keys.map((key) => '"' + this.format(item[key], key) + '"').join(','))
    })

    const str = csvArray.join('\n')

    const res = this.encode(str, encoding)
    this.data = this.decode(res, encoding)
    this.blob = new Blob([res], {
      type: 'text/csv'
    })

    return this.data
  }

  /**
   * @desc parse buffer or string to csv data string
   * @param {Buffer|string} buf
   * @param {CustomOption} option
   * @param {string} option.encoding
   * @return {string} parsed csv data string
   * @memberof CSV
   */
  parse = (buf: Buffer, option?: CustomOption = {}): string => {
    if (Array.isArray(buf)) {
      this.data = this.convert(buf, option)
    } else {
      try {
        const res = jschardet.detect(buf)
        const encoding = res.encoding
        this.data = this.decode(buf, encoding)
      } catch (error) {
        throw new Error('Parse failed, please check input data')
      }
    }
    return this.data
  }

  /**
   * @desc get file dataURL
   * @return {string} dataURL
   * @memberof CSV
   */
  getDataURL = (): string => {
    /* istanbul ignore next */
    if (!this.blob) {
      throw new Error('No data')
    } else {
      return URL.createObjectURL(this.blob)
    }
  }

  /**
   * @desc transform parsed data to json
   * @return {Array<Object>} json
   * @memberof CSV
   */
  toJSON = (): Array<{[x: string]: any}> => {
    const columns = this.schema
    if (!this.data) {
      return []
    } else {
      const data = this.data.replace(/\\r\\n|\\r/g, '\n').replace(/;|\\t|\|\^/g, ',')
      let temp = data.split('\n')
      // TODO: header check
      temp.shift()
      // remove empty line
      temp = temp.filter(temp => temp)
      temp = temp.map((str: string) => {
        const item = {}
        const arr = str.split(',')
        arr.map((s, index) => {
          s = s.substring(1, s.length - 1)
          const column = columns[index]
          switch (column.type) {
            case 'number':
              item[column.key] = parseFloat(s)
              break
            case 'boolean':
              let val
              if (s === 'true') {
                val = true
              } else if (s === 'false') {
                val = false
              } else {
                val = !!s
              }
              item[column.key] = val
              break
            case 'date':
              item[column.key] = new Date(s)
              break
            case 'string':
            case 'custom':
            default:
              item[column.key] = s
          }
        })
        return item
      })
      return temp
    }
  }

  /**
   * @desc to string
   * @return csv data string
   * @memberof CSV
   */
  toString = (): string => {
    return this.data
  }
}
