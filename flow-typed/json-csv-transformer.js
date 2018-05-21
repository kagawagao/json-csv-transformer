declare type Schema = {
  key: string,
  label?: string,
  type?: 'string' | 'boolean' | 'date' | 'number',
  formatter?: {
    csv: Function,
    json: Function
  }
};

declare type CustomOption = {
  encoding?: string
}

declare type CSVOption = {
  schema: Array<Schema>,
  encoding: string,
  withHeader: ?boolean
};

declare module 'json-csv-transformer' {
  declare class CSV {
    schema: Array<Schema>;
    buffer: ?Buffer;
    encoding: string;
    data: string;
    withHeader: boolean;
    constructor (option: CSVOption): CSV;
    checkSchema (Array<Schema>): void;
    checkEncoding (encoding: string): void;
    findSchemaByKey (key: string): Schema;
    format (value: any, key: string): string | number;
    encode (str: string): Buffer;
    decode (buf: Buffer | string): string;
    convert (items: Array<{[x: string]: any}>, option?: CustomOption): string;
    parse (buf: Buffer, option?: CustomOption): string;
    getDataURL (): string;
    toJSON (): Array<{[x: string]: any}>;
    toString (): string;
  }

  declare export default typeof CSV
};
