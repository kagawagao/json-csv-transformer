# json-csv-transformer

> transform json to csv, and vice versa

[![node](https://img.shields.io/node/v/json-csv-transformer.svg)](https://www.npmjs.com/package/json-csv-transformer)
[![npm](https://img.shields.io/npm/v/json-csv-transformer.svg)](https://www.npmjs.com/package/json-csv-transformer)
[![license](https://img.shields.io/npm/l/json-csv-transformer.svg)](https://github.com/kagawagao/json-csv-transformer/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/kagawagao/json-csv-transformer.svg?branch=master)](https://travis-ci.org/kagawagao/json-csv-transformer)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)
[![bitHound Overall Score](https://www.bithound.io/github/kagawagao/json-csv-transformer/badges/score.svg)](https://www.bithound.io/github/kagawagao/json-csv-transformer)
[![bitHound Dependencies](https://www.bithound.io/github/kagawagao/json-csv-transformer/badges/dependencies.svg)](https://www.bithound.io/github/kagawagao/json-csv-transformer/master/dependencies/npm)
[![bitHound Dev Dependencies](https://www.bithound.io/github/kagawagao/json-csv-transformer/badges/devDependencies.svg)](https://www.bithound.io/github/kagawagao/json-csv-transformer/master/dependencies/npm)
[![Coveralls Status](https://img.shields.io/coveralls/github/kagawagao/json-csv-transformer.svg)](https://coveralls.io/github/kagawagao/json-csv-transformer)

## Install

```bash
npm install json-csv-transformer --save
```

## Use

```javascript
const CSV = require('json-csv-transformer')

const csv = new CSV({
  schema: [{
    key: 'xxx',
    label: 'XXX',
    type: 'string',
  }]
})

// parse data, csv or json
csv.parse(data)
// get file dataURL
csv.getDataURL()
// transform to JSON
csv.toJSON()
```

find more use case, please see test
