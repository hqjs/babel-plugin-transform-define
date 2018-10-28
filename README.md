# babel-plugin-transform-define
Substitute object defenitions and typeof expressions e.g.
```js
import babelTransformDefine from '@hqjs/babel-plugin-transform-define';

{
  plugins: [
    [ babelTransformDefine, {
      'process.env.NODE_ENV': 'development',
      'typeof window': 'object',
    }]
  ]
}
```
will substitute values of expressions `process.env.NODE_ENV` and `typeof window` into the code.

# Installation
```sh
npm install hqjs@babel-plugin-transform-define
```
