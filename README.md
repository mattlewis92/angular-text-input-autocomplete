# angular text input autocomplete
[![Build Status](https://travis-ci.org/mattlewis92/angular-text-input-autocomplete.svg?branch=master)](https://travis-ci.org/mattlewis92/angular-text-input-autocomplete)
[![codecov](https://codecov.io/gh/mattlewis92/angular-text-input-autocomplete/branch/master/graph/badge.svg)](https://codecov.io/gh/mattlewis92/angular-text-input-autocomplete)
[![npm version](https://badge.fury.io/js/angular-text-input-autocomplete.svg)](http://badge.fury.io/js/angular-text-input-autocomplete)
[![devDependency Status](https://david-dm.org/mattlewis92/angular-text-input-autocomplete/dev-status.svg)](https://david-dm.org/mattlewis92/angular-text-input-autocomplete?type=dev)
[![GitHub issues](https://img.shields.io/github/issues/mattlewis92/angular-text-input-autocomplete.svg)](https://github.com/mattlewis92/angular-text-input-autocomplete/issues)
[![GitHub stars](https://img.shields.io/github/stars/mattlewis92/angular-text-input-autocomplete.svg)](https://github.com/mattlewis92/angular-text-input-autocomplete/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/mattlewis92/angular-text-input-autocomplete/master/LICENSE)

## Demo
https://mattlewis92.github.io/angular-text-input-autocomplete/

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#license)

## About

A angular 4+ directive for adding autocomplete functionality to text input elements, built around composability

## Installation

Install through npm:
```
npm install --save angular-text-input-autocomplete
```

Then include in your apps module:

```typescript
import { NgModule } from '@angular/core';
import { TextInputAutocompleteModule } from 'angular-text-input-autocomplete';

@NgModule({
  imports: [
    TextInputAutocompleteModule.forRoot()
  ]
})
export class MyModule {}
```

Finally use in one of your apps components:
```typescript
import { Component } from '@angular/core';

@Component({
  template: '<hello-world></hello-world>'
})
export class MyComponent {}
```

You may also find it useful to view the [demo source](https://github.com/mattlewis92/angular-text-input-autocomplete/blob/master/demo/demo.component.ts).

### Usage without a module bundler
```
<script src="node_modules/angular-text-input-autocomplete/bundles/angular-text-input-autocomplete.umd.js"></script>
<script>
    // everything is exported angularTextInputAutocomplete namespace
</script>
```

## Documentation
All documentation is auto-generated from the source via [compodoc](https://compodoc.github.io/compodoc/) and can be viewed here:
https://mattlewis92.github.io/angular-text-input-autocomplete/docs/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` to start a development server on port 8000 with auto reload + tests.

### Testing
Run `npm test` to run tests once or `npm run test:watch` to continually run tests.

### Release
* Bump the version in package.json (once the module hits 1.0 this will become automatic)
```bash
npm run release
```

## License

MIT
