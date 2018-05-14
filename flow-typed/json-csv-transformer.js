declare type Schema = {
  key: string,
  label?: string,
  type: 'string' | 'boolean' | 'date' | 'number' | 'custom'
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
    constructor (option: CSVOption): CSV;
  }

  declare export default typeof CSV
};
